"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import { useTranslations, useLocale } from "next-intl";
import { sendNotification } from "@/lib/notifications";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Props {
  targetUserId: string;
}

export default function FollowButton({ targetUserId }: Props) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const t = useTranslations("Components");
  const locale = useLocale();
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;
      setUser(currentUser);

      // User olingandan keyin follow statusni tekshirish
      if (currentUser) {
        const { data: followData } = await supabase
          .from("follows")
          .select("follower_id")
          .eq("follower_id", currentUser.id)
          .eq("following_id", targetUserId)
          .maybeSingle();

        if (followData) setFollowing(true);
      }
    };
    init();
  }, [targetUserId]);

  const handleToggle = async () => {
    if (!user) {
      window.location.href = `/${locale}/auth`;
      return;
    }
    setLoading(true);

    try {
      if (following) {
        // Unfollow
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", targetUserId);
        if (!error) setFollowing(false);
      } else {
        // Follow
        const { error } = await supabase
          .from("follows")
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
          });
        if (!error) {
          setFollowing(true);
          sendNotification({
            userId: targetUserId,
            type: "follow",
          });
        }
      }
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.id === targetUserId) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
        following
          ? "bg-white/10 text-gray-300 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
          : "bg-brand text-white hover:bg-brand-dark shadow-sm shadow-brand/20"
      } disabled:opacity-50`}
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" />
          {loading ? "..." : t("following")}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          {loading ? "..." : t("follow")}
        </>
      )}
    </button>
  );
}
