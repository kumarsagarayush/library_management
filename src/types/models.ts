export interface Book {
  id: number | string;
  title: string;
  author: string;
  genre: string;
  isbn?: string;
  publishedYear?: number;
  available?: boolean;
}

export interface Member {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
}

export interface BorrowRecord {
  id: number | string;
  bookId: number | string;
  memberId: number | string;
  book?: Book;
  member?: Member;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  returned?: boolean;
}

export interface BorrowRequest {
  bookId: number | string;
  memberId: number | string;
}

export interface ApiError {
  message: string;
}