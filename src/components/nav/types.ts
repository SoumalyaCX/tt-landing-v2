/** Data shapes shared by the navigation and footer components. */

export type LinkData = { label: string; href: string };

/** Link with icon and optional one-line description (dropdowns, mega menus). */
export type MenuLink = LinkData & { icon: React.ReactNode; desc?: string };

export type MegaCategory = {
  label: string;
  /** Short line under the category name in the rail */
  sub: string;
  icon: React.ReactNode;
  /** Repeat the category name + sub as a heading above the links */
  showHead?: boolean;
  links?: MenuLink[];
  /** Labelled link groups shown as columns (used instead of `links`) */
  groups?: { label: string; links: MenuLink[] }[];
  /** "Explore …" link under the panel */
  more?: LinkData;
};

export type MegaMenuData = {
  railLabel: string;
  ariaLabel: string;
  /** Narrower rail with titles only */
  compact?: boolean;
  categories: MegaCategory[];
};

export type NavItem =
  | { kind: "mega"; label: string; menu: MegaMenuData }
  | { kind: "dropdown"; label: string; links: MenuLink[] }
  | { kind: "link"; label: string; href: string };

export type NavAction = LinkData & { variant: "primary" | "ghost" };

export type SocialLinkData = LinkData & { icon: React.ReactNode };

export type FooterColumnData = { title: string; links: LinkData[] };
