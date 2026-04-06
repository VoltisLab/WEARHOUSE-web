"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { CREATE_CHAT, CREATE_OFFER, CREATE_ORDER } from "@/graphql/mutations/marketplace";
import { VIEW_ME } from "@/graphql/queries/admin";
import { useAuth } from "@/contexts/AuthContext";
import { formatMoney } from "@/lib/format";

type Props = {
  productId: number;
  price: number;
  status: string | null | undefined;
  sellerUsername: string | null | undefined;
};

export function ProductPurchaseSection({
  productId,
  price,
  status,
  sellerUsername,
}: Props) {
  const router = useRouter();
  const { userToken, ready } = useAuth();
  const { data: meData } = useQuery(VIEW_ME, {
    skip: !ready || !userToken,
  });
  const meUsername = meData?.viewMe?.username?.trim() ?? "";
  const isOwner =
    !!sellerUsername &&
    !!meUsername &&
    sellerUsername.trim().toLowerCase() === meUsername.toLowerCase();

  const [createChat, { loading: chatLoading }] = useMutation(CREATE_CHAT);
  const [createOffer, { loading: offerLoading }] = useMutation(CREATE_OFFER);
  const [createOrder, { loading: orderLoading }] = useMutation(CREATE_ORDER);

  const [offerOpen, setOfferOpen] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [offerPrice, setOfferPrice] = useState(String(price));
  const [offerMessage, setOfferMessage] = useState("");

  const [addrLine, setAddrLine] = useState("");
  const [city, setCity] = useState("");
  const [stateCounty, setStateCounty] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("GB");
  const [phone, setPhone] = useState("");

  const sold = status === "SOLD";
  const busy = chatLoading || offerLoading || orderLoading;

  const openLogin = useCallback(() => {
    router.push(`/login?next=${encodeURIComponent(`/product/${productId}`)}`);
  }, [router, productId]);

  const onMessage = async () => {
    setErr(null);
    setBanner(null);
    if (!userToken || !sellerUsername) return;
    try {
      const { data, errors } = await createChat({
        variables: { recipient: sellerUsername.trim() },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setErr(errors.map((e) => e.message).join(" · "));
        return;
      }
      const id = data?.createChat?.chat?.id;
      if (id != null) {
        router.push(`/messages/${id}`);
        return;
      }
      setErr("Could not open chat.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Chat failed.");
    }
  };

  const onSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBanner(null);
    const p = parseFloat(offerPrice);
    if (!userToken || Number.isNaN(p) || p <= 0) {
      setErr("Enter a valid offer amount.");
      return;
    }
    try {
      const { data, errors } = await createOffer({
        variables: {
          productIds: [productId],
          offerPrice: p,
          message: offerMessage.trim() || null,
        },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setErr(errors.map((x) => x.message).join(" · "));
        return;
      }
      if (!data?.createOffer?.success) {
        setErr(data?.createOffer?.message || "Offer could not be sent.");
        return;
      }
      const cid = data.createOffer.data?.conversationId;
      setOfferOpen(false);
      setBanner("Offer sent. You can continue the conversation in Messages.");
      if (cid != null) {
        router.push(`/messages/${cid}`);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Offer failed.");
    }
  };

  const onBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setBanner(null);
    if (!userToken) return;
    if (
      !addrLine.trim() ||
      !city.trim() ||
      !stateCounty.trim() ||
      !postal.trim() ||
      !country.trim() ||
      !phone.trim()
    ) {
      setErr("Please fill in the full delivery address and phone.");
      return;
    }
    try {
      const { data, errors } = await createOrder({
        variables: {
          productId,
          shippingFee: 0,
          buyerProtection: true,
          deliveryDetails: {
            deliveryAddress: {
              address: addrLine.trim(),
              city: city.trim(),
              state: stateCounty.trim(),
              country: country.trim(),
              postalCode: postal.trim(),
              phoneNumber: phone.trim(),
            },
            deliveryProvider: "ROYAL_MAIL",
            deliveryType: "HOME_DELIVERY",
          },
        },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setErr(errors.map((x) => x.message).join(" · "));
        return;
      }
      if (!data?.createOrder?.success || !data.createOrder.order?.id) {
        setErr("Order could not be created.");
        return;
      }
      setBuyOpen(false);
      router.push("/account/orders");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Checkout failed.");
    }
  };

  if (!sellerUsername) {
    return null;
  }

  if (!ready) {
    return (
      <div className="h-14 animate-pulse rounded-2xl bg-white/80 shadow-ios ring-1 ring-prel-glass-border" />
    );
  }

  if (!userToken) {
    return (
      <div className="space-y-3 rounded-2xl bg-white p-4 shadow-ios ring-1 ring-prel-glass-border">
        <p className="text-[14px] text-prel-secondary-label">
          Sign in to message the seller, send an offer, or buy this item.
        </p>
        <button
          type="button"
          onClick={openLogin}
          className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-[var(--prel-primary)] text-[15px] font-semibold text-white shadow-ios"
        >
          Sign in
        </button>
      </div>
    );
  }

  if (isOwner) {
    return (
      <p className="rounded-2xl bg-prel-bg-grouped px-4 py-3 text-[14px] text-prel-secondary-label ring-1 ring-prel-glass-border">
        This is your listing. Buyers can message you or make offers here once
        they are signed in.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {banner ? (
        <p className="rounded-xl bg-emerald-500/10 px-3 py-2 text-[13px] text-emerald-800">
          {banner}
        </p>
      ) : null}
      {err ? (
        <p className="rounded-xl bg-prel-error/10 px-3 py-2 text-[13px] text-prel-error">
          {err}
        </p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          disabled={busy || sold}
          onClick={onMessage}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-2xl bg-white text-[15px] font-semibold text-prel-label shadow-ios ring-1 ring-prel-glass-border disabled:opacity-45"
        >
          {chatLoading ? "Opening…" : "Message seller"}
        </button>
        <button
          type="button"
          disabled={busy || sold}
          onClick={() => {
            setErr(null);
            setOfferOpen(true);
            setOfferPrice(String(price));
          }}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-2xl bg-white text-[15px] font-semibold text-prel-label shadow-ios ring-1 ring-prel-glass-border disabled:opacity-45"
        >
          Send offer
        </button>
        <button
          type="button"
          disabled={busy || sold}
          onClick={() => {
            setErr(null);
            setBuyOpen(true);
          }}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-2xl bg-[var(--prel-primary)] text-[15px] font-semibold text-white shadow-ios disabled:opacity-45"
        >
          Buy now
        </button>
      </div>

      {sold ? (
        <p className="text-center text-[13px] text-prel-secondary-label">
          This item is sold — messaging and checkout are disabled.
        </p>
      ) : (
        <p className="text-center text-[12px] text-prel-tertiary-label">
          Verified accounts can send offers and place orders. Payment is
          completed in the mobile app.{" "}
          <Link href="/app" className="font-semibold text-[var(--prel-primary)]">
            Get the app
          </Link>
        </p>
      )}

      {offerOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal
          aria-labelledby="offer-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <h2 id="offer-title" className="text-[17px] font-bold text-prel-label">
              Send offer
            </h2>
            <p className="mt-1 text-[13px] text-prel-secondary-label">
              The seller will see your offer in chat. Listing price:{" "}
              {formatMoney(price)}
            </p>
            <form onSubmit={onSendOffer} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-prel-secondary-label">
                  Your offer (GBP)
                </label>
                <input
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-prel-secondary-label">
                  Message (optional)
                </label>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOfferOpen(false)}
                  className="min-h-[44px] flex-1 rounded-xl bg-prel-bg-grouped text-[14px] font-semibold text-prel-label ring-1 ring-prel-separator"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={offerLoading}
                  className="min-h-[44px] flex-1 rounded-xl bg-[var(--prel-primary)] text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {offerLoading ? "Sending…" : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {buyOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal
          aria-labelledby="buy-title"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <h2 id="buy-title" className="text-[17px] font-bold text-prel-label">
              Buy now
            </h2>
            <p className="mt-1 text-[13px] text-prel-secondary-label">
              We will create an order with Royal Mail home delivery. Complete
              payment in the app after placing the order.
            </p>
            <form onSubmit={onBuy} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-prel-secondary-label">
                  Address line
                </label>
                <input
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
                  autoComplete="street-address"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-prel-secondary-label">
                    City
                  </label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-prel-secondary-label">
                    County / state
                  </label>
                  <input
                    value={stateCounty}
                    onChange={(e) => setStateCounty(e.target.value)}
                    className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-prel-secondary-label">
                    Postcode
                  </label>
                  <input
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-prel-secondary-label">
                    Country
                  </label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-prel-secondary-label">
                  Phone
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBuyOpen(false)}
                  className="min-h-[44px] flex-1 rounded-xl bg-prel-bg-grouped text-[14px] font-semibold text-prel-label ring-1 ring-prel-separator"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={orderLoading}
                  className="min-h-[44px] flex-1 rounded-xl bg-[var(--prel-primary)] text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {orderLoading ? "Placing…" : "Place order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
