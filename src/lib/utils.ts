
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type GradientDirection = 
  | "to-top" 
  | "to-bottom" 
  | "to-left" 
  | "to-right"
  | "to-tr"
  | "to-tl"
  | "to-br"
  | "to-bl";

type GradientStrength = "light" | "medium" | "strong" | "extra-strong";

/**
 * Creates a gradient overlay for elements
 */
function overlayGradient(direction: GradientDirection = "to-bottom", strength: GradientStrength = "medium") {
  const strengthValues = {
    light: "from-black/10 via-black/20 to-black/40",
    medium: "from-black/20 via-black/40 to-black/60",
    strong: "from-black/40 via-black/60 to-black/80",
    "extra-strong": "from-black/60 via-black/80 to-black/90",
  };

  return `absolute inset-0 bg-gradient-${direction} ${strengthValues[strength]}`;
}

/**
 * Enhances text visibility against backgrounds
 */
function enhanceTextVisibility(strength: "light" | "medium" | "strong" = "medium") {
  const styles = {
    light: "drop-shadow-sm",
    medium: "drop-shadow-md",
    strong: "drop-shadow-lg",
  };
  
  return styles[strength];
}

/**
 * Styles for floating UI elements with different z-index priorities
 */
function floatingElement(type: "button" | "badge" | "card" | "text", priority: "low" | "medium" | "high" = "medium") {
  const baseStyles = {
    button: "backdrop-blur-sm shadow-sm",
    badge: "backdrop-blur-sm",
    card: "backdrop-blur-md shadow-md",
    text: "",
  };
  
  const priorityStyles = {
    low: "z-10",
    medium: "z-20",
    high: "z-30",
  };
  
  return `${baseStyles[type]} ${priorityStyles[priority]}`;
}

export { cn, overlayGradient, enhanceTextVisibility, floatingElement };
