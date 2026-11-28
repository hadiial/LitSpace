import { useMemo, useState } from 'react';
import BookCard from './components/BookCard';
import FilterSidebar from './components/FilterSidebar';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import StatsBanner from './components/StatsBanner';
import { INITIAL_BOOKS } from './data/initialBooks';
import type { Book, BookCategory, BookFormat, BookStatus } from './types/book';
import { BOOK_STATUS_LABELS, getNextBookStatus } from './types/book';

export default function App() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'Semua'>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<BookStatus | 'semua'>('semua');
  const [selectedFormat, setSelectedFormat] = useState<BookFormat | 'Semua'>('Semua');
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? null,
    [books, selectedBookId],
  );

  const hasActiveFilters =
    selectedCategory !== 'Semua' || selectedStatus !== 'semua' || selectedFormat !== 'Semua';

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

  const filteredBooks = useMemo(
    () =>
      books.filter((book) => {
        const matchCategory =
          selectedCategory === 'Semua' || book.category === selectedCategory;
        const matchStatus = selectedStatus === 'semua' || book.status === selectedStatus;
        const matchFormat = selectedFormat === 'Semua' || book.format === selectedFormat;

        return matchCategory && matchStatus && matchFormat;
      }),
    [books, selectedCategory, selectedStatus, selectedFormat],
  );

  const activeFilterTags = useMemo(() => {
    const tags: { id: string; label: string }[] = [];

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
  }, [selectedCategory, selectedStatus, selectedFormat]);

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
                  Saring koleksi berdasarkan kategori, status baca, atau format buku, lalu kelola
                  progres bacaan langsung dari kartu buku.
                </p>
              </div>
              <span className="ls-section-header__count">
                {filteredBooks.length} dari {books.length} Judul
              </span>
            </div>

            <div className="ls-catalog-layout">
              <FilterSidebar
                selectedCategory={selectedCategory}
                selectedStatus={selectedStatus}
                selectedFormat={selectedFormat}
                hasActiveFilters={hasActiveFilters}
                totalFiltered={filteredBooks.length}
                totalBooks={books.length}
                categoryCounts={categoryCounts}
                statusCounts={statusCounts}
                formatCounts={formatCounts}
                onCategoryChange={setSelectedCategory}
                onStatusChange={setSelectedStatus}
                onFormatChange={setSelectedFormat}
                onResetFilters={handleResetFilters}
              />

              <div className="ls-catalog-content">
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

                {filteredBooks.length === 0 ? (
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
                        : 'Tidak ada buku yang cocok dengan filter'}
                    </h3>
                    <p className="ls-empty-state__desc">
                      {books.length === 0
                        ? 'Seluruh koleksi buku telah dihapus dari daftar sementara.'
                        : 'Coba ubah kombinasi kategori, status baca, atau format buku, atau reset filter untuk menampilkan semua koleksi.'}
                    </p>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        className="ls-btn ls-btn--primary"
                        onClick={handleResetFilters}
                      >
                        Reset Semua Filter
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="ls-book-grid">
                    {filteredBooks.map((book) => (
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

      {selectedBook && (
        <div
          className="ls-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ls-detail-modal-title"
          onClick={() => setSelectedBookId(null)}
        >
          <div className="ls-modal" onClick={(event) => event.stopPropagation()}>
            <div
              className="ls-modal__cover"
              style={{
                background: `linear-gradient(135deg, ${selectedBook.coverColor}, #1e1b4b)`,
              }}
            >
              <div>
                <div className="ls-modal__cover-meta">
                  <span className="ls-book-card__category">{selectedBook.category}</span>
                  <span className="ls-book-card__format">{selectedBook.format}</span>
                  <span className="ls-book-card__rating">★ {selectedBook.rating.toFixed(1)}</span>
                </div>
                <h3 className="ls-modal__title" id="ls-detail-modal-title">
                  {selectedBook.title}
                </h3>
                <p className="ls-modal__author">oleh {selectedBook.author}</p>
              </div>

              <button
                type="button"
                className="ls-modal__close"
                onClick={() => setSelectedBookId(null)}
                aria-label="Tutup detail buku"
              >
                <svg
                  width="18"
                  height="18"
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
            </div>

            <div className="ls-modal__body">
              <p className="ls-modal__desc">{selectedBook.description}</p>

              <div className="ls-modal__specs">
                <div className="ls-modal__spec-item">
                  <span>Status Baca</span>
                  <strong>{BOOK_STATUS_LABELS[selectedBook.status]}</strong>
                </div>
                <div className="ls-modal__spec-item">
                  <span>Progres Halaman</span>
                  <strong>
                    {selectedBook.status === 'selesai'
                      ? selectedBook.pages
                      : selectedBook.currentPage}{' '}
                    / {selectedBook.pages} halaman
                  </strong>
                </div>
                <div className="ls-modal__spec-item">
                  <span>Penerbit</span>
                  <strong>{selectedBook.publisher ?? '-'}</strong>
                </div>
                <div className="ls-modal__spec-item">
                  <span>Tahun Terbit</span>
                  <strong>{selectedBook.year}</strong>
                </div>
                <div className="ls-modal__spec-item">
                  <span>ISBN</span>
                  <strong>{selectedBook.isbn ?? '-'}</strong>
                </div>
                <div className="ls-modal__spec-item">
                  <span>Favorit</span>
                  <strong>{selectedBook.isFavorite ? 'Ya, Difavoritkan' : 'Belum'}</strong>
                </div>
              </div>

              <div className="ls-modal__actions">
                <button
                  type="button"
                  className="ls-btn ls-btn--outline"
                  onClick={() => handleToggleFavorite(selectedBook.id)}
                >
                  {selectedBook.isFavorite ? 'Hapus Favorit' : 'Tandai Favorit'}
                </button>
                <button
                  type="button"
                  className="ls-btn ls-btn--primary"
                  onClick={() => handleToggleStatus(selectedBook.id)}
                >
                  Ubah Status Baca
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
