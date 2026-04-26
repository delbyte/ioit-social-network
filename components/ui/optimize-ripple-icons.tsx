"use client";

import { Code, Database, Edit3, Globe, Lock, Puzzle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ICONS = [
  { Icon: Edit3, label: "Editor", delay: 0 },
  { Icon: Code, label: "Code", delay: 0.2 },
  { Icon: Database, label: "Data", delay: 0.4 },
  { Icon: Puzzle, label: "Integrations", delay: 0.6 },
  { Icon: Globe, label: "Domains", delay: 0.8 },
  { Icon: Lock, label: "Security", delay: 1.0 },
];

interface OptimizeFadeIconsProps {
  className?: string;
}

export function OptimizeFadeIcons({ className }: OptimizeFadeIconsProps) {
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    // Start the animation after a brief delay
    const timer = setTimeout(() => setShowIcons(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("flex h-full w-full items-center justify-center", className)}>
      <div className="grid grid-cols-3 gap-8 p-8">
        {ICONS.map(({ Icon, label, delay }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={showIcons ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: delay, duration: 0.6, ease: "easeOut" }}
            className="group relative flex flex-col items-center gap-2"
          >
            {/* Icon container */}
            <div className="relative z-10 rounded-full border border-white/30 bg-white/20 p-4 backdrop-blur-sm">
              <Icon className="size-6 text-white" />
            </div>

            {/* Label */}
            <motion.span
              className="text-xs font-medium text-white/80"
              initial={{ opacity: 0 }}
              animate={showIcons ? { opacity: 1 } : {}}
              transition={{ delay: delay + 0.4, duration: 0.4 }}
            >
              {label}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
