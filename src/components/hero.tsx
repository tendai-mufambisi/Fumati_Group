import { useRef, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, Building2, CalendarDays } from "lucide-react";
import { Img } from "@/components/site";

/** Signature hero: a roof truss draws itself, photo fades up, cursor throws welding sparks. */
export function HomeHero() {
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef(0);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    const now = performance.now();
    if (!el || now - last.current < 35 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    last.current = now;
    const r = el.getBoundingClientRect();
    for (let i = 0; i < 2; i++) {
      const s = document.createElement("span");
      s.className = "spark";
      s.style.left = `${e.clientX - r.left}px`;
      s.style.top = `${e.clientY - r.top}px`;
      s.style.setProperty("--dx", `${(Math.random() - 0.5) * 60}px`);
      s.style.setProperty("--dy", `${Math.random() * 50 + 10}px`);
      el.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
  };

  const truss = "M0 300 L1200 300 M0 300 L600 60 L1200 300 M100 300 L100 260 M200 300 L200 220 M300 300 L300 180 M400 300 L400 140 M500 300 L500 100 M600 300 L600 60 M700 300 L700 100 M800 300 L800 140 M900 300 L900 180 M1000 300 L1000 220 M1100 300 L1100 260 M100 260 L200 300 M200 220 L300 300 M300 180 L400 300 M400 140 L500 300 M500 100 L600 300 M700 100 L600 300 M800 140 L700 300 M900 180 L800 300 M1000 220 L900 300 M1100 260 L1000 300";

  return (
    <section ref={ref} onMouseMove={onMove} className="relative min-h-[100svh] overflow-hidden bg-green-900 clip-cut">
      <div className="absolute inset-0 fade-in-up" style={{ animationDelay: "1.4s", animationDuration: "1.2s" }}>
        <Img name="The_Heart_Stadium.jpg" alt="The Heart Stadium steel structure by Fumati Engineers" eager className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="absolute inset-0 blueprint opacity-70" />
      <svg viewBox="0 0 1200 320" className="pointer-events-none absolute inset-x-0 top-[18%] w-full text-primary-foreground/25" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <path d={truss} pathLength={1} fill="none" stroke="currentColor" strokeWidth="1.5" className="truss-line" />
      </svg>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-32 pt-36 sm:pb-40">
        <p className="eyebrow flex items-center gap-3 text-primary-foreground/85 fade-in-up" style={{ animationDelay: ".3s" }}>
          <span className="h-px w-10 bg-red-600" /> Zimbabwe's Multi-Award-Winning Engineering Company
        </p>
        <h1 className="mt-6 font-display text-[15vw] font-extrabold uppercase leading-[0.88] tracking-tighter text-primary-foreground sm:text-[9rem] lg:text-[11rem]">
          <span className="block fade-in-up" style={{ animationDelay: ".5s" }}>Turning <span className="text-red-600">Steel</span></span>
          <span className="block fade-in-up" style={{ animationDelay: ".7s" }}>Into <span className="text-red-600">Gold.</span></span>
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="max-w-xl text-lg text-primary-foreground/80 fade-in-up" style={{ animationDelay: ".9s" }}>
            Structural, mechanical and steel fabrication specialists delivering landmark infrastructure across Zimbabwe, from stadiums and bridges to mining equipment and custom gates.
          </p>
          <div className="flex flex-wrap gap-3 fade-in-up" style={{ animationDelay: "1.1s" }}>
            <Link to="/projects" className="btn btn-red">View Our Projects <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/contact" className="btn btn-outline-white">Get a Free Quote</Link>
          </div>
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-primary-foreground/15 pt-6 text-sm text-primary-foreground/80 fade-in-up" style={{ animationDelay: "1.3s" }}>
          <li className="flex items-center gap-2"><Award className="h-4 w-4 text-red-600" />Engineering Company of the Year</li>
          <li className="flex items-center gap-2"><Building2 className="h-4 w-4 text-red-600" />120+ Projects</li>
          <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-red-600" />Since 2008</li>
        </ul>
      </div>
    </section>
  );
}
