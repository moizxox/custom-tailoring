"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Lock, Send } from "lucide-react";
import type { MessagePayload, ServerToClientEvents, ClientToServerEvents } from "@/lib/socket/events";

interface Props {
  projectId: string;
  conversationId: string | null;
  initialMessages: MessagePayload[];
  adminName?: string;
  adminId?: string;
}

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function ConversationPanel({
  projectId,
  initialMessages,
  adminName = "Admin",
  adminId = "admin",
}: Props) {
  const [messages, setMessages] = useState<MessagePayload[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [typingCustomers, setTypingCustomers] = useState<string[]>([]);
  const socketRef = useRef<AppSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingCustomers]);

  useEffect(() => {
    const socket: AppSocket = io({ path: "/api/socket", transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("authenticate", { role: "admin", id: adminId, name: adminName });
      socket.emit("join_project", projectId);
      socket.emit("read_messages", projectId);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("new_message", (msg) => {
      if (msg.projectId !== projectId) return;
      setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
      socket.emit("read_messages", projectId);
    });

    socket.on("typing_start", (payload) => {
      if (payload.projectId !== projectId || payload.senderRole !== "customer") return;
      setTypingCustomers((prev) =>
        prev.includes(payload.senderId) ? prev : [...prev, payload.senderId]
      );
    });

    socket.on("typing_stop", (payload) => {
      if (payload.projectId !== projectId) return;
      setTypingCustomers((prev) => prev.filter((id) => id !== payload.senderId));
    });

    return () => {
      socket.emit("leave_project", projectId);
      socket.disconnect();
    };
  }, [projectId, adminId, adminName]);

  const handleSend = useCallback(async () => {
    const body = input.trim();
    if (!body || sending) return;
    setSending(true);
    setInput("");

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit("send_message", { projectId, body, isInternal });
      socket.emit("typing_stop", projectId);
    } else {
      try {
        const res = await fetch(`/admin/api/crm/projects/${projectId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body, isInternal }),
        });
        if (res.ok) {
          const { message } = await res.json();
          setMessages((prev) => [...prev, message]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    setSending(false);
  }, [input, sending, projectId, isInternal]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleTyping = () => {
    const socket = socketRef.current;
    if (!socket?.connected) return;
    socket.emit("typing_start", projectId);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => socket.emit("typing_stop", projectId), 2000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 border border-white/5 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
        <div>
          <h3 className="text-sm font-semibold text-white">Gespräch</h3>
          <p className="text-[11px] text-gray-500">
            {messages.filter((m) => !m.isInternal).length} Nachrichten · {messages.filter((m) => m.isInternal).length} interne Notizen
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded border-gray-600 bg-gray-800 text-violet-500"
            />
            <Lock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs text-gray-400">Interne Notiz</span>
          </label>
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-gray-600"}`} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-gray-600 text-center py-10">Noch keine Nachrichten.</p>
        )}
        {messages.map((msg) => {
          const isAdmin = msg.senderRole === "admin";
          const isInternalNote = msg.isInternal;
          return (
            <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                  isInternalNote
                    ? "bg-amber-500/10 border border-amber-500/20 rounded-tr-sm"
                    : isAdmin
                    ? "bg-violet-600 text-white rounded-br-sm"
                    : "bg-gray-800 text-white rounded-bl-sm"
                }`}
              >
                {isInternalNote && (
                  <div className="flex items-center gap-1 mb-1">
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[9px] text-amber-400 font-medium uppercase tracking-wider">Interne Notiz</span>
                  </div>
                )}
                {!isAdmin && msg.senderName && (
                  <p className="text-[10px] font-medium text-violet-300 mb-0.5">{msg.senderName}</p>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-white">
                  {msg.body}
                </p>
                <p className="text-[10px] mt-1 text-gray-400 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })}
                  {" · "}
                  {new Date(msg.createdAt).toLocaleDateString("de-CH")}
                  {!isAdmin && msg.readAt && " · Gelesen"}
                </p>
              </div>
            </div>
          );
        })}
        {typingCustomers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-2.5">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={`px-5 py-3.5 border-t ${isInternal ? "border-amber-500/20 bg-amber-500/[0.03]" : "border-white/5"}`}>
        {isInternal && (
          <p className="text-[10px] text-amber-400 mb-2 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Diese Nachricht ist nur für Admins sichtbar
          </p>
        )}
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => { setInput(e.target.value); handleTyping(); }}
            onKeyDown={handleKeyDown}
            placeholder={isInternal ? "Interne Notiz schreiben…" : "Nachricht an Kunden…"}
            className="flex-1 resize-none rounded-xl border border-white/10 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={`px-3 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-40 flex items-center gap-1.5 flex-shrink-0 transition-colors ${
              isInternal ? "bg-amber-600 hover:bg-amber-500" : "bg-violet-600 hover:bg-violet-500"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
