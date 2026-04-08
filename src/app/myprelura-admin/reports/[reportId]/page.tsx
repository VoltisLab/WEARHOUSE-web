"use client";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  ALL_REPORTS,
  CONVERSATION_MESSAGES,
  GET_USER,
} from "@/graphql/queries/admin";
import { FLAG_USER } from "@/graphql/mutations/admin";
import { GlassCard } from "@/components/ui/GlassCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDateTime } from "@/lib/format";
import {
  publicProductUrl,
  publicProfileUrl,
  publicWebHostname,
} from "@/lib/constants";
import { staffPath } from "@/lib/staff-nav";

type ReportRow = Record<string, unknown> & { id: number };

export default function ReportDetailPage() {
  const params = useParams();
  const reportIdParam = params.reportId as string;
  const idNum = parseInt(reportIdParam, 10);

  const { data, loading, error } = useQuery(ALL_REPORTS);
  const rows = (data?.allReports ?? []) as ReportRow[];
  const report = useMemo(
    () => rows.find((r) => r.id === idNum),
    [rows, idNum]
  );

  const threadId =
    (report?.supportConversationId as number | null | undefined) ??
    (report?.conversationId as number | null | undefined);

  const { data: msgData, error: msgErr } = useQuery(CONVERSATION_MESSAGES, {
    variables: { id: String(threadId ?? ""), pageCount: 200, pageNumber: 1 },
    skip: threadId == null,
  });
  const messages = msgData?.conversation ?? [];

  const [flagUser] = useMutation(FLAG_USER);
  const [fetchUser] = useLazyQuery(GET_USER);

  async function onFlagAccount() {
    const u = report?.accountReportedUsername as string | undefined;
    if (!u) return;
    const { data: udata, error: uerr } = await fetchUser({
      variables: { username: String(u) },
    });
    if (uerr || !udata?.getUser?.id) {
      window.alert(uerr?.message ?? "Could not resolve user id.");
      return;
    }
    const reason =
      window.prompt("Reason (e.g. TERMS_VIOLATION, SPAM_ACTIVITY, OTHER):", "OTHER") ??
      "";
    if (!reason) return;
    const notes = window.prompt("Notes:", "") ?? "";
    const { data: d } = await flagUser({
      variables: {
        id: String(udata.getUser.id),
        reason,
        notes: notes || null,
      },
    });
    window.alert(d?.flagUser?.message ?? "Done");
  }

  if (loading && !data) {
    return <p className="text-prel-secondary-label">Loading…</p>;
  }
  if (error) {
    return <p className="text-prel-error">{error.message}</p>;
  }
  if (!report) {
    return (
      <GlassCard>
        <p className="text-prel-label">Report not found in current queue.</p>
        <Link
          href={staffPath("/reports")}
          className="mt-2 inline-block text-prel-primary"
        >
          Back to reports
        </Link>
      </GlassCard>
    );
  }

  const imgs = Array.isArray(report.imagesUrl)
    ? (report.imagesUrl as string[])
    : [];
  const rtype = String(report.reportType ?? "");

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <GlassCard>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-prel-primary/20 px-2 py-0.5 text-[11px] font-bold uppercase text-prel-primary">
            {rtype}
          </span>
          <span className="text-[13px] text-prel-secondary-label">
            {String(report.status ?? "")}
          </span>
        </div>
        {report.publicId != null && String(report.publicId).length > 0 ? (
          <p className="mt-2 text-[13px] text-prel-secondary-label">
            Public id: {String(report.publicId)}
          </p>
        ) : null}
        <p className="mt-3 text-[18px] font-semibold text-prel-label">
          {String(report.reason ?? "-")}
        </p>
        {report.context != null && String(report.context).length > 0 ? (
          <p className="mt-2 text-[14px] text-prel-secondary-label whitespace-pre-wrap">
            {String(report.context)}
          </p>
        ) : null}
        <p className="mt-2 text-[12px] text-prel-tertiary-label">
          Created {formatDateTime(String(report.dateCreated ?? ""))}
        </p>
      </GlassCard>

      {imgs.length > 0 && (
        <GlassCard>
          <p className="mb-2 text-[13px] font-semibold text-prel-label">
            Attachments
          </p>
          <div className="flex flex-wrap gap-2">
            {imgs.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="block h-28 w-28 overflow-hidden rounded-lg ring-1 ring-prel-glass-border"
              >
                <SafeImage
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </a>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard>
        <p className="mb-2 text-[13px] font-semibold text-prel-label">People</p>
        {report.reportedByUsername != null &&
        String(report.reportedByUsername).length > 0 ? (
          <p className="text-[14px] text-prel-label">
            Reporter: @{String(report.reportedByUsername)}
          </p>
        ) : null}
        {report.accountReportedUsername != null &&
        String(report.accountReportedUsername).length > 0 ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Link
              href={staffPath(`/users/${encodeURIComponent(String(report.accountReportedUsername))}`)}
              className="text-[15px] font-semibold text-prel-primary"
            >
              Profile @{String(report.accountReportedUsername)}
            </Link>
            <a
              href={publicProfileUrl(String(report.accountReportedUsername))}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] text-prel-secondary-label underline"
            >
              Open on web
            </a>
            <button
              type="button"
              onClick={onFlagAccount}
              className="rounded-lg bg-prel-error/15 px-3 py-1 text-[13px] font-semibold text-prel-error"
            >
              Flag user…
            </button>
          </div>
        ) : null}
      </GlassCard>

      {rtype === "PRODUCT" && report.productId != null && (
        <GlassCard>
          <p className="mb-2 text-[13px] font-semibold text-prel-label">Listing</p>
          <p className="text-prel-label">
            {String(report.productName ?? "")} (#{String(report.productId)})
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={staffPath(`/products/${String(report.productId)}`)}
              className="text-[15px] font-semibold text-prel-primary"
            >
              Staff product view
            </Link>
            <a
              href={publicProductUrl(Number(report.productId))}
              target="_blank"
              rel="noreferrer"
              className="text-[13px] text-prel-secondary-label underline"
            >
              {publicWebHostname()}
            </a>
          </div>
        </GlassCard>
      )}

      {rtype === "ORDER_ISSUE" && (
        <GlassCard>
          <p className="mb-2 text-[13px] font-semibold text-prel-label">
            Order issue
          </p>
          <p className="text-[14px] text-prel-secondary-label">
            Native id (for actions): {Math.abs(report.id)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link
              href={`${staffPath("/issues")}#issue-${Math.abs(report.id)}`}
              className="text-[15px] font-semibold text-prel-primary"
            >
              Open in order issues
            </Link>
            {report.orderId != null && (
              <Link
                href={staffPath(`/orders/${String(report.orderId)}`)}
                className="text-[15px] font-semibold text-prel-primary"
              >
                Order #{String(report.orderId)}
              </Link>
            )}
          </div>
        </GlassCard>
      )}

      <GlassCard>
        <p className="mb-2 text-[13px] font-semibold text-prel-label">
          Linked conversations
        </p>
        <p className="mb-3 text-[12px] text-prel-secondary-label">
          Staff can read threads the API exposes. Live typing uses the consumer app
          WebSocket.
        </p>
        <div className="flex flex-col gap-2">
          {report.supportConversationId != null && (
            <Link
              href={staffPath(`/chat/${String(report.supportConversationId)}`)}
              className="rounded-lg bg-prel-primary/12 px-3 py-2 text-[14px] font-semibold text-prel-primary"
            >
              Support thread #{String(report.supportConversationId)}
            </Link>
          )}
          {report.sellerSupportConversationId != null && (
            <Link
              href={staffPath(`/chat/${String(report.sellerSupportConversationId)}`)}
              className="rounded-lg bg-prel-primary/12 px-3 py-2 text-[14px] font-semibold text-prel-primary"
            >
              Seller support #{String(report.sellerSupportConversationId)}
            </Link>
          )}
          {report.conversationId != null && (
            <Link
              href={staffPath(`/chat/${String(report.conversationId)}`)}
              className="rounded-lg bg-prel-glass px-3 py-2 text-[14px] font-semibold text-prel-label ring-1 ring-prel-glass-border"
            >
              Buyer–seller DM #{String(report.conversationId)}
            </Link>
          )}
        </div>
      </GlassCard>

      {threadId != null && (
        <GlassCard>
          <p className="mb-2 text-[13px] font-semibold text-prel-label">
            Messages (primary thread)
          </p>
          {msgErr && (
            <p className="text-[13px] text-prel-error">{msgErr.message}</p>
          )}
          <div className="max-h-[360px] space-y-2 overflow-y-auto">
            {messages.map((m: Record<string, unknown>) => (
              <div
                key={String(m.id)}
                className="rounded-lg bg-prel-glass/80 px-3 py-2 ring-1 ring-prel-glass-border"
              >
                <div className="flex justify-between text-[11px] text-prel-tertiary-label">
                  <span className="text-prel-primary">
                    @
                    {(m.sender as { username?: string } | null)?.username ?? "-"}
                  </span>
                  <span>{formatDateTime(String(m.createdAt ?? ""))}</span>
                </div>
                <p className="mt-1 text-[14px] text-prel-label whitespace-pre-wrap">
                  {String(m.text ?? "")}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <Link
        href={staffPath("/reports")}
        className="inline-block text-[15px] font-semibold text-prel-primary"
      >
        ← Back to queue
      </Link>
    </div>
  );
}
