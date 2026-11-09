import Image from "next/image";
import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  LinkedinLogoIcon,
  XLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react/ssr";
import { Container } from "@/components/layout/section";
import { FooterColumn } from "@/components/nav/footer-column";
import { LegalBar, SocialLink } from "@/components/nav/footer-parts";
import { type FooterColumnData, type LinkData, type SocialLinkData } from "@/components/nav/types";

/* ---- Footer data ---------------------------------------------------------- */

const socials: SocialLinkData[] = [
  { label: "Facebook", href: "#", icon: <FacebookLogoIcon /> },
  { label: "Instagram", href: "#", icon: <InstagramLogoIcon /> },
  { label: "LinkedIn", href: "#", icon: <LinkedinLogoIcon /> },
  { label: "YouTube", href: "#", icon: <YoutubeLogoIcon /> },
  { label: "X", href: "#", icon: <XLogoIcon /> },
];

const toggleLabels = { more: "Show more", less: "Show less" };

const productColumns: FooterColumnData[] = [
  {
    title: "Productivity Management",
    links: [
      { label: "Productivity Metrics", href: "#" },
      { label: "Productivity Coaching", href: "#" },
      { label: "Integrated Productivity Profile", href: "#" },
      { label: "Productivity Comparator", href: "#" },
      { label: "Hourly Scoring", href: "#" },
      { label: "Wellbeing & Burnout", href: "#" },
    ],
  },
  {
    title: "Employee Monitoring",
    links: [
      { label: "Employee Screen Monitoring", href: "#" },
      { label: "User Activity Monitoring", href: "#" },
      { label: "Real-Time Activity Monitoring", href: "#" },
      { label: "Application and website tracking", href: "#" },
    ],
  },
  {
    title: "Insider Risk Monitoring",
    links: [
      { label: "Incident Triggered Video Recording", href: "#" },
      { label: "File Activity Monitoring", href: "#" },
      { label: "Keystroke Monitoring", href: "#" },
      { label: "USB and Website Blocking", href: "#" },
      { label: "Compliance & Audit", href: "#" },
    ],
  },
  {
    title: "Project & Tasks",
    links: [
      { label: "Kanban & Agile Workflows", href: "#" },
      { label: "Core Project Management Tools", href: "#" },
      { label: "Budget Monitoring", href: "#" },
      { label: "Wiki", href: "#" },
    ],
  },
  {
    title: "Time Tracking & Attendance",
    links: [
      { label: "Project, Tasks & Activities Time Tracking", href: "#" },
      { label: "Automated Timesheets", href: "#" },
      { label: "Attendance Tracking", href: "#" },
      { label: "Leave & Time-Off Management", href: "#" },
    ],
  },
  {
    title: "Resource Management",
    links: [
      { label: "Employee Scheduling", href: "#" },
      { label: "Resource Allocation & Utilization", href: "#" },
      { label: "Capacity Planning", href: "#" },
      { label: "Skill Matrix & Search", href: "#" },
    ],
  },
  {
    title: "Workforce Analytics",
    links: [
      { label: "Analytics - Individual Analytics", href: "#" },
      { label: "Analytics - Team and Department Analytics", href: "#" },
      { label: "Analytics - Org Level Analytics", href: "#" },
      { label: "Dashboards - System Dashboards", href: "#" },
      { label: "Dashboards - Role-based Dashboards", href: "#" },
      { label: "Dashboards - Custom Dashboards", href: "#" },
      { label: "Reports - Macro, Drilled-down & Custom", href: "#" },
    ],
  },
];

const companyColumns: FooterColumnData[] = [
  {
    title: "Solutions",
    links: [
      { label: "By Use Case", href: "#" },
      { label: "By Teams & Role", href: "#" },
      { label: "Workforce setup", href: "#" },
      { label: "Industry", href: "#" },
      { label: "By Work Mode", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Migration Guides", href: "#" },
      { label: "Download Apps", href: "#" },
      { label: "Docs/Guides", href: "#" },
      { label: "Videos", href: "#" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Product Tour", href: "#" },
      { label: "TraceAI", href: "#" },
      { label: "Security (Security, Identity, Privacy)", href: "#" },
      { label: "ROI calculator", href: "#" },
      { label: "Customer Stories", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Hourly Scoring", href: "#" },
      { label: "Dashboards", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "#" },
      { label: "Mission & Values", href: "#" },
      { label: "Impact", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Ethics & Policy", href: "#" },
    ],
  },
];

const legalLinks: LinkData[] = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Refund Policy", href: "#" },
  { label: "DPDP Compliance", href: "#" },
];

const copyright = "Copyright © 2026 CodeLogicX Technologies Pvt. Ltd. All Rights Reserved.";

/* ---- Component ------------------------------------------------------------ */

/** Site footer, rendered once in the root layout. */
export function Footer() {
  return (
    <footer className="relative border-t border-border bg-footer pt-16 md:pt-22">
      {/* glow line along the top edge */}
      <span
        aria-hidden
        className="absolute -top-px left-1/2 h-px w-[min(56.25rem,80%)] -translate-x-1/2 bg-footer-glow"
      />
      <Container className="grid gap-0 xl:grid-cols-[6rem_minmax(0,1fr)] xl:gap-12">
        <aside
          aria-label="Social media"
          className="order-2 mt-12 grid content-start gap-4.5 border-t border-border pt-8 xl:order-none xl:mt-0 xl:border-t-0 xl:pt-0"
        >
          <p className="text-ui font-semibold text-foreground">Follow us</p>
          <div className="flex flex-wrap gap-2.5 xl:flex-col">
            {socials.map((s) => (
              <SocialLink key={s.label} {...s} />
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-10 flex flex-col-reverse items-start gap-7 md:flex-row md:justify-between md:gap-6">
            <h2 className="text-gradient-footer text-footer-big font-light tracking-tightest">
              Product
            </h2>
            <Image
              src="/brand/logo-footer.png"
              alt="TeamTrace"
              width={480}
              height={129}
              className="h-11.5 w-auto"
            />
          </div>

          <nav
            aria-label="Product"
            className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 md:gap-x-8 md:gap-y-11 xl:grid-cols-4"
          >
            {productColumns.map((col) => (
              <FooterColumn key={col.title} {...col} toggleLabels={toggleLabels} />
            ))}
          </nav>

          <div aria-hidden className="my-11 h-px bg-rule md:mt-12" />

          {/* Heading for the second group, so its column titles don't sit under "Product" */}
          <h2 className="sr-only">Company</h2>
          <nav
            aria-label="Company"
            className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 md:gap-x-8 md:gap-y-11 xl:grid-cols-4"
          >
            {companyColumns.map((col) => (
              <FooterColumn key={col.title} {...col} toggleLabels={toggleLabels} plain />
            ))}
          </nav>
        </div>
      </Container>

      <LegalBar copyright={copyright} links={legalLinks} ariaLabel="Legal" />
    </footer>
  );
}
