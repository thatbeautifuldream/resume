"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { resume } from "@/lib/resume";

export function TimezoneClock() {
  const [time, setTime] = useState<{ hours: string; minutes: string; period: string }>({
    hours: "00",
    minutes: "00",
    period: "AM",
  });
  const [timezoneOffset, setTimezoneOffset] = useState<{
    diff: number;
    label: string;
  } | null>(null);

  useEffect(() => {
    const resumeTimezone = resume.basics.timezone;
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (userTimezone !== resumeTimezone) {
      const getOffset = (tz: string) => {
        const date = new Date();
        const utcDate = new Date(
          date.toLocaleString("en-US", { timeZone: "UTC" }),
        );
        const tzDate = new Date(
          date.toLocaleString("en-US", { timeZone: tz }),
        );
        return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
      };

      const userOffset = getOffset(userTimezone);
      const resumeOffset = getOffset(resumeTimezone);
      const diffInMinutes = userOffset - resumeOffset;
      const diffInHours = Math.abs(diffInMinutes / 60);

      const label =
        diffInMinutes > 0
          ? `${diffInHours}h ahead`
          : `${diffInHours}h behind`;

      setTimezoneOffset({ diff: diffInHours, label });
    }
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const resumeTimezone = resume.basics.timezone;
      const now = new Date();

      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: resumeTimezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const parts = formatter.formatToParts(now);
      const hours = parts.find((p) => p.type === "hour")?.value || "00";
      const minutes = parts.find((p) => p.type === "minute")?.value || "00";
      const period = parts.find((p) => p.type === "dayPeriod")?.value || "AM";

      setTime({ hours, minutes, period });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      {timezoneOffset && timezoneOffset.diff > 0 && (
        <span className="text-muted-foreground">[{timezoneOffset.label}]</span>
      )}
      <div className="flex items-center gap-1">
        <NumberFlow
          value={parseInt(time.hours)}
          format={{ minimumIntegerDigits: 2 }}
          className="tabular-nums"
        />
        <span>:</span>
        <NumberFlow
          value={parseInt(time.minutes)}
          format={{ minimumIntegerDigits: 2 }}
          className="tabular-nums"
        />
        <span className="text-muted-foreground">{time.period}</span>
      </div>
    </div>
  );
}
