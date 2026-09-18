import { useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import type { Hotspot } from "./types";
import "./Lightbox.css";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  hotspots?: Hotspot[];
  title?: string;
}

export function Lightbox({ isOpen, onClose, imageSrc, hotspots = [], title }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [scale, setScale] = useState(1);
  const [selected, setSelected] = useState(0);
  const [natural, setNatural] = useState({ width: 1440, height: 1800 });
  const [available, setAvailable] = useState({ width: 800, height: 700 });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const trigger = document.activeElement as HTMLElement | null;
    const oldOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setScale(1);
    setSelected(0);
    setFailed(false);
    dialog?.showModal();
    const observer = new ResizeObserver(([entry]) => setAvailable({
      width: entry.contentRect.width, height: entry.contentRect.height,
    }));
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => {
      observer.disconnect();
      dialog?.close();
      document.documentElement.style.overflow = oldOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;
  const active = hotspots[selected];
  const fitted = Math.max(100, Math.min(available.width - 32, (available.height - 32) * natural.width / natural.height));
  return (
    <dialog ref={dialogRef} className="cs-viewer" aria-label={`${title || "Prototype"} — annotated screenshot`}
      onKeyDown={event => {
        if (event.key !== "Tab") return;
        const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex="0"]',
        )).filter(element => element.getClientRects().length > 0);
        if (!elements.length) { event.preventDefault(); return; }
        const index = elements.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        const next = index < 0 ? (event.shiftKey ? elements.length - 1 : 0)
          : (index + (event.shiftKey ? -1 : 1) + elements.length) % elements.length;
        elements[next].focus();
      }}
      onCancel={event => { event.preventDefault(); closeRef.current(); }}>
      <header className="cs-viewer-toolbar">
        <div><strong>{title || "Prototype screenshot"}</strong><small>Available renderer capture · original labels preserved</small></div>
        <div className="cs-viewer-controls">
          <button type="button" aria-label="Zoom out" disabled={scale <= 1} onClick={() => setScale(s => Math.max(1, s - .5))}><ZoomOut size={19} /></button>
          <output aria-live="polite">{Math.round(scale * 100)}%</output>
          <button type="button" aria-label="Zoom in" disabled={scale >= 4} onClick={() => setScale(s => Math.min(4, s + .5))}><ZoomIn size={19} /></button>
          <button type="button" aria-label="Close screenshot viewer" autoFocus onClick={() => closeRef.current()}><X size={22} /></button>
        </div>
      </header>
      <div className="cs-viewer-body">
        <div className="cs-viewer-viewport" ref={viewportRef} tabIndex={0} aria-label="Screenshot; scroll to pan when zoomed">
          <div className="cs-viewer-canvas">
            <div className="cs-viewer-image" style={{ width: fitted * scale }}>
              {failed ? <p role="alert">This screenshot could not be loaded.</p> : (
                <img src={imageSrc} alt={`${title || "Prototype"}: original dashboard capture`}
                  onError={() => setFailed(true)}
                  onLoad={event => setNatural({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} />
              )}
              {!failed && active?.region && <div className="cs-viewer-region" data-type={active.type} aria-hidden="true" style={{
                left: `${active.region.left}%`, top: `${active.region.top}%`,
                width: `${active.region.width}%`, height: `${active.region.height}%`,
              }} />}
              {!failed && hotspots.map((point, index) => (
                <button key={point.id} type="button" className="cs-viewer-marker" data-type={point.type}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }} aria-pressed={index === selected}
                  aria-label={`Annotation ${index + 1}: ${point.title}`} onClick={() => setSelected(index)}>
                  {String(index + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </div>
        {hotspots.length > 0 && <aside className="cs-viewer-notes">
          <p className="cs-viewer-help">Choose a marker to highlight its region. Zoom in, then scroll to inspect the original.</p>
          <div className="cs-viewer-list" aria-label="Screenshot annotations">
            {hotspots.map((point, index) => (
              <button key={point.id} type="button" onClick={() => setSelected(index)} aria-pressed={index === selected}>
                <span data-type={point.type}>{String(index + 1).padStart(2, "0")} · {point.type}</span>
                <strong>{point.title}</strong>
              </button>
            ))}
          </div>
          {active && <article className="cs-viewer-explanation" aria-live="polite">
            <span data-type={active.type}>{active.type}</span>
            <h3>{active.title}</h3><p>{active.content}</p>
            <small>{title}</small>
          </article>}
        </aside>}
      </div>
    </dialog>
  );
}