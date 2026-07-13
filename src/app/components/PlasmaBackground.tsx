import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

export interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: "forward" | "reverse" | "pingpong";
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0.29, 0.5, 0.65];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;
  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y));
    p.z -= 4.;
    S = p;
    d = p.y-T;
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05);
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T));
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4;
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

export function PlasmaBackground({
  color = "#4A7FA7",
  speed = 0.25,
  direction = "forward",
  scale = 1.2,
  opacity = 0.22,
  mouseInteractive = true,
  className = "",
}: PlasmaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const programRef = useRef<Program | null>(null);
  const propsRef = useRef({ color, speed, direction, scale, opacity, mouseInteractive });
  propsRef.current = { color, speed, direction, scale, opacity, mouseInteractive };

  useEffect(() => {
    const program = programRef.current;
    const node = containerRef.current;
    if (!program) {
      if (node && !node.querySelector("canvas")) {
        node.style.background = `radial-gradient(60% 80% at 30% 20%, ${color}40, transparent 70%), radial-gradient(60% 80% at 80% 80%, ${color}25, transparent 70%)`;
        node.style.opacity = String(opacity);
      }
      return;
    }

    (program.uniforms.uCustomColor.value as Float32Array).set(hexToRgb(color));
    (program.uniforms.uUseCustomColor as { value: number }).value = color ? 1 : 0;
    (program.uniforms.uSpeed as { value: number }).value = speed * 0.4;
    (program.uniforms.uDirection as { value: number }).value = direction === "reverse" ? -1 : 1;
    (program.uniforms.uScale as { value: number }).value = scale;
    (program.uniforms.uOpacity as { value: number }).value = opacity;
  }, [color, speed, direction, scale, opacity]);

  useEffect(() => {
    if (!containerRef.current) return;
    const node = containerRef.current;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      node.style.background = `radial-gradient(60% 80% at 30% 20%, ${color}40, transparent 70%), radial-gradient(60% 80% at 80% 80%, ${color}25, transparent 70%)`;
      node.style.opacity = String(opacity);
      node.dataset.plasmaState = "reduced";
      return;
    }

    const initial = propsRef.current;
    const useCustomColor = initial.color ? 1.0 : 0.0;
    const customColorRgb = initial.color ? hexToRgb(initial.color) : [1, 1, 1];
    const directionMultiplier = initial.direction === "reverse" ? -1.0 : 1.0;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1.25),
    });

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    node.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: initial.speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: initial.scale },
        uOpacity: { value: initial.opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: 0.0 },
      },
    });
    programRef.current = program;
    node.style.background = "none";
    node.style.opacity = "1";

    const mesh = new Mesh(gl, { geometry, program });
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const handleMouseMove = (e: MouseEvent) => {
      if (!propsRef.current.mouseInteractive || mobileQuery.matches) return;
      const rect = node.getBoundingClientRect();
      const m = program.uniforms.uMouse.value as Float32Array;
      m[0] = e.clientX - rect.left;
      m[1] = e.clientY - rect.top;
    };
    let mouseListening = false;
    const syncMouseInteraction = () => {
      const enabled = propsRef.current.mouseInteractive && !mobileQuery.matches;
      (program.uniforms.uMouseInteractive as { value: number }).value = enabled ? 1 : 0;
      if (enabled && !mouseListening) {
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        mouseListening = true;
      } else if (!enabled && mouseListening) {
        window.removeEventListener("mousemove", handleMouseMove);
        mouseListening = false;
      }
    };
    mobileQuery.addEventListener("change", syncMouseInteraction);
    syncMouseInteraction();

    const setSize = () => {
      const rect = node.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(node);
    setSize();

    let raf = 0;
    let elapsed = 0;
    let lastFrame = performance.now();
    let inViewport = true;
    const loop = (t: number) => {
      elapsed += Math.min(0.1, Math.max(0, (t - lastFrame) * 0.001));
      lastFrame = t;
      let timeValue = elapsed;
      if (propsRef.current.direction === "pingpong") {
        const dur = 10;
        const seg = timeValue % (dur * 2);
        timeValue = seg > dur ? dur * 2 - seg : seg;
      }
      (program.uniforms.iTime as { value: number }).value = timeValue;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      node.dataset.plasmaState = "paused";
    };
    const start = () => {
      if (raf || !inViewport || document.hidden) return;
      lastFrame = performance.now();
      node.dataset.plasmaState = "running";
      raf = requestAnimationFrame(loop);
    };
    const syncPlayback = () => {
      if (inViewport && !document.hidden) start();
      else stop();
    };

    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        syncPlayback();
      },
      { rootMargin: "120px 0px" },
    );
    viewportObserver.observe(node);
    document.addEventListener("visibilitychange", syncPlayback);
    start();

    return () => {
      stop();
      ro.disconnect();
      viewportObserver.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      mobileQuery.removeEventListener("change", syncMouseInteraction);
      if (mouseListening) window.removeEventListener("mousemove", handleMouseMove);
      programRef.current = null;
      if (canvas.parentNode === node) node.removeChild(canvas);
      delete node.dataset.plasmaState;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}

export default PlasmaBackground;
