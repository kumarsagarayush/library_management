import { useEffect, useMemo, useState } from "react";
import { getMemberHistory, getMembers } from "../api/client";
import { DataTable, type DataColumn } from "../components/DataTable";
import type { BorrowRecord, Member } from "../types/models";

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN");
}

function isOverdue(record: BorrowRecord) {
  if (record.returnDate || record.returned) return false;
  const due = new Date(record.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export function MemberHistory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [memberId, setMemberId] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMembers() {
      try {
        setLoadingMembers(true);
        setMembers(await getMembers());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load members.");
      } finally {
        setLoadingMembers(false);
      }
    }
    loadMembers();
  }, []);

  useEffect(() => {
    if (!memberId) {
      setRecords([]);
      return;
    }

    async function loadHistory() {
      try {
        setLoadingHistory(true);
        setError("");
        setRecords(await getMemberHistory(memberId));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load member history.");
      } finally {
        setLoadingHistory(false);
      }
    }
    loadHistory();
  }, [memberId]);

  const selectedMember = useMemo(
    () => members.find((member) => String(member.id) === memberId),
    [members, memberId]
  );

  const columns: DataColumn<BorrowRecord>[] = [
    {
      key: "book",
      header: "Book",
      render: (record) => <strong>{record.book?.title || `Book #${record.bookId}`}</strong>
    },
    { key: "issue", header: "Issue Date", render: (record) => formatDate(record.issueDate) },
    {
      key: "due",
      header: "Due Date",
      render: (record) => isOverdue(record)
        ? <span className="overdue-badge">Overdue · {formatDate(record.dueDate)}</span>
        : formatDate(record.dueDate)
    },
    {
      key: "return",
      header: "Return Date",
      render: (record) => formatDate(record.returnDate)
    },
    {
      key: "status",
      header: "Status",
      render: (record) => isOverdue(record)
        ? <span className="overdue-badge">Overdue</span>
        : (record.returnDate || record.returned)
          ? <span className="status available">Returned</span>
          : <span className="status">Borrowed</span>
    }
  ];

  return (
    <section>
      <div className="page-heading">
        <div>
          <h2>Member History</h2>
          <p>View borrowing records and identify overdue books.</p>
        </div>
      </div>

      <div className="card selector-card">
        <label htmlFor="history-member">Select Member</label>
        <select
          id="history-member"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          disabled={loadingMembers}
        >
          <option value="">{loadingMembers ? "Loading members..." : "Choose a member"}</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </div>

      {selectedMember && (
        <div className="member-summary">
          <div>
            <strong>{selectedMember.name}</strong>
            <span>{selectedMember.email}</span>
          </div>
          <span>{records.length} record{records.length === 1 ? "" : "s"}</span>
        </div>
      )}

      {error && <div className="state-card error-box">{error}</div>}
      {loadingHistory && <div className="state-card">Loading history...</div>}
      {!loadingHistory && memberId && !error && (
        <DataTable
          data={records}
          columns={columns}
          rowKey={(record) => record.id}
          emptyMessage="No borrowing history for this member."
        />
      )}
    </section>
  );
}