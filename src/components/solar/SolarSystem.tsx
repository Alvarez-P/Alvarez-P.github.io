import { Fragment, useState } from "react";
import { SECTIONS } from "@/data/sections";
import "./SolarSystem.css";
import "./Sun.css";

interface OrbitDef {
  id: string;
  radiusClass: string;
  speed: number;
  ids: string[];
}

const ORBITS: OrbitDef[] = [
  { id: "inner", radiusClass: "var(--radius-inner)", speed: 20, ids: ["sobre-mi", "experiencia"] },
  { id: "mid", radiusClass: "var(--radius-mid)", speed: 32, ids: ["skills", "proyectos"] },
  { id: "outer", radiusClass: "var(--radius-outer)", speed: 48, ids: ["contacto"] },
];

const DUST = [
  { delay: "-4s", radius: "60px", color: "#7a8fc2" },
  { delay: "-9s", radius: "110px", color: "#8ea6d6" },
  { delay: "-14s", radius: "150px", color: "#98a0b3" },
  { delay: "-6s", radius: "90px", color: "#e3e6ee" },
  { delay: "-11s", radius: "130px", color: "#5f77b0" },
  { delay: "-17s", radius: "170px", color: "#8ea6d6" },
];

interface Props {
  onSelect: (id: string, element: HTMLElement) => void;
}

export default function SolarSystem({ onSelect }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className="solar-system relative mx-auto"
      style={{ width: "min(600px, 94vw)", height: "min(320px, 64vw)", perspective: "1200px" }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 600,
          height: 600,
          transform: "translate(-50%, -50%) rotateX(65deg) rotateY(-10deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-20"
          style={{
            transform: "translate(-50%, -50%) rotateY(10deg) rotateX(-65deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="sun pointer-events-auto" role="img" aria-label="Sol de plasma">
            <div className="sun__aura"></div>
            <div className="sun__surface">
              <span className="sun__texture sun__texture--1"></span>
              <span className="sun__texture sun__texture--2"></span>
              <span className="sun__plasma sun__plasma--1"></span>
              <span className="sun__plasma sun__plasma--2"></span>
            </div>
            <span className="sun__flare" style={{ ["--angle" as any]: "22deg", ["--dur" as any]: "4.8s", ["--delay" as any]: "0s", ["--size" as any]: "1" }}><i /></span>
            <span className="sun__flare" style={{ ["--angle" as any]: "95deg", ["--dur" as any]: "6.2s", ["--delay" as any]: "1.2s", ["--size" as any]: "0.7" }}><i /></span>
            <span className="sun__flare" style={{ ["--angle" as any]: "170deg", ["--dur" as any]: "5.4s", ["--delay" as any]: "0.5s", ["--size" as any]: "1.15" }}><i /></span>
            <span className="sun__flare" style={{ ["--angle" as any]: "250deg", ["--dur" as any]: "7s", ["--delay" as any]: "2s", ["--size" as any]: "0.85" }}><i /></span>
            <span className="sun__flare" style={{ ["--angle" as any]: "315deg", ["--dur" as any]: "4.2s", ["--delay" as any]: "0.8s", ["--size" as any]: "1.05" }}><i /></span>
          </div>
        </div>

        {DUST.map((d, i) => (
          <div
            key={i}
            className="solar-orbit absolute left-1/2 top-1/2 rounded-full pointer-events-none"
            style={{
              width: 3,
              height: 3,
              background: d.color,
              boxShadow: `0 0 6px ${d.color}`,
              opacity: 0.4,
              animationDelay: d.delay,
              ["--orbit-radius" as any]: d.radius,
              ["--orbit-duration" as any]: "24s",
            }}
          />
        ))}

        {ORBITS.map((orbit) => {
          const items = orbit.ids
            .map((id) => SECTIONS.find((s) => s.id === id))
            .filter((s): s is (typeof SECTIONS)[number] => Boolean(s));

          return (
            <Fragment key={orbit.id}>
              <div
                className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-primary/60 pointer-events-none"
                style={{
                  width: `calc(2 * ${orbit.radiusClass})`,
                  height: `calc(2 * ${orbit.radiusClass})`,
                  transform: "translate(-50%, -50%)",
                }}
              />

              {items.map((section, idx) => {
                const delay = -(orbit.speed / items.length) * idx;
                const duration = orbit.speed;
                const isHovered = hoveredId === section.id;
                const Icon = section.icon;

                return (
                  <div
                    key={section.id}
                    className="solar-orbit absolute left-1/2 top-1/2 h-0 w-0 pointer-events-none"
                    style={{
                      animationDelay: `${delay}s`,
                      zIndex: isHovered ? 30 : 10,
                      transformStyle: "preserve-3d",
                      ["--orbit-radius" as any]: orbit.radiusClass,
                      ["--orbit-duration" as any]: `${duration}s`,
                    }}
                  >
                    <div
                      className="absolute right-0 top-1/2 z-0 h-[1.5px] origin-right -translate-y-1/2 pointer-events-none transition-opacity duration-300"
                      style={{
                        width: orbit.radiusClass,
                        opacity: isHovered ? 1 : 0,
                        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.15) 20%, ${section.color} 80%, ${section.color} 100%)`,
                        boxShadow: `0 0 8px ${section.color}, 0 0 16px ${section.color}40`,
                      }}
                    />

                    <div
                      data-section-id={section.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Ir a la sección ${section.label}`}
                      onMouseEnter={() => setHoveredId(section.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={(e) => onSelect(section.id, e.currentTarget)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelect(section.id, e.currentTarget);
                        }
                      }}
                      className="solar-billboard solar-card"
                      style={{
                        animationDelay: `${delay}s`,
                        ["--orbit-duration" as any]: `${duration}s`,
                      }}
                    >
                      <div className="solar-card__tooltip">{section.label}</div>
                      <div
                        className="solar-card__icon"
                        style={{
                          borderColor: isHovered ? section.color : undefined,
                          boxShadow: isHovered
                            ? `0 0 20px rgba(0,0,0,0.6), 0 0 15px ${section.color}35`
                            : undefined,
                        }}
                      >
                        <Icon className="size-6" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
