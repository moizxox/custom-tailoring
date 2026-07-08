/**
 * Typed Socket.io event definitions.
 *
 * Import `ServerToClientEvents`, `ClientToServerEvents`, and `InterServerEvents`
 * wherever you create or consume the socket — both on the Node.js server and in
 * React client components.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared payload shapes
// ─────────────────────────────────────────────────────────────────────────────

export interface MessagePayload {
  id: string;
  conversationId: string;
  projectId: string;
  senderRole: "admin" | "customer";
  senderName?: string | null;
  body: string;
  isInternal: boolean;
  attachmentUrl?: string | null;
  attachmentType?: string | null;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationPayload {
  id: string;
  customerId?: string | null;
  type: string;
  title: string;
  body?: string | null;
  refId?: string | null;
  refType?: string | null;
  createdAt: string;
}

export interface TypingPayload {
  projectId: string;
  senderId: string;
  senderName?: string | null;
  senderRole: "admin" | "customer";
}

export interface MessagesReadPayload {
  projectId: string;
  conversationId: string;
  readById: string;
  readByRole: "admin" | "customer";
}

export interface ProjectStatusPayload {
  projectId: string;
  customerStatus?: string;
  internalStatus?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Server → Client events
// ─────────────────────────────────────────────────────────────────────────────

export interface ServerToClientEvents {
  /** A new message was sent in a project conversation */
  new_message: (message: MessagePayload) => void;
  /** Messages were marked as read */
  messages_read: (payload: MessagesReadPayload) => void;
  /** Another participant is typing */
  typing_start: (payload: TypingPayload) => void;
  /** Participant stopped typing */
  typing_stop: (payload: TypingPayload) => void;
  /** A project's status changed */
  project_status_changed: (payload: ProjectStatusPayload) => void;
  /** A notification for this user */
  notification: (payload: NotificationPayload) => void;
  /** Generic error from server */
  socket_error: (message: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Client → Server events
// ─────────────────────────────────────────────────────────────────────────────

export interface ClientToServerEvents {
  /** Join a project room to receive its messages */
  join_project: (projectId: string) => void;
  /** Leave a project room */
  leave_project: (projectId: string) => void;
  /** Send a message — server persists it then broadcasts to the room */
  send_message: (payload: {
    projectId: string;
    body: string;
    isInternal?: boolean;
    attachmentUrl?: string;
    attachmentType?: string;
  }) => void;
  /** Mark all messages in a project conversation as read */
  read_messages: (projectId: string) => void;
  /** Start typing indicator */
  typing_start: (projectId: string) => void;
  /** Stop typing indicator */
  typing_stop: (projectId: string) => void;
  /** Authenticate the socket with a session token */
  authenticate: (payload: {
    role: "admin" | "customer";
    id: string;
    name?: string;
  }) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inter-server events (for multi-server / adapter setups)
// ─────────────────────────────────────────────────────────────────────────────

export interface InterServerEvents {
  ping: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Socket data (per-socket metadata)
// ─────────────────────────────────────────────────────────────────────────────

export interface SocketData {
  role?: "admin" | "customer";
  userId?: string;
  userName?: string;
}
