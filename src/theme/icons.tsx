"use client";

import { IconContext, type IconWeight } from "@phosphor-icons/react";

/**
 * Icon defaults for every Phosphor icon rendered in client components.
 * Convention (from the demo): `regular` for UI icons 12–20px, `light` for
 * feature icons 24px+, `fill` for solid accents.
 * Server components import from "@phosphor-icons/react/ssr" and pass
 * `weight` explicitly, because context does not reach them.
 */
const iconDefaults = {
  weight: "regular" as IconWeight,
  size: "1em",
  mirrored: false,
};

/** Fill value for brand-gradient icons: `<SparkleIcon color={iconGradient} />` */
export const iconGradient = "url(#ph-grad)";

export function IconProvider({ children }: { children: React.ReactNode }) {
  return <IconContext.Provider value={iconDefaults}>{children}</IconContext.Provider>;
}
