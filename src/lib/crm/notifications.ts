import { prisma } from "@/lib/prisma";

export async function createNotification(opts: {
  customerId?: string;
  type: string;
  title: string;
  body?: string;
  refId?: string;
  refType?: string;
}) {
  return prisma.notification.create({ data: opts });
}

export async function getNotificationsForCustomer(customerId: string) {
  return prisma.notification.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
}

export async function getAdminNotifications() {
  return prisma.notification.findMany({
    where: { customerId: null },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function markNotificationRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { read: true, readAt: new Date() },
  });
}

export async function markAllNotificationsRead(customerId?: string) {
  return prisma.notification.updateMany({
    where: {
      customerId: customerId ?? null,
      read: false,
    },
    data: { read: true, readAt: new Date() },
  });
}

export async function getUnreadNotificationCount(customerId?: string) {
  return prisma.notification.count({
    where: { customerId: customerId ?? null, read: false },
  });
}
