import { prisma } from "@/lib/prisma";
import { emptyToNull } from "@/lib/crm/api";

export const GROUP_TYPES = [
  { value: "guggenmusik", label: "Guggenmusik" },
  { value: "clique", label: "Cliquen" },
  { value: "verein", label: "Vereine" },
  { value: "familie", label: "Familie" },
  { value: "einzelperson", label: "Einzelpersonen" },
  { value: "schnitzelbaengg", label: "Schnitzelbängg" },
  { value: "group", label: "Gruppe" },
  { value: "company", label: "Unternehmen" },
] as const;

export interface CreateGroupInput {
  name: string;
  description?: string | null;
  type?: string;
  season?: string | null;
  leaderId?: string | null;
  location?: string | null;
  notes?: string | null;
}

export async function createGroup(input: CreateGroupInput) {
  return prisma.group.create({
    data: {
      name: input.name.trim(),
      description: input.description?.trim() || null,
      type: input.type?.trim() || "group",
      season: input.season?.trim() || null,
      leaderId: emptyToNull(input.leaderId),
      location: input.location?.trim() || null,
      notes: input.notes?.trim() || null,
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
      name: data.name !== undefined ? data.name.trim() : undefined,
      description:
        data.description !== undefined ? data.description?.trim() || null : undefined,
      type: data.type !== undefined ? data.type.trim() || "group" : undefined,
      season: data.season !== undefined ? data.season?.trim() || null : undefined,
      leaderId: data.leaderId !== undefined ? emptyToNull(data.leaderId) : undefined,
      location: data.location !== undefined ? data.location?.trim() || null : undefined,
      notes: data.notes !== undefined ? data.notes?.trim() || null : undefined,
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
