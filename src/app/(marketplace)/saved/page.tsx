import type { Metadata } from "next";
import { FavouritesPageContent } from "@/components/marketplace/FavouritesPageContent";

export const metadata: Metadata = {
  title: "Favourites",
  description: "Your favourite listings — liked items from your WEARHOUSE account.",
};

export default function MarketplaceSavedPage() {
  return <FavouritesPageContent />;
}
