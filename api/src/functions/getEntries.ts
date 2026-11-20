import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { readEntries } from "../storage";

export async function getEntries(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`getEntries: ${request.method} ${request.url}`);

  try {
    const entries = await readEntries();
    // Uusin merkintä ensin (retken päivämäärän mukaan)
    entries.sort((a, b) => b.date.localeCompare(a.date));
    return { status: 200, jsonBody: entries };
  } catch (error) {
    context.error("Merkintöjen lukeminen epäonnistui", error);
    return {
      status: 500,
      jsonBody: { error: "Merkintöjen lukeminen epäonnistui." },
    };
  }
}

app.http("getEntries", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: getEntries,
});
