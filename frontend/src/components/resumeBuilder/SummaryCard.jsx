import { useEffect, useState } from "react";
import {
  Check,
  Pencil,
  RotateCcw,
  Sparkles,
} from "lucide-react";

function SummaryCard({ summary, onAccept }) {
  const [editedText, setEditedText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    setEditedText(summary?.tailored || "");
    setIsEditing(false);
    setAccepted(false);
  }, [summary]);

  if (!summary) return null;

  const handleAccept = () => {
    if (!editedText.trim()) return;

    setAccepted(true);
    setIsEditing(false);
    onAccept?.(editedText);
  };

  const handleReset = () => {
    setEditedText(summary?.tailored || "");
    setAccepted(false);
    setIsEditing(false);
    onAccept?.("");
  };

  return (
    <section className="bg-white rounded-3xl shadow p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Sparkles size={20} />

            <p className="text-sm font-semibold">
              AI suggestion
            </p>
          </div>

          <h2 className="text-2xl font-bold">
            Professional summary
          </h2>

          <p className="text-sm text-slate-600 mt-2">
            Compare the original summary with the tailored version.
          </p>
        </div>

        {accepted && (
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            <Check size={17} />
            Accepted
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
            Original
          </p>

          <p className="text-sm text-slate-700 leading-7 whitespace-pre-wrap">
            {summary.original || "No original summary was detected."}
          </p>
        </div>

        <div
          className={`border rounded-2xl p-6 ${
            accepted
              ? "bg-green-50 border-green-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold mb-3">
            Tailored version
          </p>

          {isEditing ? (
            <textarea
              rows="8"
              value={editedText}
              onChange={(event) => {
                setEditedText(event.target.value);
                setAccepted(false);
              }}
              className="w-full border border-slate-300 bg-white rounded-xl p-4 text-sm leading-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-sm text-slate-800 leading-7 whitespace-pre-wrap">
              {editedText || "No tailored summary was generated."}
            </p>
          )}
        </div>
      </div>

      {summary.reason && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-amber-900 mb-1">
            Why this change was suggested
          </p>

          <p className="text-sm text-amber-800 leading-6">
            {summary.reason}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          type="button"
          onClick={handleAccept}
          disabled={!editedText.trim()}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-slate-400 inline-flex items-center justify-center gap-2"
        >
          <Check size={18} />
          Accept version
        </button>

        <button
          type="button"
          onClick={() => {
            setIsEditing((current) => !current);
            setAccepted(false);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 inline-flex items-center justify-center gap-2"
        >
          <Pencil size={18} />
          {isEditing ? "Finish editing" : "Edit version"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 inline-flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
    </section>
  );
}

export default SummaryCard;
