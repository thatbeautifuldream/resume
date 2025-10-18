"use client";

import React, { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";

type TClockProps = {
  timeZone: string;
};

export function Clock({ timeZone = "Asia/Calcutta" }: TClockProps) {
  const [time, setTime] = useState<Date>(new Date());
  const [is24Hour, setIs24Hour] = useState<boolean>(true);

  useEffect(() => {
    const update = () => {
      setTime(new Date());
    };

    update();
    const intervalId = setInterval(update, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

  const formatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !is24Hour,
    timeZone: timeZone,
  });

  const parts = formatter.formatToParts(time);
  const hour = parts.find((part) => part.type === "hour")?.value || "00";
  const minute = parts.find((part) => part.type === "minute")?.value || "00";
  const second = parts.find((part) => part.type === "second")?.value || "00";
  const dayPeriod = parts.find((part) => part.type === "dayPeriod")?.value;

  return (
    <div
      onClick={toggleTimeFormat}
      className="cursor-pointer select-none text-sm md:text-md"
    >
      <NumberFlow value={parseInt(hour)} format={{ minimumIntegerDigits: 2 }} />
      :
      <NumberFlow
        value={parseInt(minute)}
        format={{ minimumIntegerDigits: 2 }}
      />
      :
      <NumberFlow
        value={parseInt(second)}
        format={{ minimumIntegerDigits: 2 }}
      />
      {dayPeriod && <span className="ml-1">{dayPeriod}</span>}
    </div>
  );
}
