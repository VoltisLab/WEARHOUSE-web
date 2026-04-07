"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CREATE_MULTIBUY_DISCOUNT,
  DEACTIVATE_MULTIBUY_DISCOUNTS,
} from "@/graphql/mutations/account";
import { USER_MULTIBUY_DISCOUNTS } from "@/graphql/queries/marketplace";
import { useAuth } from "@/contexts/AuthContext";

export default function MultibuySettingsPage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();
  const { data, refetch, loading: qLoad } = useQuery(USER_MULTIBUY_DISCOUNTS, {
    skip: !ready || !userToken,
  });
  const [createMultibuy, { loading: cLoad }] = useMutation(CREATE_MULTIBUY_DISCOUNT);
  const [deactivate, { loading: dLoad }] = useMutation(DEACTIVATE_MULTIBUY_DISCOUNTS);
  const [minItems, setMinItems] = useState("2");
  const [pct, setPct] = useState("10");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !userToken) router.replace("/login?next=/account/settings/multibuy");
  }, [ready, userToken, router]);

  const rows = (data?.userMultibuyDiscounts ?? []) as Array<{
    id?: string | number | null;
    minItems?: number | null;
    discountValue?: unknown;
    isActive?: boolean | null;
  }>;

  async function addRule(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const min = parseInt(minItems, 10);
    const discount = parseFloat(pct);
    if (Number.isNaN(min) || min < 2) {
      setMsg("Minimum items must be at least 2.");
      return;
    }
    if (Number.isNaN(discount) || discount <= 0 || discount > 90) {
      setMsg("Enter a discount between 1 and 90%.");
      return;
    }
    try {
      const { errors } = await createMultibuy({
        variables: {
          inputs: [{ minItems: min, discountPercentage: discount, isActive: true }],
        },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setMsg(errors.map((x) => x.message).join(" · "));
        return;
      }
      setMsg("Discount saved.");
      await refetch();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed.");
    }
  }

  async function turnOffAll() {
    setMsg(null);
    try {
      const { errors } = await deactivate({ errorPolicy: "all" });
      if (errors?.length) {
        setMsg(errors.map((x) => x.message).join(" · "));
        return;
      }
      setMsg("All multi-buy rules deactivated.");
      await refetch();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Request failed.");
    }
  }

  if (!ready || !userToken) {
    return <p className="text-[14px] text-prel-secondary-label">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-28 md:max-w-xl md:pb-12">
      <Link
        href="/account/settings"
        className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[var(--prel-primary)]"
      >
        ← Settings
      </Link>
      <div>
        <h1 className="text-[24px] font-bold text-prel-label">Multi-buy discounts</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-prel-secondary-label">
          Offer a percentage off when someone buys at least N items from your shop in one checkout.
        </p>
      </div>
      {msg ? (
        <p className="rounded-xl bg-prel-bg-grouped px-4 py-3 text-[14px] text-prel-label">{msg}</p>
      ) : null}
      <div className="rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
          Active rules
        </p>
        {qLoad ? (
          <p className="mt-2 text-[14px] text-prel-secondary-label">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="mt-2 text-[14px] text-prel-secondary-label">No rules yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {rows.map((r) => (
              <li
                key={String(r?.id)}
                className="flex items-center justify-between rounded-xl bg-prel-bg-grouped px-3 py-2 text-[14px]"
              >
                <span>
                  {r?.minItems}+ items → {String(r?.discountValue ?? "")}% off
                </span>
                <span className={r?.isActive ? "text-emerald-700" : "text-prel-tertiary-label"}>
                  {r?.isActive ? "Active" : "Off"}
                </span>
              </li>
            ))}
          </ul>
        )}
        <button
          type="button"
          onClick={() => turnOffAll()}
          disabled={dLoad || rows.length === 0}
          className="mt-4 w-full rounded-full border border-prel-separator py-2.5 text-[14px] font-semibold text-prel-label disabled:opacity-50"
        >
          Deactivate all
        </button>
      </div>
      <form
        onSubmit={addRule}
        className="space-y-4 rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border"
      >
        <p className="text-[16px] font-semibold text-prel-label">Add or update rule</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-prel-secondary-label">
              Min items
            </label>
            <input
              inputMode="numeric"
              value={minItems}
              onChange={(e) => setMinItems(e.target.value)}
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[16px] text-prel-label"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-prel-secondary-label">
              Discount %
            </label>
            <input
              inputMode="decimal"
              value={pct}
              onChange={(e) => setPct(e.target.value)}
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[16px] text-prel-label"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={cLoad}
          className="min-h-[48px] w-full rounded-full bg-[var(--prel-primary)] text-[15px] font-semibold text-white shadow-ios disabled:opacity-50"
        >
          {cLoad ? "Saving…" : "Save rule"}
        </button>
      </form>
    </div>
  );
}
