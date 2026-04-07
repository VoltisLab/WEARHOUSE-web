/**
 * Home header category row: top-level links + hover submenus (search URLs the app supports).
 */
export type HomeDepopNavSubitem = { label: string; href: string };

export type HomeDepopNavItem = {
  label: string;
  href: string;
  highlight?: boolean;
  submenu?: HomeDepopNavSubitem[];
};

export const HOME_DEPOP_NAV_ITEMS: HomeDepopNavItem[] = [
  {
    label: "Women",
    href: "/search?dept=WOMEN&browse=1",
    submenu: [
      { label: "Dresses", href: "/search?dept=WOMEN&browse=1&q=dresses" },
      { label: "Tops", href: "/search?dept=WOMEN&browse=1&q=tops" },
      { label: "Jackets & coats", href: "/search?dept=WOMEN&browse=1&q=jacket" },
      { label: "Jeans", href: "/search?dept=WOMEN&browse=1&q=jeans" },
      { label: "Shoes", href: "/search?dept=WOMEN&browse=1&q=shoes" },
      { label: "Bags & accessories", href: "/search?dept=WOMEN&browse=1&q=bag" },
      { label: "Shop all Women", href: "/search?dept=WOMEN&browse=1" },
    ],
  },
  {
    label: "Men",
    href: "/search?dept=MEN&browse=1",
    submenu: [
      { label: "T-shirts & polos", href: "/search?dept=MEN&browse=1&q=t-shirt" },
      { label: "Hoodies & sweatshirts", href: "/search?dept=MEN&browse=1&q=hoodie" },
      { label: "Jackets", href: "/search?dept=MEN&browse=1&q=jacket" },
      { label: "Jeans & trousers", href: "/search?dept=MEN&browse=1&q=jeans" },
      { label: "Trainers", href: "/search?dept=MEN&browse=1&q=trainers" },
      { label: "Shop all Men", href: "/search?dept=MEN&browse=1" },
    ],
  },
  {
    label: "Kids",
    href: "/search?dept=GIRLS&browse=1",
    submenu: [
      { label: "Girls", href: "/search?dept=GIRLS&browse=1" },
      { label: "Boys", href: "/search?dept=BOYS&browse=1" },
      { label: "Toddlers", href: "/search?dept=TODDLERS&browse=1" },
      { label: "Shop all Kids", href: "/search?browse=1&q=kids" },
    ],
  },
  {
    label: "Brands",
    href: "/search?browse=1",
    submenu: [
      { label: "Browse all", href: "/search?browse=1" },
      { label: "Vintage", href: "/search?q=vintage&browse=1" },
      { label: "Streetwear", href: "/search?q=streetwear&browse=1" },
      { label: "Designer", href: "/search?q=designer&browse=1" },
    ],
  },
  {
    label: "Trending",
    href: "/search?browse=1",
    submenu: [
      { label: "Dr. Martens Mary Janes", href: "/search?q=mary+janes&browse=1" },
      { label: "Carhartt", href: "/search?q=carhartt&browse=1" },
      { label: "Barrel jeans", href: "/search?q=barrel+jeans&browse=1" },
      { label: "Festival fits", href: "/search?q=festival&browse=1" },
      { label: "Running sneakers", href: "/search?q=running+sneakers&browse=1" },
    ],
  },
  {
    label: "Sale",
    href: "/search?sale=1&browse=1",
    highlight: true,
    submenu: [
      { label: "All sale items", href: "/search?sale=1&browse=1" },
      { label: "Under £10", href: "/search?browse=1&maxPrice=10" },
      { label: "Under £20", href: "/search?browse=1&maxPrice=20" },
      { label: "Under £50", href: "/search?browse=1&maxPrice=50" },
    ],
  },
];
