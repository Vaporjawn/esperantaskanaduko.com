import { existsSync } from 'fs';
import { join } from 'path';
import { libraryBooks, esperantoBooks, FREE_PDF_CATEGORY } from '../libraryData';
import { freeBooks } from '../freeBooks';

describe('library data', () => {
  it('has unique ids across the curated list and the hosted PDFs', () => {
    const ids = libraryBooks.map(book => book.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('adds every hosted PDF to the library', () => {
    expect(libraryBooks).toHaveLength(esperantoBooks.length + freeBooks.length);
    expect(libraryBooks.filter(book => book.category === FREE_PDF_CATEGORY)).toHaveLength(freeBooks.length);
  });

  it('points every hosted PDF at a file that exists in public/', () => {
    for (const book of freeBooks) {
      expect(book.file).toMatch(/^\/books\/[a-z]{2}\/[a-z0-9-]+\.pdf$/);
      expect(existsSync(join(process.cwd(), 'public', book.file))).toBe(true);
    }
  });

  it('gives every hosted PDF a Project Gutenberg source link', () => {
    for (const book of freeBooks) {
      expect(book.sourceUrl).toMatch(/^https:\/\/www\.gutenberg\.org\/ebooks\/\d+$/);
    }
  });
});
