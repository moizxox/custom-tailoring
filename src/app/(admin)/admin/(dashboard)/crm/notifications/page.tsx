import type { Metadata } from "next";
import Link from "next/link";
import { getAdminNotifications } from "@/lib/crm/notifications";

export const metadata: Metadata = { title: "Benachrichtigungen — CRM" };

export default async function CrmNotificationsPage() {
  const notifications = await getAdminNotifications();

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Benachrichtigungen</h1>
        <p className="text-sm text-gray-400 mt-1">{notifications.length} Einträge</p>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">Keine Benachrichtigungen</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => {
              const href =
                notif.refType === "project" && notif.refId
                  ? `/admin/crm/projects/${notif.refId}`
                  : null;

              const content = (
                <div className={`px-5 py-4 ${!notif.read ? "bg-violet-50/40" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                      {notif.body && (
                        <p className="text-xs text-gray-500 mt-1">{notif.body}</p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-2">
                        {new Date(notif.createdAt).toLocaleString("de-CH")}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="text-[10px] px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full flex-shrink-0">
                        Neu
                      </span>
                    )}
                  </div>
                </div>
              );

              return href ? (
                <Link key={notif.id} href={href} className="block hover:bg-gray-50 transition-colors">
                  {content}
                </Link>
              ) : (
                <div key={notif.id}>{content}</div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
