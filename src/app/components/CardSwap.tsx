import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={`absolute top-1/2 left-1/2 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-[0_28px_80px_-32px_rgba(10,25,49,0.55)] [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
    />
  ),
);
Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

export function CardSwap({
  width = 420,
  height = 300,
  cardDistance = 36,
  verticalDistance = 32,
  delay = 4500,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 3,
  easing = "elastic",
  children,
}: CardSwapProps) {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.35,0.8)",
          durDrop: 1.15,
          durMove: 1.15,
          durReturn: 1.15,
          promoteOverlap: 0.7,
          returnDelay: 0.1,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(
    () => Children.toArray(children) as ReactElement<CardProps>[],
    [children],
  );
  const refs = useMemo<CardRef[]>(
    () => childArr.map(() => ({ current: null }) as CardRef),
    [childArr.length],
  );
  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    const node = container.current;
    refs.forEach((r, i) => {
      if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
    });

    // Respeita redução de movimento: mantém os cards estáticos, sem animação.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      if (node) node.dataset.cardSwapState = "reduced";
      return;
    }

    const swap = () => {
      if (order.current.length < 2) return;
      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;

      tlRef.current?.kill();
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, { y: "+=500", duration: config.durDrop, ease: config.ease });
      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease },
          `promote+=${i * 0.15}`,
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, "return");
      tl.to(
        elFront,
        { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease },
        "return",
      );
      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    let inViewport = false;
    let hovered = false;

    const pause = () => {
      tlRef.current?.pause();
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
      if (node) node.dataset.cardSwapState = "paused";
    };
    const resume = () => {
      tlRef.current?.play();
      if (!intervalRef.current) intervalRef.current = window.setInterval(swap, delay);
      if (node) node.dataset.cardSwapState = "running";
    };
    const syncPlayback = () => {
      if (inViewport && !document.hidden && !hovered) resume();
      else pause();
    };

    const viewportObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        syncPlayback();
      },
      { rootMargin: "100px 0px" },
    );
    if (node) viewportObserver.observe(node);
    document.addEventListener("visibilitychange", syncPlayback);

    const onMouseEnter = () => {
      hovered = true;
      syncPlayback();
    };
    const onMouseLeave = () => {
      hovered = false;
      syncPlayback();
    };
    if (pauseOnHover && node) {
      node.addEventListener("mouseenter", onMouseEnter);
      node.addEventListener("mouseleave", onMouseLeave);
    }

    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      viewportObserver.disconnect();
      if (pauseOnHover && node) {
        node.removeEventListener("mouseenter", onMouseEnter);
        node.removeEventListener("mouseleave", onMouseLeave);
      }
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
      tlRef.current?.kill();
      if (node) delete node.dataset.cardSwapState;
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child,
  );

  return (
    <div
      ref={container}
      className="relative [perspective:1200px] transform-gpu"
      style={{ width, height }}
    >
      <div className="absolute inset-0 [transform-style:preserve-3d]">{rendered}</div>
    </div>
  );
}

export default CardSwap;
