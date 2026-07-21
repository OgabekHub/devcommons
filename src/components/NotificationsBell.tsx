"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Code2, Sparkles, MessageSquare, UserPlus, Heart } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

interface NotificationItem {
  id: string;
  type: string;
  read: boolean;
  created_at: string;
  snippet_id: string | null;
  prompt_id: string | null;
  actor: {
    github_username: string;
    avatar_url: string | null;
  };
}

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const supabase = createSupabaseBrowser();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    loadNotifications();

    // Close on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select(`
        id, type, read, created_at, snippet_id, prompt_id,
        actor:actor_id (github_username, avatar_url)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(15);

    if (!error && data) {
      setNotifications(data as any);
    }
    setLoading(false);
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "vote_snippet":
      case "vote_prompt":
        return <Heart className="h-3.5 w-3.5 text-red-500 fill-current" />;
      case "comment_snippet":
      case "comment_prompt":
        return <MessageSquare className="h-3.5 w-3.5 text-blue-400" />;
      case "follow":
        return <UserPlus className="h-3.5 w-3.5 text-green-400" />;
      default:
        return <Bell className="h-3.5 w-3.5 text-brand" />;
    }
  };

  const renderMessage = (item: NotificationItem) => {
    const actorName = item.actor?.github_username || "Foydalanuvchi";

    switch (item.type) {
      case "vote_snippet":
        return <span><strong className="text-white">{actorName}</strong> kodingizga vote berdi</span>;
      case "vote_prompt":
        return <span><strong className="text-white">{actorName}</strong> promptingizga vote berdi</span>;
      case "comment_snippet":
        return <span><strong className="text-white">{actorName}</strong> kodingizga izoh qoldirdi</span>;
      case "comment_prompt":
        return <span><strong className="text-white">{actorName}</strong> promptingizga izoh qoldirdi</span>;
      case "follow":
        return <span><strong className="text-white">{actorName}</strong> sizga obuna bo'ldi</span>;
      default:
        return <span><strong className="text-white">{actorName}</strong> siz bilan bog'landi</span>;
    }
  };

  const getTargetUrl = (item: NotificationItem) => {
    if (item.snippet_id) return `/snippets/${item.snippet_id}`;
    if (item.prompt_id) return `/prompts/${item.prompt_id}`;
    if (item.actor?.github_username) return `/users/${item.actor.github_username}`;
    return "#";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 transition-all hover:border-brand/30 hover:bg-white/10 hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white shadow-sm shadow-brand/50 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl shadow-black/80 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-[#161616]">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-brand" />
              <h3 className="text-sm font-semibold text-white">Bildirishnomalar</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand/20 border border-brand/30 px-2 py-0.5 text-xs font-semibold text-brand">
                  {unreadCount} yangi
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-brand"
                title="Barchasini o'qilgan qilish"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>O'qildi</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
            {loading ? (
              <div className="p-6 text-center text-xs text-gray-500">Yuklanmoqda...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-500">
                Hozircha bildirishnomalar yo'q
              </div>
            ) : (
              notifications.map((item) => (
                <Link
                  key={item.id}
                  href={getTargetUrl(item)}
                  onClick={() => {
                    markAsRead(item.id);
                    setOpen(false);
                  }}
                  className={`flex items-start gap-3 p-3.5 text-xs transition-colors ${
                    !item.read ? "bg-brand/5 hover:bg-brand/10" : "hover:bg-white/5"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {item.actor?.avatar_url ? (
                      <img
                        src={item.actor.avatar_url}
                        alt=""
                        className="h-8 w-8 rounded-full ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-brand font-bold">
                        {item.actor?.github_username?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-[#111] p-0.5 border border-white/10">
                      {renderIcon(item.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 leading-snug">{renderMessage(item)}</p>
                    <span className="mt-1 block text-[10px] text-gray-500">
                      {new Date(item.created_at).toLocaleDateString(
                        locale === "uz" ? "uz-UZ" : locale === "ru" ? "ru-RU" : "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </span>
                  </div>

                  {!item.read && (
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-brand" />
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
