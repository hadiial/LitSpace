import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { BookCategory, BookFormData, BookFormat, BookStatus } from '../types/book';
import {
  BOOK_CATEGORIES,
  BOOK_FORMATS,
  BOOK_STATUS_LABELS,
  BOOK_STATUS_OPTIONS,
} from '../types/book';

export interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (bookData: BookFormData) => void;
}

interface FormValues {
  title: string;
  author: string;
  category: BookCategory;
  format: BookFormat;
  status: BookStatus;
  year: string;
  pages: string;
  rating: string;
  publisher: string;
  isbn: string;
  coverUrl: string;
  coverColor: string;
  description: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const COVER_COLOR_SWATCHES = [
  { label: 'Indigo', value: '#4F46E5' },
  { label: 'Biru', value: '#2563EB' },
  { label: 'Ungu', value: '#7C3AED' },
  { label: 'Teal', value: '#0F766E' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Amber', value: '#D97706' },
] as const;

const DEFAULT_FORM_VALUES: FormValues = {
  title: '',
  author: '',
  category: 'Fiksi',
  format: 'Cetak',
  status: 'ingin-dibaca',
  year: String(new Date().getFullYear()),
  pages: '250',
  rating: '4.5',
  publisher: '',
  isbn: '',
  coverUrl: '',
  coverColor: '#4F46E5',
  description: '',
};

export default function AddBookModal({ isOpen, onClose, onAddBook }: AddBookModalProps) {
  const [values, setValues] = useState<FormValues>(DEFAULT_FORM_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof FormValues;

    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[fieldName];
        return nextErrors;
      });
    }
  };

  const handleColorSelect = (color: string) => {
    setValues((prev) => ({
      ...prev,
      coverColor: color,
    }));
  };

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};
    const currentYear = new Date().getFullYear();

    if (values.title.trim().length < 2) {
      nextErrors.title = 'Judul buku minimal 2 karakter.';
    }

    if (values.author.trim().length < 2) {
      nextErrors.author = 'Nama penulis minimal 2 karakter.';
    }

    const parsedYear = Number(values.year);
    if (!Number.isInteger(parsedYear) || parsedYear < 1450 || parsedYear > currentYear + 1) {
      nextErrors.year = `Tahun terbit harus antara 1450 hingga ${currentYear + 1}.`;
    }

    const parsedPages = Number(values.pages);
    if (!Number.isInteger(parsedPages) || parsedPages <= 0 || parsedPages > 10000) {
      nextErrors.pages = 'Jumlah halaman harus berupa angka antara 1 hingga 10.000.';
    }

    const parsedRating = Number(values.rating);
    if (Number.isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      nextErrors.rating = 'Rating harus berada di rentang 0 sampai 5.';
    }

    if (values.coverUrl.trim().length > 0 && !/^https?:\/\/.+/i.test(values.coverUrl.trim())) {
      nextErrors.coverUrl = 'URL sampul harus diawali dengan http:// atau https://.';
    }

    if (values.description.trim().length < 10) {
      nextErrors.description = 'Sinopsis singkat minimal 10 karakter.';
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const parsedPages = Number(values.pages);
    const parsedYear = Number(values.year);
    const parsedRating = Number(Number(values.rating).toFixed(1));
    const initialCurrentPage =
      values.status === 'selesai'
        ? parsedPages
        : values.status === 'sedang-dibaca'
          ? Math.max(1, Math.round(parsedPages * 0.25))
          : 0;

    onAddBook({
      title: values.title.trim(),
      author: values.author.trim(),
      category: values.category,
      format: values.format,
      status: values.status,
      year: parsedYear,
      pages: parsedPages,
      currentPage: initialCurrentPage,
      rating: parsedRating,
      isFavorite: false,
      publisher: values.publisher.trim() || undefined,
      isbn: values.isbn.trim() || undefined,
      coverUrl: values.coverUrl.trim() || undefined,
      coverColor: values.coverColor,
      description: values.description.trim(),
    });

    setValues(DEFAULT_FORM_VALUES);
    setErrors({});
    onClose();
  };

  const handleCancel = () => {
    setErrors({});
    onClose();
  };

  return (
    <div
      className="ls-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ls-add-modal-title"
      onClick={handleCancel}
    >
      <div className="ls-modal ls-modal--wide" onClick={(event) => event.stopPropagation()}>
        <div className="ls-modal__header">
          <div>
            <p className="ls-modal__eyebrow">Koleksi Baru</p>
            <h3 className="ls-modal__header-title" id="ls-add-modal-title">
              Tambah Buku ke LitSpace
            </h3>
          </div>

          <button
            type="button"
            className="ls-modal__close ls-modal__close--light"
            onClick={handleCancel}
            aria-label="Tutup form tambah buku"
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

        <form className="ls-form" onSubmit={handleSubmit} noValidate>
          <div className="ls-form__grid">
            <div className="ls-form__field">
              <label htmlFor="ls-book-title" className="ls-form__label">
                Judul Buku <span className="ls-form__req">*</span>
              </label>
              <input
                id="ls-book-title"
                name="title"
                type="text"
                className={`ls-form__input${errors.title ? ' ls-form__input--error' : ''}`}
                placeholder="Contoh: Filosofi Teras"
                value={values.title}
                onChange={handleChange}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && <span className="ls-form__error">{errors.title}</span>}
            </div>

            <div className="ls-form__field">
              <label htmlFor="ls-book-author" className="ls-form__label">
                Penulis <span className="ls-form__req">*</span>
              </label>
              <input
                id="ls-book-author"
                name="author"
                type="text"
                className={`ls-form__input${errors.author ? ' ls-form__input--error' : ''}`}
                placeholder="Contoh: Henry Manampiring"
                value={values.author}
                onChange={handleChange}
                aria-invalid={Boolean(errors.author)}
              />
              {errors.author && <span className="ls-form__error">{errors.author}</span>}
            </div>
          </div>

          <div className="ls-form__grid ls-form__grid--3">
            <div className="ls-form__field">
              <label htmlFor="ls-book-category" className="ls-form__label">
                Kategori
              </label>
              <select
                id="ls-book-category"
                name="category"
                className="ls-form__select"
                value={values.category}
                onChange={handleChange}
              >
                {BOOK_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="ls-form__field">
              <label htmlFor="ls-book-format" className="ls-form__label">
                Format
              </label>
              <select
                id="ls-book-format"
                name="format"
                className="ls-form__select"
                value={values.format}
                onChange={handleChange}
              >
                {BOOK_FORMATS.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            <div className="ls-form__field">
              <label htmlFor="ls-book-status" className="ls-form__label">
                Status Baca
              </label>
              <select
                id="ls-book-status"
                name="status"
                className="ls-form__select"
                value={values.status}
                onChange={handleChange}
              >
                {BOOK_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {BOOK_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="ls-form__grid ls-form__grid--3">
            <div className="ls-form__field">
              <label htmlFor="ls-book-year" className="ls-form__label">
                Tahun Terbit <span className="ls-form__req">*</span>
              </label>
              <input
                id="ls-book-year"
                name="year"
                type="number"
                className={`ls-form__input${errors.year ? ' ls-form__input--error' : ''}`}
                value={values.year}
                onChange={handleChange}
                aria-invalid={Boolean(errors.year)}
              />
              {errors.year && <span className="ls-form__error">{errors.year}</span>}
            </div>

            <div className="ls-form__field">
              <label htmlFor="ls-book-pages" className="ls-form__label">
                Jumlah Halaman <span className="ls-form__req">*</span>
              </label>
              <input
                id="ls-book-pages"
                name="pages"
                type="number"
                min={1}
                className={`ls-form__input${errors.pages ? ' ls-form__input--error' : ''}`}
                value={values.pages}
                onChange={handleChange}
                aria-invalid={Boolean(errors.pages)}
              />
              {errors.pages && <span className="ls-form__error">{errors.pages}</span>}
            </div>

            <div className="ls-form__field">
              <label htmlFor="ls-book-rating" className="ls-form__label">
                Rating (0 - 5) <span className="ls-form__req">*</span>
              </label>
              <input
                id="ls-book-rating"
                name="rating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                className={`ls-form__input${errors.rating ? ' ls-form__input--error' : ''}`}
                value={values.rating}
                onChange={handleChange}
                aria-invalid={Boolean(errors.rating)}
              />
              {errors.rating && <span className="ls-form__error">{errors.rating}</span>}
            </div>
          </div>

          <div className="ls-form__grid">
            <div className="ls-form__field">
              <label htmlFor="ls-book-publisher" className="ls-form__label">
                Penerbit (Opsional)
              </label>
              <input
                id="ls-book-publisher"
                name="publisher"
                type="text"
                className="ls-form__input"
                placeholder="Contoh: Gramedia Pustaka Utama"
                value={values.publisher}
                onChange={handleChange}
              />
            </div>

            <div className="ls-form__field">
              <label htmlFor="ls-book-isbn" className="ls-form__label">
                ISBN (Opsional)
              </label>
              <input
                id="ls-book-isbn"
                name="isbn"
                type="text"
                className="ls-form__input"
                placeholder="Contoh: 978-602-412-518-9"
                value={values.isbn}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="ls-form__grid">
            <div className="ls-form__field">
              <label htmlFor="ls-book-coverUrl" className="ls-form__label">
                URL Sampul (Opsional)
              </label>
              <input
                id="ls-book-coverUrl"
                name="coverUrl"
                type="url"
                className={`ls-form__input${errors.coverUrl ? ' ls-form__input--error' : ''}`}
                placeholder="https://contoh.com/sampul.jpg"
                value={values.coverUrl}
                onChange={handleChange}
                aria-invalid={Boolean(errors.coverUrl)}
              />
              {errors.coverUrl && <span className="ls-form__error">{errors.coverUrl}</span>}
            </div>

            <div className="ls-form__field">
              <span className="ls-form__label">Warna Sampul Placeholder</span>
              <div className="ls-color-swatches" role="group" aria-label="Pilih warna sampul">
                {COVER_COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.value}
                    type="button"
                    className={`ls-color-swatch${
                      values.coverColor === swatch.value ? ' ls-color-swatch--active' : ''
                    }`}
                    style={{ backgroundColor: swatch.value }}
                    onClick={() => handleColorSelect(swatch.value)}
                    aria-label={`Pilih warna ${swatch.label}`}
                    aria-pressed={values.coverColor === swatch.value}
                    title={swatch.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="ls-form__field">
            <label htmlFor="ls-book-description" className="ls-form__label">
              Sinopsis Singkat <span className="ls-form__req">*</span>
            </label>
            <textarea
              id="ls-book-description"
              name="description"
              rows={3}
              className={`ls-form__textarea${errors.description ? ' ls-form__input--error' : ''}`}
              placeholder="Tuliskan ringkasan atau sinopsis buku..."
              value={values.description}
              onChange={handleChange}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && <span className="ls-form__error">{errors.description}</span>}
          </div>

          <div className="ls-modal__actions">
            <button type="button" className="ls-btn ls-btn--outline" onClick={handleCancel}>
              Batal
            </button>
            <button type="submit" className="ls-btn ls-btn--primary">
              Simpan Buku
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
