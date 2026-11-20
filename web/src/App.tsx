import { FormEvent, useEffect, useState } from "react";

interface Entry {
  id: string;
  date: string;
  place: string;
  note: string;
  createdAt: string;
}

const today = () => new Date().toISOString().slice(0, 10);

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${Number(day)}.${Number(month)}.${year}`;
}

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [date, setDate] = useState(today());
  const [place, setPlace] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadEntries() {
    try {
      const response = await fetch("/api/getEntries");
      if (!response.ok) {
        throw new Error("Merkintöjen haku epäonnistui.");
      }
      setEntries((await response.json()) as Entry[]);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Rajapintaan ei saatu yhteyttä. Onko func start käynnissä?"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/addEntry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, place, note }),
      });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Tallennus epäonnistui.");
      }
      setPlace("");
      setNote("");
      await loadEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tallennus epäonnistui.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      <header className="masthead">
        <h1>Retkiloki</h1>
        <p>Kirjaa retket ylös: milloin, minne ja mitä jäi mieleen.</p>
      </header>

      <div className="layout">
        <section className="panel" aria-labelledby="form-title">
          <h2 id="form-title">Uusi merkintä</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="date">Päivämäärä</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <label htmlFor="place">Paikka</label>
            <input
              id="place"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Esim. Oulangan kansallispuisto"
              required
            />

            <label htmlFor="note">Muistiinpano</label>
            <textarea
              id="note"
              rows={5}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Sää, reitti, havainnot..."
              required
            />

            <button type="submit" disabled={saving}>
              {saving ? "Tallennetaan..." : "Tallenna merkintä"}
            </button>
          </form>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </section>

        <section className="log" aria-labelledby="log-title">
          <h2 id="log-title">Merkinnät</h2>
          {loading ? (
            <p className="muted">Ladataan merkintöjä...</p>
          ) : entries.length === 0 ? (
            <p className="muted">
              Ei vielä merkintöjä. Täytä lomake ja tallenna ensimmäinen retki.
            </p>
          ) : (
            <ol className="entries">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                  <h3>{entry.place}</h3>
                  <p>{entry.note}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}
