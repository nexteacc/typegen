import {
  AnimatePresence,
} from "motion/react"
import { Trash2 } from "lucide-react"

import { ThanosSnapEffect } from "@/components/ui/thanos-snap-effect";

const DemoOne = () => {
  return (
    <div className="text-white">
      <AnimatePresence mode="wait">
        <ThanosSnapEffect>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 bg-primary text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90 h-9 px-4 py-2 gap-2">
            <Trash2 size={16} strokeWidth={2} />
            Click to delete
          </button>
        </ThanosSnapEffect>
      </AnimatePresence>
    </div>
  );
};

export { DemoOne };
