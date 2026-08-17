import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface ExperienceProject {
  role: string;
  company: string;
  period: string;
  description?: string;
  techStack: string[];
}

interface ExperienceTimelineProps {
  projects: ExperienceProject[];
}

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options ?? { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);

    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}

const GLOW = 'rgba(122, 143, 194, 0.14)';

function TimelineItem({ project, isHead, index }: { project: ExperienceProject; isHead: boolean; index: number }) {
  const { ref, inView } = useInView<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className="group relative ps-8 pb-10 last:pb-0"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(14px)',
        transition: `opacity 0.55s ease-out ${index * 80}ms, transform 0.55s ease-out ${index * 80}ms`,
      }}
    >
      <span
        aria-hidden="true"
        className="absolute start-0 top-4 h-px w-6 bg-border transition-colors duration-300 group-hover:bg-[color:var(--primary)]"
      />

      <span
        aria-hidden="true"
        className={cn(
          'absolute -start-[5px] top-[13px] size-2.5 rounded-full transition-all duration-300',
          isHead
            ? 'border-[color:var(--primary)] bg-[color:var(--primary)] shadow-[0_0_12px_rgba(122,143,194,0.7)]'
            : 'border border-[color:var(--border)] bg-[color:var(--background)] group-hover:border-[color:var(--primary)] group-hover:bg-[color:var(--primary)] group-hover:shadow-[0_0_12px_rgba(122,143,194,0.7)]',
        )}
      />

      <div
        className={cn(
          'rounded-xl border bg-card p-5 transition-all duration-300',
          isHead
            ? 'border-[color:var(--primary)]/40 shadow-[0_0_28px_rgba(122,143,194,0.10)]'
            : 'border-border/60 group-hover:border-[color:var(--primary)]/50 group-hover:shadow-[0_0_28px_var(--tw-shadow-color)]',
        )}
        style={isHead ? undefined : ({ '--tw-shadow-color': GLOW } as React.CSSProperties)}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{project.role}</h3>
          <span className="font-mono text-xs text-muted-foreground">{project.period}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{project.company}</p>
        {project.description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 8).map((t) => (
            <Badge key={t} variant="outline">{t}</Badge>
          ))}
        </div>
      </div>
    </li>
  );
}

export default function ExperienceTimeline({ projects }: ExperienceTimelineProps) {
  return (
    <ol className="relative border-s border-border">
      {projects.map((p, i) => (
        <TimelineItem key={i} project={p} isHead={i === 0} index={i} />
      ))}
    </ol>
  );
}
