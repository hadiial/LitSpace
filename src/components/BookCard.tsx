import type { Book } from '../types/book';
import { BOOK_STATUS_LABELS, getNextBookStatus } from '../types/book';

export interface BookCardProps {
  book: Book;
  onToggleStatus: (bookId: string) => void;
  onToggleFavorite: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onViewDetail: (book: Book) => void;
}

export default function BookCard({
  book,
  onToggleStatus,
  onToggleFavorite,
  onDelete,
  onViewDetail,
}: BookCardProps) {
  const nextStatus = getNextBookStatus(book.status);
  const progressPercent =
    book.pages > 0
      ? Math.min(100, Math.round(((book.status === 'selesai' ? book.pages : book.currentPage) / book.pages) * 100))
      : 0;

  return (
    <article className="ls-book-card">
      {/* Cover / Placeholder */}
      <div
        className="ls-book-card__cover"
        style={
          book.coverUrl
            ? undefined
            : {
                background: `linear-gradient(135deg, ${book.coverColor}, #1e1b4b)`,
              }
        }
      >
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Sampul buku ${book.title}`}
            className="ls-book-card__cover-img"
            loading="lazy"
          />
        ) : (
          <div className="ls-book-card__placeholder-art" aria-hidden="true">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
          </div>
        )}

        <div className="ls-book-card__cover-top">
          <div className="ls-book-card__cover-badges">
            <span className="ls-book-card__category">{book.category}</span>
            <span className="ls-book-card__format">{book.format}</span>
          </div>

          <button
            type="button"
            className={`ls-icon-btn ls-icon-btn--favorite${
              book.isFavorite ? ' ls-icon-btn--favorite-active' : ''
            }`}
            onClick={() => onToggleFavorite(book.id)}
            aria-pressed={book.isFavorite}
            aria-label={
              book.isFavorite
                ? `Hapus ${book.title} dari favorit`
                : `Tambahkan ${book.title} ke favorit`
            }
            title={book.isFavorite ? 'Hapus dari favorit' : 'Tandai favorit'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={book.isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        </div>

        <div className="ls-book-card__cover-bottom">
          <span className="ls-book-card__year">
            {book.publisher ? `${book.publisher} • ` : ''}
            {book.year}
          </span>
          <span className="ls-book-card__rating" aria-label={`Rating ${book.rating} dari 5`}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {book.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="ls-book-card__body">
        <div className="ls-book-card__status-row">
          <span className={`ls-badge ls-badge--${book.status}`}>
            {BOOK_STATUS_LABELS[book.status]}
          </span>
          <span className="ls-book-card__pages">
            {book.status === 'selesai' ? book.pages : book.currentPage}/{book.pages} hlm
          </span>
        </div>

        <h3 className="ls-book-card__title">{book.title}</h3>
        <p className="ls-book-card__author">{book.author}</p>
        <p className="ls-book-card__desc">{book.description}</p>

        {/* Mini Progress Bar */}
        <div className="ls-book-card__progress" aria-label={`Progres baca ${progressPercent}%`}>
          <div
            className="ls-book-card__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="ls-book-card__actions">
          <button
            type="button"
            className="ls-card-btn ls-card-btn--status"
            onClick={() => onToggleStatus(book.id)}
            title={`Ubah status ke ${BOOK_STATUS_LABELS[nextStatus]}`}
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
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Ubah Status
          </button>

          <button
            type="button"
            className="ls-card-btn ls-card-btn--detail"
            onClick={() => onViewDetail(book)}
          >
            Lihat Detail
          </button>

          <button
            type="button"
            className="ls-card-btn ls-card-btn--danger"
            onClick={() => onDelete(book.id)}
            aria-label={`Hapus buku ${book.title}`}
            title="Hapus buku"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
