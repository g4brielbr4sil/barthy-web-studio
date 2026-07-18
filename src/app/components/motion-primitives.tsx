import type { ReactNode } from "react";
import {
  motion,
  useDragControls,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import { useMediaQuery } from "../lib/useMediaQuery";

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

const groupVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

export function MotionGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduceMotion ? undefined : groupVariants}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.14 }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduceMotion ? undefined : revealItemVariants}
    >
      {children}
    </motion.div>
  );
}

const INTERACTIVE_SELECTOR = [
  "button",
  "a",
  "input",
  "select",
  "textarea",
  "summary",
  "[role='button']",
  "[role='link']",
  "[role='checkbox']",
  "[role='switch']",
  "[tabindex]:not([tabindex='-1'])",
  "[data-no-drag]",
].join(",");

export function TactileCard({
  children,
  className = "",
  ...rest
}: Omit<
  HTMLMotionProps<"article">,
  | "children"
  | "drag"
  | "dragConstraints"
  | "dragControls"
  | "dragElastic"
  | "dragListener"
  | "dragMomentum"
  | "dragTransition"
  | "variants"
  | "whileDrag"
> & { children: ReactNode }) {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduceMotion = useReducedMotion();
  const dragControls = useDragControls();
  const dragEnabled = finePointer && !reduceMotion;

  return (
    <motion.article
      {...rest}
      className={className}
      style={{ ...rest.style, cursor: dragEnabled ? "grab" : undefined }}
      data-drag-enabled={dragEnabled ? "true" : "false"}
      variants={reduceMotion ? undefined : revealItemVariants}
      drag={dragEnabled}
      dragListener={false}
      dragControls={dragControls}
      dragElastic={0.12}
      dragMomentum={false}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragTransition={{ bounceStiffness: 350, bounceDamping: 22 }}
      whileDrag={dragEnabled ? { scale: 1.02, zIndex: 2 } : undefined}
      onPointerDown={(event) => {
        rest.onPointerDown?.(event);
        if (!dragEnabled || event.defaultPrevented) return;

        const target = event.target;
        if (target instanceof Element && target.closest(INTERACTIVE_SELECTOR)) return;

        dragControls.start(event);
      }}
    >
      {children}
    </motion.article>
  );
}
