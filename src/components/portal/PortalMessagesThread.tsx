"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type {
  MessagePayload,
  ServerToClientEvents,
  ClientToServerEvents,
} from "@/lib/socket/events";

interface Props {
  projectId: string;
  conversationId: string | null;
  initialMessages: MessagePayload[];
  customerId: string;
  customerName?: string;
}

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function PortalMessagesThread({
  projectId,
  initialMessages,
  customerId,
  customerName,
}: Props) {
  const [messages, setMessages] = useState<MessagePayload[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [typingAdmins, setTypingAdmins] = useState<string[]>([]);
  const socketRef = useRef<AppSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingAdmins]);

  // Socket setup
  useEffect(() => {
    const socket: AppSocket = io({ path: "/api/socket", transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("authenticate", { role: "customer", id: customerId, name: customerName });
      socket.emit("join_project", projectId);
      socket.emit("read_messages", projectId);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("new_message", (msg) => {
      if (msg.projectId !== projectId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      // Mark as read immediately if we received it
      socket.emit("read_messages", projectId);
    });

    socket.on("typing_start", (payload) => {
      if (payload.projectId !== projectId) return;
      if (payload.senderRole !== "admin") return;
      setTypingAdmins((prev) =>
        prev.includes(payload.senderId) ? prev : [...prev, payload.senderId]
      );
    });

    socket.on("typing_stop", (payload) => {
      if (payload.projectId !== projectId) return;
      setTypingAdmins((prev) => prev.filter((id) => id !== payload.senderId));
    });

    return () => {
      socket.emit("leave_project", projectId);
      socket.disconnect();
    };
  }, [projectId, customerId, customerName]);

  const handleSend = useCallback(async () => {
    const body = input.trim();
    if (!body || sending) return;

    setSending(true);
    setInput("");

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit("send_message", { projectId, body });
      socket.emit("typing_stop", projectId);
    } else {
      // REST fallback
      try {
        const res = await fetch(`/kundenbereich/api/projekt/${projectId}/nachrichten`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body }),
        });
        if (res.ok) {
          const { message } = await res.json();
          setMessages((prev) => [...prev, message]);
        }
      } catch (err) {
        console.error("Failed to send message", err);
      }
    }

    setSending(false);
  }, [input, sending, projectId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = () => {
    const socket = socketRef.current;
    if (!socket?.connected) return;

    socket.emit("typing_start", projectId);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("typing_stop", projectId);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[500px] glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-light/60">
        <div>
          <h3 className="font-serif text-sm text-charcoal">Nachrichten</h3>
          <p className="font-sans text-[10px] text-charcoal-lighter">
            Direkter Kontakt mit unserem Atelier
          </p>
        </div>
        <span
          className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-stone-light"}`}
          title={connected ? "Verbunden" : "Nicht verbunden"}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs font-sans text-charcoal-lighter text-center py-8">
            Noch keine Nachrichten. Schreiben Sie uns!
          </p>
        )}

        {messages.map((msg) => {
          const isCustomer = msg.senderRole === "customer";
          return (
            <div
              key={msg.id}
              className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isCustomer
                    ? "bg-periwinkle-dark text-white rounded-br-sm"
                    : "bg-offwhite border border-stone-light text-charcoal rounded-bl-sm"
                }`}
              >
                {!isCustomer && msg.senderName && (
                  <p className="text-[10px] font-sans font-medium text-periwinkle-dark mb-0.5">
                    {msg.senderName}
                  </p>
                )}
                <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.body}
                </p>
                <p
                  className={`text-[10px] font-sans mt-1 ${
                    isCustomer ? "text-white/60 text-right" : "text-charcoal-lighter"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString("de-CH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {isCustomer && msg.readAt && " · Gelesen"}
                </p>
              </div>
            </div>
          );
        })}

        {typingAdmins.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-offwhite border border-stone-light rounded-2xl rounded-bl-sm px-4 py-2.5">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-charcoal-lighter rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-stone-light/60 flex gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Nachricht schreiben…"
          className="flex-1 resize-none rounded-xl border border-stone-light bg-offwhite-pure px-3 py-2 text-sm font-sans text-charcoal placeholder:text-charcoal-lighter focus:outline-none focus:ring-2 focus:ring-periwinkle-lighter focus:border-periwinkle-dark transition-all"
          disabled={sending}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="px-4 py-2 rounded-xl bg-periwinkle-dark text-white text-sm font-sans font-medium disabled:opacity-40 hover:bg-periwinkle transition-colors flex-shrink-0"
        >
          {sending ? "…" : "Senden"}
        </button>
      </div>
    </div>
  );
}
