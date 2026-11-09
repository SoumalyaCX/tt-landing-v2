import { type Metadata, type Viewport } from "next";
import { Providers } from "@/app/providers";
import { siteConfig } from "@/config/site";
import { fontVariables } from "@/theme/fonts";
import { IconGradientDefs } from "@/theme/icon-gradient";
import { ScrollProgress } from "@/components/nav/scroll-progress";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000", // = --void in theme.css (browser UI colour)
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme drives the token set in src/styles/theme.css
    <html lang="en" data-theme="dark" className={fontVariables}>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla's
          `cz-shortcut-listen`) add attributes to <body> before React loads.
          This only silences attribute mismatches on <body> itself, not its children. */}
      <body id="top" className="min-h-dvh" suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only rounded-full border border-border-strong bg-popover px-4 py-2.5 text-sm font-semibold text-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70"
        >
          Skip to content
        </a>
        <IconGradientDefs />
        <Providers>
          <ScrollProgress />
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
