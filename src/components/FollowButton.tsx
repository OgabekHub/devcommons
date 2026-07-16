"use client";

import { useState, useEffect } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Props {
  targetUserId: string;
}

export default function FollowButton({ targetUserId }: Props) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    
    // Check if already following
    if (user) {
      checkFollowStatus();
    }
  }, [targetUserId]);

  const checkFollowStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId)
      .single();
    setFollowing(!!data);
  };

  const handleToggle = async () => {
    if (!user) return;
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
        if (!error) setFollowing(true);
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
      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
        following
          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
          : "bg-brand text-white hover:bg-brand-dark"
      } disabled:opacity-50`}
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" />
          {loading ? "..." : "Following"}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          {loading ? "..." : "Follow"}
        </>
      )}
    </button>
  );
}
