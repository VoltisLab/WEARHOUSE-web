"use client";

import { useMutation } from "@apollo/client";
import { useState } from "react";
import { REPORT_PRODUCT } from "@/graphql/mutations/account";
import { useAuth } from "@/contexts/AuthContext";

const REASONS = [
  "Counterfeit",
  "Prohibited item",
  "Wrong category",
  "Offensive content",
  "Spam",
  "Other",
];

type Props = {
  productId: number;
  productName: string;
};

export function ReportListingDialog({ productId, productName }: Props) {
  const { userToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [reportProduct, { loading }] = useMutation(REPORT_PRODUCT);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!userToken) return;
    try {
      const { data, errors } = await reportProduct({
        variables: {
          productId: String(productId),
          reason,
          content: notes.trim() || undefined,
        },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setMsg(errors.map((x) => x.message).join(" · "));
        return;
      }
      setMsg(data?.reportProduct?.message ?? "Thanks - we will review this listing.");
      setTimeout(() => {
        setOpen(false);
        setNotes("");
      }, 1500);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (!userToken) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[14px] font-semibold text-prel-error/90 underline-offset-2 hover:underline"
      >
        Report listing
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal
          aria-labelledby="report-listing-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ring-1 ring-prel-glass-border">
            <h2 id="report-listing-title" className="text-[18px] font-bold text-prel-label">
              Report listing
            </h2>
            <p className="mt-1 text-[13px] text-prel-secondary-label line-clamp-2">
              {productName}
            </p>
            <form onSubmit={submit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
                  Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[15px] text-prel-label"
                >
                  {REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
                  Details (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[15px] text-prel-label"
                  placeholder="Add context for moderators…"
                />
              </div>
              {msg ? (
                <p className="text-[13px] text-prel-secondary-label">{msg}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-[44px] flex-1 rounded-full bg-prel-error/90 px-4 text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Submit report"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="min-h-[44px] rounded-full border border-prel-separator px-4 text-[14px] font-semibold text-prel-label"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
