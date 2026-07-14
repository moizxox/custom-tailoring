"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { Bell, Check } from "lucide-react";
import type { NotificationPayload, ServerToClientEvents, ClientToServerEvents } from "@/lib/socket/events";

interface Props {
  adminId: string;
  adminName?: string;
  initialUnreadCount?: number;
}

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

interface NotificationItem extends NotificationPayload {
  read?: boolean;
}

export function AdminNotificationBell({ adminId, adminName, initialUnreadCount = 0 }: Props) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [loaded, setLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function fetchNotifications() {
    try {
      const res = await fetch("/admin/api/crm/notifications");
      if (!res.ok) return;
      const data = await res.json();
      const items = (data.notifications ?? []) as NotificationItem[];
      setNotifications(items);
      setUnreadCount(items.filter((n) => !n.read).length);
      setLoaded(true);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const socket: AppSocket = io({ path: "/api/socket", transports: ["websocket", "polling"] });

    socket.on("connect", () => {
      socket.emit("authenticate", { role: "admin", id: adminId, name: adminName });
    });

    socket.on("notification", (notif) => {
      setNotifications((prev) => [{ ...notif, read: false }, ...prev].slice(0, 30));
      setUnreadCount((c) => c + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [adminId, adminName]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function markRead(id: string) {
    await fetch("/admin/api/crm/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }

  async function markAllRead() {
    await fetch("/admin/api/crm/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }

  function getNotificationLink(notif: NotificationItem): string | null {
    if (notif.refType === "project" && notif.refId) {
      return `/admin/crm/projects/${notif.refId}`;
    }
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!loaded) fetchNotifications();
        }}
        className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        title="Benachrichtigungen"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Benachrichtigungen</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-violet-600 hover:text-violet-800 flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Alle gelesen
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">Keine Benachrichtigungen</p>
            ) : (
              notifications.map((notif) => {
                const href = getNotificationLink(notif);
                const content = (
                  <div className={`px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${!notif.read ? "bg-violet-50/50" : ""}`}>
                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                    {notif.body && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.body}</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleString("de-CH")}
                    </p>
                  </div>
                );
                return href ? (
                  <Link
                    key={notif.id}
                    href={href}
                    onClick={() => {
                      if (!notif.read) markRead(notif.id);
                      setOpen(false);
                    }}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={notif.id} onClick={() => !notif.read && markRead(notif.id)}>
                    {content}
                  </div>
                );
              })
            )}
          </div>
          <div className="px-4 py-2 border-t border-gray-100">
            <Link
              href="/admin/crm/notifications"
              className="text-xs text-gray-500 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              Alle anzeigen →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
