/** Logos: ComplianceSeal and LogoTile. */

import Image from "next/image";
import { cn } from "@/lib/cn";

/* ---- ComplianceSeal -------------------------------------------------------- */

export type ComplianceSealProps = {
  src: string;
  alt: string;
  /** `plain` = logo artwork as-is, `iso` = logo inset on a white disc */
  variant?: "plain" | "iso";
  className?: string;
};

/** Round certification logo (GDPR, DPDP, ISO). */
export function ComplianceSeal({ src, alt, variant = "plain", className }: ComplianceSealProps) {
  return (
    <span
      title={alt}
      className={cn(
        "grid size-11.5 shrink-0 place-items-center overflow-hidden rounded-full transition-transform duration-250 ease-brand hover:-translate-y-0.5",
        variant === "iso" && "bg-strong ring-1 ring-border-strong",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={64}
        height={64}
        className={cn("object-contain", variant === "iso" ? "size-[64%]" : "size-full")}
      />
    </span>
  );
}

/* ---- LogoTile -------------------------------------------------------------- */

export type LogoTileProps = {
  name: string;
  /** Logo image; when missing a dashed placeholder is shown */
  src?: string;
  className?: string;
};

export function LogoTile({ name, src, className }: LogoTileProps) {
  return (
    <li
      className={cn(
        "grid h-12 min-w-0 place-items-center rounded-lg text-xs text-dim",
        !src && "border border-dashed border-border-dashed",
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name} width={160} height={48} className="h-8 w-auto object-contain" />
      ) : (
        <span className="truncate px-2">{name}</span>
      )}
    </li>
  );
}
