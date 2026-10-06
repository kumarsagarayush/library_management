import type { ApiError, Book, BorrowRecord, BorrowRequest, Member } from "../types/models";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("authToken");

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = (await response.json()) as Partial<ApiError>;
      if (errorBody.message) message = errorBody.message;
    } catch {
      // Ignore non-JSON error responses.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function unwrapArray<T>(value: unknown, keys: string[]): T[] {
  if (Array.isArray(value)) return value as T[];

  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    for (const key of keys) {
      if (Array.isArray(object[key])) return object[key] as T[];
    }
    if (object.data && Array.isArray(object.data)) return object.data as T[];
  }

  return [];
}

export async function getBooks(): Promise<Book[]> {
  const response = await request<unknown>("/api/books");
  return unwrapArray<Book>(response, ["books"]);
}

export async function getMembers(): Promise<Member[]> {
  const response = await request<unknown>("/api/members");
  return unwrapArray<Member>(response, ["members"]);
}

export async function getMemberHistory(memberId: number | string): Promise<BorrowRecord[]> {
  const response = await request<unknown>(`/api/borrow/member/${memberId}`);
  return unwrapArray<BorrowRecord>(response, ["records", "borrowRecords", "history"]);
}

export async function issueBook(payload: BorrowRequest): Promise<BorrowRecord> {
  return request<BorrowRecord>("/api/borrow", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}