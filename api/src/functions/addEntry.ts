import { randomUUID } from "crypto";
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { Entry, readEntries, writeEntries } from "../storage";

export async function addEntry(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`addEntry: ${request.method} ${request.url}`);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return {
      status: 400,
      jsonBody: { error: "Pyynnön runko ei ole kelvollista JSONia." },
    };
  }

  const date = String(body?.date ?? "").trim();
  const place = String(body?.place ?? "").trim();
  const note = String(body?.note ?? "").trim();

  // Tarkistetaan, että pakolliset tiedot on annettu
  const missing: string[] = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) missing.push("date (muodossa VVVV-KK-PP)");
  if (!place) missing.push("place");
  if (!note) missing.push("note");

  if (missing.length > 0) {
    return {
      status: 400,
      jsonBody: { error: `Puuttuvat tai virheelliset tiedot: ${missing.join(", ")}.` },
    };
  }

  const entry: Entry = {
    id: randomUUID(),
    date,
    place,
    note,
    createdAt: new Date().toISOString(),
  };

  try {
    const entries = await readEntries();
    entries.push(entry);
    await writeEntries(entries);
    return { status: 201, jsonBody: entry };
  } catch (error) {
    context.error("Merkinnän tallennus epäonnistui", error);
    return {
      status: 500,
      jsonBody: { error: "Merkinnän tallennus epäonnistui." },
    };
  }
}

app.http("addEntry", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: addEntry,
});
