import Footer from './components/Footer';
import Navbar from './components/Navbar';
import StatsBanner from './components/StatsBanner';
import { INITIAL_BOOKS } from './data/initialBooks';
import { BOOK_STATUS_LABELS } from './types/book';

export default function App() {
  const books = INITIAL_BOOKS;

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
                <p className="ls-section-header__eyebrow">Pratinjau Koleksi Awal</p>
                <h2 className="ls-section-header__title" id="ls-catalog-heading">
                  Katalog Buku LitSpace
                </h2>
                <p className="ls-section-header__subtitle">
                  Menampilkan daftar buku awal sebagai pratinjau tata letak katalog sebelum fitur
                  pencarian, filter, dan manajemen koleksi dihubungkan.
                </p>
              </div>
              <span className="ls-section-header__count">{books.length} Judul Tersedia</span>
            </div>

            <div className="ls-book-grid">
              {books.map((book) => (
                <article key={book.id} className="ls-book-card">
                  <div
                    className="ls-book-card__cover"
                    style={{
                      background: `linear-gradient(135deg, ${book.coverColor}, #1e1b4b)`,
                    }}
                  >
                    <div className="ls-book-card__cover-top">
                      <span className="ls-book-card__category">{book.category}</span>
                      <span className="ls-book-card__rating" aria-label={`Rating ${book.rating}`}>
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
                    <span className="ls-book-card__year">
                      {book.publisher ? `${book.publisher} • ` : ''}
                      {book.year}
                    </span>
                  </div>

                  <div className="ls-book-card__body">
                    <h3 className="ls-book-card__title">{book.title}</h3>
                    <p className="ls-book-card__author">{book.author}</p>
                    <p className="ls-book-card__desc">{book.description}</p>

                    <div className="ls-book-card__footer">
                      <span className="ls-book-card__pages">
                        {book.currentPage}/{book.pages} hlm
                      </span>
                      <span className={`ls-badge ls-badge--${book.status}`}>
                        {BOOK_STATUS_LABELS[book.status]}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer totalBooks={books.length} />
    </div>
  );
}
