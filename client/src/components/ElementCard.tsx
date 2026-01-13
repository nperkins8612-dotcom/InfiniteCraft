import { motion } from "framer-motion";
import type { Element } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ElementCardProps {
  element: Element;
  onClick?: () => void;
  className?: string;
}

export function ElementCard({ element, onClick, className }: ElementCardProps) {
  return (
    <motion.div
      layoutId={`element-${element.id}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer select-none",
        "flex items-center gap-3 px-4 py-3 rounded-xl",
        "bg-white border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30",
        "transition-colors duration-200",
        "group relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <span className="text-2xl filter drop-shadow-sm">{element.icon}</span>
      <span className="font-medium text-foreground/90 group-hover:text-primary transition-colors">
        {element.name}
      </span>
    </motion.div>
  );
}
