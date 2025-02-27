import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans, fontComfortaa } from "@/config/fonts";
import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/context/authContext";
import { ThemeSwitch } from "@/components/theme-switch";
import Footer from "@/components/layout/footer";
import { Suspense } from "react";
import Loading from "./loading";
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
      <AuthProvider>
        <head />
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            fontComfortaa.variable
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <div className="relative flex flex-col h-screen">
              {/* <Suspense fallback={<Loading />}> */}
              <Navbar />
              {/* <Loading /> */}
              <main className="container mx-auto pt-16 px-6 flex-grow">
                {children}
              </main>
              <Footer />
              {/* </Suspense> */}
            </div>
            <Toaster richColors />
            <ThemeSwitch />
          </Providers>
        </body>
      </AuthProvider>
    </html>
  );
}
