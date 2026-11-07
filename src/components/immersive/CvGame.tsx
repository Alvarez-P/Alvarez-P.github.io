import { useEffect, useRef, useState } from 'react';
import { Download, Play, RotateCcw, X } from 'lucide-react';

interface Props {
  cv: { es: string; en: string };
}

type Phase = 'idle' | 'playing' | 'won' | 'lost';

interface Ev { a: number; d: number; v: number; bad: boolean; col: string; label: string; passed: boolean; dead?: boolean }
interface Fx { x: number; y: number; vx: number; vy: number; life: number; col: string }
interface Game {
  cv: HTMLCanvasElement;
  target: number; sh: number; ev: Ev[]; fx: Fx[];
  spawn: number; count: number; charge: number; lives: number; combo: number; shake: number; time: number;
  done: boolean; last: number; n: number;
}

const C = 260, R = 118, ARC = 0.62, TIME = 30, COUNTDOWN = 8;
const GOOD = ['OrderCreated', 'UserRegistered', 'PaymentSettled', 'TicketClassified', 'StockUpdated'];
const BAD = ['Error 500', 'Timeout', 'NullPointer', 'DeadLock'];
const DISPLAY = "'Space Grotesk Variable', system-ui, sans-serif";
const MONO = "'JetBrains Mono', monospace";

const wrap = (a: number) => {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
};

function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string) => cs.getPropertyValue(n).trim();
  return { bg: v('--bg'), ink: v('--ink'), muted: v('--muted'), line: v('--line'), domain: v('--domain'), app: v('--app'), infra: v('--infra'), bad: v('--bad') };
}

export default function CvGame({ cv }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [modal, setModal] = useState(false);
  const [closing, setClosing] = useState(false);
  const [round, setRound] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<Game | null>(null);
  const raf = useRef(0);

  const stop = () => {
    cancelAnimationFrame(raf.current);
    if (game.current) game.current.done = true;
    game.current = null;
  };
  useEffect(() => stop, []);

  // El canvas existe solo con la partida abierta: se arranca cuando ya está montado.
  useEffect(() => {
    if (phase !== 'playing') return;
    const cv = canvasRef.current;
    if (!cv) return;
    cv.scrollIntoView({ block: 'center', behavior: 'smooth' });
    run(cv, (win) => setPhase(win ? 'won' : 'lost'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round]);

  function run(cv: HTMLCanvasElement, finish: (win: boolean) => void) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = 520 * dpr;
    cv.height = 520 * dpr;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const p = readPalette();
    const g: Game = { cv, target: -Math.PI / 2, sh: -Math.PI / 2, ev: [], fx: [], spawn: 0.6, count: COUNTDOWN, charge: 0, lives: 3, combo: 0, shake: 0, time: TIME, done: false, last: performance.now(), n: 0 };
    game.current = g;

    const burst = (x: number, y: number, col: string, n: number, sp: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, v = (0.3 + Math.random()) * sp;
        g.fx.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.7, col });
      }
    };
    const end = (win: boolean) => { g.done = true; game.current = null; finish(win); };

    const step = (now: number) => {
      if (g.done) return;
      const dt = Math.min(0.05, (now - g.last) / 1000);
      g.last = now;
      const live = g.count <= 0;
      if (live) g.time -= dt; else g.count -= dt;
      const edt = live ? dt : 0;
      g.shake = Math.max(0, g.shake - dt);
      g.sh += wrap(g.target - g.sh) * Math.min(1, dt * 14);
      const el = TIME - g.time;

      g.spawn -= edt;
      if (g.spawn <= 0) {
        g.spawn = Math.max(0.4, 0.85 - el * 0.015);
        const bad = Math.random() < 0.42;
        const col = bad ? p.bad : [p.domain, p.app, p.infra][g.n % 3];
        g.ev.push({ a: Math.random() * 6.283, d: 290, v: (bad ? 95 : 80) + el * 2.4, bad, col, label: bad ? BAD[g.n % BAD.length] : GOOD[g.n % GOOD.length], passed: false });
        g.n++;
      }
      for (const e of g.ev) {
        e.d -= e.v * edt;
        const x = C + Math.cos(e.a) * e.d, y = C + Math.sin(e.a) * e.d;
        if (!e.passed && e.d <= R + 6) {
          if (Math.abs(wrap(e.a - g.sh)) <= ARC) {
            e.dead = true;
            if (e.bad) { g.combo++; burst(x, y, e.col, 16, 160); }
            else { g.combo = 0; burst(x, y, p.muted, 8, 90); }
          } else e.passed = true;
        }
        if (!e.dead && e.d <= 30) {
          e.dead = true;
          if (e.bad) { g.lives--; g.combo = 0; g.shake = 0.4; burst(C, C, e.col, 26, 220); }
          else { g.charge++; burst(C, C, e.col, 14, 150); }
        }
      }
      g.ev = g.ev.filter((e) => !e.dead);
      for (const f of g.fx) { f.x += f.vx * dt; f.y += f.vy * dt; f.life -= dt; }
      g.fx = g.fx.filter((f) => f.life > 0);
      if (g.lives <= 0) return end(false);
      if (g.time <= 0) return end(true);

      draw(ctx, g, p, now, live);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }

  const start = () => { stop(); setPhase('playing'); setRound((r) => r + 1); };

  const pointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = game.current;
    if (!g) return;
    const r = g.cv.getBoundingClientRect();
    g.target = Math.atan2(((e.clientY - r.top) / r.height) * 520 - 260, ((e.clientX - r.left) / r.width) * 520 - 260);
  };
  const key = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const g = game.current;
    if (!g) return;
    if (e.key === 'ArrowLeft') { g.target -= 0.4; e.preventDefault(); }
    if (e.key === 'ArrowRight') { g.target += 0.4; e.preventDefault(); }
  };

  // El modal sale con una animación corta antes de desmontarse.
  const closeModal = () => {
    if (closing) return;
    setClosing(true);
    setTimeout(() => { setModal(false); setClosing(false); }, 180);
  };

  // Esc cierra el modal de descarga.
  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal]);

  const overlay: React.CSSProperties = {
    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24,
    textAlign: 'center', borderRadius: 20, background: 'color-mix(in srgb, var(--bg) 78%, transparent)', backdropFilter: 'blur(3px)',
  };
  const icon = { 'aria-hidden': true, size: 18 } as const;

  return (
    <div style={{ marginTop: 32, padding: 28, border: '1px solid var(--line)', borderRadius: 24, background: 'var(--panel)' }}>
      <h3 style={{ margin: 0, fontSize: 24 }}>Descarga mi CV</h3>

      {phase === 'idle' ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
          <button type="button" className="imm-btn" onClick={start}><Play {...icon} />Jugar (30 s)</button>
          <button type="button" className="imm-btn-ghost" data-event="CVRequested" onClick={() => setModal(true)}><Download {...icon} />Omitir y descargar</button>
        </div>
      ) : (
        <div style={{ marginTop: 18 }}>
          <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
            <canvas
              ref={canvasRef}
              tabIndex={0}
              aria-label="Minijuego: mueve el escudo alrededor del anillo para bloquear los fallos"
              onPointerMove={pointer}
              onPointerDown={pointer}
              onKeyDown={key}
              style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '1 / 1', borderRadius: 20, border: '1px solid var(--line)', touchAction: 'none', cursor: 'crosshair' }}
            />
            {phase === 'won' && (
              <div style={overlay}>
                <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--app)' }}>¡Ganaste!</div>
                <div style={{ fontSize: 17 }}>Sobreviviste los 30 segundos.</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                  <button type="button" className="imm-btn" onClick={() => setModal(true)}><Download {...icon} />Descargar CV</button>
                  <button type="button" className="imm-btn-ghost" onClick={start}><RotateCcw {...icon} />Volver a jugar</button>
                </div>
              </div>
            )}
            {phase === 'lost' && (
              <div style={overlay}>
                <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--bad)' }}>Perdiste</div>
                <div style={{ fontSize: 17 }}>Te colaron 3 fallos.</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                  <button type="button" className="imm-btn" onClick={start}><RotateCcw {...icon} />Volver a jugar</button>
                  <button type="button" className="imm-btn-ghost" onClick={() => setModal(true)}><Download {...icon} />Descargar CV</button>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <button type="button" className="imm-btn-ghost" data-event="CVRequested" onClick={() => setModal(true)}><Download {...icon} />Omitir y descargar</button>
          </div>
        </div>
      )}

      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Elegir idioma del CV"
          onClick={closeModal}
          className={closing ? 'imm-modal-bg imm-out' : 'imm-modal-bg'}
          style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,.6)' }}
        >
          <div onClick={(e) => e.stopPropagation()} className={closing ? 'imm-modal imm-out' : 'imm-modal'} style={{ position: 'relative', width: 'min(420px, 100%)', padding: 28, borderRadius: 24, border: '1px solid var(--line)', background: 'var(--panel)' }}>
            <button type="button" className="imm-icon-btn" aria-label="Cerrar" onClick={closeModal} style={{ position: 'absolute', top: 12, right: 12, width: 40, height: 40 }}><X size={18} aria-hidden="true" /></button>
            <h3 style={{ margin: 0, fontSize: 22 }}>¿En qué idioma?</h3>
            <p style={{ margin: '8px 0 0', color: 'var(--muted)', fontSize: 15 }}>Elige la versión del CV que quieres descargar.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
              <a className="imm-btn" href={cv.es} download="CV-Esteban-Alvarez-ES.pdf" autoFocus onClick={closeModal}><Download {...icon} />Español</a>
              <a className="imm-btn" href={cv.en} download="CV-Esteban-Alvarez-EN.pdf" onClick={closeModal}><Download {...icon} />English</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type Palette = ReturnType<typeof readPalette>;

function draw(ctx: CanvasRenderingContext2D, g: Game, p: Palette, now: number, live: boolean) {
  ctx.save();
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, 520, 520);
  if (g.shake > 0) ctx.translate((Math.random() - 0.5) * g.shake * 24, (Math.random() - 0.5) * g.shake * 24);

  const rings: [number, string][] = [[62, p.domain], [R, p.app], [150, p.infra], [232, p.line]];
  for (const [r, c] of rings) {
    ctx.beginPath(); ctx.arc(C, C, r, 0, 6.283); ctx.strokeStyle = c; ctx.globalAlpha = r === 232 ? 0.5 : 0.28; ctx.lineWidth = 1.5; ctx.stroke();
  }
  ctx.globalAlpha = 1;

  for (const e of g.ev) {
    const x = C + Math.cos(e.a) * e.d, y = C + Math.sin(e.a) * e.d;
    const tx = C + Math.cos(e.a) * (e.d + 34), ty = C + Math.sin(e.a) * (e.d + 34);
    const gr = ctx.createLinearGradient(x, y, tx, ty);
    gr.addColorStop(0, e.col); gr.addColorStop(1, 'transparent');
    ctx.strokeStyle = gr; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.shadowColor = e.col; ctx.shadowBlur = 14; ctx.fillStyle = e.col; ctx.beginPath();
    if (e.bad) { ctx.moveTo(x, y - 10); ctx.lineTo(x + 10, y); ctx.lineTo(x, y + 10); ctx.lineTo(x - 10, y); ctx.closePath(); }
    else ctx.arc(x, y, 8, 0, 6.283);
    ctx.fill(); ctx.shadowBlur = 0;
    if (e.d < 260) { ctx.font = `500 11px ${MONO}`; ctx.textAlign = 'center'; ctx.fillStyle = p.ink; ctx.fillText(e.label, x, y - 16); }
  }
  for (const f of g.fx) { ctx.globalAlpha = Math.max(0, f.life / 0.7); ctx.fillStyle = f.col; ctx.fillRect(f.x - 2, f.y - 2, 4, 4); }
  ctx.globalAlpha = 1;

  ctx.shadowColor = p.ink; ctx.shadowBlur = 18; ctx.strokeStyle = p.ink; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(C, C, R, g.sh - ARC, g.sh + ARC); ctx.stroke(); ctx.shadowBlur = 0;

  const pulse = 1 + Math.sin(now / 220) * 0.06;
  ctx.beginPath(); ctx.arc(C, C, 34, -Math.PI / 2, -Math.PI / 2 + 6.283 * ((TIME - g.time) / TIME)); ctx.strokeStyle = p.domain; ctx.lineWidth = 5; ctx.stroke();
  ctx.shadowColor = p.domain; ctx.shadowBlur = 10 + g.charge * 2; ctx.fillStyle = p.ink; ctx.beginPath(); ctx.arc(C, C, 22 * pulse, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = p.bg; ctx.font = `500 13px ${MONO}`; ctx.textAlign = 'center'; ctx.fillText('EA', C, C + 4);

  for (let i = 0; i < 3; i++) {
    ctx.beginPath(); ctx.arc(26 + i * 20, 28, 6, 0, 6.283);
    if (i < g.lives) { ctx.fillStyle = p.bad; ctx.fill(); } else { ctx.strokeStyle = p.muted; ctx.lineWidth = 1.5; ctx.stroke(); }
  }
  ctx.fillStyle = p.ink; ctx.font = `500 14px ${MONO}`; ctx.textAlign = 'right'; ctx.fillText(g.time.toFixed(1) + ' s', 500, 32);
  ctx.textAlign = 'center'; ctx.fillStyle = p.muted;
  ctx.fillText(g.charge + ' eventos entregados' + (g.combo > 1 ? '  ·  x' + g.combo : ''), C, 506);

  if (!live) {
    ctx.fillStyle = p.bg; ctx.globalAlpha = 0.88; ctx.fillRect(0, 0, 520, 520); ctx.globalAlpha = 1;
    ctx.textAlign = 'center'; ctx.fillStyle = p.ink; ctx.font = `600 26px ${DISPLAY}`;
    ctx.fillText('Defiende el núcleo', C, 80);
    ctx.textAlign = 'left'; ctx.font = `400 16px ${DISPLAY}`;
    ctx.strokeStyle = p.ink; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(70, 140, 16, -0.9, 0.9); ctx.stroke();
    ctx.fillStyle = p.ink; ctx.fillText('Mueve el cursor o el dedo para girar el escudo', 104, 146);
    ctx.fillStyle = p.bad; ctx.beginPath(); ctx.moveTo(70, 186); ctx.lineTo(80, 196); ctx.lineTo(70, 206); ctx.lineTo(60, 196); ctx.closePath(); ctx.fill();
    ctx.fillStyle = p.ink; ctx.fillText('Bloquea los rombos rojos: son fallos', 104, 202);
    ctx.fillStyle = p.app; ctx.beginPath(); ctx.arc(70, 252, 9, 0, 6.283); ctx.fill();
    ctx.fillStyle = p.ink; ctx.fillText('Deja pasar los círculos de color', 104, 258);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = p.bad; ctx.beginPath(); ctx.arc(52 + i * 18, 308, 6, 0, 6.283); ctx.fill(); }
    ctx.fillStyle = p.ink; ctx.fillText('Gana si sobrevives 30 s sin que te cuelen 3 fallos', 104, 314);
    ctx.textAlign = 'center'; ctx.fillStyle = p.muted; ctx.font = `500 14px ${MONO}`;
    ctx.fillText('EMPIEZA EN', C, 388);
    ctx.fillStyle = p.domain; ctx.font = `700 84px ${DISPLAY}`;
    ctx.fillText(String(Math.ceil(g.count)), C, 466);
  }
  ctx.restore();
}
