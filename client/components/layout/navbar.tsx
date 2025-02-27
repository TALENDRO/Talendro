"use client";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { Logo, TalendroLogo } from "@/components/icons";
import { useEffect, useState } from "react";
import WalletConnector from "../walletConnector/client";
import { usePathname } from "next/navigation";
import { useWallet } from "@/context/walletContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [WallectConnection] = useWallet();
  const { isEmulator } = WallectConnection;

  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 150;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-2 sm:px-4">
      <NextUINavbar
        onMenuOpenChange={setIsMenuOpen}
        isBordered
        className={clsx(
          pathname === "/"
            ? isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-full"
            : "opacity-100 translate-y-0",
          scrolled &&
            "mx-auto my-4 md:w-[80%] sm:w-[75%] rounded-lg shadow-lg border-2 border-primary/50",
          "font-comfortaa transition-all duration-500 "
        )}
      >
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <Logo />
              <TalendroLogo />
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="flex basis-1/5 sm:basis-full"
          justify="center"
        >
          <ul className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                    !isEmulator && item.label === "Admin" && "hidden"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
          </ul>
        </NavbarContent>

        <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
          <NavbarItem className="hidden md:block">
            <WalletConnector />
          </NavbarItem>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="max-md:hidden lg:hidden justify-end"
          />
        </NavbarContent>

        <NavbarContent justify="end" className="sm:hidden">
          <NavbarItem className="flex gap-2">
            <WalletConnector />
          </NavbarItem>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden justify-end"
          />
        </NavbarContent>

        {/* mobile menu open */}
        <NavbarMenu className="py-10">
          {siteConfig.navItems.map((item) => (
            <NavbarMenuItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem className="my-10"></NavbarMenuItem>
        </NavbarMenu>
      </NextUINavbar>
    </div>
  );
};
