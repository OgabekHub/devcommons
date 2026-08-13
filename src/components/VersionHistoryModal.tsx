"use client";

import React, { useState, useEffect } from "react";
import { History, X, GitCompare, ShieldCheck, Check, Plus } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase";

interface Props {
  itemId: string;
  itemType: "snippet" | "prompt";
  currentVersion?: string;
  title: string;
  currentContent: string;
  onSelectVersion?: (content: string, version: string) => void;
}

interface VersionRecord {
  id: string;
  version_label: string;
  title: string;
  content: string;
  changelog?: string | null;
  created_at: string;
}

export default function VersionHistoryModal({
  itemId,
  itemType,
  currentVersion = "v1",
  title,
  currentContent,
  onSelectVersion,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"history" | "diff">("history");
  const [versions, setVersions] = useState<VersionRecord[]>([]);
  const [selectedDiffIndex, setSelectedDiffIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const supabase = createSupabaseBrowser();

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("item_versions")
        .select("*")
        .eq("item_id", itemId)
        .eq("item_type", itemType)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setVersions(data as VersionRecord[]);
      } else {
        // Fallback default version representing current live state
        setVersions([
          {
            id: "default-v1",
            version_label: currentVersion || "v1",
            title: title,
            content: currentContent,
            changelog: "Initial published baseline version",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setVersions([
        {
          id: "default-v1",
          version_label: currentVersion || "v1",
          title: title,
          content: currentContent,
          changelog: "Initial published baseline version",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen]);

  const handleCreateSnapshot = async () => {
    setCreating(true);
    const nextVer = `v${versions.length + 1}`;
    try {
      const newRecord = {
        item_id: itemId,
        item_type: itemType,
        version_label: nextVer,
        title,
        content: currentContent,
        changelog: `Snapshot revision saved at ${new Date().toLocaleTimeString()}`,
      };
      const { error } = await supabase.from("item_versions").insert(newRecord);
      if (!error) {
        await fetchVersions();
      } else {
        // Optimistic addition for preview
        setVersions([
          {
            id: `opt-${Date.now()}`,
            ...newRecord,
            created_at: new Date().toISOString(),
          },
          ...versions,
        ]);
      }
    } catch {
      // ignore
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-purple-400 transition-colors duration-200 hover:bg-purple-500/20 hover:text-purple-300 bg-purple-500/10 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
        title="View version history and compare content revisions"
      >
        <History className="h-4 w-4 shrink-0 animate-pulse text-purple-400" />
        <span>Version {currentVersion || "v1"}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-[#0F172A] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <History className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight">Version History & Diff</h3>
                  <p className="text-xs text-gray-400">Track iterations, audits and revisions for this resource</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs & Controls */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/[0.01]">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === "history"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <History className="h-3.5 w-3.5" />
                  <span>Timeline</span>
                </button>
                <button
                  onClick={() => setActiveTab("diff")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === "diff"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  <span>Diff Viewer</span>
                </button>
              </div>

              <button
                onClick={handleCreateSnapshot}
                disabled={creating}
                className="flex items-center gap-1 rounded-lg bg-white/5 border border-white/15 hover:bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-300 transition-colors"
                title="Save current state as a new version snapshot"
              >
                <Plus className="h-3 w-3 text-emerald-400" />
                <span>{creating ? "Saving..." : "Save Snapshot"}</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-300">
              {loading ? (
                <div className="flex h-48 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                </div>
              ) : activeTab === "history" ? (
                <div className="space-y-4">
                  {versions.map((ver, idx) => (
                    <div
                      key={ver.id || idx}
                      className="rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-purple-500/40 hover:bg-purple-500/[0.02] flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/40">
                            {ver.version_label}
                          </span>
                          <span className="text-sm font-semibold text-white">{ver.title}</span>
                          {idx === 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                              <ShieldCheck className="h-3 w-3" /> Latest Active
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(ver.created_at).toLocaleDateString()} {new Date(ver.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 italic">
                        {ver.changelog || "Standard incremental version update"}
                      </p>
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            if (onSelectVersion) onSelectVersion(ver.content, ver.version_label);
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                        >
                          <Check className="h-3.5 w-3.5 text-purple-400" />
                          <span>Load Revision</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>Compare Current ({currentVersion || "v1"}) with:</span>
                    <select
                      value={selectedDiffIndex}
                      onChange={(e) => setSelectedDiffIndex(Number(e.target.value))}
                      className="rounded-lg bg-black/40 border border-white/15 px-2.5 py-1 text-white focus:outline-none focus:border-purple-500"
                    >
                      {versions.map((v, i) => (
                        <option key={i} value={i} className="bg-gray-900 text-white">
                          {v.version_label} ({new Date(v.created_at).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-white/10 rounded-xl p-4 bg-black/40 text-xs font-mono">
                    <div>
                      <div className="text-red-400 font-bold mb-2 pb-1 border-b border-white/10 flex items-center gap-1">
                        <span>[-] Previous: {versions[selectedDiffIndex]?.version_label || "v1"}</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-gray-400 overflow-x-auto max-h-60 overflow-y-auto">
                        {versions[selectedDiffIndex]?.content || "No older comparison state."}
                      </pre>
                    </div>
                    <div>
                      <div className="text-emerald-400 font-bold mb-2 pb-1 border-b border-white/10 flex items-center gap-1">
                        <span>[+] Current Live Version</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-gray-200 overflow-x-auto max-h-60 overflow-y-auto">
                        {currentContent}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-white/10 px-6 py-3 bg-white/[0.02] flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-1.5 text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
