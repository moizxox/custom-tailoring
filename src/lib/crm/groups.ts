import { prisma } from "@/lib/prisma";

export const GROUP_TYPES = [
  { value: "group", label: "Gruppe" },
  { value: "guggenmusik", label: "Guggenmusik" },
  { value: "clique", label: "Clique" },
  { value: "verein", label: "Verein" },
  { value: "company", label: "Unternehmen" },
] as const;

export interface CreateGroupInput {
  name: string;
  description?: string;
  type?: string;
  season?: string;
  leaderId?: string;
  location?: string;
  notes?: string;
}

export async function createGroup(input: CreateGroupInput) {
  return prisma.group.create({
    data: {
      name: input.name.trim(),
      description: input.description?.trim() ?? null,
      type: input.type ?? "group",
      season: input.season?.trim() ?? null,
      leaderId: input.leaderId ?? null,
      location: input.location?.trim() ?? null,
      notes: input.notes?.trim() ?? null,
    },
  });
}

export async function getGroup(id: string) {
  return prisma.group.findUnique({
    where: { id },
    include: {
      leader: true,
      members: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: { customer: true },
      },
      projects: {
        orderBy: { updatedAt: "desc" },
        take: 5,
      },
    },
  });
}

export async function listGroups(opts?: {
  search?: string;
  type?: string;
  skip?: number;
  take?: number;
}) {
  const where = {
    AND: [
      opts?.search
        ? { name: { contains: opts.search, mode: "insensitive" as const } }
        : {},
      opts?.type ? { type: opts.type } : {},
    ],
  };

  const [groups, total] = await Promise.all([
    prisma.group.findMany({
      where,
      orderBy: { name: "asc" },
      skip: opts?.skip ?? 0,
      take: opts?.take ?? 50,
      include: {
        leader: { select: { id: true, name: true } },
        _count: { select: { members: true, projects: true } },
      },
    }),
    prisma.group.count({ where }),
  ]);

  return { groups, total };
}

export async function updateGroup(id: string, data: Partial<CreateGroupInput>) {
  return prisma.group.update({
    where: { id },
    data: {
      name: data.name?.trim(),
      description: data.description?.trim() ?? undefined,
      type: data.type ?? undefined,
      season: data.season?.trim() ?? undefined,
      leaderId: data.leaderId ?? undefined,
      location: data.location?.trim() ?? undefined,
      notes: data.notes?.trim() ?? undefined,
    },
  });
}

export async function deleteGroup(id: string) {
  return prisma.group.delete({ where: { id } });
}

export async function addGroupMember(
  groupId: string,
  customerId: string,
  opts?: { costumeVariant?: string; notes?: string; sortOrder?: number }
) {
  return prisma.groupMember.upsert({
    where: { groupId_customerId: { groupId, customerId } },
    update: {
      costumeVariant: opts?.costumeVariant ?? undefined,
      notes: opts?.notes ?? undefined,
    },
    create: {
      groupId,
      customerId,
      costumeVariant: opts?.costumeVariant ?? null,
      notes: opts?.notes ?? null,
      sortOrder: opts?.sortOrder ?? 0,
    },
  });
}

export async function removeGroupMember(groupId: string, customerId: string) {
  return prisma.groupMember.delete({
    where: { groupId_customerId: { groupId, customerId } },
  });
}

export async function updateGroupMember(
  groupId: string,
  customerId: string,
  data: {
    costumeVariant?: string;
    measurementStatus?: string;
    notes?: string;
    sortOrder?: number;
  }
) {
  return prisma.groupMember.update({
    where: { groupId_customerId: { groupId, customerId } },
    data,
  });
}
