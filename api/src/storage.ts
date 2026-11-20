import { promises as fs } from "fs";
import * as path from "path";

export interface Entry {
  id: string;
  date: string;
  place: string;
  note: string;
  createdAt: string;
}

// Tallennus on paikallinen JSON-tiedosto. Azuressa tämän tilalla
// olisi tietokanta (esim. Cosmos DB tai Table Storage).
// Tiedosto sijaitsee api-kansion data-alikansiossa, kun funktiot ajetaan
// komennolla "func start" api-kansiossa.
const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "entries.json");

export async function readEntries(): Promise<Entry[]> {
  try {
    const content = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(content) as Entry[];
  } catch (error) {
    // Tiedostoa ei ole vielä olemassa -> ei merkintöjä
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

export async function writeEntries(entries: Entry[]): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(entries, null, 2), "utf-8");
}
