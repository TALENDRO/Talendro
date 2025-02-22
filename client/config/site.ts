export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Talendro",
  description:
    "Empowering your search for trusted talent—Talendro connects you with skilled professionals you can rely on.",
  navItems: [
    {
      label: "Admin",
      href: "/admin",
    },
    {
      label: "Explore",
      href: "/projects",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Arbitrator",
      href: "/arbitrator",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Admin",
      href: "/admin",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Arbitrator",
      href: "/arbitrator",
    },
  ],
  links: {
    github: "https://github.com/TALENDRO/talendro",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
