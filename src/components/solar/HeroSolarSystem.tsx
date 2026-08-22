import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import SolarSystem from "./SolarSystem";
import { SECTIONS } from "@/data/sections";

interface FlyState {
  startX: number;
  startY: number;
  centerX: number;
  centerY: number;
  targetX: number;
  targetY: number;
  Icon: LucideIcon;
}

const FLY_SIZE = 48;
const HALF = FLY_SIZE / 2;
const SCROLL_MARGIN_TOP = 64;

export default function HeroSolarSystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const transitioningRef = useRef(false);
  const hasScrolledRef = useRef(false);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [fly, setFly] = useState<FlyState | null>(null);
  const [overlay, setOverlay] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.classList.toggle("solar-transitioning", active);
    return () => document.body.classList.remove("solar-transitioning");
  }, [active]);

  const select = (id: string, itemEl: HTMLElement) => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;
    hasScrolledRef.current = true;
    setActive(true);

    const Icon = SECTIONS.find((s) => s.id === id)?.icon;
    const itemRect = itemEl.getBoundingClientRect();
    const itemCx = itemRect.left + itemRect.width / 2;
    const itemCy = itemRect.top + itemRect.height / 2;

    const centerCx = window.innerWidth / 2;
    const centerCy = window.innerHeight / 2;

    let targetCx = centerCx;
    let targetCy = centerCy;
    const section = document.getElementById(id);
    const headerIcon = document.querySelector<HTMLElement>(
      `[data-header-icon="${id}"]`
    );
    if (section && headerIcon) {
      const sRect = section.getBoundingClientRect();
      const iRect = headerIcon.getBoundingClientRect();
      targetCx = iRect.left + iRect.width / 2;
      targetCy =
        SCROLL_MARGIN_TOP + (iRect.top + iRect.height / 2 - sRect.top);
    }

    if (Icon) {
      setFly({
        startX: itemCx - HALF,
        startY: itemCy - HALF,
        centerX: centerCx - HALF,
        centerY: centerCy - HALF,
        targetX: targetCx - HALF,
        targetY: targetCy - HALF,
        Icon,
      });
    }

    window.setTimeout(() => setOverlay(1), 550);
    window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    }, 900);
    window.setTimeout(() => setFly(null), 1400);
    window.setTimeout(() => setOverlay(0), 1300);
    window.setTimeout(() => {
      setActive(false);
      transitioningRef.current = false;
    }, 1800);
  };

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 4) hasScrolledRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY <= 0) return;
      if (window.scrollY >= 24) return;
      const el = document.querySelector<HTMLElement>(
        '[data-section-id="sobre-mi"]'
      );
      if (!el) return;
      e.preventDefault();
      if (transitioningRef.current || hasScrolledRef.current) return;
      hasScrolledRef.current = true;
      select("sobre-mi", el);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <SolarSystem onSelect={select} />

      {mounted &&
        fly &&
        createPortal(
          <motion.div
            className="pointer-events-none fixed left-0 top-0 z-[60] flex items-center justify-center rounded-full border border-primary/50 bg-card text-primary"
            style={{
              width: FLY_SIZE,
              height: FLY_SIZE,
              boxShadow: "0 0 30px rgba(122,143,194,0.35)",
            }}
            initial={{ x: fly.startX, y: fly.startY, scale: 1, opacity: 1 }}
            animate={{
              x: [fly.startX, fly.centerX, fly.targetX, fly.targetX],
              y: [fly.startY, fly.centerY, fly.targetY, fly.targetY],
              scale: [1, 1.7, 1, 1],
              opacity: [1, 1, 1, 0],
            }}
            transition={{ duration: 1.4, times: [0, 0.4, 0.9, 1], ease: "easeInOut" }}
          >
            <fly.Icon className="size-6" />
          </motion.div>,
          document.body,
        )}

      {mounted &&
        createPortal(
          <motion.div
            className="pointer-events-none fixed inset-0 z-[70] bg-black"
            animate={{ opacity: overlay }}
            transition={{ duration: 0.35 }}
          />,
          document.body,
        )}
    </div>
  );
}
