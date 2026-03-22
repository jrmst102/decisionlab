"use client";

import { useState } from "react";

interface Tool {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface CourseToolEditorProps {
  courseId: string;
  allTools: Tool[];
  assignedToolIds: string[];
}

export default function CourseToolEditor({
  courseId,
  allTools,
  assignedToolIds,
}: CourseToolEditorProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(assignedToolIds)
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const hasChanges =
    selected.size !== assignedToolIds.length ||
    assignedToolIds.some((id) => !selected.has(id));

  function toggle(toolId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        next.add(toolId);
      }
      return next;
    });
    setMessage(null);
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/courses/${courseId}/tools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolIds: Array.from(selected) }),
      });
      if (res.ok) {
        setMessage("Saved");
        // Update the baseline so hasChanges resets
        assignedToolIds.length = 0;
        assignedToolIds.push(...Array.from(selected));
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to save");
      }
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="divide-y divide-nyu-border">
        {allTools.map((tool) => (
          <label
            key={tool.id}
            className="py-3 flex items-center gap-3 cursor-pointer hover:bg-nyu-light-gray/50 -mx-1 px-1 rounded"
          >
            <input
              type="checkbox"
              checked={selected.has(tool.id)}
              onChange={() => toggle(tool.id)}
              className="h-4 w-4 rounded border-nyu-border text-nyu-violet focus:ring-nyu-violet"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-nyu-black">{tool.name}</p>
            </div>
            {!tool.isActive && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 shrink-0">
                Coming Soon
              </span>
            )}
          </label>
        ))}
      </div>

      {hasChanges && (
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={save}
            disabled={saving || selected.size === 0}
            className="px-4 py-2 bg-nyu-violet text-white text-sm font-medium rounded-lg hover:bg-nyu-dark-violet disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {message && (
            <span
              className={`text-sm ${message === "Saved" ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </span>
          )}
        </div>
      )}
      {!hasChanges && message === "Saved" && (
        <p className="mt-3 text-sm text-green-600">Saved</p>
      )}
    </div>
  );
}
