import { useEffect, useMemo, useState } from "react";
import { getBooks } from "../api/client";
import { DataTable, type DataColumn } from "../components/DataTable";
import type { Book } from "../types/models";

export function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      try {
        setLoading(true);
        setError("");
        const data = await getBooks();
        if (active) setBooks(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load books.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBooks();
    return () => { active = false; };
  }, []);

  const genres = useMemo(
    () => ["All", ...Array.from(new Set(books.map((book) => book.genre).filter(Boolean)))],
    [books]
  );

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return books.filter((book) => {
      const titleMatch = !query || book.title.toLowerCase().includes(query);
      const genreMatch = genre === "All" || book.genre === genre;
      return titleMatch && genreMatch;
    });
  }, [books, search, genre]);

  const columns: DataColumn<Book>[] = [
    { key: "title", header: "Title", render: (book) => <strong>{book.title}</strong> },
    { key: "author", header: "Author", render: (book) => book.author },
    { key: "genre", header: "Genre", render: (book) => <span className="badge">{book.genre}</span> },
    { key: "isbn", header: "ISBN", render: (book) => book.isbn || "—" },
    { key: "status", header: "Status", render: (book) =>
      <span className={`status ${book.available === false ? "unavailable" : "available"}`}>
        {book.available === false ? "Issued" : "Available"}
      </span>
    }
  ];

  return (
    <section>
      <div className="page-heading">
        <div>
          <h2>Books</h2>
          <p>Browse and filter the library collection.</p>
        </div>
        <span className="count">{filteredBooks.length} books</span>
      </div>

      <div className="filters card">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          aria-label="Search by title"
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} aria-label="Filter by genre">
          {genres.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      {loading && <div className="state-card">Loading books...</div>}
      {!loading && error && <div className="state-card error-box">{error}</div>}
      {!loading && !error && <DataTable data={filteredBooks} columns={columns} rowKey={(book) => book.id} />}
    </section>
  );
}