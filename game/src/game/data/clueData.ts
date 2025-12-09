import type { Clue } from "../types";
import { ClueType } from "../types";

/**
 * Sample clues for the mystery game
 */
export const CLUE_FOOTPRINTS: Clue = {
  id: "clue_footprints",
  name: "Muddy Footprints",
  description:
    "Fresh muddy footprints leading toward the back of the warehouse. Size 11 boot print.",
  type: ClueType.Physical,
  relatedCharacters: [],
  relatedClues: ["clue_shipping_label"],
};

export const CLUE_BROKEN_GLASS: Clue = {
  id: "clue_broken_glass",
  name: "Broken Glass",
  description:
    "Shattered glass near the window. Some pieces have traces of blood.",
  type: ClueType.Physical,
  relatedCharacters: [],
  relatedClues: ["clue_footprints"],
};

export const CLUE_SHIPPING_LABEL: Clue = {
  id: "clue_shipping_label",
  name: "Shipping Label",
  description:
    "A torn shipping label from 'Maritime Imports Ltd.' dated three days ago.",
  type: ClueType.Document,
  relatedCharacters: ["journalist"],
  relatedClues: [],
};

export const CLUE_NEWSPAPER: Clue = {
  id: "clue_newspaper",
  name: "Newspaper Article",
  description:
    "Article about recent smuggling operations in the harbor district.",
  type: ClueType.Document,
  relatedCharacters: ["journalist"],
  relatedClues: ["clue_shipping_label"],
};

export const CLUE_LAB_REPORT: Clue = {
  id: "clue_lab_report",
  name: "Laboratory Report",
  description:
    "Chemical analysis report showing traces of an unusual compound.",
  type: ClueType.Document,
  relatedCharacters: ["scientist"],
  relatedClues: ["clue_broken_glass"],
};

export const CLUE_POLICE_REPORT: Clue = {
  id: "clue_police_report",
  name: "Police Report",
  description: "Initial incident report filed by Officer Blake.",
  type: ClueType.Document,
  relatedCharacters: ["officer"],
  relatedClues: [],
};

export const CLUE_WITNESS_TESTIMONY: Clue = {
  id: "clue_witness_testimony",
  name: "Witness Testimony",
  description:
    "Statement from a nearby resident who heard suspicious noises around midnight.",
  type: ClueType.Testimony,
  relatedCharacters: [],
  relatedClues: ["clue_footprints"],
};

/**
 * Clue registry for easy lookup
 */
export const CLUE_REGISTRY: Record<string, Clue> = {
  clue_footprints: CLUE_FOOTPRINTS,
  clue_broken_glass: CLUE_BROKEN_GLASS,
  clue_shipping_label: CLUE_SHIPPING_LABEL,
  clue_newspaper: CLUE_NEWSPAPER,
  clue_lab_report: CLUE_LAB_REPORT,
  clue_police_report: CLUE_POLICE_REPORT,
  clue_witness_testimony: CLUE_WITNESS_TESTIMONY,
};

/**
 * Get a clue by ID
 */
export function getClueById(id: string): Clue | undefined {
  return CLUE_REGISTRY[id];
}
