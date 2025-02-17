import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { Toaster } from "@/components/ui/sonner";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans, fontComfortaa } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/context/authContext";
import Ribbons from "@/components/ui/Ribbon";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
        <Ribbons
          baseThickness={7}
          colors={["#74b3ce"]}
          speedMultiplier={0.4}
          maxAge={700}
          enableFade={true}
          enableShaderEffect={true}
        />
      </div>
      <AuthProvider>
        <head />
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontComfortaa.variable
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto pt-16 px-6 flex-grow">
                {children}
              </main>
            </div>
            <Toaster richColors />
          </Providers>
        </body>
      </AuthProvider>
    </html>
  );
}
