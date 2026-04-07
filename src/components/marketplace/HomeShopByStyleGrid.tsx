import Link from "next/link";

const STYLES: { label: string; href: string }[] = [
  {
    label: "'00s sportswear",
    href: "/search?q=00s+sportswear&browse=1",
  },
  {
    label: "'90s minimalism",
    href: "/search?q=90s+minimalism&browse=1",
  },
  {
    label: "The blues",
    href: "/search?q=blue+jacket&browse=1",
  },
  {
    label: "Running gear",
    href: "/search?q=running+sneakers&browse=1",
  },
  {
    label: "Barrel jeans",
    href: "/search?q=barrel+jeans&browse=1",
  },
  {
    label: "Vintage soccer shirts",
    href: "/search?q=vintage+football+shirt&browse=1",
  },
];

/**
 * Depop-style “Shop by style”: 2×3 grid, grey tile + label (placeholder art until real assets).
 */
export function HomeShopByStyleGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 md:px-8 lg:px-10">
      <h2 className="mb-6 text-[1.5rem] font-black tracking-tight text-neutral-900 sm:text-[1.65rem]">
        Shop by style
      </h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3">
        {STYLES.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="group block [-webkit-tap-highlight-color:transparent]"
          >
            <div className="aspect-[4/3] rounded-lg bg-neutral-100 shadow-sm ring-1 ring-black/[0.06] transition group-hover:bg-neutral-50 group-hover:shadow-md group-active:scale-[0.99]" />
            <p className="mt-3 text-center text-[14px] font-bold text-neutral-900 sm:text-[15px]">
              {label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
