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
  { id: "ash", name: "Ash", icon: "⚱️" },
  { id: "bacteria", name: "Bacteria", icon: "🦠" },
  { id: "beach", name: "Beach", icon: "🏖️" },
  { id: "bee", name: "Bee", icon: "🐝" },
  { id: "bird", name: "Bird", icon: "🐦" },
  { id: "boat", name: "Boat", icon: "⛵" },
  { id: "brick", name: "Brick", icon: "🧱" },
  { id: "car", name: "Car", icon: "🚗" },
  { id: "carbon", name: "Carbon", icon: "💎" },
  { id: "cat", name: "Cat", icon: "🐱" },
  { id: "charcoal", name: "Charcoal", icon: "⬛" },
  { id: "cheese", name: "Cheese", icon: "🧀" },
  { id: "cloud", name: "Cloud", icon: "☁️" },
  { id: "coal", name: "Coal", icon: "🕳️" },
  { id: "computer", name: "Computer", icon: "💻" },
  { id: "cow", name: "Cow", icon: "🐄" },
  { id: "crystal", name: "Crystal", icon: "🔮" },
  { id: "desert", name: "Desert", icon: "🌵" },
  { id: "dirt", name: "Dirt", icon: "🟫" },
  { id: "dog", name: "Dog", icon: "🐶" },
  { id: "dragon", name: "Dragon", icon: "🐉" },
  { id: "electricity", name: "Electricity", icon: "⚡" },
  { id: "energy", name: "Energy", icon: "🔋" },
  { id: "fish", name: "Fish", icon: "🐟" },
  { id: "flower", name: "Flower", icon: "🌸" },
  { id: "forest", name: "Forest", icon: "🌲" },
  { id: "glass", name: "Glass", icon: "🥃" },
  { id: "gold", name: "Gold", icon: "💰" },
  { id: "grass", name: "Grass", icon: "🌱" },
  { id: "heat", name: "Heat", icon: "🔥" },
  { id: "human", name: "Human", icon: "🧑" },
  { id: "ice", name: "Ice", icon: "🧊" },
  { id: "lava", name: "Lava", icon: "🌋" },
  { id: "light", name: "Light", icon: "💡" },
  { id: "metal", name: "Metal", icon: "🛡️" },
  { id: "milk", name: "Milk", icon: "🥛" },
  { id: "mist", name: "Mist", icon: "🌫️" },
  { id: "moon", name: "Moon", icon: "🌙" },
  { id: "mountain", name: "Mountain", icon: "🏔️" },
  { id: "mud", name: "Mud", icon: "💩" },
  { id: "paper", name: "Paper", icon: "📄" },
  { id: "plant", name: "Plant", icon: "🌿" },
  { id: "plastic", name: "Plastic", icon: "🥤" },
  { id: "rain", name: "Rain", icon: "🌧️" },
  { id: "river", name: "River", icon: "🌊" },
  { id: "rock", name: "Rock", icon: "🪨" },
  { id: "sand", name: "Sand", icon: "🏖️" },
  { id: "seed", name: "Seed", icon: "🌱" },
  { id: "shadow", name: "Shadow", icon: "👤" },
  { id: "sky", name: "Sky", icon: "🌤️" },
  { id: "smoke", name: "Smoke", icon: "💨" },
  { id: "snow", name: "Snow", icon: "❄️" },
  { id: "soil", name: "Soil", icon: "🌱" },
  { id: "sound", name: "Sound", icon: "🔊" },
  { id: "steam", name: "Steam", icon: "💨" },
  { id: "stone", name: "Stone", icon: "🪨" },
  { id: "storm", name: "Storm", icon: "⛈️" },
  { id: "sun", name: "Sun", icon: "☀️" },
  { id: "swamp", name: "Swamp", icon: "🐊" },
  { id: "tree", name: "Tree", icon: "🌳" },
  { id: "volcano", name: "Volcano", icon: "🌋" },
  { id: "wave", name: "Wave", icon: "🌊" },
  { id: "wind", name: "Wind", icon: "🌬️" },
  { id: "wood", name: "Wood", icon: "🪵" },
  { id: "soot", name: "Soot", icon: "🌑" },
  { id: "infection", name: "Infection", icon: "🤢" },
  { id: "sandstorm", name: "Sandstorm", icon: "🌪️" },
  { id: "swarm", name: "Swarm", icon: "🐝" },
  { id: "flight", name: "Flight", icon: "✈️" },
  { id: "sail", name: "Sail", icon: "⛵" },
  { id: "co2", name: "CO2", icon: "☁️" },
  { id: "fur", name: "Fur", icon: "🐾" },
  { id: "smell", name: "Smell", icon: "👃" },
  { id: "fan", name: "Fan", icon: "🌀" },
  { id: "milkshake", name: "Milkshake", icon: "🥤" },
  { id: "shine", name: "Shine", icon: "✨" },
  { id: "hay", name: "Hay", icon: "🌾" },
  { id: "warmth", name: "Warmth", icon: "🌡️" },
  { id: "breath", name: "Breath", icon: "🌬️" },
  { id: "sparkle", name: "Sparkle", icon: "✨" },
  { id: "obsidian", name: "Obsidian", icon: "💎" },
  { id: "flutter", name: "Flutter", icon: "🦋" },
  { id: "glow", name: "Glow", icon: "🌟" },
  { id: "rust", name: "Rust", icon: "🔩" },
  { id: "foam", name: "Foam", icon: "🫧" },
  { id: "fog", name: "Fog", icon: "🌫️" },
  { id: "night", name: "Night", icon: "🌃" },
  { id: "clay", name: "Clay", icon: "🏺" },
  { id: "kite", name: "Kite", icon: "🪁" },
  { id: "bag", name: "Bag", icon: "🛍️" },
  { id: "pollution", name: "Pollution", icon: "🏭" },
  { id: "blizzard", name: "Blizzard", icon: "❄️" },
  { id: "echo", name: "Echo", icon: "📣" },
  { id: "darkness", name: "Darkness", icon: "🌑" },
  { id: "atmosphere", name: "Atmosphere", icon: "🌎" },
  { id: "hurricane", name: "Hurricane", icon: "🌀" },
  { id: "day", name: "Day", icon: "☀️" },
  { id: "mosquito", name: "Mosquito", icon: "🦟" },
  { id: "leaves", name: "Leaves", icon: "🍃" },
  { id: "eruption", name: "Eruption", icon: "🌋" },
  { id: "spray", name: "Spray", icon: "🚿" },
  { id: "gust", name: "Gust", icon: "💨" },
  { id: "sawdust", name: "Sawdust", icon: "🪵" },
  { id: "fertilizer", name: "Fertilizer", icon: "💩" },
  { id: "illness", name: "Illness", icon: "🤒" },
  { id: "plankton", name: "Plankton", icon: "🔬" },
  { id: "shore", name: "Shore", icon: "🏖️" },
  { id: "honey", name: "Honey", icon: "🍯" },
  { id: "hive", name: "Hive", icon: "🐝" },
  { id: "nest", name: "Nest", icon: "🪺" },
  { id: "steamship", name: "Steamship", icon: "🚢" },
  { id: "ship", name: "Ship", icon: "🚢" },
  { id: "sailboat", name: "Sailboat", icon: "⛵" },
  { id: "ceramic", name: "Ceramic", icon: "🏺" },
  { id: "ev", name: "EV", icon: "⚡" },
  { id: "vehicle", name: "Vehicle", icon: "🚗" },
  { id: "engine", name: "Engine", icon: "⚙️" },
  { id: "diamond", name: "Diamond", icon: "💎" },
  { id: "kitten", name: "Kitten", icon: "🐱" },
  { id: "forge", name: "Forge", icon: "🔥" },
  { id: "sandwich", name: "Sandwich", icon: "🥪" },
  { id: "sunset", icon: "🌅", name: "Sunset" },
  { id: "cow-wash", icon: "🚿", name: "Cow Wash" },
  { id: "prism", icon: "🌈", name: "Prism" },
  { id: "oasis", icon: "🌴", name: "Oasis" },
  { id: "friend", icon: "🤝", name: "Friend" },
  { id: "dragonfire", icon: "🔥", name: "Dragonfire" },
  { id: "hoard", icon: "💰", name: "Hoard" },
  { id: "earthquake", icon: "🫨", name: "Earthquake" },
  { id: "field", icon: "🌾", name: "Field" },
  { id: "glacier", icon: "🧊", name: "Glacier" },
  { id: "ore", icon: "🪨", name: "Ore" },
  { id: "geyser", icon: "⛲", name: "Geyser" },
  { id: "power", icon: "🔌", name: "Power" },
  { id: "plasma", icon: "🔮", name: "Plasma" },
  { id: "lightbulb", icon: "💡", name: "Lightbulb" },
  { id: "wire", icon: "🔌", name: "Wire" },
  { id: "shock", icon: "⚡", name: "Shock" },
  { id: "magnet", icon: "🧲", name: "Magnet" },
  { id: "cooked-fish", icon: "🍳", name: "Cooked Fish" },
  { id: "scent", icon: "👃", name: "Scent" },
  { id: "wildfire", icon: "🔥", name: "Wildfire" },
  { id: "molten-glass", icon: "🔥", name: "Molten Glass" },
  { id: "inferno", icon: "🔥", name: "Inferno" },
  { id: "tool", icon: "🔨", name: "Tool" },
  { id: "hot-chocolate", icon: "☕", name: "Hot Chocolate" },
  { id: "magma", icon: "🔥", name: "Magma" },
  { id: "popcorn", icon: "🍿", name: "Popcorn" },
  { id: "pressure", icon: "😤", name: "Pressure" },
  { id: "solar-flare", icon: "☀️", name: "Solar Flare" },
  { id: "school", icon: "🏫", name: "School" },
  { id: "garden", icon: "🏡", name: "Garden" },
  { id: "time", icon: "⏳", name: "Time" },
  { id: "sailor", icon: "⚓", name: "Sailor" },
  { id: "driver", icon: "🏎️", name: "Driver" },
  { id: "owner", icon: "👤", name: "Owner" },
  { id: "chef", icon: "👨‍🍳", name: "Chef" },
  { id: "programmer", icon: "👨‍💻", name: "Programmer" },
  { id: "farmer", icon: "👨‍🌾", name: "Farmer" },
  { id: "engineer", icon: "👷", name: "Engineer" },
  { id: "fisherman", icon: "🎣", name: "Fisherman" },
  { id: "gardener", icon: "👨‍🌾", name: "Gardener" },
  { id: "lumberjack", icon: "🪓", name: "Lumberjack" },
  { id: "glasses", icon: "👓", name: "Glasses" },
  { id: "wealth", icon: "💰", name: "Wealth" },
  { id: "skater", icon: "⛸️", name: "Skater" },
  { id: "danger", icon: "⚠️", name: "Danger" },
  { id: "blacksmith", icon: "🔨", name: "Blacksmith" },
  { id: "cook", icon: "🍳", name: "Cook" },
  { id: "climber", icon: "🧗", name: "Climber" },
  { id: "writer", icon: "✍️", name: "Writer" },
  { id: "toy", icon: "🧸", name: "Toy" },
  { id: "umbrella", icon: "☂️", name: "Umbrella" },
  { id: "miner", icon: "👷", name: "Miner" },
  { id: "castle", icon: "🏰", name: "Castle" },
  { id: "snowman", icon: "☃️", name: "Snowman" },
  { id: "builder", icon: "👷", name: "Builder" },
  { id: "fear", icon: "😨", name: "Fear" },
  { id: "sunburn", icon: "🥵", name: "Sunburn" },
  { id: "woodcutter", icon: "🪓", name: "Woodcutter" },
  { id: "swimmer", icon: "🏊", name: "Swimmer" },
  { id: "cold-steel", icon: "❄️", name: "Cold Steel" },
  { id: "reflection", icon: "🪞", name: "Reflection" },
  { id: "steel", icon: "🔩", name: "Steel" },
  { id: "diluted-milk", icon: "🥛", name: "Diluted Milk" },
  { id: "rainbow", icon: "🌈", name: "Rainbow" },
  { id: "dream", icon: "💤", name: "Dream" },
  { id: "peak", icon: "🏔️", name: "Peak" },
  { id: "pulp", icon: "📄", name: "Pulp" },
  { id: "growth", icon: "🌱", name: "Growth" },
  { id: "photosynthesis", icon: "☀️", name: "Photosynthesis" },
  { id: "bottle", icon: "🍾", name: "Bottle" },
  { id: "pebble", icon: "🪨", name: "Pebble" },
  { id: "erosion", icon: "⌛", name: "Erosion" },
  { id: "sprout", icon: "🌱", name: "Sprout" },
  { id: "slush", icon: "❄️", name: "Slush" },
  { id: "island", icon: "🏝️", name: "Island" },
];

const INITIAL_COMBINATIONS: CombinationDictionary = {
"air|ash": "soot",
"air|bacteria": "infection",
"air|beach": "sandstorm",
"air|bee": "swarm",
"air|bird": "flight",
"air|boat": "sail",
"air|brick": "dust",
"air|car": "windshield",
"air|carbon": "co2",
"air|cat": "fur",
"air|charcoal": "carbon",
"air|cheese": "smell",
"air|cloud": "sky",
"air|coal": "smoke",
"air|computer": "fan",
"air|cow": "milkshake",
"air|crystal": "shine",
"air|desert": "sandstorm",
"air|dirt": "dust",
"air|dog": "fur",
"air|dragon": "flight",
"air|earth": "dust",
"air|electricity": "lightning",
"air|energy": "wind",
"air|fire": "smoke",
"air|fish": "flying-fish",
"air|flower": "pollen",
"air|forest": "oxygen",
"air|glass": "lens",
"air|gold": "sparkle",
"air|grass": "hay",
"air|heat": "warmth",
"air|human": "breath",
"air|ice": "snow",
"air|lava": "obsidian",
"air|leaf": "flutter",
"air|light": "glow",
"air|metal": "rust",
"air|milk": "foam",
"air|mist": "fog",
"air|moon": "night",
"air|mountain": "wind",
"air|mud": "clay",
"air|paper": "kite",
"air|plant": "pollen",
"air|plastic": "bag",
"air|rain": "storm",
"air|river": "mist",
"air|rock": "sand",
"air|sand": "dust",
"air|seed": "dandelion",
"air|shadow": "darkness",
"air|sky": "atmosphere",
"air|smoke": "pollution",
"air|snow": "blizzard",
"air|soil": "dust",
"air|sound": "echo",
"air|steam": "cloud",
"air|stone": "sand",
"air|storm": "hurricane",
"air|sun": "day",
"air|swamp": "mosquito",
"air|tree": "leaves",
"air|volcano": "eruption",
"air|water": "cloud",
"air|wave": "spray",
"air|wind": "gust",
"air|wood": "sawdust",

"ash|earth": "fertilizer",
"ash|fire": "carbon",
"ash|plant": "soil",
"ash|water": "mud",

"bacteria|human": "illness",
"bacteria|water": "plankton",

"beach|water": "shore",

"bee|flower": "honey",
"bee|tree": "hive",

"bird|egg": "nest",
"bird|tree": "nest",

"boat|fire": "steamship",
"boat|metal": "ship",
"boat|water": "sailboat",

"brick|fire": "ceramic",
"brick|mud": "clay",

"car|electricity": "ev",
"car|metal": "vehicle",
"car|oil": "engine",

"carbon|fire": "diamond",
"carbon|pressure": "diamond",

"cat|milk": "kitten",

"charcoal|fire": "forge",

"cheese|bread": "sandwich",

"cloud|electricity": "lightning",
"cloud|fire": "sunset",
"cloud|ice": "snow",
"cloud|rain": "storm",
"cloud|water": "rain",

"coal|fire": "energy",
"coal|pressure": "diamond",

"computer|electricity": "processor",
"computer|metal": "circuit",

"cow|grass": "milk",
"cow|water": "cow-wash",

"crystal|light": "prism",

"desert|water": "oasis",

"dirt|water": "mud",

"dog|human": "friend",

"dragon|fire": "dragonfire",
"dragon|gold": "hoard",

"earth|energy": "earthquake",
"earth|fire": "lava",
"earth|grass": "field",
"earth|heat": "desert",
"earth|human": "house",
"earth|ice": "glacier",
"earth|metal": "ore",
"earth|milk": "cheese",
"earth|plant": "tree",
"earth|pressure": "stone",
"earth|rain": "plant",
"earth|seed": "plant",
"earth|steam": "geyser",
"earth|stone": "mountain",
"earth|sun": "day",
"earth|tree": "forest",
"earth|water": "mud",
"earth|wind": "dust",

"electricity|energy": "power",
"electricity|fire": "plasma",
"electricity|glass": "lightbulb",
"electricity|metal": "wire",
"electricity|water": "shock",

"energy|fire": "heat",
"energy|metal": "magnet",
"energy|water": "wave",

"fire|fish": "cooked-fish",
"fire|flower": "scent",
"fire|forest": "wildfire",
"fire|glass": "molten-glass",
"fire|grass": "ash",
"fire|heat": "inferno",
"fire|human": "tool",
"fire|ice": "water",
"fire|lava": "eruption",
"fire|metal": "forge",
"fire|milk": "hot-chocolate",
"fire|mist": "steam",
"fire|mountain": "volcano",
"fire|mud": "brick",
"fire|paper": "ash",
"fire|plant": "ash",
"fire|plastic": "melted-plastic",
"fire|rain": "steam",
"fire|rock": "magma",
"fire|sand": "glass",
"fire|seed": "popcorn",
"fire|snow": "water",
"fire|steam": "pressure",
"fire|stone": "magma",
"fire|storm": "lightning",
"fire|sun": "solar-flare",
"fire|tree": "charcoal",
"fire|water": "steam",
"fire|wind": "wildfire",
"fire|wood": "charcoal",

"fish|water": "school",

"flower|water": "garden",

"forest|water": "swamp",

"glass|sand": "time",
"glass|water": "ice",

"gold|pressure": "ingot",

"grass|water": "plant",

"heat|ice": "water",

"human|air": "breath",
"human|boat": "sailor",
"human|bread": "sandwich",
"human|car": "driver",
"human|cat": "owner",
"human|cheese": "chef",
"human|computer": "programmer",
"human|cow": "farmer",
"human|dog": "owner",
"human|earth": "house",
"human|electricity": "engineer",
"human|fire": "tool",
"human|fish": "fisherman",
"human|flower": "gardener",
"human|forest": "lumberjack",
"human|glass": "glasses",
"human|gold": "wealth",
"human|grass": "farmer",
"human|ice": "skater",
"human|lava": "danger",
"human|metal": "blacksmith",
"human|milk": "cook",
"human|mountain": "climber",
"human|paper": "writer",
"human|plant": "gardener",
"human|plastic": "toy",
"human|rain": "umbrella",
"human|river": "fisherman",
"human|rock": "miner",
"human|sand": "castle",
"human|seed": "farmer",
"human|snow": "snowman",
"human|stone": "builder",
"human|storm": "fear",
"human|sun": "sunburn",
"human|tree": "woodcutter",
"human|water": "swimmer",
"human|wind": "kite",

"ice|metal": "cold-steel",
"ice|rock": "glacier",
"ice|water": "snow",

"lava|stone": "obsidian",
"lava|water": "stone",

"light|metal": "reflection",

"metal|pressure": "steel",
"metal|water": "rust",

"milk|water": "diluted-milk",

"mist|sun": "rainbow",

"moon|night": "dream",

"mountain|snow": "peak",

"mud|plant": "swamp",

"paper|water": "pulp",

"plant|rain": "growth",
"plant|sun": "photosynthesis",
"plant|water": "algae",

"plastic|water": "bottle",

"rain|sun": "rainbow",

"river|stone": "pebble",

"rock|water": "erosion",

"sand|water": "beach",

"seed|water": "sprout",

"snow|water": "slush",

"steam|stone": "geyser",

"stone|water": "erosion",

"sun|water": "rain",

"tree|water": "swamp",

"volcano|water": "island"
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
      // NO COMBINATION FOUND
      return;
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
