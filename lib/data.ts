import game from "@/data/game.json";
import snapshots from "@/data/snapshots.json";
import eventsJson from "@/data/events.json";
import codes from "@/data/codes.json";
import gamepassesJson from "@/data/gamepasses.json";
import crates from "@/data/crates.json";
import toys from "@/data/toys.json";
import rebirths from "@/data/rebirths.json";
import workers from "@/data/workers.json";
import changelog from "@/data/changelog.json";
import type { EventRecord, GamepassRecord } from "./types";

export { game, snapshots, codes, crates, toys, rebirths, workers, changelog };
export const events = eventsJson as EventRecord[];
export const gamepasses = gamepassesJson as GamepassRecord[];
