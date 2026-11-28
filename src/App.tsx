import { useEffect, useMemo, useState } from 'react';
import AddBookModal from './components/AddBookModal';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';
import FilterSidebar from './components/FilterSidebar';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import StatsBanner from './components/StatsBanner';
import { INITIAL_BOOKS } from './data/initialBooks';
import type {
  Book,
  BookCategory,
  BookFormData,
  BookFormat,
  BookSortOption,
  BookStatus,
} from './types/book';
import { BOOK_STATUS_LABELS, getNextBookStatus } from './types/book';

const STORAGE_KEY = 'litspace_books_v1';

const SORT_OPTIONS: readonly { value: BookSortOption; label: string }[] = [
  { value: 'terbaru', label: 'Terbaru Ditambahkan' },
  { value: 'judul-asc', label: 'Judul (A – Z)' },
  { value: 'judul-desc', label: 'Judul (Z – A)' },
  { value: 'rating-desc', label: 'Rating Tertinggi' },
  { value: 'tahun-desc', label: 'Tahun Terbit Terbaru' },
] as const;

function loadBooksFromStorage(): Book[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return INITIAL_BOOKS;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return INITIAL_BOOKS;
    }

    return parsed.filter(
      (item): item is Book =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Book).id === 'string' &&
        typeof (item as Book).title === 'string' &&
        typeof (item as Book).author === 'string',
    );
  } catch {
    return INITIAL_BOOKS;
  }
}

export default function App() {
  const [books, setBooks] = useState<Book[]>(loadBooksFromStorage);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<BookSortOption>('terbaru');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'Semua'>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | 'semua'>('semua');
  const [selectedFormat, setSelectedFormat] = useState<BookFormat | 'Semua'>('Semua');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch {
      // Abaikan jika penyimpanan browser penuh atau tidak tersedia
    }
  }, [books]);

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? null,
    [books, selectedBookId],
  );

  const trimmedSearch = searchQuery.trim();
  const hasActiveFilters =
    trimmedSearch.length > 0 ||
    selectedCategory !== 'Semua' ||
    selectedStatus !== 'semua' ||
    selectedFormat !== 'Semua';

  const { categoryCounts, statusCounts, formatCounts } = useMemo(() => {
    const categories: Partial<Record<BookCategory, number>> = {};
    const statuses: Partial<Record<BookStatus, number>> = {};
    const formats: Partial<Record<BookFormat, number>> = {};

    for (const book of books) {
      categories[book.category] = (categories[book.category] ?? 0) + 1;
      statuses[book.status] = (statuses[book.status] ?? 0) + 1;
      formats[book.format] = (formats[book.format] ?? 0) + 1;
    }

    return {
      categoryCounts: categories,
      statusCounts: statuses,
      formatCounts: formats,
    };
  }, [books]);

  const filteredAndSortedBooks = useMemo(() => {
    const normalizedSearch = trimmedSearch.toLowerCase();

    const matched = books.filter((book) => {
      const matchSearch =
        normalizedSearch.length === 0 ||
        book.title.toLowerCase().includes(normalizedSearch) ||
        book.author.toLowerCase().includes(normalizedSearch);
      const matchCategory =
        selectedCategory === 'Semua' || book.category === selectedCategory;
      const matchStatus = selectedStatus === 'semua' || book.status === selectedStatus;
      const matchFormat = selectedFormat === 'Semua' || book.format === selectedFormat;

      return matchSearch && matchCategory && matchStatus && matchFormat;
    });

    return [...matched].sort((a, b) => {
      switch (sortBy) {
        case 'judul-asc':
          return a.title.localeCompare(b.title, 'id');
        case 'judul-desc':
          return b.title.localeCompare(a.title, 'id');
        case 'rating-desc':
          return b.rating - a.rating || a.title.localeCompare(b.title, 'id');
        case 'tahun-desc':
          return b.year - a.year || a.title.localeCompare(b.title, 'id');
        case 'terbaru':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [books, trimmedSearch, selectedCategory, selectedStatus, selectedFormat, sortBy]);

  const activeFilterTags = useMemo(() => {
    const tags: { id: string; label: string }[] = [];

    if (trimmedSearch.length > 0) {
      tags.push({ id: 'search', label: `Pencarian: "${trimmedSearch}"` });
    }
    if (selectedCategory !== 'Semua') {
      tags.push({ id: 'category', label: `Kategori: ${selectedCategory}` });
    }
    if (selectedStatus !== 'semua') {
      tags.push({ id: 'status', label: `Status: ${BOOK_STATUS_LABELS[selectedStatus]}` });
    }
    if (selectedFormat !== 'Semua') {
      tags.push({ id: 'format', label: `Format: ${selectedFormat}` });
    }

    return tags;
  }, [trimmedSearch, selectedCategory, selectedStatus, selectedFormat]);

  const handleAddBook = (bookData: BookFormData) => {
    const newBook: Book = {
      ...bookData,
      id: `bk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setBooks((prevBooks) => [newBook, ...prevBooks]);
  };

  const handleToggleStatus = (bookId: string) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id !== bookId) return book;

        const nextStatus = getNextBookStatus(book.status);
        let nextPage = book.currentPage;

        if (nextStatus === 'selesai') {
          nextPage = book.pages;
        } else if (nextStatus === 'ingin-dibaca') {
          nextPage = 0;
        } else if (nextPage === 0 || nextPage >= book.pages) {
          nextPage = Math.max(1, Math.round(book.pages * 0.4));
        }

        return {
          ...book,
          status: nextStatus,
          currentPage: nextPage,
        };
      }),
    );
  };

  const handleToggleFavorite = (bookId: string) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book,
      ),
    );
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    if (selectedBookId === bookId) {
      setSelectedBookId(null);
    }
  };

  const handleViewDetail = (book: Book) => {
    setSelectedBookId(book.id);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedStatus('semua');
    setSelectedFormat('Semua');
  };

  const handleResetInitialData = () => {
    const confirmed = window.confirm(
      'Kembalikan seluruh koleksi buku ke data awal LitSpace? Perubahan yang tersimpan di browser akan diganti.',
    );
    if (!confirmed) return;

    setBooks(INITIAL_BOOKS);
    setSelectedBookId(null);
    setSearchQuery('');
    setSortBy('terbaru');
    setSelectedCategory('Semua');
    setSelectedStatus('semua');
    setSelectedFormat('Semua');
  };

  return (
    <div className="ls-app">
      <Navbar totalBooks={books.length} />

      <main className="ls-main">
        <StatsBanner books={books} />

        <section
          className="ls-catalog-section"
          id="katalog"
          aria-labelledby="ls-catalog-heading"
        >
          <div className="ls-container">
            <div className="ls-section-header">
              <div>
                <p className="ls-section-header__eyebrow">Koleksi Perpustakaan</p>
                <h2 className="ls-section-header__title" id="ls-catalog-heading">
                  Katalog Buku LitSpace
                </h2>
                <p className="ls-section-header__subtitle">
                  Cari judul atau penulis, saring koleksi, urutkan daftar, atau tambahkan buku baru
                  yang tersimpan otomatis di browser Anda.
                </p>
              </div>

              <div className="ls-section-header__actions">
                <span className="ls-section-header__count">
                  {filteredAndSortedBooks.length} dari {books.length} Judul
                </span>
                <button
                  type="button"
                  className="ls-btn ls-btn--outline ls-btn--sm"
                  onClick={handleResetInitialData}
                >
                  Reset Data Awal
                </button>
                <button
                  type="button"
                  className="ls-btn ls-btn--primary ls-btn--sm"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  Tambah Buku
                </button>
              </div>
            </div>

            <div className="ls-mobile-filter-bar">
              <button
                type="button"
                className={`ls-mobile-filter-toggle${
                  isMobileSidebarOpen ? ' ls-mobile-filter-toggle--open' : ''
                }`}
                onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
                aria-expanded={isMobileSidebarOpen}
                aria-controls="ls-filter-sidebar"
              >
                <span className="ls-mobile-filter-toggle__left">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  <span>{isMobileSidebarOpen ? 'Sembunyikan Filter' : 'Tampilkan Filter'}</span>
                  {activeFilterTags.length > 0 && (
                    <span className="ls-mobile-filter-toggle__badge">
                      {activeFilterTags.length}
                    </span>
                  )}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`ls-filter-toggle__icon${
                    isMobileSidebarOpen ? ' ls-filter-toggle__icon--expanded' : ''
                  }`}
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>

            <div className="ls-catalog-layout">
              <FilterSidebar
                selectedCategory={selectedCategory}
                selectedStatus={selectedStatus}
                selectedFormat={selectedFormat}
                hasActiveFilters={hasActiveFilters}
                totalFiltered={filteredAndSortedBooks.length}
                totalBooks={books.length}
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
                categoryCounts={categoryCounts}
                statusCounts={statusCounts}
                formatCounts={formatCounts}
                onCategoryChange={setSelectedCategory}
                onStatusChange={setSelectedStatus}
                onFormatChange={setSelectedFormat}
                onResetFilters={handleResetFilters}
              />

              <div className="ls-catalog-content">
                <div className="ls-toolbar" role="search" aria-label="Pencarian dan pengurutan buku">
                  <div className="ls-search-box">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ls-search-box__icon"
                      aria-hidden="true"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      type="search"
                      className="ls-search-box__input"
                      placeholder="Cari judul buku atau nama penulis..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      aria-label="Cari judul buku atau nama penulis"
                    />
                    {searchQuery.length > 0 && (
                      <button
                        type="button"
                        className="ls-search-box__clear"
                        onClick={() => setSearchQuery('')}
                        aria-label="Hapus kata kunci pencarian"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="ls-sort-control">
                    <label htmlFor="ls-sort-books" className="ls-sort-control__label">
                      Urutkan
                    </label>
                    <select
                      id="ls-sort-books"
                      className="ls-sort-control__select"
                      value={sortBy}
                      onChange={(event) => setSortBy(event.target.value as BookSortOption)}
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="ls-active-filters" aria-label="Filter yang sedang aktif">
                    <span className="ls-active-filters__label">Filter aktif:</span>
                    {activeFilterTags.map((tag) => (
                      <span key={tag.id} className="ls-active-pill">
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}

                {filteredAndSortedBooks.length === 0 ? (
                  <div className="ls-empty-state" role="status">
                    <span className="ls-empty-state__icon" aria-hidden="true">
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        <path d="m9.5 8.5 5 5" />
                        <path d="m14.5 8.5-5 5" />
                      </svg>
                    </span>

                    <h3 className="ls-empty-state__title">
                      {books.length === 0
                        ? 'Belum ada buku di katalog'
                        : 'Tidak ada buku yang cocok dengan pencarian atau filter'}
                    </h3>
                    <p className="ls-empty-state__desc">
                      {books.length === 0
                        ? 'Tambahkan buku baru atau klik Reset Data Awal untuk mengembalikan koleksi bawaan LitSpace.'
                        : 'Coba ubah kata kunci pencarian atau kombinasi filter, atau reset filter untuk menampilkan semua koleksi.'}
                    </p>

                    {books.length === 0 ? (
                      <div className="ls-section-header__actions">
                        <button
                          type="button"
                          className="ls-btn ls-btn--outline"
                          onClick={handleResetInitialData}
                        >
                          Reset Data Awal
                        </button>
                        <button
                          type="button"
                          className="ls-btn ls-btn--primary"
                          onClick={() => setIsAddModalOpen(true)}
                        >
                          Tambah Buku Baru
                        </button>
                      </div>
                    ) : (
                      hasActiveFilters && (
                        <button
                          type="button"
                          className="ls-btn ls-btn--primary"
                          onClick={handleResetFilters}
                        >
                          Reset Semua Filter
                        </button>
                      )
                    )}
                  </div>
                ) : (
                  <div className="ls-book-grid">
                    {filteredAndSortedBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onToggleStatus={handleToggleStatus}
                        onToggleFavorite={handleToggleFavorite}
                        onDelete={handleDeleteBook}
                        onViewDetail={handleViewDetail}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer totalBooks={books.length} />

      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBook={handleAddBook}
      />

      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBookId(null)}
        onToggleStatus={handleToggleStatus}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleDeleteBook}
      />
    </div>
  );
}
