"use client";

import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CREATE_ORDER } from "@/graphql/mutations/marketplace";
import { UPDATE_PROFILE_SHIPPING } from "@/graphql/mutations/account";
import type { MarketplaceProductRow } from "@/components/marketplace/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useShopAllBag } from "@/contexts/ShopAllBagContext";
import { formatMoney } from "@/lib/format";
import { productPriceDisplay } from "@/lib/product-display";
import { firstProductImageUrl } from "@/lib/product-images";
import { SafeImage } from "@/components/ui/SafeImage";
import { VIEW_ME } from "@/graphql/queries/admin";
import { USER_MULTIBUY_DISCOUNTS } from "@/graphql/queries/marketplace";

/** Swift `DeliveryType.shippingFee` — used when sellers have no custom postage on the client. */
const STANDARD_HOME_FEE = 2.29;
const STANDARD_COLLECTION_FEE = 2.99;

function lineSale(p: MarketplaceProductRow): number {
  const { sale } = productPriceDisplay(
    Number(p.price ?? 0),
    p.discountPrice != null && p.discountPrice !== ""
      ? Number(p.discountPrice)
      : null,
  );
  return sale;
}

function buyerProtectionFeeAmount(merchandiseAfterDiscount: number): number {
  const p = merchandiseAfterDiscount;
  if (p <= 10) return (10 * p) / 100;
  if (p <= 50) return (8 * p) / 100;
  if (p <= 200) return (6 * p) / 100;
  return (5 * p) / 100;
}

function groupBySellerId(
  items: MarketplaceProductRow[],
): Map<number, MarketplaceProductRow[]> {
  const m = new Map<number, MarketplaceProductRow[]>();
  for (const p of items) {
    const sid = p.seller?.id;
    if (sid == null) continue;
    const list = m.get(sid) ?? [];
    list.push(p);
    m.set(sid, list);
  }
  return m;
}

function parseProfileShipping(raw: unknown): {
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
} | null {
  if (raw == null || raw === "") return null;
  let o: Record<string, unknown>;
  if (typeof raw === "string") {
    try {
      o = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return null;
    }
  } else if (typeof raw === "object") {
    o = raw as Record<string, unknown>;
  } else {
    return null;
  }
  const postcode =
    (typeof o.postcode === "string" && o.postcode) ||
    (typeof o.postalCode === "string" && o.postalCode) ||
    "";
  const country =
    (typeof o.country === "string" && o.country.trim()) || "GB";
  const address = typeof o.address === "string" ? o.address : "";
  const city = typeof o.city === "string" ? o.city : "";
  const state = typeof o.state === "string" ? o.state : "";
  if (!address && !city && !postcode) return null;
  return { address, city, state, postcode, country };
}

function multibuyPercent(
  tiers: {
    minItems: number;
    discountValue: string | number;
    isActive?: boolean | null;
  }[],
  itemCount: number,
): number {
  const active = tiers
    .filter((t) => t.isActive !== false && t.minItems <= itemCount)
    .sort((a, b) => b.minItems - a.minItems);
  const t = active[0];
  if (!t) return 0;
  return Math.floor(Number(t.discountValue) || 0);
}

type DeliveryChoice = "home" | "collection";

type Props = {
  items: MarketplaceProductRow[];
};

export function ShopAllBagCheckoutForm({ items }: Props) {
  const router = useRouter();
  const { userToken, ready } = useAuth();
  const { clear } = useShopAllBag();
  const [createOrder] = useMutation(CREATE_ORDER);
  const [updateShipping, { loading: savingAddress }] =
    useMutation(UPDATE_PROFILE_SHIPPING);

  const { data: meData } = useQuery(VIEW_ME, {
    skip: !ready || !userToken,
  });
  const me = meData?.viewMe;

  const sellerGroups = useMemo(() => groupBySellerId(items), [items]);
  const distinctSellerCount = sellerGroups.size;
  const allHaveSellerId =
    items.length === 0 ||
    items.every((p) => typeof p.seller?.id === "number");

  const commonSellerId = useMemo(() => {
    if (distinctSellerCount !== 1) return null;
    const [first] = sellerGroups.keys();
    return first ?? null;
  }, [distinctSellerCount, sellerGroups]);

  const { data: mbData } = useQuery(USER_MULTIBUY_DISCOUNTS, {
    variables: { userId: commonSellerId },
    skip:
      commonSellerId == null ||
      items.length < 2 ||
      distinctSellerCount !== 1,
  });

  const mbTiers = mbData?.userMultibuyDiscounts ?? [];

  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [addrLine1, setAddrLine1] = useState("");
  const [addrLine2, setAddrLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateCounty, setStateCounty] = useState("");
  const [postal, setPostal] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryChoice, setDeliveryChoice] =
    useState<DeliveryChoice>("home");
  const [buyerProtectionEnabled, setBuyerProtectionEnabled] = useState(false);

  useEffect(() => {
    if (!me) return;
    const parsed = parseProfileShipping(me.shippingAddress);
    if (parsed) {
      if (parsed.address) setAddrLine1(parsed.address);
      if (parsed.city) setCity(parsed.city);
      if (parsed.state) setStateCounty(parsed.state);
      if (parsed.postcode) setPostal(parsed.postcode.trim().toUpperCase());
    }
    const ph = me.phone;
    if (ph?.number?.trim()) {
      const cc = (ph.countryCode ?? "").replace(/^\+/, "").trim();
      setPhone(cc ? `+${cc} ${ph.number!.trim()}` : ph.number.trim());
    }
  }, [me]);

  const orderSubtotal = useMemo(
    () => items.reduce((s, p) => s + lineSale(p), 0),
    [items],
  );

  const multiBuyDiscountPercent = useMemo(() => {
    if (distinctSellerCount !== 1 || items.length < 2) return 0;
    return multibuyPercent(mbTiers, items.length);
  }, [distinctSellerCount, items.length, mbTiers]);

  const multiBuyDiscountAmount = useMemo(
    () => orderSubtotal * (multiBuyDiscountPercent / 100),
    [orderSubtotal, multiBuyDiscountPercent],
  );

  const afterDiscount = orderSubtotal - multiBuyDiscountAmount;

  const perParcelFee =
    deliveryChoice === "home" ? STANDARD_HOME_FEE : STANDARD_COLLECTION_FEE;

  const effectiveShippingFee = useMemo(() => {
    if (distinctSellerCount < 1) return 0;
    return distinctSellerCount * perParcelFee;
  }, [distinctSellerCount, perParcelFee]);

  const buyerProtectionFee = useMemo(
    () =>
      buyerProtectionEnabled ? buyerProtectionFeeAmount(afterDiscount) : 0,
    [buyerProtectionEnabled, afterDiscount],
  );

  const grandTotal = afterDiscount + effectiveShippingFee + buyerProtectionFee;

  const shippingOptionLabel =
    deliveryChoice === "home" ? "Home delivery" : "Collection point";

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErr(null);
      if (!userToken) {
        router.push(`/login?next=${encodeURIComponent("/search/bag")}`);
        return;
      }
      if (!allHaveSellerId) {
        setErr(
          "Some items are missing seller information. Remove them and add again from Try Cart shop all.",
        );
        return;
      }
      if (distinctSellerCount < 1) {
        setErr("Your bag is empty.");
        return;
      }

      const a1 = addrLine1.trim();
      const a2 = addrLine2.trim();
      const cityT = city.trim();
      const stateT = stateCounty.trim();
      const postT = postal.trim();
      const phoneT = phone.trim();

      if (!a1 || !cityT || !postT || !phoneT) {
        setErr(
          "Please fill address line 1, city, postcode, and phone (Swift: required contact + delivery).",
        );
        return;
      }

      const combinedAddress = [a1, a2].filter(Boolean).join(", ");
      const ids = items.map((p) => p.id).filter((id) => typeof id === "number");
      if (ids.length === 0) {
        setErr("Your bag is empty.");
        return;
      }

      const deliveryType =
        deliveryChoice === "home" ? "HOME_DELIVERY" : "LOCAL_PICKUP";
      const deliveryProvider = "EVRI";

      const sellerShippingFees =
        distinctSellerCount > 1
          ? [...sellerGroups.keys()].map((sellerId) => ({
              sellerId,
              shippingFee: perParcelFee,
            }))
          : undefined;

      setSubmitting(true);
      try {
        const { errors: shipErrs } = await updateShipping({
          variables: {
            shippingAddress: {
              address: combinedAddress,
              city: cityT,
              country: "GB",
              postcode: postT,
            },
          },
          errorPolicy: "all",
        });
        if (shipErrs?.length) {
          setErr(shipErrs.map((x) => x.message).join(" · "));
          return;
        }

        const { data, errors } = await createOrder({
          variables: {
            productIds: ids,
            shippingFee: effectiveShippingFee,
            buyerProtection: buyerProtectionEnabled,
            sellerShippingFees,
            deliveryDetails: {
              deliveryAddress: {
                address: combinedAddress,
                city: cityT,
                state: stateT || "",
                country: "GB",
                postalCode: postT,
                phoneNumber: phoneT,
              },
              deliveryProvider,
              deliveryType,
              shippingOptionName: shippingOptionLabel,
            },
          },
          errorPolicy: "all",
        });
        if (errors?.length) {
          setErr(errors.map((x) => x.message).join(" · "));
          return;
        }
        if (!data?.createOrder?.success || !data.createOrder.order?.id) {
          setErr(
            "Order could not be created. Check unavailable items, or try fewer sellers.",
          );
          return;
        }
        clear();
        router.push("/account/orders");
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Checkout failed.");
      } finally {
        setSubmitting(false);
      }
    },
    [
      userToken,
      router,
      items,
      allHaveSellerId,
      distinctSellerCount,
      addrLine1,
      addrLine2,
      city,
      stateCounty,
      postal,
      phone,
      deliveryChoice,
      buyerProtectionEnabled,
      effectiveShippingFee,
      perParcelFee,
      sellerGroups,
      shippingOptionLabel,
      updateShipping,
      createOrder,
      clear,
    ],
  );

  const busy = submitting || savingAddress;

  if (!ready) {
    return (
      <div className="h-32 animate-pulse rounded-2xl bg-prel-bg-grouped ring-1 ring-prel-glass-border" />
    );
  }

  if (!userToken) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-ios ring-1 ring-prel-glass-border">
        <p className="text-[14px] text-prel-secondary-label">
          Sign in to complete checkout for your bag.
        </p>
        <button
          type="button"
          onClick={() =>
            router.push(`/login?next=${encodeURIComponent("/search/bag")}`)
          }
          className="mt-3 flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--prel-primary)] text-[15px] font-semibold text-white"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-2xl bg-white p-4 shadow-ios ring-1 ring-prel-glass-border"
    >
      <h2 className="text-[17px] font-bold text-prel-label">Checkout</h2>
      <p className="text-[12px] text-prel-secondary-label">
        Matches the app: address (lines 1–2, city, county, postcode, UK),
        delivery option, contact phone, buyer protection, then totals. Your
        address is saved to your profile before the order (server requirement).
      </p>

      {err ? (
        <p className="rounded-xl bg-prel-error/10 px-3 py-2 text-[13px] text-prel-error">
          {err}
        </p>
      ) : null}

      {!allHaveSellerId ? (
        <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-[13px] text-amber-900">
          Re-add items from Try Cart so each listing includes seller id (needed
          for multi-seller postage).
        </p>
      ) : null}

      <div>
        <h3 className="text-[13px] font-bold uppercase tracking-wide text-prel-secondary-label">
          Address
        </h3>
        <div className="mt-2 grid gap-2">
          <label className="text-[12px] font-semibold text-prel-secondary-label">
            Address line 1
            <input
              value={addrLine1}
              onChange={(e) => setAddrLine1(e.target.value)}
              className="mt-1 w-full rounded-xl border border-prel-separator px-3 py-2 text-[15px]"
              autoComplete="address-line1"
            />
          </label>
          <label className="text-[12px] font-semibold text-prel-secondary-label">
            Address line 2 (optional)
            <input
              value={addrLine2}
              onChange={(e) => setAddrLine2(e.target.value)}
              className="mt-1 w-full rounded-xl border border-prel-separator px-3 py-2 text-[15px]"
              autoComplete="address-line2"
            />
          </label>
          <label className="text-[12px] font-semibold text-prel-secondary-label">
            City
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-xl border border-prel-separator px-3 py-2 text-[15px]"
              autoComplete="address-level2"
            />
          </label>
          <label className="text-[12px] font-semibold text-prel-secondary-label">
            State / County
            <input
              value={stateCounty}
              onChange={(e) => setStateCounty(e.target.value)}
              className="mt-1 w-full rounded-xl border border-prel-separator px-3 py-2 text-[15px]"
              autoComplete="address-level1"
            />
          </label>
          <label className="text-[12px] font-semibold text-prel-secondary-label">
            Postcode
            <input
              value={postal}
              onChange={(e) => setPostal(e.target.value.toUpperCase())}
              className="mt-1 w-full rounded-xl border border-prel-separator px-3 py-2 text-[15px]"
              autoComplete="postal-code"
            />
          </label>
          <div>
            <p className="text-[12px] font-semibold text-prel-secondary-label">
              Country
            </p>
            <div className="mt-1 rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px] text-prel-label">
              United Kingdom (GB)
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-bold uppercase tracking-wide text-prel-secondary-label">
          Delivery option
        </h3>
        <p className="mt-1 text-[12px] text-prel-secondary-label">
          Standard rates (Swift defaults when seller custom postage isn’t loaded
          on web): one parcel per seller.
        </p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setDeliveryChoice("home")}
            className={`rounded-xl border-2 px-3 py-3 text-left transition ${
              deliveryChoice === "home"
                ? "border-[var(--prel-primary)] bg-[var(--prel-primary)]/10"
                : "border-prel-separator bg-prel-bg-grouped"
            }`}
          >
            <p className="text-[14px] font-bold text-prel-label">
              Home delivery
            </p>
            <p className="text-[13px] text-prel-secondary-label">
              {formatMoney(STANDARD_HOME_FEE)} per seller parcel
            </p>
          </button>
          <button
            type="button"
            onClick={() => setDeliveryChoice("collection")}
            className={`rounded-xl border-2 px-3 py-3 text-left transition ${
              deliveryChoice === "collection"
                ? "border-[var(--prel-primary)] bg-[var(--prel-primary)]/10"
                : "border-prel-separator bg-prel-bg-grouped"
            }`}
          >
            <p className="text-[14px] font-bold text-prel-label">
              Collection point
            </p>
            <p className="text-[13px] text-prel-secondary-label">
              {formatMoney(STANDARD_COLLECTION_FEE)} per seller parcel
            </p>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-bold uppercase tracking-wide text-prel-secondary-label">
          Your contact details
        </h3>
        <label className="mt-2 block text-[12px] font-semibold text-prel-secondary-label">
          Phone
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-prel-separator px-3 py-2 text-[15px]"
            autoComplete="tel"
          />
        </label>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-prel-separator bg-prel-bg-grouped p-3">
        <input
          type="checkbox"
          checked={buyerProtectionEnabled}
          onChange={(e) => setBuyerProtectionEnabled(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--prel-primary)]"
        />
        <div>
          <p className="text-[14px] font-semibold text-prel-label">
            Buyer protection fee
          </p>
          <p className="text-[13px] text-prel-secondary-label">
            {buyerProtectionEnabled
              ? formatMoney(buyerProtectionFee)
              : "Off — same default as app until you enable"}
          </p>
        </div>
      </label>

      <div>
        <h3 className="text-[13px] font-bold uppercase tracking-wide text-prel-secondary-label">
          {items.length} {items.length === 1 ? "item" : "items"}
        </h3>
        <div className="mt-2 divide-y divide-prel-separator rounded-xl border border-prel-separator">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-2 px-3 py-2.5"
            >
              <span className="line-clamp-2 text-[14px] text-prel-label">
                {p.name ?? "Listing"}
              </span>
              <span className="shrink-0 text-[14px] text-prel-secondary-label">
                {formatMoney(lineSale(p))}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-[14px] text-prel-label">Price</span>
            <span className="text-[14px] text-prel-secondary-label">
              {formatMoney(orderSubtotal)}
            </span>
          </div>
          {multiBuyDiscountPercent > 0 ? (
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-[14px] text-[var(--prel-primary)]">
                Multi-buy discount ({multiBuyDiscountPercent}%)
              </span>
              <span className="text-[14px] font-semibold text-[var(--prel-primary)]">
                −{formatMoney(multiBuyDiscountAmount)}
              </span>
            </div>
          ) : null}
          {distinctSellerCount <= 1 ? (
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-[14px] text-prel-label">Postage</span>
              <span className="text-[14px] text-prel-secondary-label">
                {formatMoney(effectiveShippingFee)}
              </span>
            </div>
          ) : (
            [...sellerGroups.entries()].map(([sid, rows]) => {
              const uname =
                rows[0]?.seller?.username?.trim() || `Seller ${sid}`;
              return (
                <div
                  key={sid}
                  className="flex items-center justify-between px-3 py-2.5"
                >
                  <span className="text-[14px] text-prel-label">
                    Postage · @{uname}
                  </span>
                  <span className="text-[14px] text-prel-secondary-label">
                    {formatMoney(perParcelFee)}
                  </span>
                </div>
              );
            })
          )}
          {buyerProtectionEnabled ? (
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-[14px] text-prel-label">
                Buyer protection fee
              </span>
              <span className="text-[14px] text-prel-secondary-label">
                {formatMoney(buyerProtectionFee)}
              </span>
            </div>
          ) : null}
          <div className="flex items-center justify-between px-3 py-3">
            <span className="text-[15px] font-bold text-prel-label">Total</span>
            <span className="text-[17px] font-black text-[var(--prel-primary)]">
              {formatMoney(grandTotal)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-prel-bg-grouped p-3 ring-1 ring-prel-glass-border">
        <p className="text-[12px] font-semibold text-prel-label">
          Active payment method
        </p>
        <p className="mt-1 text-[13px] text-prel-secondary-label">
          Card capture matches the iOS flow (payment intent after order). Web
          checkout here creates the order with the same delivery inputs; complete
          or confirm payment in the app if your account requires it.
        </p>
      </div>

      <button
        type="submit"
        disabled={busy || items.length === 0 || !allHaveSellerId}
        className="flex min-h-[52px] w-full items-center justify-center rounded-full bg-[var(--prel-primary)] text-[16px] font-bold text-white shadow-md disabled:opacity-40"
      >
        {busy ? "Placing order…" : "Pay by card (place order)"}
      </button>
    </form>
  );
}

/** Line items for bag page (Swift `ShopAllBagView` row). */
export function ShopAllBagLineList({
  items,
}: {
  items: MarketplaceProductRow[];
}) {
  const { remove } = useShopAllBag();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <span className="text-5xl text-prel-tertiary-label" aria-hidden>
          👜
        </span>
        <p className="text-[17px] font-semibold text-prel-secondary-label">
          Your bag is empty
        </p>
        <a
          href="/search?browse=1&tryCart=1"
          className="text-[15px] font-semibold text-[var(--prel-primary)]"
        >
          Browse Try Cart
        </a>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((p) => {
        const img = firstProductImageUrl(p.imagesUrl);
        const sale = lineSale(p);
        return (
          <li
            key={p.id}
            className="flex gap-3 rounded-2xl bg-prel-bg-grouped p-3 ring-1 ring-prel-glass-border"
          >
            <div className="relative h-[94px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-white">
              <SafeImage
                src={img}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              {p.brand?.name ? (
                <p className="text-[11px] font-semibold text-[var(--prel-primary)]">
                  {p.brand.name}
                </p>
              ) : null}
              <p className="line-clamp-2 text-[14px] font-semibold text-prel-label">
                {p.name ?? "Listing"}
              </p>
              {p.seller?.username ? (
                <p className="mt-0.5 text-[12px] text-prel-secondary-label">
                  @{p.seller.username}
                </p>
              ) : null}
              <p className="mt-1 text-[15px] font-bold text-prel-label">
                {formatMoney(sale)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(p.id)}
              className="shrink-0 self-start rounded-full p-1 text-prel-secondary-label hover:bg-black/5"
              aria-label="Remove from bag"
            >
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
}
