import { useGameEngine } from "@/hooks/use-game-engine";
import { Sidebar } from "@/components/Sidebar";
import { GameCanvas } from "@/components/GameCanvas";
import { motion } from "framer-motion";

export default function Home() {
  const {
    elements,
    tiles,
    canvasRef,
    spawnTile,
    moveTile,
    removeTile,
    clearCanvas,
    checkCombination,
    isLoaded
  } = useGameEngine();

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-muted-foreground">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background font-sans text-foreground">
      {/* Left Sidebar */}
      <div className="w-72 md:w-80 h-full flex-shrink-0 z-20 shadow-xl shadow-black/5">
        <Sidebar 
          elements={elements} 
          onSpawnElement={spawnTile} 
        />
      </div>

      {/* Main Canvas Area */}
      <main className="flex-1 h-full relative p-4 md:p-6 bg-muted/10">
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
            <h1 className="text-2xl md:text-3xl font-display font-extrabold bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent drop-shadow-sm">
                Infinite Craft
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">
                Drag elements to combine them
            </p>
        </div>
        
        <GameCanvas
          tiles={tiles}
          elements={elements}
          onMoveTile={moveTile}
          onCheckCombination={checkCombination}
          onRemoveTile={removeTile}
          onClearCanvas={clearCanvas}
          canvasRef={canvasRef}
        />
      </main>
    </div>
  );
}
