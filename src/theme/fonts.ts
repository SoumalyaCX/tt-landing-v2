import { Urbanist } from "next/font/google";

/**
 * Fonts — Urbanist (variable, so every weight from 100–900 renders exactly,
 * including the 450 body weight). Swap the family here; theme.css reads the
 * `--font-urbanist` variable, so keep that name stable.
 */
const fontSans = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

export const fontVariables = fontSans.variable;
