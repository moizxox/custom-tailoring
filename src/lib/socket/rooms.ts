/**
 * Canonical Socket.io room naming helpers.
 *
 * Keep room names consistent between server emit and client join/leave.
 */

/** Room for all messages and events in a specific project */
export const projectRoom = (projectId: string) => `project:${projectId}`;

/** Room for a specific customer (personal notifications, DMs) */
export const customerRoom = (customerId: string) => `customer:${customerId}`;

/** Broadcast room for all connected admin users */
export const ADMIN_GLOBAL_ROOM = "admin_global";

/** Parse a projectId from a project room string, returns null if not a project room */
export function parseProjectRoom(room: string): string | null {
  const match = room.match(/^project:(.+)$/);
  return match ? match[1] : null;
}

/** Parse a customerId from a customer room string */
export function parseCustomerRoom(room: string): string | null {
  const match = room.match(/^customer:(.+)$/);
  return match ? match[1] : null;
}
