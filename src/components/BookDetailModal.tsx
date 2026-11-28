import { useEffect } from 'react';
import type { Book } from '../types/book';
import { BOOK_STATUS_LABELS } from '../types/book';

export interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onToggleStatus: (bookId: string) => void;
  onToggleFavorite: (bookId: string) => void;
  onDelete: (bookId: string) => void;
}

export default function BookDetailModal({
  book,
  onClose,
  onToggleStatus,
  onToggleFavorite,
  onDelete,
}: BookDetailModalProps) {
  useEffect(() => {
    if (!book) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [book, onClose]);

  if (!book) {
    return null;
  }

  const effectivePagesRead = book.status === 'selesai' ? book.pages : book.currentPage;
  const progressPercent =
    book.pages > 0 ? Math.min(100, Math.round((effectivePagesRead / book.pages) * 100)) : 0;

  return (
    <div
      className="ls-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ls-detail-modal-title"
      onClick={onClose}
    >
      <div className="ls-modal" onClick={(event) => event.stopPropagation()}>
        <div
          className="ls-modal__cover"
          style={
            book.coverUrl
              ? undefined
              : {
                  background: `linear-gradient(135deg, ${book.coverColor}, #1e1b4b)`,
                }
          }
        >
          {book.coverUrl && (
            <img
              src={book.coverUrl}
              alt={`Sampul buku ${book.title}`}
              className="ls-modal__cover-img"
            />
          )}

          <div className="ls-modal__cover-content">
            <div className="ls-modal__cover-meta">
              <span className="ls-book-card__category">{book.category}</span>
              <span className="ls-book-card__format">{book.format}</span>
              <span className="ls-book-card__rating">★ {book.rating.toFixed(1)}</span>
            </div>
            <h3 className="ls-modal__title" id="ls-detail-modal-title">
              {book.title}
            </h3>
            <p className="ls-modal__author">oleh {book.author}</p>
          </div>

          <button
            type="button"
            className="ls-modal__close"
            onClick={onClose}
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
          <div className="ls-modal__section">
            <h4 className="ls-modal__section-title">Sinopsis Buku</h4>
            <p className="ls-modal__desc">{book.description}</p>
          </div>

          <div className="ls-modal__progress">
            <div className="ls-modal__progress-head">
              <span>Progres Membaca</span>
              <strong>{progressPercent}%</strong>
            </div>
            <div
              className="ls-progress-bar"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progres membaca buku"
            >
              <div
                className="ls-progress-bar__fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="ls-modal__specs">
            <div className="ls-modal__spec-item">
              <span>Status Baca</span>
              <strong>{BOOK_STATUS_LABELS[book.status]}</strong>
            </div>
            <div className="ls-modal__spec-item">
              <span>Progres Halaman</span>
              <strong>
                {effectivePagesRead} / {book.pages} halaman
              </strong>
            </div>
            <div className="ls-modal__spec-item">
              <span>Format</span>
              <strong>{book.format}</strong>
            </div>
            <div className="ls-modal__spec-item">
              <span>Tahun Terbit</span>
              <strong>{book.year}</strong>
            </div>
            <div className="ls-modal__spec-item">
              <span>Penerbit</span>
              <strong>{book.publisher || '-'}</strong>
            </div>
            <div className="ls-modal__spec-item">
              <span>ISBN</span>
              <strong>{book.isbn || '-'}</strong>
            </div>
          </div>

          <div className="ls-modal__actions ls-modal__actions--between">
            <button
              type="button"
              className="ls-btn ls-btn--danger-outline"
              onClick={() => onDelete(book.id)}
            >
              Hapus Buku
            </button>

            <div className="ls-modal__actions-right">
              <button
                type="button"
                className="ls-btn ls-btn--outline"
                onClick={() => onToggleFavorite(book.id)}
              >
                {book.isFavorite ? 'Hapus Favorit' : 'Tandai Favorit'}
              </button>
              <button
                type="button"
                className="ls-btn ls-btn--primary"
                onClick={() => onToggleStatus(book.id)}
              >
                Ubah Status Baca
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
