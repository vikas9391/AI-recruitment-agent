import { useRef } from "react";
import Spline, { type Application } from "@splinetool/react-spline";
import { motion } from "framer-motion";

const SPLINE_SCENE_URL = "https://prod.spline.design/ocaSjLGU3WXd-VOj/scene.splinecode";

// How much to zoom the canvas in before cropping — higher = more aggressive crop,
// cutting more of the surrounding bars/arrow/watermark, but also crops closer to the cubes.
const ZOOM = 1.45;

export function HeroAnimation({ sceneUrl = SPLINE_SCENE_URL }: { sceneUrl?: string }) {
  const splineRef = useRef<Application | null>(null);

  function handleLoad(spline: Application) {
    splineRef.current = spline;
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const app = splineRef.current;
    if (!app) return;
    const cube = app.findObjectByName("Cube Clones");
    if (!cube) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cube.rotation.y = x * 0.6;
    cube.rotation.x = y * 0.6;
  }

  return (
    <div className="relative w-full lg:w-[47%] flex items-center justify-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(closest-side, rgba(101,184,255,0.35), rgba(179,139,255,0.28) 45%, rgba(179,139,255,0) 72%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        onMouseMove={handleMouseMove}
        animate={{ y: [0, -14, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="relative w-full max-w-[560px] aspect-square rounded-xl2 overflow-hidden bg-transparent"
      >
        {sceneUrl ? (
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: `${ZOOM * 100}%`,
                height: `${ZOOM * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Spline
                scene={sceneUrl}
                onLoad={handleLoad}
                style={{ width: "100%", height: "100%", background: "transparent" }}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-center px-6">
            <p className="text-xs text-ink-secondary/60">
              Add your Spline scene URL to <code className="text-ink-secondary/80">SPLINE_SCENE_URL</code>{" "}
              in HeroAnimation.tsx
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}