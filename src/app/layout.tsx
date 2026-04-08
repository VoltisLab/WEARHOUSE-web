import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ApolloProviderWrapper } from "@/lib/ApolloProviderWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: {
    default: "WEARHOUSE",
    template: "%s · WEARHOUSE",
  },
  description: "WEARHOUSE marketplace preview and staff console (web)",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  /** Chrome/Android: resize layout when URL bar / toolbars change (reduces fixed-bottom gaps). */
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="font-ios min-h-full antialiased">
        <ThemeProvider>
          <ApolloProviderWrapper>
            <AuthProvider>{children}</AuthProvider>
          </ApolloProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
