/** Kanban mock-up: KanbanBoard (columns of KanbanCards). */

import {
  ArrowDownIcon,
  ArrowElbowDownRightIcon,
  ArrowUpIcon,
  CalendarBlankIcon,
  ChatCircleIcon,
  DotsThreeVerticalIcon,
  EqualsIcon,
} from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { colorVar, type ColorToken } from "@/theme/colors";
import { stagger } from "@/theme/motion";
import { AvatarStack } from "@/components/ui/avatar";

export type KanbanCardData = {
  id: string;
  /** Parent issue id shown before the id */
  parentId?: string;
  type: "task" | "bug" | "feature";
  title: string;
  date: string;
  assignees: { initials: string; hue: number }[];
  comments: number;
  priority?: "High" | "Medium" | "Low";
  /** Small status tag at the bottom, e.g. "Done" */
  tag?: { label: string; tone?: "ok" | "info" };
};

export type KanbanColumnData = {
  title: string;
  color: ColorToken;
  count: number;
  cards: KanbanCardData[];
};

const typeColor = { task: "bg-volt", bug: "bg-coral", feature: "bg-leaf" };
const priority = {
  High: { icon: <ArrowUpIcon />, cls: "text-coral-100" },
  Medium: { icon: <EqualsIcon />, cls: "text-amber-100" },
  Low: { icon: <ArrowDownIcon />, cls: "text-sky-100" },
};

/** Kanban board: three columns when the frame is wide enough, stacked otherwise. */
export function KanbanBoard({
  columns,
  compact = false,
}: {
  columns: KanbanColumnData[];
  compact?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 @md:grid-cols-3">
      {columns.map((col) => (
        <div
          key={col.title}
          className="grid min-w-0 content-start gap-2 rounded-xl border border-border bg-fill-2 p-2"
        >
          <p
            className={cn(
              "flex items-center gap-1.75 px-0.5 py-0.5 pl-1 font-semibold whitespace-nowrap text-foreground",
              compact ? "text-2xs" : "text-xs",
            )}
          >
            <i
              aria-hidden
              className="size-2.25 rounded-full border-2"
              style={{ borderColor: colorVar(col.color) }}
            />
            <span className="truncate">{col.title}</span>
            <em className="ml-auto rounded-full bg-volt/28 px-2 py-px text-3xs font-bold text-volt-50 not-italic">
              {col.count}
            </em>
          </p>
          {col.cards.map((card, i) => (
            <KanbanCard key={card.id} {...card} compact={compact} delay={i * stagger.step} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function KanbanCard({
  id,
  parentId,
  type,
  title,
  date,
  assignees,
  comments,
  priority: pri,
  tag,
  compact,
  delay = 0,
}: KanbanCardData & { compact?: boolean; delay?: number }) {
  return (
    <article
      style={{ animationDelay: `${delay}s` }}
      className="grid min-w-0 animate-blur-in gap-1.5 rounded-lg border border-border bg-card-solid p-2.5 shadow-card"
    >
      <p className="flex items-center gap-1.25 text-3xs text-dim">
        <i aria-hidden className={cn("size-2.25 shrink-0 rounded-xs", typeColor[type])} />
        {parentId && (
          <span className="inline-flex items-center gap-0.75 [&_svg]:size-2.5">
            {parentId} <ArrowElbowDownRightIcon aria-hidden />
          </span>
        )}
        <b className="font-semibold text-volt-100">{id}</b>
        <DotsThreeVerticalIcon aria-hidden className="ml-auto size-3.25" />
      </p>
      <p
        className={cn("leading-snug font-medium text-foreground", compact ? "text-2xs" : "text-xs")}
      >
        {title}
      </p>
      <p className="flex items-center gap-1.25 text-3xs text-dim [&_svg]:size-2.75">
        <CalendarBlankIcon aria-hidden />
        {date}
      </p>
      <div className="flex items-center gap-2">
        <AvatarStack people={assignees} size="xs" className="pl-1" />
        <span className="inline-flex items-center gap-0.75 text-3xs text-muted [&_svg]:size-2.75">
          <ChatCircleIcon aria-hidden />
          {comments}
        </span>
        {pri && (
          <span
            className={cn(
              "ml-auto inline-flex items-center gap-0.75 rounded-md border border-border-strong px-1.75 py-0.5 text-4xs font-semibold [&_svg]:size-2.5",
              priority[pri].cls,
            )}
          >
            {priority[pri].icon}
            {pri}
          </span>
        )}
      </div>
      {tag && (
        <span
          className={cn(
            "justify-self-start rounded-sm border px-1.75 py-0.5 text-4xs font-semibold",
            tag.tone === "ok" ? "border-leaf/40 text-leaf-100" : "border-sky/35 text-sky-100",
          )}
        >
          {tag.label}
        </span>
      )}
    </article>
  );
}
