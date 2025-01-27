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
import { GithubIcon, Logo, TalendroLogo } from "@/components/icons";
import { useState } from "react";
import { ThemeSwitch } from "./theme-switch";
import WalletConnector from "./walletConnector/client";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <NextUINavbar
      maxWidth="xl"
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
      isBordered
      className="font-comfortaa"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <TalendroLogo />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent></NavbarContent>

      <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
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
            </NavbarItem>
          ))}
        </ul>

        {/* Github & Dark/light Mode */}
        <NavbarItem className="hidden md:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>

        <NavbarItem className="hidden md:block">
        <WalletConnector/>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="md:hidden">
        <NavbarItem className="flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <WalletConnector/>

        </NavbarItem>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden justify-end"
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
        <NavbarMenuItem className="my-10">
          {/* <WalletConnectors /> */}
          {/* <WalletClient /> */}
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
};
