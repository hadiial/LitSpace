export type BookStatus = 'ingin-dibaca' | 'sedang-dibaca' | 'selesai';

export type BookFormat = 'Cetak' | 'E-Book' | 'Audiobook';

export type BookCategory =
  | 'Fiksi'
  | 'Teknologi'
  | 'Pengembangan Diri'
  | 'Sains'
  | 'Sejarah'
  | 'Bisnis'
  | 'Desain'
  | 'Non-Fiksi';

export type BookSortOption =
  | 'terbaru'
  | 'judul-asc'
  | 'judul-desc'
  | 'rating-desc'
  | 'tahun-desc';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  format: BookFormat;
  year: number;
  pages: number;
  currentPage: number;
  rating: number;
  status: BookStatus;
  isFavorite: boolean;
  isbn?: string;
  publisher?: string;
  coverColor: string;
  coverUrl?: string;
  description: string;
  createdAt: string;
}

export type BookFormData = Omit<Book, 'id' | 'createdAt'>;

export interface BookFilter {
  search: string;
  category: BookCategory | 'Semua';
  status: BookStatus | 'semua';
  format: BookFormat | 'Semua';
  onlyFavorites: boolean;
  sortBy: BookSortOption;
}

export interface BookStats {
  totalBooks: number;
  completedBooks: number;
  readingBooks: number;
  wantToReadBooks: number;
  favoriteBooks: number;
  averageRating: number;
  totalPages: number;
  totalPagesRead: number;
  completionRate: number;
}

export const BOOK_CATEGORIES: readonly BookCategory[] = [
  'Fiksi',
  'Teknologi',
  'Pengembangan Diri',
  'Sains',
  'Sejarah',
  'Bisnis',
  'Desain',
  'Non-Fiksi',
] as const;

export const BOOK_FORMATS: readonly BookFormat[] = [
  'Cetak',
  'E-Book',
  'Audiobook',
] as const;

export const BOOK_STATUS_OPTIONS: readonly BookStatus[] = [
  'ingin-dibaca',
  'sedang-dibaca',
  'selesai',
] as const;

export const BOOK_STATUS_LABELS: Record<BookStatus, string> = {
  'ingin-dibaca': 'Ingin Dibaca',
  'sedang-dibaca': 'Sedang Dibaca',
  selesai: 'Selesai Dibaca',
};

export function getNextBookStatus(currentStatus: BookStatus): BookStatus {
  if (currentStatus === 'ingin-dibaca') return 'sedang-dibaca';
  if (currentStatus === 'sedang-dibaca') return 'selesai';
  return 'ingin-dibaca';
}

export function calculateBookStats(books: readonly Book[]): BookStats {
  const totalBooks = books.length;
  let completedBooks = 0;
  let readingBooks = 0;
  let wantToReadBooks = 0;
  let favoriteBooks = 0;
  let totalRating = 0;
  let ratedCount = 0;
  let totalPages = 0;
  let totalPagesRead = 0;

  for (const book of books) {
    if (book.status === 'selesai') completedBooks += 1;
    else if (book.status === 'sedang-dibaca') readingBooks += 1;
    else wantToReadBooks += 1;

    if (book.isFavorite) favoriteBooks += 1;

    if (book.rating > 0) {
      totalRating += book.rating;
      ratedCount += 1;
    }

    totalPages += book.pages;
    const boundedCurrentPage = Math.min(Math.max(book.currentPage, 0), book.pages);
    totalPagesRead += book.status === 'selesai' ? book.pages : boundedCurrentPage;
  }

  const averageRating = ratedCount > 0 ? Number((totalRating / ratedCount).toFixed(1)) : 0;
  const completionRate = totalBooks > 0 ? Math.round((completedBooks / totalBooks) * 100) : 0;

  return {
    totalBooks,
    completedBooks,
    readingBooks,
    wantToReadBooks,
    favoriteBooks,
    averageRating,
    totalPages,
    totalPagesRead,
    completionRate,
  };
}
