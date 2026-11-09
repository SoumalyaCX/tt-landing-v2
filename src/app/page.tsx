import {
  ArrowRightIcon,
  BellSimpleIcon,
  BrainIcon,
  BrowserIcon,
  BrowsersIcon,
  CalendarBlankIcon,
  ChartBarHorizontalIcon,
  ChartBarIcon,
  ClockClockwiseIcon,
  CoinsIcon,
  DatabaseIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  GaugeIcon,
  KanbanIcon,
  LightningIcon,
  ListChecksIcon,
  ListIcon,
  LockSimpleIcon,
  MonitorIcon,
  PresentationChartIcon,
  PulseIcon,
  RocketLaunchIcon,
  SlidersHorizontalIcon,
  SmileyIcon,
  TableIcon,
  TimerIcon,
  UsersThreeIcon,
  XCircleIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Container, Section, SectionHeader } from "@/components/layout";
import {
  Button,
  Callout,
  type CalloutProps,
  Chip,
  Eyebrow,
  Heading,
  Lede,
  Toggle,
} from "@/components/ui";
import {
  AccentCard,
  type AccentCardProps,
  ComplianceSeal,
  type ComplianceSealProps,
  FeatureItem,
  type FeatureItemProps,
  FeatureSplit,
  LogoTile,
  type LogoTileProps,
  NumberedPoint,
  type NumberedPointProps,
  SignalColumn,
  type SignalColumnProps,
  StatCard,
  type StatCardProps,
  Testimonial,
  type TestimonialProps,
} from "@/components/content";
import {
  AlertList,
  AppBar,
  AppWindow,
  DashboardFrame,
  DashboardPanel,
  DashboardSplit,
  DataTable,
  FilterChips,
  KanbanBoard,
  KpiGrid,
  LiveBadge,
  MockCard,
  NowPlaying,
  Pager,
  PersonLabel,
  SearchField,
  SkillSummary,
  TableFooter,
  TaskTile,
  type TaskTileProps,
  ToneValue,
  ViewTabs,
} from "@/components/app-mock";
import {
  BarChart,
  BlockStrip,
  Donut,
  GroupedBarChart,
  HalfGauge,
  Heatmap,
  Legend,
  LineChart,
  MeterRow,
  type MeterRowProps,
  MetricList,
  TimelineRows,
} from "@/components/dataviz";
import {
  Accordion,
  CircuitDiagram,
  HighlightColumns,
  LearningOrb,
  ListTabs,
  Reveal,
  ScrollStepper,
  SpectrumPlot,
  SwitchPanels,
  SwitchView,
} from "@/components/interactive";
import { AssistantOrb, AssistantProvider, AssistantReadout } from "@/components/assistant";
import { HorizonGlow } from "@/components/effects";

/* =============================================================================
   HOME PAGE — every section's content is written inline, at the component call
   that uses it.
   ============================================================================= */

export default function Home() {
  return (
    <main id="main">
      {/* ---- Hero ---- */}
      <section
        aria-labelledby="hero-title"
        className="relative isolate overflow-hidden lg:min-h-[max(48.75rem,100svh)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-hero-glow-mobile lg:bg-hero-glow"
        />
        <AssistantProvider>
          <AssistantOrb
            name="TraceAI"
            greeting={["Hi", "I’m TraceAI"]}
            idleLines={["Hi", "I’m TraceAI", "Tell me what to do"]}
            hello="Hi!"
            workingText="Working on it"
            doneText="Done"
            statusText={{
              idleMouse: "Click me to ask",
              idleTouch: "Tap me to ask",
              working: "Working on it",
              done: "Done",
            }}
            className="mt-16 lg:mt-0"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-1 bg-hero-vignette-mobile lg:bg-hero-vignette"
          />
          <Container className="pointer-events-none relative z-2 grid grid-cols-1 items-end gap-8 pt-6 pb-14 lg:min-h-[inherit] lg:grid-cols-[minmax(0,1fr)_var(--container-readout)] lg:gap-12 lg:pt-37.5 lg:pb-16">
            <div className="grid max-w-hero min-w-0 grid-cols-1 gap-6.5 *:pointer-events-auto">
              <div className="grid gap-5">
                <Eyebrow className="text-kicker">Workforce management software</Eyebrow>
                <Heading as="h1" id="hero-title" size="display" className="text-headline">
                  <span className="block">From planning work</span>{" "}
                  <span className="block text-headline-soft">to measuring outcomes</span>
                </Heading>
              </div>
              <Lede>
                TeamTrace is end-to-end workforce management software that orchestrates work from
                plan to outcome. Plan, execute, monitor, measure and investigate — on one connected
                record of how the work actually gets done.
              </Lede>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Start free trial", href: "#cta", variant: "primary" as const },
                  { label: "Book a demo", href: "#cta", variant: "ghost" as const },
                ].map((cta) => (
                  <Button key={cta.label} href={cta.href} variant={cta.variant}>
                    {cta.label}
                  </Button>
                ))}
              </div>
              <ul
                aria-label="Compliance and certifications"
                className="flex flex-wrap items-center gap-3"
              >
                {(
                  [
                    { src: "/compliance/gdpr.png", alt: "GDPR compliant", variant: "plain" },
                    { src: "/compliance/dpdp.png", alt: "DPDP compliant", variant: "plain" },
                    {
                      src: "/compliance/iso-27001-2022.png",
                      alt: "ISO 27001:2022 certified",
                      variant: "iso",
                    },
                    {
                      src: "/compliance/iso-9001-2015.png",
                      alt: "ISO 9001:2015 certified",
                      variant: "iso",
                    },
                  ] satisfies ComplianceSealProps[]
                ).map((seal) => (
                  <li key={seal.src}>
                    <ComplianceSeal {...seal} />
                  </li>
                ))}
              </ul>
            </div>
            <AssistantReadout
              ariaLabel="Sample workday with TraceAI"
              title="Sample workday"
              range="9:00 AM to 6:00 PM"
              score={{ value: 78, max: 100, label: "productivity score" }}
              scaleMinutes={460}
              metrics={[
                { id: "deep", label: "Deep focus", minutes: 230, color: "sky" },
                { id: "shallow", label: "Shallow focus", minutes: 155, color: "volt" },
                { id: "idle", label: "Idle", minutes: 75, color: "amber" },
              ]}
              note="Longest focused session ran from 10:00 to 11:42 AM. Focus broke at 2:40 PM."
              instructions={[
                {
                  text: "Count Figma as productive for the Design team",
                  keys: ["figma"],
                  steps: [
                    "Opening the Design team’s app rules",
                    "Moving Figma from Neutral to Productive",
                    "Recalculating today’s scores",
                  ],
                  effect: { score: 3, metrics: { deep: 25, shallow: -25 } },
                  note: "Figma now counts as productive for Design, so today’s score rose by 3 points.",
                },
                {
                  text: "Ignore idle breaks shorter than 5 minutes",
                  keys: ["idle", "break", "5 min"],
                  steps: [
                    "Opening idle time settings",
                    "Setting the idle threshold to 5 minutes",
                    "Recalculating today’s scores",
                  ],
                  effect: { score: 2, metrics: { idle: -25 } },
                  note: "Short pauses no longer count as idle, so 25 minutes moved out of idle time.",
                },
                {
                  text: "Alert me if anyone’s focus drops 3 days in a row",
                  keys: ["alert", "notify", "drop"],
                  steps: [
                    "Creating a new alert rule",
                    "Watching focus scores across your teams",
                    "Sending alerts by email and in the app",
                  ],
                  effect: {
                    addItem: {
                      icon: <BellSimpleIcon />,
                      text: "Alert when focus drops 3 days in a row",
                      status: "Active",
                    },
                  },
                  note: "Your new alert rule is live and watching every team.",
                },
                {
                  text: "Email me this report every Friday",
                  keys: ["report", "email", "friday"],
                  steps: [
                    "Saving this view as a report",
                    "Scheduling it for Fridays at 5 PM",
                    "Adding your email as the recipient",
                  ],
                  effect: {
                    addItem: {
                      icon: <EnvelopeSimpleIcon />,
                      text: "Report emailed every Friday at 5 PM",
                      status: "Scheduled",
                    },
                  },
                  note: "This report will land in your inbox every Friday.",
                },
              ]}
              text={{
                assistantName: "TraceAI",
                intro:
                  "Tell TraceAI what to do. It makes the change for you, and you see it in your dashboard right away.",
                closeLabel: "Close TraceAI and return to the dashboard",
                inputLabel: "Give TraceAI an instruction",
                placeholder: "Ask TraceAI to do anything",
                sendLabel: "Send to TraceAI",
                doneMessage: "Done. Here’s the change in your dashboard.",
                fallbackMessage:
                  "In this preview, TraceAI runs the sample instructions above. Start a free trial to give it your own.",
                doneSuffix: "(done)",
                changedBadge: "TraceAI",
                reset: "Reset demo",
              }}
            />
          </Container>
        </AssistantProvider>
      </section>

      {/* ---- Logos ---- */}
      <Section
        aria-label="Customers"
        spacing="none"
        className="border-y border-border bg-fill-0 py-7"
        containerClassName="flex flex-col gap-3.5 md:flex-row md:items-center md:gap-8"
      >
        <p className="shrink-0 text-ui text-muted">Trusted by teams at</p>
        <ul className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {(
            Array.from({ length: 6 }, () => ({ name: "Client logo" })) satisfies LogoTileProps[]
          ).map((logo, i) => (
            <LogoTile key={i} {...logo} />
          ))}
        </ul>
      </Section>

      {/* ---- Lifecycle ---- */}
      <Section id="lifecycle" aria-labelledby="life-title" contained={false}>
        <Container>
          <SectionHeader
            align="center"
            eyebrow="The work orchestration lifecycle"
            title="One record of work, from first plan to final diagnosis"
            titleId="life-title"
            lede="Five capabilities on a single workforce management platform. Select a stage to see what it answers and what it produces."
          />
        </Container>
        <ScrollStepper
          className="mt-14"
          ariaLabel="Lifecycle stages"
          steps={[
            { number: "01", title: "Plan", subtitle: "Workforce planning" },
            { number: "02", title: "Execute", subtitle: "Projects, tasks & activities" },
            { number: "03", title: "Monitor", subtitle: "User activity monitoring" },
            { number: "04", title: "Measure", subtitle: "Productivity management" },
            { number: "05", title: "Investigate", subtitle: "Employee monitoring" },
          ]}
          panels={[
            <FeatureSplit
              key="plan"
              eyebrow="Workforce planning"
              title="Plan the work before it becomes work"
              body="Decide who is supposed to be working on what, when, and to what ETA — so your workforce always knows what to pick up today, tomorrow, this week and next week."
              visual={
                <AppWindow padding="lg" className="min-h-75" aria-label="Sample plan">
                  <AppBar
                    className="mb-1.5 text-sm text-muted"
                    left={<b className="text-control font-semibold text-foreground">Alex’s plan</b>}
                    right={<span>Sprint 14</span>}
                  />
                  <div className="grid grid-cols-2 gap-2.5 @lg:grid-cols-4">
                    {(
                      [
                        {
                          heading: "Today",
                          tasks: [
                            { title: "API rate limits", meta: "ETA 4 PM", tone: "highlight" },
                            { title: "Review PR #214", meta: "ETA 5 PM" },
                          ],
                        },
                        {
                          heading: "Tomorrow",
                          tasks: [{ title: "Billing export", meta: "ETA Wed" }],
                        },
                        {
                          heading: "This week",
                          tasks: [
                            { title: "Sprint 14 demo prep", meta: "ETA Fri" },
                            { title: "Usage alerts", meta: "ETA Fri" },
                          ],
                        },
                        {
                          heading: "Next week",
                          tasks: [{ title: "Onboarding flow v2", meta: "ETA Tue", tone: "muted" }],
                        },
                      ] satisfies { heading: string; tasks: TaskTileProps[] }[]
                    ).map((col) => (
                      <div key={col.heading} className="grid min-w-0 content-start gap-2">
                        <b className="text-xs font-semibold text-muted">{col.heading}</b>
                        {col.tasks.map((t) => (
                          <TaskTile key={t.title} {...t} />
                        ))}
                      </div>
                    ))}
                  </div>
                </AppWindow>
              }
            />,
            <FeatureSplit
              key="execute"
              eyebrow="Projects, tasks & activities"
              title="Get the work done, and know it happened"
              body="Projects, tasks and activities are where execution is tracked — every update, every completion, every dependency, attached to the person who owns it."
              visual={
                <AppWindow aria-label="Sample task board">
                  <AppBar
                    left={
                      <ViewTabs
                        tabs={[
                          { label: "List", icon: <ListIcon /> },
                          { label: "Board", icon: <KanbanIcon />, active: true },
                          { label: "Calendar", icon: <CalendarBlankIcon /> },
                          { label: "Gantt", icon: <ChartBarHorizontalIcon /> },
                        ]}
                      />
                    }
                    right={<Chip tone="outline">Billing revamp</Chip>}
                  />
                  <KanbanBoard
                    columns={[
                      {
                        title: "To Do",
                        color: "amber",
                        count: 34,
                        cards: [
                          {
                            id: "#TT-8410",
                            type: "bug",
                            title: "Invoice totals round incorrectly on annual plans",
                            date: "No date",
                            assignees: [
                              { initials: "AK", hue: 205 },
                              { initials: "NK", hue: 160 },
                            ],
                            comments: 0,
                            priority: "Medium",
                          },
                          {
                            id: "#TT-8405",
                            parentId: "#TT-8334",
                            type: "task",
                            title: "Role-based permissions for custom billing fields",
                            date: "Mon, 07:00 PM",
                            assignees: [{ initials: "RM", hue: 30 }],
                            comments: 2,
                            priority: "High",
                          },
                        ],
                      },
                      {
                        title: "In Progress",
                        color: "sky",
                        count: 93,
                        cards: [
                          {
                            id: "#TT-8408",
                            parentId: "#TT-8193",
                            type: "task",
                            title: "Payout reconciliation job for multi-currency",
                            date: "Thu, 07:00 PM",
                            assignees: [{ initials: "KS", hue: 280 }],
                            comments: 1,
                            priority: "High",
                          },
                          {
                            id: "#TT-8396",
                            type: "task",
                            title: "Billing export — scheduled CSV delivery",
                            date: "No date",
                            assignees: [
                              { initials: "NK", hue: 160 },
                              { initials: "AK", hue: 205 },
                            ],
                            comments: 0,
                          },
                        ],
                      },
                      {
                        title: "Ready for Testing",
                        color: "violet",
                        count: 53,
                        cards: [
                          {
                            id: "#TT-8378",
                            type: "task",
                            title: "Usage alerts API for the admin dashboard",
                            date: "Fri, 07:00 PM",
                            assignees: [{ initials: "AK", hue: 205 }],
                            comments: 1,
                            priority: "High",
                            tag: { label: "Done", tone: "ok" },
                          },
                        ],
                      },
                    ]}
                  />
                </AppWindow>
              }
            />,
            <FeatureSplit
              key="monitor"
              eyebrow="User activity monitoring"
              title="Watch activity and progress in real time"
              body="TeamTrace’s user activity monitoring software shows what is actually happening on a screen right now — the applications in use, the URLs visited, and the session timeline behind them."
              visual={
                <AppWindow aria-label="Sample live activity">
                  <AppBar
                    left={
                      <span className="flex items-center gap-2.25 text-ui">
                        <PersonLabel
                          initials="AK"
                          hue={205}
                          name={<b className="font-semibold text-strong">Alex K.</b>}
                        />
                        <LiveBadge label="Live" />
                      </span>
                    }
                    right={<Chip tone="outline">Today</Chip>}
                  />
                  <KpiGrid
                    items={[
                      { label: "Check in", value: "09:02 AM" },
                      { label: "Active time", value: "5h 48m" },
                      { label: "Average activity", value: "78%" },
                    ]}
                    columns={3}
                  />
                  <NowPlaying
                    app="VS Code"
                    detail="billing-export / routes.ts"
                    startSeconds={24 * 60 + 12}
                  />
                  <TimelineRows
                    rows={[
                      {
                        label: "09–10 AM",
                        segments: [
                          ["sky", 34],
                          ["volt", 14],
                          ["idle", 4],
                          ["sky", 8],
                        ],
                      },
                      {
                        label: "10–11 AM",
                        segments: [
                          ["volt", 6],
                          ["sky", 22],
                          ["idle", 5],
                          ["volt", 9],
                          ["break", 8],
                          ["sky", 10],
                        ],
                      },
                      {
                        label: "11–12 PM",
                        segments: [
                          ["sky", 28],
                          ["volt", 12],
                          ["idle", 7],
                          ["sky", 13],
                        ],
                      },
                      {
                        label: "12–01 PM",
                        segments: [
                          ["volt", 14],
                          ["break", 30],
                          ["volt", 16],
                        ],
                      },
                    ]}
                  />
                  <MockCard
                    title="11:00 AM – 12:00 PM"
                    aside={
                      <span className="inline-flex items-center gap-1.25 text-2xs font-semibold text-leaf-100 [&_svg]:size-3">
                        <PulseIcon aria-hidden />
                        Activity 84%
                      </span>
                    }
                  >
                    <BlockStrip
                      blocks={[
                        "volt",
                        "sky",
                        "sky",
                        "volt",
                        "sky",
                        "sky",
                        "sky",
                        "idle",
                        "sky",
                        "sky",
                        "volt",
                        "volt",
                      ]}
                      axis={["0", "15", "30", "45", "60"]}
                    />
                  </MockCard>
                  <Legend
                    items={[
                      { label: "Focused", swatch: "sky" },
                      { label: "Active", swatch: "volt" },
                      { label: "Idle", swatch: "idle" },
                      { label: "Break", swatch: "break" },
                    ]}
                  />
                </AppWindow>
              }
            />,
            <FeatureSplit
              key="measure"
              eyebrow="Productivity management"
              title="Measure whether the work landed — and what it cost"
              body="Was the work completed in time? Were more hours needed than planned? Productivity management turns the activity trail into focus, deep work, shallow hours and on-time delivery."
              visual={
                <AppWindow aria-label="Sample productivity overview">
                  <AppBar
                    left={
                      <ViewTabs
                        tabs={[
                          { label: "Overview", icon: <EyeIcon />, active: true },
                          { label: "Screenshots", icon: <MonitorIcon /> },
                          { label: "Apps", icon: <BrowsersIcon /> },
                          { label: "Activity", icon: <PulseIcon /> },
                        ]}
                      />
                    }
                    right={<Chip tone="outline">Last week</Chip>}
                  />
                  <KpiGrid
                    items={[
                      { label: "Work hours", value: "38h 12m" },
                      { label: "On-time delivery", value: "82%" },
                      { label: "Idle", value: "3h 02m" },
                      { label: "Breaks", value: "2h 12m" },
                    ]}
                  />
                  <div className="grid gap-2.5 @lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                    <MockCard
                      title="Work hours"
                      aside={
                        <Legend
                          size="sm"
                          items={[
                            { label: "Alex", swatch: "bar-hi" },
                            { label: "Department", swatch: "bar" },
                          ]}
                        />
                      }
                    >
                      <GroupedBarChart
                        groups={[
                          {
                            label: "Mon",
                            values: [
                              { value: 80, title: "Alex 8.0h" },
                              { value: 74, title: "Department 7.4h" },
                            ],
                          },
                          {
                            label: "Tue",
                            values: [
                              { value: 89, title: "Alex 8.9h" },
                              { value: 81, title: "Department 8.1h" },
                            ],
                          },
                          {
                            label: "Wed",
                            values: [
                              { value: 84, title: "Alex 8.4h" },
                              { value: 83, title: "Department 8.3h" },
                            ],
                          },
                          {
                            label: "Thu",
                            values: [
                              { value: 62, title: "Alex 6.2h" },
                              { value: 76, title: "Department 7.6h" },
                            ],
                          },
                          {
                            label: "Fri",
                            values: [
                              { value: 67, title: "Alex 6.7h" },
                              { value: 79, title: "Department 7.9h" },
                            ],
                          },
                        ]}
                        series={["bar-hi", "bar"]}
                        yTicks={["10h", "5h", "0h"]}
                      />
                    </MockCard>
                    <MockCard title="Work summary">
                      <Donut
                        legend
                        center="88%"
                        sub="active"
                        segments={[
                          { share: 88, color: "sky", label: "Active", value: "38h 12m" },
                          { share: 5, color: "break", label: "Break", value: "2h 12m" },
                          { share: 7, color: "idle", label: "Idle", value: "3h 02m" },
                        ]}
                      />
                    </MockCard>
                  </div>
                </AppWindow>
              }
            />,
            <FeatureSplit
              key="investigate"
              eyebrow="Employee monitoring"
              title="Find out why the number moved"
              body="Why did task B take so long? Why did James overshoot the deadline? Employee monitoring software breaks a metric into the drivers behind it — and surfaces the warning signals worth acting on."
              visual={
                <AppWindow
                  padding="lg"
                  className="min-h-75 gap-3"
                  aria-label="Sample root-cause breakdown"
                >
                  <b className="mb-1 text-control font-semibold text-foreground">
                    Why did task B take 9h longer?
                  </b>
                  {(
                    [
                      {
                        label: "Waiting on code review",
                        percent: 78,
                        color: "amber",
                        value: "+4.1h",
                      },
                      { label: "Context switching", percent: 52, color: "volt", value: "+2.7h" },
                      { label: "Unplanned meetings", percent: 40, color: "volt", value: "+2.2h" },
                    ] satisfies MeterRowProps[]
                  ).map((d) => (
                    <MeterRow key={d.label} {...d} />
                  ))}
                  <Callout tone="amber" size="sm" className="mt-2">
                    Warning signal: James has 3 tasks past their ETA this week
                  </Callout>
                </AppWindow>
              }
            />,
          ]}
          progress={{ of: "of", hint: "Keep scrolling" }}
        />
      </Section>

      {/* ---- Questions ---- */}
      <Section id="platform" aria-labelledby="qs-title">
        <SectionHeader
          align="center"
          title="Who is working. What is happening. Why."
          titleId="qs-title"
          titleClassName="max-w-[14em]"
          subtitle="Every question about your workforce, answered on one platform."
          lede="Productivity management gives you the what. Employee monitoring gives you the why. Insider risk monitoring tells you when to step in. The project, time, resource and analytics modules answer the where, how long, who and how, all on the same data."
          ledeClassName="max-w-lede-wide"
          className="gap-4"
        />
        <ListTabs
          className="mt-14"
          ariaLabel="Questions"
          items={[
            {
              keyword: "WHAT",
              title: "Productivity Management",
              description: "What is my team’s productivity? How does Alex compare to his team?",
            },
            {
              keyword: "WHY",
              title: "Employee Monitoring",
              description: "Why do some employees show high productivity while others show low?",
            },
            {
              keyword: "WHEN",
              title: "Insider Risk Monitoring",
              description:
                "Seeing warning signs in employee monitoring? That is when you switch this on.",
            },
            {
              keyword: "WHERE",
              title: "Project & Task Management",
              description: "Where does every project, task and budget stand right now?",
            },
            {
              keyword: "HOW LONG",
              title: "Time Tracking & Attendance",
              description: "How long did the work take, and who was in, out or on leave?",
            },
            {
              keyword: "WHO",
              title: "Resource Management",
              description: "Who is free, who is stretched, and who has the skills?",
            },
            {
              keyword: "HOW",
              title: "Workforce Analytics",
              description:
                "How is the organization performing, from one person to the whole company?",
            },
          ]}
          panels={[
            {
              heading: "Productivity Management",
              body: "TeamTrace’s productivity management software answers both with focus, deep work and on-time delivery, not keyboard noise, then gives you the tools to compare, coach and act.",
              link: { label: "Explore productivity management →", href: "#" },
              content: (
                <AppWindow variant="inset" aria-label="Sample productivity overview">
                  <AppBar
                    left={
                      <PersonLabel
                        initials="AK"
                        hue={205}
                        size="sm"
                        name={<b className="font-semibold text-foreground">Alex K. · Overview</b>}
                      />
                    }
                    right={
                      <Chip tone="soft" size="sm">
                        Last week
                      </Chip>
                    }
                  />
                  <KpiGrid
                    items={[
                      { label: "Work hours", value: "38h 12m" },
                      { label: "Activity", value: "74%" },
                      { label: "Idle", value: "3h 02m" },
                      { label: "Breaks", value: "2h 12m" },
                    ]}
                    size="sm"
                  />
                  <div className="grid gap-2 @md:grid-cols-2">
                    <MockCard tone="fill" title="Work hours vs department">
                      <div className="flex justify-around gap-2 pt-1">
                        <HalfGauge value={0.84} label="Alex K." color="sky" />
                        <HalfGauge value={0.76} label="Department" color="volt" />
                      </div>
                    </MockCard>
                    <MockCard
                      tone="fill"
                      title="Activity level"
                      aside={
                        <Legend
                          size="sm"
                          items={[
                            { label: "Alex", swatch: "sky" },
                            { label: "Dept", swatch: "periwinkle" },
                          ]}
                        />
                      }
                    >
                      <LineChart
                        series={[
                          { values: [62, 70, 66, 76, 74, 81, 78], color: "sky" },
                          { values: [60, 63, 64, 66, 63, 68, 67], color: "periwinkle" },
                        ]}
                        labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                      />
                    </MockCard>
                  </div>
                </AppWindow>
              ),
            },
            {
              heading: "Employee Monitoring",
              body: "TeamTrace’s employee monitoring software shows the apps, sites, idle stretches and work patterns behind every score, across remote, hybrid and office teams, with privacy controls you set.",
              link: { label: "Explore employee monitoring →", href: "#" },
              content: (
                <AppWindow variant="inset" aria-label="Sample engagement screen">
                  <AppBar
                    left={
                      <PersonLabel
                        initials="AK"
                        hue={205}
                        size="sm"
                        name={<b className="font-semibold text-foreground">Alex K. · Engagement</b>}
                      />
                    }
                    right={
                      <Chip tone="soft" size="sm">
                        Today
                      </Chip>
                    }
                  />
                  <KpiGrid
                    items={[
                      { label: "Daily mood", value: "Good", icon: <SmileyIcon aria-hidden /> },
                      { label: "Check in", value: "09:02 AM" },
                      { label: "Check out", value: "06:10 PM" },
                      { label: "Avg. activity", value: "78%" },
                    ]}
                    size="sm"
                  />
                  <div className="grid gap-2 @md:grid-cols-2">
                    <MockCard tone="fill" title="Active vs idle">
                      <Donut
                        legend
                        size="sm"
                        center="82%"
                        sub="active"
                        segments={[
                          { share: 82, color: "sky", label: "Active", value: "82%" },
                          { share: 18, color: "idle", label: "Idle", value: "18%" },
                        ]}
                      />
                    </MockCard>
                    <MockCard tone="fill" title="Applications used">
                      <Donut
                        legend
                        size="sm"
                        hole={false}
                        segments={[
                          { share: 44, color: "sky", label: "VS Code", value: "2h 18m" },
                          { share: 20, color: "volt", label: "Teams", value: "1h 01m" },
                          { share: 15, color: "violet", label: "Chrome", value: "48m" },
                          { share: 11, color: "leaf", label: "Figma", value: "32m" },
                          { share: 10, color: "slate", label: "Others", value: "29m" },
                        ]}
                      />
                    </MockCard>
                  </div>
                  <TimelineRows
                    rows={[
                      {
                        label: "09–10 AM",
                        segments: [
                          ["sky", 38],
                          ["volt", 14],
                          ["idle", 8],
                        ],
                      },
                      {
                        label: "10–11 AM",
                        segments: [
                          ["volt", 8],
                          ["sky", 26],
                          ["idle", 6],
                          ["break", 8],
                          ["sky", 12],
                        ],
                      },
                      {
                        label: "11–12 PM",
                        segments: [
                          ["sky", 30],
                          ["volt", 16],
                          ["idle", 5],
                          ["sky", 9],
                        ],
                      },
                    ]}
                  />
                  <Legend
                    items={[
                      { label: "Focused", swatch: "sky" },
                      { label: "Active", swatch: "volt" },
                      { label: "Idle", swatch: "idle" },
                      { label: "Break", swatch: "break" },
                    ]}
                  />
                </AppWindow>
              ),
            },
            {
              heading: "Insider Risk Monitoring",
              body: "When employee monitoring surfaces a warning sign, switch on insider risk monitoring for that person, a team or the whole company. TeamTrace’s insider risk management then runs insider threat detection and data loss prevention at the device, so a risk is stopped while it is still a signal, not found after the data has gone.",
              link: { label: "Explore insider risk monitoring →", href: "#" },
              content: (
                <AppWindow variant="inset" aria-label="Sample insider risk alerts">
                  <AppBar title="Insider risk" right={<Toggle on label="On for Sales team" />} />
                  <AlertList
                    alerts={[
                      {
                        severity: "high",
                        title: "Bulk file copy to USB blocked",
                        meta: "Laptop SL-14, 2 min ago",
                        level: "High",
                      },
                      {
                        severity: "medium",
                        title: "Upload to personal cloud drive",
                        meta: "Chrome, 18 min ago",
                        level: "Medium",
                      },
                      {
                        severity: "low",
                        title: "After-hours access to client folder",
                        meta: "Yesterday, 23:12",
                        level: "Low",
                      },
                    ]}
                  />
                </AppWindow>
              ),
            },
            {
              heading: "Project & Task Management",
              body: "Most project tools only know what people remember to update. In TeamTrace, every task is linked to the time and activity behind it, so progress is evidence, not opinion. Plan sprints, assign work and watch budgets in task management software that already knows the effort.",
              link: { label: "Explore project and task management →", href: "#" },
              content: (
                <AppWindow variant="inset" aria-label="Sample task board">
                  <AppBar
                    left={
                      <ViewTabs
                        tabs={[
                          { label: "List", icon: <ListIcon /> },
                          { label: "Board", icon: <KanbanIcon />, active: true },
                          { label: "Calendar", icon: <CalendarBlankIcon /> },
                          { label: "Gantt", icon: <ChartBarHorizontalIcon /> },
                        ]}
                      />
                    }
                    right={
                      <Chip tone="soft" size="sm">
                        Billing revamp
                      </Chip>
                    }
                  />
                  <KanbanBoard
                    columns={[
                      {
                        title: "To Do",
                        color: "amber",
                        count: 34,
                        cards: [
                          {
                            id: "#TT-8410",
                            type: "bug",
                            title: "Invoice totals round incorrectly",
                            date: "No date",
                            assignees: [
                              { initials: "AK", hue: 205 },
                              { initials: "NK", hue: 160 },
                            ],
                            comments: 0,
                            priority: "Medium",
                          },
                        ],
                      },
                      {
                        title: "In Progress",
                        color: "sky",
                        count: 93,
                        cards: [
                          {
                            id: "#TT-8408",
                            type: "task",
                            title: "Payout reconciliation job",
                            date: "Thu, 07:00 PM",
                            assignees: [{ initials: "KS", hue: 280 }],
                            comments: 1,
                            priority: "High",
                          },
                        ],
                      },
                      {
                        title: "Testing",
                        color: "violet",
                        count: 53,
                        cards: [
                          {
                            id: "#TT-8378",
                            type: "task",
                            title: "Usage alerts API",
                            date: "Fri, 07:00 PM",
                            assignees: [{ initials: "AK", hue: 205 }],
                            comments: 1,
                            priority: "High",
                            tag: { label: "Done", tone: "ok" },
                          },
                        ],
                      },
                    ]}
                    compact
                  />
                </AppWindow>
              ),
            },
            {
              heading: "Time Tracking & Attendance",
              body: "Every working hour lands on the right project, task and activity as it happens. With time and attendance software built into the same platform, payroll, client billing and utilization all start from one verified number, and nobody rebuilds their week from memory.",
              link: { label: "Explore time tracking and attendance →", href: "#" },
              content: (
                <AppWindow variant="inset" aria-label="Sample time and activity summary">
                  <AppBar
                    title="Time & activity summary"
                    right={
                      <Chip tone="soft" size="sm">
                        Last week
                      </Chip>
                    }
                  />
                  <FilterChips labels={["Branch", "Department", "Project", "People"]} />
                  <DataTable
                    columns={[
                      { label: "People", strong: true },
                      { label: "Leaves", numeric: true },
                      { label: "Allocated", numeric: true },
                      { label: "Logged", numeric: true },
                      { label: "Idle", numeric: true },
                      { label: "Days", numeric: true },
                    ]}
                    rows={[
                      [
                        <PersonLabel
                          key="person"
                          initials="AK"
                          hue={205}
                          name="Alex K."
                          size="xs"
                        />,
                        "0",
                        "40h",
                        "38h 12m",
                        "1h 14m",
                        "5",
                      ],
                      [
                        <PersonLabel
                          key="person"
                          initials="NR"
                          hue={330}
                          name="Neha R."
                          size="xs"
                        />,
                        "1",
                        "32h",
                        "31h 40m",
                        "52m",
                        "4",
                      ],
                      [
                        <PersonLabel
                          key="person"
                          initials="RM"
                          hue={30}
                          name="Ravi M."
                          size="xs"
                        />,
                        "0",
                        "40h",
                        "41h 05m",
                        "2h 08m",
                        "5",
                      ],
                      [
                        <PersonLabel
                          key="person"
                          initials="TS"
                          hue={280}
                          name="Tara S."
                          size="xs"
                        />,
                        "0.5",
                        "36h",
                        "34h 22m",
                        "1h 31m",
                        "4.5",
                      ],
                      [
                        <PersonLabel
                          key="person"
                          initials="AP"
                          hue={160}
                          name="Arun P."
                          size="xs"
                        />,
                        "0",
                        "40h",
                        "36h 48m",
                        "3h 02m",
                        "5",
                      ],
                    ]}
                  />
                  <TableFooter summary="Showing 1–5 of 114">
                    <Pager pages={["1", "2", "3", "…", "23"]} active="1" />
                  </TableFooter>
                </AppWindow>
              ),
            },
            {
              heading: "Resource Management",
              body: "TeamTrace’s resource management software answers from real hours instead of guesses, so workforce planning happens now, not in next month’s firefight.",
              link: { label: "Explore resource management →", href: "#" },
              content: (
                <AppWindow variant="inset" aria-label="Sample skill search">
                  <AppBar
                    title="Skill search"
                    right={
                      <Chip tone="soft" size="sm" icon={<SlidersHorizontalIcon aria-hidden />}>
                        Filter
                      </Chip>
                    }
                  />
                  <SearchField label="Skills" tokens={["React", "AWS"]} />
                  <DataTable
                    columns={[
                      { label: "Employee", strong: true },
                      { label: "Job title" },
                      { label: "Skills" },
                      { label: "Projects", numeric: true },
                      { label: "Hrs/wk", numeric: true },
                    ]}
                    rows={[
                      [
                        <PersonLabel
                          key="person"
                          initials="NR"
                          hue={330}
                          name="Neha R."
                          size="xs"
                        />,
                        "Sr. Frontend Developer",
                        <SkillSummary key="s" skills="React, TypeScript" more="+9" />,
                        "3",
                        <ToneValue key="v" tone="hot">
                          38
                        </ToneValue>,
                      ],
                      [
                        <PersonLabel
                          key="person"
                          initials="RM"
                          hue={30}
                          name="Ravi M."
                          size="xs"
                        />,
                        "Full Stack Developer",
                        <SkillSummary key="s" skills="React, Node.js" more="+12" />,
                        "2",
                        "32",
                      ],
                      [
                        <PersonLabel
                          key="person"
                          initials="AP"
                          hue={160}
                          name="Arun P."
                          size="xs"
                        />,
                        "DevOps Engineer",
                        <SkillSummary key="s" skills="AWS, Terraform" more="+7" />,
                        "4",
                        <ToneValue key="v" tone="hot">
                          40
                        </ToneValue>,
                      ],
                      [
                        <PersonLabel
                          key="person"
                          initials="TS"
                          hue={280}
                          name="Tara S."
                          size="xs"
                        />,
                        "Product Designer",
                        <SkillSummary key="s" skills="Figma, React" more="+6" />,
                        "1",
                        <ToneValue key="v" tone="free">
                          20
                        </ToneValue>,
                      ],
                      [
                        <PersonLabel
                          key="person"
                          initials="KT"
                          hue={120}
                          name="Kabir T."
                          size="xs"
                        />,
                        "Jr. ML Engineer",
                        <SkillSummary key="s" skills="Python, AWS" more="+5" />,
                        "1",
                        <ToneValue key="v" tone="free">
                          12
                        </ToneValue>,
                      ],
                    ]}
                  />
                  <TableFooter summary="Showing 1–5 of 110">
                    <Legend
                      size="sm"
                      items={[
                        { label: "Free", swatch: "sky" },
                        { label: "Stretched", swatch: "amber" },
                      ]}
                    />
                  </TableFooter>
                </AppWindow>
              ),
            },
            {
              heading: "Workforce Analytics",
              body: "Every module shares the same data, so every report agrees with every other report. TeamTrace’s workforce analytics software takes you from one person to a team, a department or the whole organization, with numbers nobody argues with.",
              link: { label: "Explore workforce analytics →", href: "#" },
              content: (
                <AppWindow variant="inset" aria-label="Sample consolidated work summary">
                  <AppBar
                    title="Consolidated work summary"
                    right={
                      <Chip tone="soft" size="sm">
                        Today · by work
                      </Chip>
                    }
                  />
                  <KpiGrid
                    columns={2}
                    size="sm"
                    items={[
                      { label: "Total time", value: "80h 14m" },
                      { label: "Average activity", value: "76%" },
                    ]}
                  />
                  <div className="grid gap-2 @md:grid-cols-2">
                    <MockCard tone="fill" title="Activity">
                      <Donut
                        legend
                        size="sm"
                        hole={false}
                        segments={[
                          { share: 91, color: "sky", label: "Activity ex. idle", value: "91%" },
                          { share: 9, color: "idle", label: "Idle", value: "9%" },
                        ]}
                      />
                    </MockCard>
                    <MockCard tone="fill" title="Project / task / activity">
                      <Donut
                        legend
                        size="sm"
                        segments={[
                          { share: 40, color: "volt", label: "Project", value: "40%" },
                          { share: 2, color: "amber", label: "Task", value: "2%" },
                          { share: 58, color: "sky", label: "Activity", value: "58%" },
                        ]}
                      />
                    </MockCard>
                  </div>
                  <MockCard tone="fill" title="Total hours by person">
                    <BarChart
                      bars={[
                        ["Alex", 3.0],
                        ["Neha", 2.6],
                        ["Ravi", 2.4],
                        ["Tara", 2.0],
                        ["Arun", 2.0],
                        ["Maya", 1.9],
                        ["Dev", 1.8],
                        ["Omar", 1.8],
                        ["Ella", 1.7],
                        ["Kabir", 1.5],
                      ].map(([label, value]) => ({
                        label: label as string,
                        value: value as number,
                        display: (value as number).toFixed(1),
                      }))}
                      max={3}
                    />
                  </MockCard>
                </AppWindow>
              ),
            },
          ]}
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {(
            [
              {
                tone: "blue",
                title: "Start with one module. Add the rest when you are ready.",
                body: "Every module shares the same data, so nothing is set up twice and every number matches.",
              },
              {
                tone: "green",
                title: "Monitoring to coaching.",
                body: "TeamTrace tracks productivity drift as closely as it tracks overwork.",
              },
            ] satisfies (CalloutProps & { body: string })[]
          ).map(({ body, ...note }) => (
            <Callout key={note.title as string} {...note}>
              {body}
            </Callout>
          ))}
        </div>
      </Section>

      {/* ---- Barbell ---- */}
      <Section id="barbell" aria-labelledby="bb-title">
        <SectionHeader
          align="center"
          eyebrow="The barbell problem"
          title="Your workforce has two extremes. Most tools only see one."
          titleId="bb-title"
          lede="Every team has both ends — people running on fumes, and people quietly coasting. TeamTrace plots every person on the barbell, flags employee burnout and disengagement early, and shows you which playbook fits."
        />
        <div className="mt-14 grid gap-4 xl:grid-cols-3">
          {(
            [
              {
                title: "One end burns out",
                body: "Part of your team is running on fumes — too many meetings, weekend pings, context they cannot shake. The people doing the most work are the most at risk.",
                accent: ["coral", "amber"],
              },
              {
                title: "The other end drifts",
                body: "Another part is invisible — quiet quitting, long lunches, focus blocks that never actually start. By the time you notice, they have already accepted another offer.",
                accent: ["volt", "lavender"],
              },
              {
                title: "Most tools only see one end",
                body: "Activity trackers punish the deep worker to catch the coasting one. Wellbeing apps protect the burned-out and ignore the disengaged. Both ends need different interventions.",
                accent: ["coral", "leaf", "volt"],
              },
            ] satisfies AccentCardProps[]
          ).map((c) => (
            <AccentCard key={c.title as string} {...c} />
          ))}
        </div>
        <SpectrumPlot
          className="mt-10"
          zones={[
            { label: "Burnout risk", short: "Burnout risk", color: "coral" },
            { label: "Approaching burnout", short: "Approaching", color: "amber" },
            { label: "Balanced", short: "Balanced", color: "leaf" },
            { label: "Approaching drift", short: "Approaching", color: "sky" },
            { label: "Drift", short: "Drift", color: "volt" },
            { label: "Drift risk", short: "Drift risk", color: "ultraviolet" },
          ]}
          people={[
            {
              name: "Arjun M.",
              zone: 0,
              signals: [
                "After-hours load 34h/month",
                "Weekend pings 6 in 4 weeks",
                "Focus decay −38% over 6 weeks",
              ],
              playbook: [
                "Break reminders on",
                "After-hours boundary at 19:00",
                "Lead 1:1 prompt (sustained 3+ weeks)",
              ],
            },
            {
              name: "Alex K.",
              zone: 0,
              signals: [
                "Meeting density 64% of week",
                "Break skipping 6 days running",
                "Focus decay −29% over 6 weeks",
              ],
              playbook: ["Auto break reminders", "Meeting-load cap suggested for next sprint"],
            },
            {
              name: "Pat R.",
              zone: 0,
              signals: [
                "After-hours load 27h/month",
                "Weekend pings 4 in 4 weeks",
                "Focus decay −31% over 6 weeks",
              ],
              playbook: ["Break reminders on", "After-hours boundary at 18:30", "Lead 1:1 prompt"],
            },
            {
              name: "Dev V.",
              zone: 1,
              signals: [
                "After-hours load 22h/month",
                "Meeting density 58% of week",
                "Break skipping 4 days running",
              ],
              playbook: ["Early warning at 3 weeks", "Workload handoff suggested"],
            },
            {
              name: "Ravi M.",
              zone: 2,
              signals: ["After-hours load 9h/month", "Deep work 12h/week", "Output at baseline"],
              playbook: ["Maintenance only — no intervention needed"],
            },
            {
              name: "Neha K.",
              zone: 2,
              signals: ["Deep work 14h/week", "Standup attendance 5 of 5", "Output at baseline"],
              playbook: ["Maintenance only — no intervention needed"],
            },
            {
              name: "Kaysha S.",
              zone: 2,
              signals: ["Deep work 11h/week", "Focus blocks matched to tracked work", "Output +6%"],
              playbook: ["Maintenance only — no intervention needed"],
            },
            {
              name: "Vikram S.",
              zone: 2,
              signals: ["Deep work 10h/week", "Standup attendance 4 of 5", "Output at baseline"],
              playbook: ["Maintenance only — no intervention needed"],
            },
            {
              name: "Arun P.",
              zone: 3,
              signals: [
                "Deep work 7h/week",
                "Output −22% from baseline",
                "Focus blocks with no tracked work",
              ],
              playbook: ["Re-engagement nudge", "Check for a blocker before capacity is raised"],
            },
            {
              name: "Solomon K.",
              zone: 4,
              signals: ["Deep work 5h/week", "Output −48% from baseline", "1:1s canceled twice"],
              playbook: ["Re-engagement nudge", "Anonymous blockers surfaced to lead"],
            },
            {
              name: "Kimmy R.",
              zone: 4,
              signals: [
                "Deep work 4h/week",
                "Standup attendance 2 of 5",
                "Output −55% from baseline",
              ],
              playbook: [
                "Re-engagement nudge",
                "Anonymous blockers surfaced to lead",
                "Consent check before individual data",
              ],
            },
            {
              name: "Mohan V.",
              zone: 5,
              signals: [
                "Deep work 3h/week",
                "Output −58% from baseline",
                "Calendar ghosting on 1:1s",
              ],
              playbook: ["Re-engagement nudge", "Consent check before individual data is shown"],
            },
          ]}
          heading={{
            kicker: "Team overview · 12 people",
            text: "Four people over-worked, four balanced, four under-engaged. Select a person on the barbell to see the signals behind their position and the playbook TeamTrace prescribes.",
          }}
          ends={["Burnout end", "Drift end"]}
          labels={{ demo: "Demo data", signals: "Signals", playbook: "TeamTrace playbook" }}
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {(
            [
              {
                tone: "warm",
                label: "Over-worked end",
                title: "Burnout signals",
                signals: [
                  { direction: "up", text: "After-hours load: >20h/month" },
                  { direction: "up", text: "Weekend pings: 3+ in 4 weeks" },
                  { direction: "up", text: "Meeting density: >60% of week" },
                  { direction: "down", text: "Focus decay: −30% over 6 weeks" },
                  { direction: "down", text: "Break skipping: 4+ days running" },
                ],
                note: {
                  title: "TeamTrace intervention",
                  text: "Auto break reminders · After-hours boundary guard · Lead 1:1 prompt when sustained 3+ weeks. Never surveillance.",
                },
              },
              {
                tone: "cool",
                label: "Under-engaged end",
                title: "Drift signals",
                signals: [
                  { direction: "down", text: "Deep work hours: <8h/week" },
                  { direction: "down", text: "Standup attendance: 2 of last 5" },
                  { direction: "down", text: "Output: −50% from baseline" },
                  { direction: "up", text: "Focus blocks with no tracked work" },
                  { direction: "up", text: "Calendar ghosting: 1:1s canceled repeatedly" },
                ],
                note: {
                  title: "TeamTrace intervention",
                  text: "Gentle re-engagement nudge · Anonymous blockers surfaced to lead · Individual data only with employee consent. Never surveillance.",
                },
              },
            ] satisfies Omit<SignalColumnProps, "directionLabels">[]
          ).map((col) => (
            <SignalColumn
              key={col.title}
              {...col}
              directionLabels={{ up: "Rising", down: "Falling" }}
            />
          ))}
        </div>
      </Section>

      {/* ---- Integrations ---- */}
      <Section id="integrations" aria-labelledby="ints-title">
        <SectionHeader
          align="center"
          title="Connect the stack you already run"
          titleId="ints-title"
          titleClassName="xl:whitespace-nowrap"
          className="max-w-none"
          lede="33 integrations across 8 categories. TeamTrace’s workforce management software reads from the tools your teams already work in."
        >
          <div className="mt-2.5 flex justify-center">
            <Button href="#" variant="ghost" iconRight={<ArrowRightIcon aria-hidden />}>
              Learn more
            </Button>
          </div>
        </SectionHeader>
      </Section>

      {/* ---- Siloed → unified ---- */}
      <Section id="consolidation" aria-labelledby="silo-title" className="overflow-x-clip">
        <SectionHeader
          align="center"
          title="Data that was siloed becomes one trace"
          titleId="silo-title"
          lede="Most productivity tooling is excellent at one individual and blind to the organization. Once the stack is consolidated, the record is finally unified — TeamTrace’s workforce management software brings four disconnected systems into one platform."
        />
        <CircuitDiagram
          className="mt-8"
          sources={[
            { label: "Project & task management", icon: <KanbanIcon weight="light" /> },
            { label: "Resource management", icon: <UsersThreeIcon weight="light" /> },
            { label: "Time tracking", icon: <TimerIcon weight="light" /> },
            { label: "Productivity management", icon: <GaugeIcon weight="light" /> },
          ]}
          hub={{
            siloed: {
              icon: <TableIcon weight="light" />,
              badge: <XCircleIcon weight="fill" />,
              title: "Manual join",
              sub: "Spreadsheets, exports and email",
            },
            unified: {
              logo: { src: "/brand/mark.png", width: 128, height: 130 },
              title: "TeamTrace",
              sub: "One record",
            },
          }}
          outputs={[
            {
              title: "Organization productivity",
              value: 68,
              suffix: " focus index",
              before: "No system holds the total picture",
              after: "One metric system across every department",
            },
            {
              title: "On-time delivery",
              value: 82,
              suffix: "% on time",
              before: "Planned hours and actual hours live apart",
              after: "Planned and actual hours, finally comparable",
            },
          ]}
          toggle={{ ariaLabel: "View", siloed: "Siloed today", unified: "Unified in TeamTrace" }}
          status={[
            "Four systems. Zero shared context. · Every answer requires a manual join",
            "One platform. One continuous trace. · Every answer without a manual join",
          ]}
          unknownText="— unknown —"
        />
        <ol className="mt-14 grid gap-8 lg:grid-cols-3">
          {(
            [
              {
                num: "01",
                title: "Individual, not organization",
                body: "Plenty of tools are good at tracking an individual. Far fewer can track and improve the productivity of the organization as a whole.",
              },
              {
                num: "02",
                title: "Siloed by default",
                body: "Project and task management, resource management software, time tracking and productivity platforms each hold part of the truth — and none of them talk.",
              },
              {
                num: "03",
                title: "Unified by TeamTrace",
                body: "All four become part of a single platform, giving visibility into the organization rather than just the individual in front of you.",
              },
            ] satisfies NumberedPointProps[]
          ).map((pt) => (
            <NumberedPoint key={pt.num} {...pt} />
          ))}
        </ol>
      </Section>

      {/* ---- TraceAI memory ---- */}
      <Section id="traceai" aria-labelledby="mem-title">
        <SectionHeader
          align="center"
          title="TraceAI that works harder for you every passing day"
          titleId="mem-title"
          lede="The more your people use TeamTrace, the more it learns — your patterns, your drift, your warning signs — and the more precisely it can prescribe what to do next."
        />
        <div className="mt-14 grid items-center gap-10 xl:grid-cols-2 xl:gap-14">
          <div className="grid min-w-0 gap-4.5">
            <Heading as="h3" size="h3">
              Your organization gets its own memory.
            </Heading>
            <p className="text-body text-muted">
              When you sign up, TraceAI creates a separate memory for your organization. Nothing
              leaks between tenants. Every day of usage sharpens it — until it can spot productivity
              drift before anyone complains, flag warning signs early, and prescribe remedial
              measures your own team will actually accept.
            </p>
            <ul className="mt-2">
              {(
                [
                  {
                    icon: <DatabaseIcon weight="light" />,
                    title: "One memory per organization",
                    body: "Created on sign-up, never shared, never pooled with another tenant.",
                  },
                  {
                    icon: <BrainIcon weight="light" />,
                    title: "Learns from usage",
                    body: "Patterns come from how your team actually works — not from a static rulebook written for everyone else.",
                  },
                  {
                    icon: <ListChecksIcon weight="light" />,
                    title: "Prescribes, not just reports",
                    body: "Every signal arrives with the remedial measure attached — never a metric with no next step.",
                  },
                ] satisfies FeatureItemProps[]
              ).map((fact) => (
                <FeatureItem key={fact.title as string} {...fact} />
              ))}
            </ul>
          </div>
          <LearningOrb
            title="Your organization’s memory"
            icon={<LockSimpleIcon aria-hidden />}
            sliderLabel="Days of usage:"
            max={180}
            autoplayTo={130}
            stages={[
              {
                from: 1,
                status: "Learning your patterns",
                text: "Not enough history yet. Collecting how your teams actually work.",
              },
              {
                from: 15,
                status: "Pattern found",
                text: "The Design team’s focus dips every Thursday afternoon.",
              },
              {
                from: 60,
                status: "Drift spotted early",
                text: "Arun P.’s deep work fell 22% over three weeks, before anyone raised it.",
              },
              {
                from: 120,
                status: "Remedy prescribed",
                text: "Suggested for Arun P.: a re-engagement nudge, and a check for a blocker before his capacity is raised.",
              },
            ]}
          />
        </div>
      </Section>

      {/* ---- Analytics ---- */}
      <Section id="metrics" aria-labelledby="alt-title">
        <SectionHeader
          align="center"
          eyebrow="Workforce analytics for managers and leadership"
          title="Three dimensions of visibility. One metric system."
          titleId="alt-title"
          lede="Layered visibility that leadership and managers can act on, built into TeamTrace’s workforce management software — dashboards, analytics and reports at every level, from one person to the whole organization."
        />
        <SwitchView
          className="mt-11"
          ariaLabel="Level of visibility"
          defaultValue="individual"
          options={[
            { value: "individual", label: "Individual" },
            { value: "team", label: "Team" },
            { value: "department", label: "Department" },
            { value: "org", label: "Organization-wide", shortLabel: "Org-wide" },
          ]}
        >
          <SwitchPanels
            className="mt-5"
            views={{
              individual: (
                <DashboardFrame
                  title="Alex M."
                  subtitle="Individual analytics"
                  aside={
                    <>
                      <Chip>Role-based</Chip>
                      <Chip tone="green">Sprint 14</Chip>
                    </>
                  }
                  footnote="Same metric, same formula, from one person to the whole organization."
                >
                  <KpiGrid
                    size="lg"
                    items={[
                      {
                        label: "Focus index",
                        value: "74",
                        note: "+9 vs personal baseline",
                        noteTone: "success",
                      },
                      { label: "On-time completion", value: "92%", note: "11 of 12 tasks" },
                      { label: "Deep work", value: "3.1h", note: "per day, average" },
                      {
                        label: "Shallow hours",
                        value: "2.4h",
                        note: "+0.6 this week",
                        noteTone: "danger",
                      },
                    ]}
                  />
                  <DashboardSplit>
                    <DashboardPanel
                      title="Focus index by day"
                      aside={<Chip tone="blue">Last 12 days</Chip>}
                      stretch
                      footer={
                        <Legend
                          items={[
                            { label: "Best", swatch: "sky" },
                            { label: "On track", swatch: "volt" },
                            { label: "Below baseline", swatch: "slate" },
                          ]}
                        />
                      }
                    >
                      <BarChart
                        size="lg"
                        max={100}
                        low={40}
                        bars={[
                          { label: "M", value: 42 },
                          { label: "T", value: 55 },
                          { label: "W", value: 28 },
                          { label: "T", value: 61 },
                          { label: "F", value: 70 },
                          { label: "M", value: 33 },
                          { label: "T", value: 48 },
                          { label: "W", value: 82 },
                          { label: "T", value: 64 },
                          { label: "F", value: 57 },
                          { label: "M", value: 30 },
                          { label: "T", value: 72 },
                        ]}
                      />
                    </DashboardPanel>
                    <DashboardPanel title="Work mix" aside={<Chip>This week</Chip>}>
                      <Donut
                        size="lg"
                        className="mx-auto mt-1"
                        center="68%"
                        sub="in the zone"
                        segments={[
                          { share: 46, color: "sky" },
                          { share: 22, color: "volt" },
                          { share: 32, color: "track" },
                        ]}
                      />
                      <MetricList
                        items={[
                          { label: "Focused sessions", value: "19.4h", signal: "sky" },
                          { label: "Shallow hours", value: "12.1h", signal: "volt" },
                          { label: "Negative work", value: "2.2h", signal: "slate" },
                        ]}
                      />
                    </DashboardPanel>
                  </DashboardSplit>
                </DashboardFrame>
              ),
              team: (
                <DashboardFrame
                  title="Platform team"
                  subtitle="Team analytics"
                  aside={
                    <>
                      <Chip>System</Chip>
                      <Chip tone="green">12 members</Chip>
                    </>
                  }
                  footnote="Same metric, same formula, from one person to the whole organization."
                >
                  <KpiGrid
                    size="lg"
                    items={[
                      {
                        label: "In the zone",
                        value: "8/12",
                        note: "+2 this sprint",
                        noteTone: "success",
                      },
                      {
                        label: "Burning out",
                        value: "1",
                        note: "Priya, 62h last week",
                        valueTone: "danger",
                      },
                      {
                        label: "Drifting",
                        value: "3",
                        note: "below their own baseline",
                        valueTone: "info",
                      },
                      {
                        label: "Sprint completion",
                        value: "78%",
                        note: "+10 pts",
                        noteTone: "success",
                      },
                    ]}
                  />
                  <DashboardSplit>
                    <DashboardPanel
                      title="Focus index by member"
                      aside={<Chip tone="blue">vs team median</Chip>}
                      stretch
                      footer={
                        <Legend
                          items={[
                            { label: "Best", swatch: "sky" },
                            { label: "On track", swatch: "volt" },
                            { label: "Below baseline", swatch: "slate" },
                            { label: "Team median 63", swatch: "dashed" },
                          ]}
                        />
                      }
                    >
                      <BarChart
                        size="lg"
                        max={100}
                        low={40}
                        median={63}
                        bars={[
                          { label: "MS", value: 88 },
                          { label: "PR", value: 74 },
                          { label: "AK", value: 62 },
                          { label: "DV", value: 34 },
                          { label: "RM", value: 70 },
                          { label: "NK", value: 58 },
                          { label: "TS", value: 66 },
                          { label: "AJ", value: 82 },
                          { label: "VS", value: 52 },
                          { label: "KP", value: 28 },
                          { label: "SR", value: 64 },
                          { label: "LB", value: 60 },
                        ]}
                      />
                    </DashboardPanel>
                    <DashboardPanel title="Workload spread" aside={<Chip>Allocated hours</Chip>}>
                      <MetricList
                        items={[
                          {
                            label: "Priya R.",
                            value: "62h",
                            meter: 92,
                            meterColor: "coral",
                            valueTone: "danger",
                          },
                          {
                            label: "Arun K.",
                            value: "58h",
                            meter: 84,
                            meterColor: "amber",
                            valueTone: "warning",
                          },
                          { label: "Mohan S.", value: "41h", meter: 60 },
                          { label: "Devika V.", value: "38h", meter: 52, meterColor: "leaf" },
                        ]}
                      />
                    </DashboardPanel>
                  </DashboardSplit>
                </DashboardFrame>
              ),
              department: (
                <DashboardFrame
                  title="Engineering"
                  subtitle="Department analytics"
                  aside={
                    <>
                      <Chip>Custom</Chip>
                      <Chip tone="green">6 squads</Chip>
                    </>
                  }
                  footnote="Same metric, same formula, from one person to the whole organization."
                >
                  <KpiGrid
                    size="lg"
                    items={[
                      {
                        label: "Focus index",
                        value: "68",
                        note: "+6 vs last quarter",
                        noteTone: "success",
                      },
                      {
                        label: "On-time delivery",
                        value: "84%",
                        note: "+4 pts",
                        noteTone: "success",
                      },
                      {
                        label: "Capacity used",
                        value: "91%",
                        note: "above plan",
                        noteTone: "danger",
                      },
                      { label: "Squads at risk", value: "2", note: "Support, Data" },
                    ]}
                  />
                  <DashboardSplit>
                    <DashboardPanel
                      title="Squad comparison"
                      aside={<Chip tone="blue">Focus index</Chip>}
                      stretch
                      footer={
                        <Legend
                          items={[
                            { label: "Best", swatch: "sky" },
                            { label: "On track", swatch: "volt" },
                            { label: "Below baseline", swatch: "slate" },
                          ]}
                        />
                      }
                    >
                      <BarChart
                        size="lg"
                        max={100}
                        low={45}
                        bars={[
                          { label: "Core", value: 72 },
                          { label: "Platform", value: 86 },
                          { label: "Mobile", value: 64 },
                          { label: "Support", value: 38 },
                          { label: "Data", value: 58 },
                          { label: "Infra", value: 70 },
                        ]}
                      />
                    </DashboardPanel>
                    <DashboardPanel title="Capacity by squad" aside={<Chip>This quarter</Chip>}>
                      <MetricList
                        items={[
                          { label: "Core", value: "86%", meter: 86 },
                          {
                            label: "Platform",
                            value: "97%",
                            meter: 97,
                            meterColor: "amber",
                            valueTone: "warning",
                          },
                          {
                            label: "Support",
                            value: "74%",
                            meter: 74,
                            meterColor: "coral",
                            valueTone: "danger",
                          },
                          { label: "Data", value: "69%", meter: 69 },
                        ]}
                      />
                    </DashboardPanel>
                  </DashboardSplit>
                </DashboardFrame>
              ),
              org: (
                <DashboardFrame
                  title="Your organization"
                  subtitle="Org-wide analytics"
                  aside={
                    <>
                      <Chip>System</Chip>
                      <Chip tone="green">4 departments</Chip>
                    </>
                  }
                  footnote="Same metric, same formula, from one person to the whole organization."
                >
                  <KpiGrid
                    size="lg"
                    items={[
                      {
                        label: "Org focus index",
                        value: "71",
                        note: "+11 since Q1",
                        noteTone: "success",
                      },
                      {
                        label: "On-time delivery",
                        value: "82%",
                        note: "+7 pts",
                        noteTone: "success",
                      },
                      {
                        label: "Hours lost to drift",
                        value: "−38%",
                        note: "vs last quarter",
                        noteTone: "success",
                      },
                      { label: "Departments at risk", value: "1", note: "Customer Ops" },
                    ]}
                  />
                  <DashboardSplit>
                    <DashboardPanel
                      title="Focus index, department × week"
                      aside={<Chip tone="blue">12 weeks</Chip>}
                    >
                      <Heatmap
                        columns={["W1", "", "", "W4", "", "", "", "W8", "", "", "", "W12"]}
                        rows={[
                          {
                            label: "Engineering",
                            values: [
                              0.49, 0.39, 0.52, 0.72, 0.62, 0.59, 0.75, 0.79, 0.48, 0.87, 0.58, 0.6,
                            ],
                          },
                          {
                            label: "Design",
                            values: [
                              0.65, 0.3, 0.45, 0.34, 0.38, 0.64, 0.77, 0.75, 0.75, 0.5, 0.75, 0.72,
                            ],
                          },
                          {
                            label: "Customer Ops",
                            values: [
                              0.33, 0.63, 0.33, 0.65, 0.41, 0.39, 0.69, 0.72, 0.8, 0.8, 0.83, 0.82,
                            ],
                            riskFrom: 8,
                          },
                          {
                            label: "Sales",
                            values: [
                              0.26, 0.41, 0.36, 0.59, 0.5, 0.49, 0.72, 0.55, 0.8, 0.7, 0.58, 0.71,
                            ],
                          },
                        ]}
                      />
                      <Legend
                        items={[
                          { label: "High focus", swatch: "sky" },
                          { label: "Low focus", swatch: "sky-faint" },
                          { label: "Drift risk", swatch: "risk" },
                        ]}
                      />
                    </DashboardPanel>
                    <DashboardPanel title="Top signals" aside={<Chip tone="green">Live</Chip>}>
                      <MetricList
                        items={[
                          {
                            label: "Customer Ops · drift",
                            value: "+9 pts",
                            valueTone: "danger",
                            signal: "coral",
                          },
                          {
                            label: "Engineering · deep work",
                            value: "+2.4h",
                            valueTone: "success",
                            signal: "leaf",
                          },
                          { label: "Platform · sprint slip", value: "2 tasks", signal: "amber" },
                          {
                            label: "Support · tenure cohort",
                            value: "New hires",
                            signal: "periwinkle",
                          },
                          { label: "Sales · meeting load", value: "34%", signal: "periwinkle" },
                        ]}
                      />
                    </DashboardPanel>
                  </DashboardSplit>
                </DashboardFrame>
              ),
            }}
          />
          <HighlightColumns
            className="mt-14"
            columns={[
              {
                title: "Dashboards",
                intro: "The surface each role opens on.",
                items: [
                  {
                    title: "Role-based dashboards",
                    text: "Built for the person, not the org chart",
                  },
                  { title: "System dashboards", text: "The standard set, out of the box" },
                  { title: "Custom dashboards", text: "Assembled by your own teams" },
                ],
              },
              {
                title: "Analytics",
                intro:
                  "Workforce analytics software with the same metric system at every altitude.",
                items: [
                  {
                    title: "Individual analytics",
                    text: "One person, in context",
                    when: ["individual"],
                  },
                  {
                    title: "Team and department analytics",
                    text: "Where the pattern is",
                    when: ["team", "department"],
                  },
                  {
                    title: "Org-wide analytics",
                    text: "The whole trace, no sampling",
                    when: ["org"],
                  },
                ],
              },
              {
                title: "Reports",
                intro: "How the answer leaves the building.",
                items: [
                  {
                    title: "Macro reports",
                    text: "The whole organization, one view",
                    when: ["org"],
                  },
                  {
                    title: "Drilled-down reports",
                    text: "From board to individual",
                    when: ["individual", "team", "department"],
                  },
                  { title: "Custom reports", text: "Your columns, your cadence" },
                ],
              },
            ]}
          />
        </SwitchView>
      </Section>

      {/* ---- Profits ---- */}
      <Section id="roi" aria-labelledby="pf-title">
        <SectionHeader
          title="Where productivity translates into profits"
          titleId="pf-title"
          lede="Implement TeamTrace and watch productivity rise, costs shrink, and results multiply across your organization."
        />
        <div className="mt-12 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {(
            [
              {
                icon: <ClockClockwiseIcon weight="light" />,
                value: "50 minutes to 2.2 hours",
                title: "more productive work per employee, every day",
                body: "Turning idle time into extra output with no new hires needed.",
                featured: true,
              },
              {
                icon: <BrowserIcon weight="light" />,
                value: "40–70 minutes",
                title: "less browsing per employee each day",
                body: "Reclaiming nearly an hour for high-value work instead of distractions.",
              },
              {
                icon: <PresentationChartIcon weight="light" />,
                value: "2.1×",
                title: "jump in managers’ productivity",
                body: "Doubling leadership output without increasing headcount.",
              },
              {
                icon: <LightningIcon weight="light" />,
                value: "23–35%",
                title: "faster decision-making",
                body: "Slashing delays to speed up project delivery and realize returns sooner.",
              },
              {
                icon: <CoinsIcon weight="light" />,
                value: "12–31%",
                title: "more project revenue",
                body: "Converting efficiency gains into direct financial growth and higher returns per project.",
              },
              {
                icon: <ChartBarIcon weight="light" />,
                value: "2–5%",
                title: "more output company-wide",
                body: "Getting more done with existing resources to improve profit margins.",
                wide: true,
              },
              {
                icon: <RocketLaunchIcon weight="light" />,
                value: "2–3%",
                title: "faster task turnaround",
                body: "Shortening delivery times and capturing value and revenue sooner.",
                wide: true,
              },
            ] satisfies (StatCardProps & { wide?: boolean })[]
          ).map(({ wide, ...card }, i) => (
            <Reveal
              key={card.title as string}
              index={i}
              className={
                card.featured ? "sm:col-span-2 xl:row-span-2" : wide ? "xl:col-span-2" : undefined
              }
            >
              <StatCard {...card} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---- Customer stories ---- */}
      <Section id="stories" aria-labelledby="st-title">
        <SectionHeader title="Customer stories" titleId="st-title" />
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {(
            [
              {
                quote:
                  "“We were paying for several tools that together covered maybe half of what we needed. TeamTrace replaced them with one place for tasks, files, leave, and milestones, and within a month our sprints ran smoother with far less admin.”",
                name: "Sankhadeep S.",
                role: "CEO, DotLinker",
                initials: "SS",
                featured: true,
              },
              {
                quote:
                  "“We believe that TeamTrace has been a crucial tool in optimizing our remote work strategy.”",
                name: "Nicolas B.",
                role: "Head of IT & Marketing, Kunde LLC",
                initials: "NB",
              },
              {
                quote:
                  "“The insights provided by the platform have significantly enhanced our ability to assess employee performance.”",
                name: "Russel S.",
                role: "Operations Manager, Durgan Inc",
                initials: "RS",
              },
            ] satisfies TestimonialProps[]
          ).map((story) => (
            <Testimonial
              key={story.name}
              {...story}
              className={story.featured ? "lg:row-span-2" : undefined}
            />
          ))}
        </div>
      </Section>

      {/* ---- Trust ---- */}
      <Section id="trust" aria-labelledby="tr-title">
        <SectionHeader
          title="Designed for trust"
          titleId="tr-title"
          lede="Workplace monitoring became capable long before it became acceptable. The research is unusually consistent about what closes the gap — and what does not."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {(
            [
              {
                value: "1 in 5",
                body: "employees have a great deal of trust that their leaders will use their workplace data responsibly.",
              },
              {
                value: (
                  <>
                    44%
                    <span className="mx-[0.15em] text-[0.45em] tracking-normal text-muted">vs</span>
                    16%
                  </>
                ),
                body: "of employees say workplace monitoring feels reasonable — where it is disclosed, versus where it is not.",
              },
              {
                value: "94 samples",
                body: "found no evidence that electronic performance monitoring improves performance — while stress rose regardless of design.",
              },
            ] satisfies StatCardProps[]
          ).map((stat) => (
            <StatCard key={stat.body as string} valueStyle="plain" {...stat} />
          ))}
        </div>
      </Section>

      {/* ---- CTA ---- */}
      <Section
        id="cta"
        aria-labelledby="cta-title"
        spacing="cta"
        className="isolate overflow-hidden text-center"
      >
        <HorizonGlow />
        <SectionHeader
          align="center"
          title="See where your work actually stands"
          titleId="cta-title"
          lede="Put TeamTrace’s workforce management software on your own team. Plan, execute, monitor, measure and investigate on one connected platform, with an organization memory that keeps getting sharper."
        >
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <Button href="#">Start free trial</Button>
            <Button href="#" variant="ghost">
              Book a demo
            </Button>
          </div>
        </SectionHeader>
      </Section>

      {/* ---- FAQ ---- */}
      <Section id="faq" aria-labelledby="faq-title">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHeader
            className="gap-5 lg:sticky lg:top-30"
            title="Frequently asked questions"
            titleId="faq-title"
            lede={
              <>
                Something else on your mind?{" "}
                <Link href="#" className="text-accent underline underline-offset-4">
                  Contact us
                </Link>
                .
              </>
            }
          />
          <Accordion
            items={[
              {
                question: "Is employee monitoring legal in India?",
                answer:
                  "Generally, yes, when it’s transparent, serves a legitimate business purpose, and employees are properly informed. The DPDP Act 2023 governs how personal data is collected and used, and TeamTrace is DPDP compliant. Check local employment law and take legal advice when you write your monitoring policy.",
              },
              {
                question: "Will my team feel spied on?",
                answer:
                  "Not when it’s used the way it’s designed. Share what’s tracked and why, use the data to coach and balance workloads, and let good work speak for itself. Good people would rather be measured on output than judged on who looks busiest.",
              },
              {
                question: "How is TeamTrace different from other employee monitoring tools?",
                answer:
                  "Most tools are good at tracking individual productivity but can’t show how the organization performs as a whole, because project, resource, time and productivity data sit in separate platforms. TeamTrace runs all of it as one workforce management software platform, then adds insider risk controls and a built-in PSA, so you can follow an hour from the first plan to the final invoice.",
              },
              {
                question: "Does it include time and attendance software?",
                answer:
                  "Yes. Automatic time tracking, timesheets with approvals, clock in and out, shifts, overtime, and leave are all built in.",
              },
              {
                question: "How much does it cost?",
                answer: (
                  <>
                    Plans start at $3 per user per month, across Starter, Express, Professional, and
                    Enterprise tiers. Pay monthly or annually, with no long-term contract.{" "}
                    <Link href="#">See pricing →</Link>
                  </>
                ),
              },
              {
                question: "Is there a free trial?",
                answer: "Yes. 7 days with full access.",
              },
            ]}
          />
        </div>
      </Section>
    </main>
  );
}
