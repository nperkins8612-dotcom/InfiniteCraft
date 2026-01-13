import { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { api } from "@shared/routes"; // Imported but logic is mostly local
import type { Element, Tile, CombinationDictionary } from "@shared/schema";

// --- INITIAL DATA ---
const INITIAL_ELEMENTS: Element[] = [
  { id: "water", name: "Water", icon: "💧" },
  { id: "fire", name: "Fire", icon: "🔥" },
  { id: "earth", name: "Earth", icon: "🌍" },
  { id: "air", name: "Air", icon: "💨" },
];

const INITIAL_COMBINATIONS: CombinationDictionary = {
  "fire|water": "steam",
  "earth|water": "mud",
  "earth|fire": "lava",
  "air|fire": "smoke",
  "air|earth": "dust",
  "earth|plant": "tree",
  "plant|water": "algae",
  "ash|plant": "ash",
  "earth|seed": "plant", // Helper to get plant
  "dust|water": "mud",   // Alternate path
};

// Initial "Steam" element isn't in INITIAL_ELEMENTS to demonstrate discovery,
// but for a smooth start, we rely on the engine to create it if it doesn't exist 
// when the combo happens, OR we can pre-populate the 'dictionary' of result definitions.
// For this engine, we will dynamically generate the result element if missing.

const STORAGE_KEYS = {
  ELEMENTS: "infinite-craft-elements",
  COMBINATIONS: "infinite-craft-combinations",
  TILES: "infinite-craft-tiles",
};

export function useGameEngine() {
  const [elements, setElements] = useState<Element[]>(INITIAL_ELEMENTS);
  const [combinations, setCombinations] = useState<CombinationDictionary>(INITIAL_COMBINATIONS);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    // Load from local storage on mount
    const savedElements = localStorage.getItem(STORAGE_KEYS.ELEMENTS);
    const savedCombinations = localStorage.getItem(STORAGE_KEYS.COMBINATIONS);
    const savedTiles = localStorage.getItem(STORAGE_KEYS.TILES);

    if (savedElements) {
      // Merge initial elements with saved to ensure base ones always exist
      const parsed = JSON.parse(savedElements);
      const uniqueElements = [...INITIAL_ELEMENTS];
      parsed.forEach((p: Element) => {
        if (!uniqueElements.find((e) => e.id === p.id)) {
          uniqueElements.push(p);
        }
      });
      setElements(uniqueElements);
    }

    if (savedCombinations) setCombinations({ ...INITIAL_COMBINATIONS, ...JSON.parse(savedCombinations) });
    if (savedTiles) setTiles(JSON.parse(savedTiles));
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.ELEMENTS, JSON.stringify(elements));
  }, [elements, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.COMBINATIONS, JSON.stringify(combinations));
  }, [combinations, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.TILES, JSON.stringify(tiles));
  }, [tiles, isLoaded]);


  // --- ACTIONS ---

  const spawnTile = useCallback((elementId: string, position?: { x: number; y: number }) => {
    if (!canvasRef.current) return;
    
    // Random position if not provided, but within visible bounds
    const bounds = canvasRef.current.getBoundingClientRect();
    const x = position?.x ?? (Math.random() * (bounds.width - 100) + 50);
    const y = position?.y ?? (Math.random() * (bounds.height - 100) + 50);

    const newTile: Tile = {
      instanceId: uuidv4(),
      elementId,
      x, 
      y
    };
    setTiles((prev) => [...prev, newTile]);
  }, []);

  const moveTile = useCallback((instanceId: string, x: number, y: number) => {
    setTiles((prev) => 
      prev.map(t => t.instanceId === instanceId ? { ...t, x, y } : t)
    );
  }, []);

  const removeTile = useCallback((instanceId: string) => {
    setTiles((prev) => prev.filter(t => t.instanceId !== instanceId));
  }, []);

  const clearCanvas = useCallback(() => {
    setTiles([]);
  }, []);

  const discoverNewElement = useCallback((name: string, icon: string): Element => {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    const newElement: Element = { id, name, icon };
    
    setElements((prev) => {
      if (prev.find(e => e.id === id)) return prev;
      return [...prev, newElement];
    });
    return newElement;
  }, []);

  const checkCombination = useCallback((sourceTile: Tile, targetTile: Tile) => {
    const el1 = elements.find(e => e.id === sourceTile.elementId);
    const el2 = elements.find(e => e.id === targetTile.elementId);
    
    if (!el1 || !el2) return;

    const key = [el1.id, el2.id].sort().join("|");
    let resultId = combinations[key];
    let resultElement: Element | undefined;

    if (resultId) {
      // Known combination
      resultElement = elements.find(e => e.id === resultId);
      
      // If we have the recipe but lost the element definition (weird edge case), recreate generic
      if (!resultElement) {
        resultElement = discoverNewElement(resultId, "✨");
      }
    } else {
      // NEW DISCOVERY LOGIC (Deterministic Fallback)
      const newName = `${el1.name} ${el2.name}`;
      const newId = newName.toLowerCase().replace(/\s+/g, "-");
      
      // Save this new recipe
      setCombinations(prev => ({ ...prev, [key]: newId }));
      
      // Create the element
      // Pick icon from one parent randomly or default
      const icons = ["✨", "🌟", "💠", "🔮", "⚗️"];
      const newIcon = icons[Math.floor(Math.random() * icons.length)];
      
      resultElement = discoverNewElement(newName, newIcon);
    }

    // Remove old tiles, spawn new one at target location
    setTiles(prev => {
      const filtered = prev.filter(t => t.instanceId !== sourceTile.instanceId && t.instanceId !== targetTile.instanceId);
      return [
        ...filtered, 
        {
          instanceId: uuidv4(),
          elementId: resultElement!.id,
          x: targetTile.x,
          y: targetTile.y
        }
      ];
    });

    return resultElement; // Return for animation/notification
  }, [combinations, elements, discoverNewElement]);


  return {
    elements,
    tiles,
    canvasRef,
    spawnTile,
    moveTile,
    removeTile,
    clearCanvas,
    checkCombination,
    isLoaded
  };
}
