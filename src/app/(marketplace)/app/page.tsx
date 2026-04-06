import type { Metadata } from "next";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Mobile apps",
  description: `Download the ${BRAND_NAME} app for iOS and Android.`,
};

export default function MobileAppsPage() {
  return (
    <SimpleDocPage
      title="Mobile apps"
      lead={`The full ${BRAND_NAME} experience — listings, chat, checkout, and notifications — lives in our native apps.`}
    >
      <h2>iOS</h2>
      <p>
        Search the App Store for <strong>{BRAND_NAME}</strong> or use your
        official App Store link once published. Enable notifications for offers
        and messages.
      </p>

      <h2>Android</h2>
      <p>
        Find {BRAND_NAME} on Google Play. Turn on updates so you always have
        the latest security fixes and features.
      </p>

      <h2>Web</h2>
      <p>
        This website is perfect for browsing and discovery. Some account
        actions may still route you to the app — we are bringing more features
        to the browser over time.
      </p>
    </SimpleDocPage>
  );
}
