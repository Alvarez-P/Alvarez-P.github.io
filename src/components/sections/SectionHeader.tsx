import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { SECTIONS } from "@/data/sections";

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: string;
}

export default function SectionHeader({ eyebrow, title, description, icon }: Props) {
  const Icon = SECTIONS.find((s) => s.id === icon)?.icon ?? Mail;

  return (
    <div className="space-y-3">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground"
      >
        {eyebrow}
      </motion.p>

      <div className="flex items-center gap-4">
        <motion.span
          data-header-icon={icon}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-border/60 bg-card/40 text-primary"
        >
          <Icon className="size-5" />
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
          className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          {title}
        </motion.h2>
      </div>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.28 }}
          className="max-w-2xl text-base text-muted-foreground"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
