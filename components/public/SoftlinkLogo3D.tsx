"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

export function SoftlinkLogo3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotX = useSpring(0, { stiffness: 200, damping: 22 });

  const onMove = useCallback(
    (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      rotX.set(ny * -15);
    },
    [rotX]
  );

  const onLeave = useCallback(() => rotX.set(0), [rotX]);

  useEffect(() => {
    const el = containerRef.current;
    el?.addEventListener("mousemove", onMove);
    el?.addEventListener("mouseleave", onLeave);
    return () => {
      el?.removeEventListener("mousemove", onMove);
      el?.removeEventListener("mouseleave", onLeave);
    };
  }, [onMove, onLeave]);

  const LAYERS = 10;

  return (
    <div
      ref={containerRef}
      className="relative flex items-center select-none px-1"
      style={{ perspective: "400px" }}
    >
      <motion.div
        style={{ rotateX: rotX, transformStyle: "preserve-3d" }}
        animate={{ rotateY: [0, 8, 0, -8, 0, 360] }}
        transition={{
          rotateY: {
            duration: 6,
            times: [0, 0.17, 0.37, 0.57, 0.75, 1],
            repeat: Infinity,
            ease: ["easeInOut", "easeInOut", "easeInOut", "easeInOut", "circInOut"],
          },
        }}
      >
        {/* Extrusion depth layers */}
        {Array.from({ length: LAYERS }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center"
            style={{
              transform: `translateZ(${-(i + 1) * 1.5}px)`,
              opacity: Math.max(0.02, 0.18 - i * 0.015),
            }}
            aria-hidden
          >
            <span className="text-xl font-bold tracking-tight whitespace-nowrap">
              <span style={{ color: "#2e28a0" }}>Soft</span>
              <span style={{ color: "#3d36bb" }}>link</span>
            </span>
          </div>
        ))}

        {/* Front face */}
        <div
          className="relative"
          style={{ transform: "translateZ(1px)" }}
        >
          {/* Scanline sweep */}
          <motion.div
            className="absolute inset-y-0 w-8 pointer-events-none z-10"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
              skewX: "-15deg",
              maskImage: "linear-gradient(to bottom, transparent 0%, white 8%, white 92%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, white 8%, white 92%, transparent 100%)",
            }}
            animate={{
              left: ["-5%", "95%"],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeIn",
              opacity: { times: [0, 0.55, 1], ease: "easeIn" },
            }}
          />

          <span className="text-xl font-bold tracking-tight whitespace-nowrap">
            <span
              className="text-foreground"
              style={{ filter: "drop-shadow(0 2px 6px rgba(108,99,255,0.25))" }}
            >
              Soft
            </span>
            <motion.span
              style={{
                background: "linear-gradient(135deg, #6c63ff 0%, #a78bfa 40%, #c4b5fd 60%, #a78bfa 80%, #6c63ff 100%)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 8px rgba(108,99,255,0.9)) drop-shadow(0 0 18px rgba(108,99,255,0.5))",
              }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              link
            </motion.span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
