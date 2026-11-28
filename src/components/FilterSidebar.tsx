import { useState } from 'react';
import type { BookCategory, BookFormat, BookStatus } from '../types/book';
import {
  BOOK_CATEGORIES,
  BOOK_FORMATS,
  BOOK_STATUS_LABELS,
  BOOK_STATUS_OPTIONS,
} from '../types/book';

const DEFAULT_VISIBLE_OPTIONS = 3;

export interface FilterSidebarProps {
  selectedCategory: BookCategory | 'Semua';
  selectedStatus: BookStatus | 'semua';
  selectedFormat: BookFormat | 'Semua';
  hasActiveFilters: boolean;
  totalFiltered: number;
  totalBooks: number;
  categoryCounts?: Partial<Record<BookCategory, number>>;
  statusCounts?: Partial<Record<BookStatus, number>>;
  formatCounts?: Partial<Record<BookFormat, number>>;
  onCategoryChange: (category: BookCategory | 'Semua') => void;
  onStatusChange: (status: BookStatus | 'semua') => void;
  onFormatChange: (format: BookFormat | 'Semua') => void;
  onResetFilters: () => void;
}

interface FilterOptionItem<T extends string> {
  value: T;
  label: string;
  count?: number;
  dotClassName?: string;
}

interface CollapsibleFilterGroupProps<T extends string> {
  title: string;
  ariaLabel: string;
  options: readonly FilterOptionItem<T>[];
  selectedValue: T;
  isExpanded: boolean;
  onSelect: (value: T) => void;
  onToggleExpand: () => void;
}

function CollapsibleFilterGroup<T extends string>({
  title,
  ariaLabel,
  options,
  selectedValue,
  isExpanded,
  onSelect,
  onToggleExpand,
}: CollapsibleFilterGroupProps<T>) {
  const canToggle = options.length > DEFAULT_VISIBLE_OPTIONS;

  let visibleOptions: readonly FilterOptionItem<T>[] = options;
  if (canToggle && !isExpanded) {
    const baseOptions = options.slice(0, DEFAULT_VISIBLE_OPTIONS);
    const hasActiveInBase = baseOptions.some((option) => option.value === selectedValue);

    if (hasActiveInBase) {
      visibleOptions = baseOptions;
    } else {
      const activeOption = options.find((option) => option.value === selectedValue);
      visibleOptions = activeOption ? [...baseOptions, activeOption] : baseOptions;
    }
  }

  return (
    <div className="ls-filter-group">
      <h4 className="ls-filter-group__label">{title}</h4>
      <div className="ls-filter-list" role="group" aria-label={ariaLabel}>
        {visibleOptions.map((option) => {
          const isActive = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={`ls-filter-option${isActive ? ' ls-filter-option--active' : ''}`}
              onClick={() => onSelect(option.value)}
              aria-pressed={isActive}
            >
              {option.dotClassName ? (
                <span className="ls-filter-option__label-with-dot">
                  <span className={option.dotClassName} aria-hidden="true" />
                  <span className="ls-filter-option__text">{option.label}</span>
                </span>
              ) : (
                <span className="ls-filter-option__text">{option.label}</span>
              )}

              {typeof option.count === 'number' && (
                <span className="ls-filter-option__count">{option.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {canToggle && (
        <button
          type="button"
          className="ls-filter-toggle"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Tampilkan Lebih Sedikit' : 'Tampilkan Semua'}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ls-filter-toggle__icon${
              isExpanded ? ' ls-filter-toggle__icon--expanded' : ''
            }`}
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function FilterSidebar({
  selectedCategory,
  selectedStatus,
  selectedFormat,
  hasActiveFilters,
  totalFiltered,
  totalBooks,
  categoryCounts,
  statusCounts,
  formatCounts,
  onCategoryChange,
  onStatusChange,
  onFormatChange,
  onResetFilters,
}: FilterSidebarProps) {
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);

  const categoryOptions: FilterOptionItem<BookCategory | 'Semua'>[] = [
    {
      value: 'Semua',
      label: 'Semua Kategori',
      count: totalBooks,
    },
    ...BOOK_CATEGORIES.map((category) => ({
      value: category,
      label: category,
      count: categoryCounts ? (categoryCounts[category] ?? 0) : undefined,
    })),
  ];

  const statusOptions: FilterOptionItem<BookStatus | 'semua'>[] = [
    {
      value: 'semua',
      label: 'Semua Status',
      count: totalBooks,
    },
    ...BOOK_STATUS_OPTIONS.map((status) => ({
      value: status,
      label: BOOK_STATUS_LABELS[status],
      count: statusCounts ? (statusCounts[status] ?? 0) : undefined,
      dotClassName: `ls-status-dot ls-status-dot--${status}`,
    })),
  ];

  return (
    <aside className="ls-sidebar" aria-label="Filter katalog buku">
      <div className="ls-sidebar__header">
        <div className="ls-sidebar__title-group">
          <span className="ls-sidebar__icon" aria-hidden="true">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </span>
          <div>
            <h3 className="ls-sidebar__title">Filter Katalog</h3>
            <p className="ls-sidebar__subtitle">
              Menampilkan {totalFiltered} dari {totalBooks} buku
            </p>
          </div>
        </div>
      </div>

      {/* Filter Kategori */}
      <CollapsibleFilterGroup
        title="Kategori"
        ariaLabel="Filter kategori buku"
        options={categoryOptions}
        selectedValue={selectedCategory}
        isExpanded={isCategoryExpanded}
        onSelect={onCategoryChange}
        onToggleExpand={() => setIsCategoryExpanded((prev) => !prev)}
      />

      {/* Filter Status Baca */}
      <CollapsibleFilterGroup
        title="Status Baca"
        ariaLabel="Filter status baca"
        options={statusOptions}
        selectedValue={selectedStatus}
        isExpanded={isStatusExpanded}
        onSelect={onStatusChange}
        onToggleExpand={() => setIsStatusExpanded((prev) => !prev)}
      />

      {/* Filter Format Buku */}
      <div className="ls-filter-group">
        <h4 className="ls-filter-group__label">Format Buku</h4>
        <div className="ls-filter-chips" role="group" aria-label="Filter format buku">
          <button
            type="button"
            className={`ls-filter-chip${
              selectedFormat === 'Semua' ? ' ls-filter-chip--active' : ''
            }`}
            onClick={() => onFormatChange('Semua')}
            aria-pressed={selectedFormat === 'Semua'}
          >
            Semua
          </button>

          {BOOK_FORMATS.map((format) => {
            const count = formatCounts?.[format];
            const isActive = selectedFormat === format;

            return (
              <button
                key={format}
                type="button"
                className={`ls-filter-chip${isActive ? ' ls-filter-chip--active' : ''}`}
                onClick={() => onFormatChange(format)}
                aria-pressed={isActive}
              >
                {format}
                {typeof count === 'number' && <span className="ls-filter-chip__count">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tombol Reset Filter */}
      <div className="ls-sidebar__footer">
        <button
          type="button"
          className="ls-reset-btn"
          onClick={onResetFilters}
          disabled={!hasActiveFilters}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset Filter
        </button>
      </div>
    </aside>
  );
}
