import type { Server as SocketIOServer } from "socket.io";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./events";
import { projectRoom, customerRoom, ADMIN_GLOBAL_ROOM } from "./rooms";
import { prisma } from "@/lib/prisma";

export type AppSocketServer = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

let _io: AppSocketServer | null = null;

/** Returns the Socket.io server instance (throws if not yet initialised) */
export function getIO(): AppSocketServer {
  if (!_io) throw new Error("Socket.io server not initialised");
  return _io;
}

/** Boot Socket.io logic — called once from server.ts */
export function initSocketIO(io: AppSocketServer) {
  _io = io;

  io.on("connection", (socket) => {
    console.log(`[socket] connected ${socket.id}`);

    // ── Authentication ──────────────────────────────────────────────────────
    socket.on("authenticate", ({ role, id, name }) => {
      socket.data.role = role;
      socket.data.userId = id;
      socket.data.userName = name;

      if (role === "admin") {
        socket.join(ADMIN_GLOBAL_ROOM);
      } else if (role === "customer") {
        socket.join(customerRoom(id));
      }

      console.log(`[socket] authenticated ${socket.id} as ${role}:${id}`);
    });

    // ── Project rooms ───────────────────────────────────────────────────────
    socket.on("join_project", (projectId) => {
      socket.join(projectRoom(projectId));
      console.log(`[socket] ${socket.id} joined ${projectRoom(projectId)}`);
    });

    socket.on("leave_project", (projectId) => {
      socket.leave(projectRoom(projectId));
    });

    // ── Messaging ───────────────────────────────────────────────────────────
    socket.on("send_message", async ({ projectId, body, isInternal, attachmentUrl, attachmentType }) => {
      try {
        const { role, userId, userName } = socket.data;
        if (!role || !userId) {
          socket.emit("socket_error", "Not authenticated");
          return;
        }

        // Internal notes are admin-only
        const internal = isInternal === true && role === "admin";

        // Find or create the conversation for this project
        let conv = await prisma.conversation.findFirst({
          where: { projectId },
        });
        if (!conv) {
          conv = await prisma.conversation.create({ data: { projectId } });
        }

        const message = await prisma.message.create({
          data: {
            conversationId: conv.id,
            senderRole: role,
            senderName: userName ?? null,
            body,
            isInternal: internal,
            attachmentUrl: attachmentUrl ?? null,
            attachmentType: attachmentType ?? null,
          },
        });

        const payload = {
          id: message.id,
          conversationId: message.conversationId,
          projectId,
          senderRole: message.senderRole as "admin" | "customer",
          senderName: message.senderName,
          body: message.body,
          isInternal: message.isInternal,
          attachmentUrl: message.attachmentUrl,
          attachmentType: message.attachmentType,
          readAt: message.readAt?.toISOString() ?? null,
          createdAt: message.createdAt.toISOString(),
        };

        if (internal) {
          // Internal notes only go to admins
          io.to(ADMIN_GLOBAL_ROOM).emit("new_message", payload);
        } else {
          io.to(projectRoom(projectId)).emit("new_message", payload);

          if (role === "customer") {
            // Also send to admin global room
            io.to(ADMIN_GLOBAL_ROOM).emit("new_message", payload);

            // Create + push admin notification
            const adminNotif = await prisma.notification.create({
              data: {
                type: "new_message",
                title: "Neue Kundennachricht",
                body: body.slice(0, 120),
                refId: projectId,
                refType: "project",
              },
            });
            io.to(ADMIN_GLOBAL_ROOM).emit("notification", {
              id: adminNotif.id,
              type: adminNotif.type,
              title: adminNotif.title,
              body: adminNotif.body,
              refId: adminNotif.refId,
              refType: adminNotif.refType,
              createdAt: adminNotif.createdAt.toISOString(),
            });
          } else {
            // Admin sent message → notify the customer
            const project = await prisma.project.findUnique({
              where: { id: projectId },
              select: { customerId: true },
            });
            if (project?.customerId) {
              const custNotif = await prisma.notification.create({
                data: {
                  customerId: project.customerId,
                  type: "new_message",
                  title: "Neue Nachricht vom Atelier",
                  body: body.slice(0, 120),
                  refId: projectId,
                  refType: "project",
                },
              });
              io.to(customerRoom(project.customerId)).emit("notification", {
                id: custNotif.id,
                customerId: custNotif.customerId,
                type: custNotif.type,
                title: custNotif.title,
                body: custNotif.body,
                refId: custNotif.refId,
                refType: custNotif.refType,
                createdAt: custNotif.createdAt.toISOString(),
              });
            }
          }
        }
      } catch (err) {
        console.error("[socket] send_message error", err);
        socket.emit("socket_error", "Failed to send message");
      }
    });

    // ── Read receipts ───────────────────────────────────────────────────────
    socket.on("read_messages", async (projectId) => {
      try {
        const { role, userId } = socket.data;
        if (!role || !userId) return;

        const conv = await prisma.conversation.findFirst({ where: { projectId } });
        if (!conv) return;

        // Mark unread messages from the other role as read
        const oppositeRole = role === "admin" ? "customer" : "admin";
        await prisma.message.updateMany({
          where: {
            conversationId: conv.id,
            senderRole: oppositeRole,
            isInternal: false,
            readAt: null,
          },
          data: { readAt: new Date() },
        });

        io.to(projectRoom(projectId)).emit("messages_read", {
          projectId,
          conversationId: conv.id,
          readById: userId,
          readByRole: role,
        });
      } catch (err) {
        console.error("[socket] read_messages error", err);
      }
    });

    // ── Typing indicators ───────────────────────────────────────────────────
    socket.on("typing_start", (projectId) => {
      const { role, userId, userName } = socket.data;
      if (!role || !userId) return;
      socket.to(projectRoom(projectId)).emit("typing_start", {
        projectId,
        senderId: userId,
        senderName: userName,
        senderRole: role,
      });
    });

    socket.on("typing_stop", (projectId) => {
      const { role, userId, userName } = socket.data;
      if (!role || !userId) return;
      socket.to(projectRoom(projectId)).emit("typing_stop", {
        projectId,
        senderId: userId,
        senderName: userName,
        senderRole: role,
      });
    });

    // ── Disconnect ──────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      console.log(`[socket] disconnected ${socket.id}`);
    });
  });

  console.log("[socket] Socket.io server initialised");
}

/**
 * Push a project status change notification to the customer's room.
 * Call from API routes after updating project status.
 */
export async function pushStatusChange(
  projectId: string,
  customerId: string | null,
  customerStatus: string
) {
  if (!_io) return;
  const payload = { projectId, customerStatus };

  _io.to(projectRoom(projectId)).emit("project_status_changed", payload);

  if (customerId) {
    _io.to(customerRoom(customerId)).emit("project_status_changed", payload);

    // Persist notification
    try {
      const notif = await prisma.notification.create({
        data: {
          customerId,
          type: "status_change",
          title: "Projektstatus aktualisiert",
          body: `Neuer Status: ${customerStatus}`,
          refId: projectId,
          refType: "project",
        },
      });
      _io.to(customerRoom(customerId)).emit("notification", {
        id: notif.id,
        customerId: notif.customerId,
        type: notif.type,
        title: notif.title,
        body: notif.body,
        refId: notif.refId,
        refType: notif.refType,
        createdAt: notif.createdAt.toISOString(),
      });
    } catch (err) {
      console.error("[socket] pushStatusChange notification error", err);
    }
  }
}
