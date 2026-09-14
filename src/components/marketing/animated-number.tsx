"use client";

import { useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { motion } from "@/components/marketing/motion";

/**
 * Counts from 0 to `value` once the element enters the viewport. Spring-
 * driven (not a duration tween) so the count settles with a natural
 * deceleration rather than a linear tick. Reused wherever the landing page
 * states a real, verifiable product number — never for fabricated traction
 * or usage metrics.
 */
export function AnimatedNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { mass: 0.9, stiffness: 90, damping: 20 });
  const display = useTransform(spring, (latest) =>
    Math.round(latest).toLocaleString("en-US"),
  );

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return (
    <motion.span className={className} ref={ref}>
      {display}
    </motion.span>
  );
}
