
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "gold";
  hoverEffect?: boolean;
}

/**
 * Composant de carte avec effet de verre ou doré
 */
const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = "", 
  variant = "glass",
  hoverEffect = false
}) => {
  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all duration-300",
        variant === "glass" && "glass-card",
        variant === "gold" && "gold-card",
        hoverEffect && "hover:scale-105 hover:shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
