"use client";

import { AdSense } from "./adsense";

interface SidebarAdProps {
  slot?: string;
  side: "left" | "right";
}

export function SidebarAd({ slot = "XXXXXXXXXX", side }: SidebarAdProps) {
  return (
    <div
      className={`hidden 2xl:block fixed top-1/2 -translate-y-1/2 w-[160px] ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      <AdSense
        slot={slot}
        format="vertical"
        responsive={false}
        className="min-h-[600px]"
      />
    </div>
  );
}
