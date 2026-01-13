import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameEngine } from "@/hooks/use-game-engine";
import { Trash2, Eraser } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Element, Tile } from "@shared/schema";

interface GameCanvasProps {
  tiles: Tile[];
  elements: Element[];
  onMoveTile: (id: string, x: number, y: number) => void;
  onCheckCombination: (source: Tile, target: Tile) => void;
  onRemoveTile: (id: string) => void;
  onClearCanvas: () => void;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export function GameCanvas({
  tiles,
  elements,
  onMoveTile,
  onCheckCombination,
  onRemoveTile,
  onClearCanvas,
  canvasRef,
}: GameCanvasProps) {
  // We need a ref to track drag targets
  const trashRef = useRef<HTMLDivElement>(null);

  const getElement = (id: string) => elements.find((e) => e.id === id);

  return (
    <div 
      ref={canvasRef}
      className="relative w-full h-full overflow-hidden bg-muted/30 canvas-pattern rounded-3xl border border-border/50 shadow-inner"
    >
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={onClearCanvas}
          className="p-3 rounded-full bg-white/90 shadow-sm border border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all active:scale-95"
          title="Clear Canvas"
        >
          <Eraser className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {tiles.map((tile) => {
          const el = getElement(tile.elementId);
          if (!el) return null;

          return (
            <DraggableTile
              key={tile.instanceId}
              tile={tile}
              element={el}
              tiles={tiles}
              onMove={onMoveTile}
              onCombine={onCheckCombination}
              onDelete={onRemoveTile}
              trashRef={trashRef}
            />
          );
        })}
      </AnimatePresence>

      {/* Trash Zone */}
      <div
        ref={trashRef}
        className={cn(
          "absolute bottom-6 right-6 p-4 rounded-2xl",
          "border-2 border-dashed border-border/60 bg-white/50 backdrop-blur-sm",
          "transition-colors duration-200 z-0",
          "group hover:border-destructive/50 hover:bg-destructive/5"
        )}
      >
        <Trash2 className="w-8 h-8 text-muted-foreground group-hover:text-destructive transition-colors" />
      </div>
    </div>
  );
}

interface DraggableTileProps {
  tile: Tile;
  element: Element;
  tiles: Tile[];
  onMove: (id: string, x: number, y: number) => void;
  onCombine: (source: Tile, target: Tile) => void;
  onDelete: (id: string) => void;
  trashRef: React.RefObject<HTMLDivElement>;
}

function DraggableTile({
  tile,
  element,
  tiles,
  onMove,
  onCombine,
  onDelete,
  trashRef,
}: DraggableTileProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ x: tile.x, y: tile.y, scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      whileDrag={{ scale: 1.1, zIndex: 50, cursor: "grabbing" }}
      whileHover={{ scale: 1.05, zIndex: 40, cursor: "grab" }}
      onDragEnd={(e, info) => {
        const dropRect = (e.target as HTMLElement).getBoundingClientRect();
        const centerX = dropRect.left + dropRect.width / 2;
        const centerY = dropRect.top + dropRect.height / 2;

        // Check for trash collision
        if (trashRef.current) {
          const trashRect = trashRef.current.getBoundingClientRect();
          if (
            centerX >= trashRect.left &&
            centerX <= trashRect.right &&
            centerY >= trashRect.top &&
            centerY <= trashRect.bottom
          ) {
            onDelete(tile.instanceId);
            return;
          }
        }

        // Check for tile collision (Combination)
        // Simple radius check against all other tiles
        const hitTile = tiles.find((t) => {
            if (t.instanceId === tile.instanceId) return false;
            // Approximate hit detection since we don't have exact DOM rects for other tiles easily inside React loop
            // Use the stored x/y coordinates. Assuming tile size is roughly 100x50
            const dx = Math.abs(t.x - tile.x - info.offset.x); 
            const dy = Math.abs(t.y - tile.y - info.offset.y);
            return dx < 50 && dy < 30; // Hitbox radius
        });

        if (hitTile) {
            onCombine(tile, hitTile);
        } else {
            // Just move
            // We need to calculate new relative position based on parent container
            // This is a bit tricky with framer motion drag, 
            // usually better to rely on parent constraints or specialized dnd library
            // For this simpler version, we just add the delta
            onMove(tile.instanceId, tile.x + info.offset.x, tile.y + info.offset.y);
        }
      }}
      className={cn(
        "absolute top-0 left-0", // Positioned absolutely, controlled by motion x/y
        "flex items-center gap-2 px-4 py-2 pr-5 rounded-lg",
        "bg-white border border-border shadow-lg tile-shadow select-none",
        "font-display font-bold text-sm tracking-wide text-foreground",
        "hover:border-primary/50 hover:shadow-xl transition-colors"
      )}
      style={{ touchAction: "none" }} // Prevent scrolling on mobile while dragging
    >
      <span className="text-xl leading-none">{element.icon}</span>
      <span>{element.name}</span>
    </motion.div>
  );
}
