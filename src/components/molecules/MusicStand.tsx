import React from "react";
import { cn } from "@/lib/utils";

export interface MusicStandProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * MusicStand Molecule
 * Extracted from Pencil Node IDs: fqxzb, 79ha5, 1ZRgJ
 * Visual representation of the wooden clip area bridging the gradient to the canvas.
 */
export const MusicStand = React.forwardRef<HTMLDivElement, MusicStandProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex justify-center w-[1513px] max-w-[90vw]",
          className,
        )}
        {...props}
      >
        {/* Main curved stand base (Node: fqxzb) */}
        <div className="relative w-full h-[70px] bg-[#dec7a7] rounded-[20px] overflow-hidden border border-black/10">
          {/* Dark left accent rectangle (Node: 79ha5 interpreted spacing) */}
          <div className="absolute left-[50%] -translate-x-[20px] bottom-0 w-[48px] h-[390px] bg-[#1f1f1f] border border-black/10" />

          {/* Wooden accent center (Node: 1ZRgJ interpreted spacing) */}
          <div className="absolute left-[50%] -translate-x-[60px] bottom-0 w-[82px] h-[288px] bg-[var(--sonata-detail, #d2b48c)] border border-black/10" />
        </div>
      </div>
    );
  },
);

MusicStand.displayName = "MusicStand";
