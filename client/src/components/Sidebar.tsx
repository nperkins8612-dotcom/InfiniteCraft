import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ElementCard } from "./ElementCard";
import type { Element } from "@shared/schema";
import { motion } from "framer-motion";

interface SidebarProps {
  elements: Element[];
  onSpawnElement: (id: string) => void;
}

export function Sidebar({ elements, onSpawnElement }: SidebarProps) {
  const [query, setQuery] = useState("");

  const filteredElements = useMemo(() => {
    return elements
      .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [elements, query]);

  return (
    <div className="h-full flex flex-col bg-muted/20 border-r border-border backdrop-blur-xl">
      <div className="p-4 border-b border-border/50 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search elements..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-border/60 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/70"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {filteredElements.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-sm">No elements found.</p>
            <p className="text-xs mt-1">Try combining some basic elements!</p>
          </div>
        ) : (
          filteredElements.map((element) => (
            <ElementCard
              key={element.id}
              element={element}
              onClick={() => onSpawnElement(element.id)}
            />
          ))
        )}
      </div>
      
      <div className="p-3 border-t border-border/50 bg-white/50 text-xs text-center text-muted-foreground">
        {elements.length} elements discovered
      </div>
    </div>
  );
}
