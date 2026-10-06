import { FormEvent, useEffect, useState } from "react";
import { getBooks, getMembers, issueBook } from "../api/client";
import { Toast } from "../components/Toast";
import type { Book, Member } from "../types/models";

export function IssueBook() {
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [bookData, memberData] = await Promise.all([getBooks(), getMembers()]);
        setBooks(bookData);
        setMembers(memberData);
      } catch (err) {
        setPageError(err instanceof Error ? err.message : "Failed to load form data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!bookId || !memberId) return;

    try {
      setSubmitting(true);
      await issueBook({ bookId, memberId });
      setToast({ message: "Book issued successfully!", type: "success" });
      setBookId("");
      setMemberId("");
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Could not issue the book.",
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="state-card">Loading members and books...</div>;

  return (
    <section>
      <div className="page-heading">
        <div>
          <h2>Issue Book</h2>
          <p>Assign an available book to a library member.</p>
        </div>
      </div>

      {pageError && <div className="state-card error-box">{pageError}</div>}

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="member">Member</label>
          <select id="member" value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
            <option value="">Select member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} — {member.email}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="book">Book</label>
          <select id="book" value={bookId} onChange={(e) => setBookId(e.target.value)} required>
            <option value="">Select book</option>
            {books.filter((book) => book.available !== false).map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} — {book.author}
              </option>
            ))}
          </select>
        </div>

        <button className="primary-btn" type="submit" disabled={submitting || !bookId || !memberId}>
          {submitting ? "Issuing..." : "Issue Book"}
        </button>
      </form>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </section>
  );
}