"use client"

import type { ElementType, ReactNode } from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

// Single, project-wide easing so every reveal shares the same feel.
const EASE = [0.16, 1, 0.3, 1] as const

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

type RevealProps = {
  children: ReactNode
  className?: string
  /** Vertical travel in px before settling. */
  y?: number
  /** Seconds of delay before the reveal starts. */
  delay?: number
  /** Render as a different element (e.g. "section", "li", "span"). */
  as?: ElementType
}

/**
 * Fades + lifts a single block into view once it enters the viewport.
 * Collapses to a static, fully-visible element under reduced-motion.
 */
export function Reveal({ children, className, y = 24, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion(as as ElementType)

  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}

type GroupProps = {
  children: ReactNode
  className?: string
  as?: ElementType
}

/**
 * Stagger parent. Direct <RevealChild> descendants animate in sequence as the
 * group enters the viewport. Put the grid/flex classes here.
 */
export function RevealGroup({ children, className, as = "div" }: GroupProps) {
  const reduce = useReducedMotion()
  const Comp = motion(as as ElementType)

  return (
    <Comp
      className={className}
      variants={containerVariants}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </Comp>
  )
}

/** One staggered child inside a <RevealGroup>. */
export function RevealChild({ children, className, as = "div" }: GroupProps) {
  const Comp = motion(as as ElementType)
  return (
    <Comp className={className} variants={itemVariants}>
      {children}
    </Comp>
  )
}
