"use client";

import { useEffect, useRef, useState } from "react";

export type Journey = "outside" | "crossing" | "inside";
type SceneControls = { enter: () => void; reset: () => void; setPaused: (paused: boolean) => void; setActive: (active: boolean) => void; dispose: () => void };

/** The renderer is loaded only inside the existing Casa da Mileide tab. */
export default function PortalScene({ journey, paused, active, onReady, onArrive }: {
  journey: Journey; paused: boolean; active: boolean;
  onReady: () => void; onArrive: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<SceneControls | null>(null);
  const callbacks = useRef({ onReady, onArrive });
  const [fallback, setFallback] = useState(false);

  useEffect(() => { callbacks.current = { onReady, onArrive }; }, [onReady, onArrive]);

  useEffect(() => {
    let disposed = false;
    let instance: SceneControls | null = null;
    const fail = () => {
      if (disposed) return;
      instance?.dispose();
      instance = null;
      controls.current = null;
      setFallback(true);
      callbacks.current.onReady();
      callbacks.current.onArrive();
    };
    import("./portal-engine").then(({ createPortalScene }) => {
      if (disposed || !host.current) return;
      instance = createPortalScene(host.current, () => callbacks.current.onArrive(), fail);
      controls.current = instance;
      callbacks.current.onReady();
    }).catch(fail);
    return () => { disposed = true; instance?.dispose(); controls.current = null; };
  }, []);

  useEffect(() => {
    if (journey === "crossing") {
      if (!fallback) { controls.current?.enter(); return; }
      const timer = window.setTimeout(() => callbacks.current.onArrive(), 650);
      return () => window.clearTimeout(timer);
    }
    if (journey === "outside") controls.current?.reset();
  }, [journey, fallback]);

  useEffect(() => { controls.current?.setPaused(paused); }, [paused]);
  useEffect(() => { controls.current?.setActive(active); }, [active]);

  return <div className={`mileide-world${fallback ? " mileide-world--fallback" : ""}`} aria-hidden="true">
    <div className="mileide-webgl" ref={host}/>
    <div className="mileide-fallback-room">
      <div className="mileide-fallback-arch"><i/><i/></div>
      <div className="mileide-fallback-table"><span className="mileide-fallback-orb"/><i/><i/></div>
    </div>
    <div className="mileide-world-vignette"/>
    <div className="mileide-crossing-light"/>
  </div>;
}
