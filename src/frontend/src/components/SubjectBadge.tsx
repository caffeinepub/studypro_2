import { cn } from "@/lib/utils";
import type { SubjectWithGeneral } from "@/types";
import { SUBJECT_CLASS_MAP } from "@/utils/helpers";

interface SubjectBadgeProps {
  subject: SubjectWithGeneral;
  className?: string;
}

export function SubjectBadge({ subject, className }: SubjectBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        SUBJECT_CLASS_MAP[subject],
        className,
      )}
    >
      {subject}
    </span>
  );
}
