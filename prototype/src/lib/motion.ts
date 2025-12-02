// Motion variants for Framer Motion animations based on design system tokens

export const motionTokens = {
  duration: {
    xxfast: 0.08,
    xfast: 0.12,
    fast: 0.15,
    base: 0.2,
    slow: 0.3,
    xslow: 0.45,
  },
  easing: {
    standard: [0.2, 0, 0, 1] as const,
    entrance: [0, 0, 0, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
    bounce: [0.34, 1.56, 0.64, 1] as const,
    decel: [0, 0, 0.2, 1] as const,
    accel: [0.4, 0, 1, 1] as const,
  },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: motionTokens.duration.base,
    ease: motionTokens.easing.standard,
  },
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: motionTokens.duration.base,
    ease: motionTokens.easing.entrance,
  },
}

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: {
    duration: motionTokens.duration.base,
    ease: motionTokens.easing.entrance,
  },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: {
    duration: motionTokens.duration.fast,
    ease: motionTokens.easing.standard,
  },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerChild = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.easing.standard,
    },
  },
}

export const cardHover = {
  whileHover: {
    y: -4,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.standard,
    },
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: motionTokens.duration.xxfast,
      ease: motionTokens.easing.standard,
    },
  },
}

export const buttonPress = {
  whileHover: {
    scale: 1.02,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.standard,
    },
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: motionTokens.duration.xxfast,
      ease: motionTokens.easing.standard,
    },
  },
}

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.easing.standard,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.easing.exit,
    },
  },
}

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.easing.entrance,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: motionTokens.duration.base,
      ease: motionTokens.easing.exit,
    },
  },
}