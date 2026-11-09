import {
  AirplaneTiltIcon,
  ArrowsLeftRightIcon,
  BankIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BroadcastIcon,
  BrowsersIcon,
  BuildingsIcon,
  CalculatorIcon,
  CalendarBlankIcon,
  CalendarCheckIcon,
  CalendarDotsIcon,
  ChartBarIcon,
  ChartPieSliceIcon,
  ClockIcon,
  CodeIcon,
  CrownSimpleIcon,
  CubeIcon,
  DesktopTowerIcon,
  EyeIcon,
  FactoryIcon,
  FileMagnifyingGlassIcon,
  FilmSlateIcon,
  FlagIcon,
  GaugeIcon,
  GlobeHemisphereWestIcon,
  GraduationCapIcon,
  HardDrivesIcon,
  HeadsetIcon,
  HeartbeatIcon,
  HouseLineIcon,
  KanbanIcon,
  KeyboardIcon,
  ListChecksIcon,
  LockKeyIcon,
  MagnifyingGlassIcon,
  MegaphoneSimpleIcon,
  MonitorIcon,
  PlugsConnectedIcon,
  ProhibitIcon,
  PulseIcon,
  ScalesIcon,
  ShieldCheckIcon,
  ShieldWarningIcon,
  SparkleIcon,
  SquaresFourIcon,
  StackIcon,
  StethoscopeIcon,
  TargetIcon,
  TimerIcon,
  TrendUpIcon,
  UmbrellaIcon,
  UserCheckIcon,
  UserIcon,
  UserPlusIcon,
  UsersThreeIcon,
  VideoCameraIcon,
  WalletIcon,
} from "@phosphor-icons/react/ssr";
import { NavBar } from "@/components/nav/nav-bar";
import type { LinkData, MegaMenuData, MenuLink, NavAction, NavItem } from "@/components/nav/types";

/* ---- Navigation data ------------------------------------------------------ */

const product: MegaMenuData = {
  railLabel: "Product",
  ariaLabel: "Product modules",
  compact: true,
  categories: [
    {
      label: "Productivity Management",
      sub: "Focus, output and delivery",
      icon: <TrendUpIcon />,
      showHead: true,
      links: [
        {
          label: "Productivity Metrics",
          href: "/product/productivity-management/productivity-metrics",
          icon: <GaugeIcon />,
          desc: "Focus index, deep work and productive hours",
        },
        {
          label: "Benchmarking & Comparison",
          href: "/product/productivity-management/benchmarking-and-comparison",
          icon: <ScalesIcon />,
          desc: "Compare people and teams against fair baselines",
        },
        {
          label: "Coaching & Burnout",
          href: "/product/productivity-management/coaching-and-burnout",
          icon: <HeartbeatIcon />,
          desc: "Spot burnout and drift early, coach with evidence",
        },
        {
          label: "Delivery Tracking",
          href: "/product/productivity-management/delivery-tracking",
          icon: <CalendarCheckIcon />,
          desc: "Planned versus actual, and on-time delivery",
        },
        {
          label: "AI Adoption",
          href: "/product/productivity-management/ai-adoption",
          icon: <SparkleIcon />,
          desc: "How AI tools are used across your teams",
        },
        {
          label: "Developer Productivity",
          href: "/product/productivity-management/developer-productivity",
          icon: <CodeIcon />,
          desc: "Code time, focus and flow for engineering",
        },
      ],
      more: { label: "Explore Productivity Management", href: "/product/productivity-management" },
    },
    {
      label: "Employee Monitoring",
      sub: "Activity, with the context",
      icon: <EyeIcon />,
      showHead: true,
      links: [
        {
          label: "Employee Screen Monitoring",
          href: "/product/employee-monitoring/employee-screen-monitoring",
          icon: <MonitorIcon />,
          desc: "Screenshots with the work context behind them",
        },
        {
          label: "User Activity Monitoring",
          href: "/product/employee-monitoring/user-activity-monitoring",
          icon: <PulseIcon />,
          desc: "App, URL and session activity on every device",
        },
        {
          label: "Real-Time Activity Monitoring",
          href: "/product/employee-monitoring/real-time-activity-monitoring",
          icon: <BroadcastIcon />,
          desc: "Who is working on what, right now",
        },
        {
          label: "Application & Website Tracking",
          href: "/product/employee-monitoring/application-and-website-tracking",
          icon: <BrowsersIcon />,
          desc: "Time spent per app and site, classified",
        },
      ],
      more: { label: "Explore Employee Monitoring", href: "/product/employee-monitoring" },
    },
    {
      label: "Insider Risk Monitoring",
      sub: "Spot and stop data risk",
      icon: <ShieldWarningIcon />,
      showHead: true,
      links: [
        {
          label: "Incident Triggered Video Recording",
          href: "/product/insider-risk-monitoring/incident-triggered-video-recording",
          icon: <VideoCameraIcon />,
          desc: "Records only when a risk rule fires",
        },
        {
          label: "File Activity Monitoring",
          href: "/product/insider-risk-monitoring/file-activity-monitoring",
          icon: <FileMagnifyingGlassIcon />,
          desc: "File moves, copies and uploads",
        },
        {
          label: "Keystroke Monitoring",
          href: "/product/insider-risk-monitoring/keystroke-monitoring",
          icon: <KeyboardIcon />,
          desc: "For high-risk roles, set by policy",
        },
        {
          label: "USB & Website Blocking",
          href: "/product/insider-risk-monitoring/usb-and-website-blocking",
          icon: <ProhibitIcon />,
          desc: "Block devices and sites by policy",
        },
      ],
      more: { label: "Explore Insider Risk Monitoring", href: "/product/insider-risk-monitoring" },
    },
    {
      label: "Project & Task Management",
      sub: "Plan and ship the work",
      icon: <KanbanIcon />,
      showHead: true,
      links: [
        {
          label: "Kanban & Agile Workflows",
          href: "/product/project-and-task-management/kanban-and-agile-workflows",
          icon: <KanbanIcon />,
          desc: "Boards, sprints and backlogs",
        },
        {
          label: "Core Project Management Tools",
          href: "/product/project-and-task-management/core-project-management-tools",
          icon: <ListChecksIcon />,
          desc: "Projects, tasks, owners and deadlines",
        },
        {
          label: "Budget Monitoring",
          href: "/product/project-and-task-management/budget-monitoring",
          icon: <WalletIcon />,
          desc: "Planned versus actual cost per project",
        },
        {
          label: "Wiki",
          href: "/product/project-and-task-management/wiki",
          icon: <BookOpenIcon />,
          desc: "Team knowledge next to the work",
        },
      ],
      more: {
        label: "Explore Project & Task Management",
        href: "/product/project-and-task-management",
      },
    },
    {
      label: "Time Tracking & Attendance",
      sub: "Hours, timesheets and leave",
      icon: <ClockIcon />,
      showHead: true,
      links: [
        {
          label: "Project, Task & Activity Time Tracking",
          href: "/product/time-tracking-and-attendance/project-task-and-activity-time-tracking",
          icon: <TimerIcon />,
          desc: "Time logged against the work it belongs to",
        },
        {
          label: "Automated Timesheets",
          href: "/product/time-tracking-and-attendance/automated-timesheets",
          icon: <CalendarBlankIcon />,
          desc: "Timesheets that fill themselves",
        },
        {
          label: "Attendance Tracking",
          href: "/product/time-tracking-and-attendance/attendance-tracking",
          icon: <UserCheckIcon />,
          desc: "Check-ins, shifts and presence",
        },
        {
          label: "Leave & Time-Off Management",
          href: "/product/time-tracking-and-attendance/leave-and-time-off-management",
          icon: <AirplaneTiltIcon />,
          desc: "Requests, approvals and balances",
        },
      ],
      more: {
        label: "Explore Time Tracking & Attendance",
        href: "/product/time-tracking-and-attendance",
      },
    },
    {
      label: "Resource Management",
      sub: "People, capacity and skills",
      icon: <UsersThreeIcon />,
      showHead: true,
      links: [
        {
          label: "Employee Scheduling",
          href: "/product/resource-management/employee-scheduling",
          icon: <CalendarDotsIcon />,
          desc: "Shifts and schedules in one place",
        },
        {
          label: "Resource Allocation & Utilization",
          href: "/product/resource-management/resource-allocation-and-utilization",
          icon: <ChartPieSliceIcon />,
          desc: "Who is free, who is stretched",
        },
        {
          label: "Capacity Planning",
          href: "/product/resource-management/capacity-planning",
          icon: <GaugeIcon />,
          desc: "Plan workload and hiring ahead",
        },
        {
          label: "Skill Matrix & Search",
          href: "/product/resource-management/skill-matrix-and-search",
          icon: <MagnifyingGlassIcon />,
          desc: "Find the right person by skill",
        },
      ],
      more: { label: "Explore Resource Management", href: "/product/resource-management" },
    },
    {
      label: "Workforce Analytics",
      sub: "One metric system, every level",
      icon: <ChartBarIcon />,
      showHead: true,
      links: [
        {
          label: "Individual Analytics",
          href: "/product/workforce-analytics/individual-analytics",
          icon: <UserIcon />,
          desc: "One person, in context",
        },
        {
          label: "Team & Department Analytics",
          href: "/product/workforce-analytics/team-and-department-analytics",
          icon: <UsersThreeIcon />,
          desc: "Where the pattern is",
        },
        {
          label: "Org-Level Analytics",
          href: "/product/workforce-analytics/org-level-analytics",
          icon: <BuildingsIcon />,
          desc: "The whole trace, no sampling",
        },
        {
          label: "System Dashboards",
          href: "/product/workforce-analytics/system-dashboards",
          icon: <SquaresFourIcon />,
          desc: "The standard set, out of the box",
        },
      ],
      more: { label: "Explore Workforce Analytics", href: "/product/workforce-analytics" },
    },
  ],
};

const solutions: MegaMenuData = {
  railLabel: "Solutions",
  ariaLabel: "Solution categories",
  compact: false,
  categories: [
    {
      label: "By Use Case",
      sub: "What it does",
      icon: <TargetIcon />,
      links: [
        {
          label: "Workforce Planning",
          href: "/solutions/by-use-case/workforce-planning",
          icon: <TargetIcon />,
          desc: "The who — capacity, allocation and ETA",
        },
        {
          label: "Productivity Management",
          href: "/solutions/by-use-case/productivity-management",
          icon: <TrendUpIcon />,
          desc: "The what — where the hours actually went",
        },
        {
          label: "Employee Monitoring",
          href: "/solutions/by-use-case/employee-monitoring",
          icon: <EyeIcon />,
          desc: "The why — activity with the reason behind it",
        },
        {
          label: "User Activity Monitoring",
          href: "/solutions/by-use-case/user-activity-monitoring",
          icon: <PulseIcon />,
          desc: "Capture on every app, URL and session",
        },
        {
          label: "Hourly Scoring",
          href: "/solutions/by-use-case/hourly-scoring",
          icon: <ClockIcon />,
          desc: "Every hour gets its own score",
        },
        {
          label: "Wellbeing & Burnout",
          href: "/solutions/by-use-case/wellbeing-burnout",
          icon: <HeartbeatIcon />,
          desc: "Both ends of the barbell, caught early",
        },
        {
          label: "Tool Consolidation",
          href: "/solutions/by-use-case/tool-consolidation",
          icon: <StackIcon />,
          desc: "Seven subscriptions, one record",
        },
        {
          label: "Compliance & Audit",
          href: "/solutions/by-use-case/compliance-audit",
          icon: <LockKeyIcon />,
          desc: "Policy, records and evidence in one place",
        },
        {
          label: "TraceAI",
          href: "/solutions/by-use-case/traceai",
          icon: <SparkleIcon />,
          desc: "Ask the record from chat or your own agent",
        },
      ],
    },
    {
      label: "By Teams & Role",
      sub: "Who it’s for",
      icon: <UsersThreeIcon />,
      links: [
        {
          label: "C-Suite",
          href: "/solutions/by-teams-and-role/c-suite",
          icon: <CrownSimpleIcon />,
          desc: "Organization-wide visibility, one metric system",
        },
        {
          label: "Human Resource",
          href: "/solutions/by-teams-and-role/human-resource",
          icon: <UsersThreeIcon />,
          desc: "Wellbeing, compliance and the evidence behind both",
        },
        {
          label: "IT Managers",
          href: "/solutions/by-teams-and-role/it-managers",
          icon: <DesktopTowerIcon />,
          desc: "Fewer tools, one continuous record",
        },
        {
          label: "Resource Managers",
          href: "/solutions/by-teams-and-role/resource-managers",
          icon: <GaugeIcon />,
          desc: "Capacity, allocation and drift",
        },
      ],
    },
    {
      label: "Work Mode",
      sub: "How work is organized",
      icon: <HouseLineIcon />,
      links: [
        {
          label: "Remote",
          href: "/solutions/by-work-mode/remote",
          icon: <HouseLineIcon />,
          desc: "Work across time zones without losing the thread",
        },
        {
          label: "In-Office",
          href: "/solutions/by-work-mode/in-office",
          icon: <BuildingsIcon />,
          desc: "Floor presence, attendance and focus",
        },
        {
          label: "Hybrid",
          href: "/solutions/by-work-mode/hybrid",
          icon: <ArrowsLeftRightIcon />,
          desc: "Office and remote on one timeline",
        },
      ],
    },
    {
      label: "Industry",
      sub: "Where it’s used",
      icon: <FactoryIcon />,
      groups: [
        {
          label: "Technology & Digital",
          links: [
            {
              label: "IT Services & Software",
              href: "/solutions/by-industry/it-services-and-software",
              icon: <CodeIcon />,
            },
            {
              label: "SaaS & Product Engineering",
              href: "/solutions/by-industry/saas-and-product-engineering",
              icon: <CubeIcon />,
            },
            {
              label: "Managed Service Providers",
              href: "/solutions/by-industry/managed-service-providers",
              icon: <HardDrivesIcon />,
            },
            {
              label: "Digital & Creative Agencies",
              href: "/solutions/by-industry/digital-and-creative-agencies",
              icon: <MegaphoneSimpleIcon />,
            },
            {
              label: "Design, Animation & VFX",
              href: "/solutions/by-industry/design-animation-and-vfx",
              icon: <FilmSlateIcon />,
            },
          ],
        },
        {
          label: "Outsourcing & Support",
          links: [
            {
              label: "BPO & ITES",
              href: "/solutions/by-industry/bpo-and-ites",
              icon: <GlobeHemisphereWestIcon />,
            },
            {
              label: "Customer Support & Contact Centers",
              href: "/solutions/by-industry/customer-support-and-contact-centers",
              icon: <HeadsetIcon />,
            },
            {
              label: "Staffing, Recruitment & RPO",
              href: "/solutions/by-industry/staffing-recruitment-and-rpo",
              icon: <UserPlusIcon />,
            },
            {
              label: "Healthcare RCM & Medical Billing",
              href: "/solutions/by-industry/healthcare-rcm-and-medical-billing",
              icon: <StethoscopeIcon />,
            },
            {
              label: "Insurance Operations",
              href: "/solutions/by-industry/insurance-operations",
              icon: <UmbrellaIcon />,
            },
          ],
        },
        {
          label: "Professional & Regulated",
          links: [
            {
              label: "Consulting & Professional Services",
              href: "/solutions/by-industry/consulting-and-professional-services",
              icon: <BriefcaseIcon />,
            },
            {
              label: "Accounting, Audit & Tax",
              href: "/solutions/by-industry/accounting-audit-and-tax",
              icon: <CalculatorIcon />,
            },
            {
              label: "Legal & LPO",
              href: "/solutions/by-industry/legal-and-lpo",
              icon: <ScalesIcon />,
            },
            {
              label: "BFSI Back-Office",
              href: "/solutions/by-industry/bfsi-back-office",
              icon: <BankIcon />,
            },
            {
              label: "EdTech & Online Education",
              href: "/solutions/by-industry/edtech-and-online-education",
              icon: <GraduationCapIcon />,
            },
          ],
        },
      ],
    },
  ],
};

const explore: MenuLink[] = [
  {
    label: "How the signal works",
    desc: "From capture to companion",
    href: "#platform",
    icon: <PulseIcon />,
  },
  {
    label: "Research & trust",
    desc: "What the evidence says",
    href: "#trust",
    icon: <ShieldCheckIcon />,
  },
  {
    label: "The ROI",
    desc: "What productivity returns in a quarter",
    href: "#roi",
    icon: <TrendUpIcon />,
  },
  {
    label: "Customer stories",
    desc: "How teams use TeamTrace",
    href: "#stories",
    icon: <UsersThreeIcon />,
  },
  {
    label: "Integrations",
    desc: "33 tools TeamTrace reads from",
    href: "#integrations",
    icon: <PlugsConnectedIcon />,
  },
  {
    label: "Activity vs. metrics",
    desc: "What traditional tracking misses",
    href: "#consolidation",
    icon: <EyeIcon />,
  },
  {
    label: "Hourly scoring",
    desc: "Every hour gets its own score",
    href: "#metrics",
    icon: <ClockIcon />,
  },
  {
    label: "Dashboards",
    desc: "Role-based, system and custom",
    href: "#metrics",
    icon: <GaugeIcon />,
  },
];

const company: MenuLink[] = [
  {
    label: "Our mission",
    desc: "Visibility without surveillance",
    href: "#top",
    icon: <FlagIcon />,
  },
  {
    label: "Ethics & policy",
    desc: "What TeamTrace will not do",
    href: "#top",
    icon: <ShieldCheckIcon />,
  },
  { label: "Contact", desc: "Book a demo", href: "#cta", icon: <HeadsetIcon /> },
];

const items: NavItem[] = [
  { kind: "mega", label: "Product", menu: product },
  { kind: "mega", label: "Solutions", menu: solutions },
  { kind: "link", label: "Pricing", href: "#cta" },
  { kind: "link", label: "Resources", href: "#trust" },
  { kind: "dropdown", label: "Explore", links: explore },
  { kind: "dropdown", label: "Company", links: company },
];

const login: LinkData = { label: "Log in", href: "#" };

const actions: NavAction[] = [
  { label: "Sign up", href: "#", variant: "ghost" },
  { label: "Book a demo", href: "#cta", variant: "primary" },
];

/* ---- Component ------------------------------------------------------------ */

/** Site navigation, rendered once in the root layout. */
export function Navbar() {
  return (
    <NavBar
      brand={{
        src: "/brand/logo-nav.png",
        alt: "TeamTrace",
        href: "/#top",
        width: 480,
        height: 129,
      }}
      items={items}
      utilityLink={login}
      actions={actions}
      labels={{
        nav: "Main",
        home: "TeamTrace home",
        openMenu: "Open menu",
        closeMenu: "Close menu",
      }}
    />
  );
}
