import Link from "next/link";

const BRACKETS: { label: string; max: number }[] = [
  { label: "10", max: 10 },
  { label: "20", max: 20 },
  { label: "50", max: 50 },
  { label: "100", max: 100 },
];

/**
 * Depop-style “Shop by price”: subtle neutral gradient tiles, “Under £X”.
 */
export function HomeShopByPrice() {
  return (
    <section className="bg-white pb-10 pt-2 sm:pb-12 sm:pt-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10">
        <h2 className="mb-6 text-[1.5rem] font-black tracking-tight text-black sm:mb-8 sm:text-[1.65rem]">
          Shop by price
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {BRACKETS.map(({ label, max }) => (
            <Link
              key={max}
              href={`/search?browse=1&maxPrice=${max}`}
              className="flex min-h-[5.5rem] items-center justify-center rounded-lg bg-gradient-to-b from-neutral-50 to-neutral-100/90 px-3 py-4 text-center shadow-sm ring-1 ring-black/[0.08] transition hover:from-neutral-100 hover:to-neutral-200/80 hover:ring-black/12"
            >
              <p className="text-[15px] leading-tight text-neutral-800 sm:text-[16px]">
                <span className="font-normal">Under </span>
                <span className="font-black text-black">£{label}</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
