import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/** All group IDs a customer can access (member or leader). */
export async function getCustomerGroupIds(customerId: string): Promise<string[]> {
  const [memberships, ledGroups] = await Promise.all([
    prisma.groupMember.findMany({
      where: { customerId },
      select: { groupId: true },
    }),
    prisma.group.findMany({
      where: { leaderId: customerId },
      select: { id: true },
    }),
  ]);

  return [
    ...new Set([
      ...memberships.map((m) => m.groupId),
      ...ledGroups.map((g) => g.id),
    ]),
  ];
}

/** Prisma where-clause for projects accessible to a portal customer. */
export async function getAccessibleProjectWhere(
  customerId: string
): Promise<Prisma.ProjectWhereInput> {
  const groupIds = await getCustomerGroupIds(customerId);

  return {
    OR: [
      { customerId },
      ...(groupIds.length > 0 ? [{ groupId: { in: groupIds } }] : []),
    ],
  };
}

/** Check if a customer may view a specific project. */
export async function canAccessProject(
  customerId: string,
  project: { customerId: string | null; groupId: string | null }
): Promise<boolean> {
  if (project.customerId === customerId) return true;
  if (!project.groupId) return false;

  const groupIds = await getCustomerGroupIds(customerId);
  return groupIds.includes(project.groupId);
}

/** Fetch all projects accessible to a portal customer. */
export async function getAccessibleProjects(customerId: string) {
  const where = await getAccessibleProjectWhere(customerId);
  return prisma.project.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
}
