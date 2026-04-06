import type { Metadata } from "next";
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
