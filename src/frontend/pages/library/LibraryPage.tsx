import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Pagination,
} from '@mui/material';
import { Search as SearchIcon, MenuBook, Download, OpenInNew, ChromeReaderMode } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { libraryBooks, type Book } from '../../../data/libraryData';
import { SEO } from '../../../components/SEO';
import { logAnalyticsEvent } from '../../../backend/firebase/analytics';

/** Number of books shown per page */
const PAGE_SIZE = 12;

/**
 * Determine the appropriate action button for a book URL.
 *
 * Logic:
 *  - URL ends with .pdf, .epub, .mobi → Download
 *  - URL contains gutenberg.org, wikisource, read., /read, /viewer → Read Online
 *  - Everything else → Open (external link)
 */
function getBookAction(url: string): 'read' | 'download' | 'open' {
  if (!url) return 'open';
  const lower = url.toLowerCase();

  // Direct file downloads
  if (lower.endsWith('.pdf') || lower.endsWith('.epub') || lower.endsWith('.mobi') || lower.endsWith('.txt')) {
    return 'download';
  }

  // Known readable online platforms
  if (
    lower.includes('gutenberg.org') ||
    lower.includes('wikisource') ||
    lower.includes('/read') ||
    lower.includes('read.') ||
    lower.includes('/viewer') ||
    lower.includes('archive.org/details')
  ) {
    return 'read';
  }

  return 'open';
}

const LibraryPage = () => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const isEsperanto = i18n.language === 'eo';

  // Structured data for library page
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('seo.pages.library.title', 'Esperanto Library - Books & Reading Materials'),
    description: t('seo.pages.library.description', 'Browse our curated collection of Esperanto books'),
    url: 'https://esperantaskanaduko.com/library',
    inLanguage: ['en', 'eo'],
    mainEntity: {
      '@type': 'ItemList',
      name: 'Esperanto Books Collection',
      numberOfItems: libraryBooks.length,
      itemListElement: libraryBooks.slice(0, 5).map((book, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Book',
          name: book.title,
          author: { '@type': 'Person', name: book.author },
          inLanguage: 'eo',
          bookFormat: 'EBook',
          isAccessibleForFree: true,
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://esperantaskanaduko.com' },
        { '@type': 'ListItem', position: 2, name: 'Library', item: 'https://esperantaskanaduko.com/library' },
      ],
    },
  };

  // Get unique categories
  const categories = useMemo<string[]>(() => {
    const cats = new Set<string>(libraryBooks.map((book: Book) => book.category));
    return ['all' as string, ...Array.from(cats)];
  }, []);

  // Filter books based on search and category
  const filteredBooks = useMemo(() => {
    return libraryBooks.filter((book: Book) => {
      const matchesSearch =
        searchQuery === '' ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.titleEo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.descriptionEo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Scroll back to top of book grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredBooks.length / PAGE_SIZE);
  const pageStart = (page - 1) * PAGE_SIZE; // 0-indexed
  const pageEnd = Math.min(pageStart + PAGE_SIZE, filteredBooks.length);
  const booksOnPage = filteredBooks.slice(pageStart, pageEnd);

  const getDifficultyColor = (difficulty: Book['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const handleBookOpen = (book: Book) => {
    logAnalyticsEvent('book_opened', {
      book_title: book.title,
      book_author: book.author,
    });
  };

  const renderBookButton = (book: Book) => {
    const url = book.downloadUrl || '';
    const action = getBookAction(url);

    const commonSx = {
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      border: '1px solid rgba(0, 255, 0, 0.3)',
      color: '#00ff00',
      '&:hover': {
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderColor: '#00ff00',
        transform: 'translateY(-2px)',
      },
    };

    if (action === 'read') {
      return (
        <Button
          fullWidth
          variant="contained"
          startIcon={<ChromeReaderMode />}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleBookOpen(book)}
          sx={commonSx}
        >
          {t('library.book.readOnline', isEsperanto ? 'Legi Rete' : 'Read Online')}
        </Button>
      );
    }

    if (action === 'download') {
      return (
        <Button
          fullWidth
          variant="contained"
          startIcon={<Download />}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleBookOpen(book)}
          sx={commonSx}
        >
          {t('library.book.download', isEsperanto ? 'Elŝuti' : 'Download')}
        </Button>
      );
    }

    return (
      <Button
        fullWidth
        variant="contained"
        startIcon={<OpenInNew />}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleBookOpen(book)}
        sx={commonSx}
      >
        {t('library.book.open', isEsperanto ? 'Malfermi' : 'Open')}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        background: 'linear-gradient(135deg, #000000 0%, #001a00 50%, #000000 100%)',
        paddingY: { xs: '1rem', md: '2rem' },
      }}
    >
      <SEO
        title={t('seo.pages.library.title', 'Esperanto Library - Books & Reading Materials')}
        description={t('seo.pages.library.description', 'Browse our curated collection of Esperanto books, novels, and reading materials. Perfect for learners at all levels.')}
        keywords={[
          'Esperanto books',
          'Esperanto library',
          'Esperanto reading',
          'Esperanto literature',
          'learn Esperanto reading',
          'free Esperanto ebooks',
          'Esperanto classics',
          'biblioteko',
          'esperantaj libroj',
          'free language books',
        ]}
        canonical="https://esperantaskanaduko.com/library"
        type="website"
      />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      <Container maxWidth="xl">
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', marginBottom: '3rem', animation: 'scaleIn 0.8s ease-out both' }}>
          <Typography
            variant="h1"
            sx={{
              color: '#00ff00',
              marginBottom: '1rem',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              fontFamily: 'Copperplate',
              textTransform: 'uppercase',
            }}
          >
            <MenuBook sx={{ fontSize: { xs: '3rem', md: '4rem' }, verticalAlign: 'middle', marginRight: '1rem' }} />
            {t('library.page.title', isEsperanto ? 'Biblioteko' : 'Library')}
          </Typography>
          <Typography variant="h6" sx={{
            color: 'text.secondary',
            maxWidth: '800px',
            margin: '0 auto',
            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
            padding: { xs: '0 1rem', md: 0 },
          }}>
            {isEsperanto
              ? 'Malkovru librojn en Esperanto - de klasikaĵoj al modernaj verkoj, ĉiuj senpagaj kaj alirebla por ĉiuj.'
              : 'Discover books in Esperanto - from classics to modern works, all free and accessible to everyone.'}
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ marginBottom: '3rem', animation: 'fadeIn 0.8s ease-out 0.4s both' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder={
                  isEsperanto
                    ? 'Serĉi librojn laŭ titolo, aŭtoro, aŭ priskribo...'
                    : 'Search books by title, author, or description...'
                }
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#00ff00' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  transition: 'all 0.3s ease',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(18, 20, 21, 0.9)',
                    '& fieldset': { borderColor: 'rgba(0, 255, 0, 0.3)' },
                    '&:hover': {
                      transform: 'scale(1.01)',
                      '& fieldset': { borderColor: 'rgba(0, 255, 0, 0.5)' },
                    },
                    '&.Mui-focused': {
                      transform: 'scale(1.02)',
                      '& fieldset': { borderColor: '#00ff00' },
                    },
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#00ff00' }}>
                  {isEsperanto ? 'Kategorio' : 'Category'}
                </InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  label={isEsperanto ? 'Kategorio' : 'Category'}
                  sx={{
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(18, 20, 21, 0.9)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 255, 0, 0.3)',
                      transition: 'border-color 0.3s ease',
                    },
                    '&:hover': {
                      transform: 'scale(1.01)',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(0, 255, 0, 0.5)' },
                    },
                    '&.Mui-focused': {
                      transform: 'scale(1.02)',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#00ff00' },
                    },
                  }}
                >
                  {categories.map((category: string) => (
                    <MenuItem key={category} value={category}>
                      {category === 'all'
                        ? isEsperanto ? 'Ĉiuj Kategorioj' : 'All Categories'
                        : category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Results count + pagination summary */}
          <Box sx={{ marginTop: '1rem', textAlign: 'center' }}>
            {filteredBooks.length > 0 ? (
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t('library.pagination.showing', {
                  from: pageStart + 1,
                  to: pageEnd,
                  total: filteredBooks.length,
                  defaultValue: `Showing ${pageStart + 1}–${pageEnd} of ${filteredBooks.length} books`,
                })}
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {t('library.results.noResults', isEsperanto ? 'Neniuj libroj trovitaj' : 'No books found')}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Books Grid */}
        {booksOnPage.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {booksOnPage.map((book: Book, index: number) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={book.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'rgba(18, 20, 21, 0.9)',
                      border: '1px solid rgba(0, 255, 0, 0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      animation: `fadeIn 0.6s ease-out ${index * 0.05}s both`,
                      '&:hover': {
                        borderColor: '#00ff00',
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 12px 24px rgba(0, 255, 0, 0.4), 0 0 40px rgba(0, 255, 0, 0.15)',
                      },
                    }}
                  >
                    {book.coverImage && (
                      <Box
                        component="img"
                        src={book.coverImage}
                        alt={isEsperanto ? book.titleEo : book.title}
                        sx={{
                          width: '100%',
                          height: '250px',
                          objectFit: 'cover',
                          borderBottom: '1px solid rgba(0, 255, 0, 0.2)',
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: '#00ff00',
                          marginBottom: '0.5rem',
                          fontWeight: 600,
                          minHeight: '3rem',
                        }}
                      >
                        {isEsperanto ? book.titleEo : book.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: '0.5rem' }}>
                        {t('library.book.author', isEsperanto ? 'Aŭtoro' : 'Author')}: {book.author}
                      </Typography>
                      {book.year !== undefined && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: '0.5rem' }}>
                          {t('library.book.year', isEsperanto ? 'Jaro' : 'Year')}: {book.year}
                        </Typography>
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#ffffff',
                          marginBottom: '1rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {isEsperanto ? book.descriptionEo : book.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        <Chip
                          label={book.category}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(0, 255, 0, 0.1)',
                            color: '#00ff00',
                            border: '1px solid rgba(0, 255, 0, 0.3)',
                          }}
                        />
                        {book.difficulty && (
                          <Chip
                            label={book.difficulty}
                            size="small"
                            color={getDifficultyColor(book.difficulty)}
                            variant="outlined"
                          />
                        )}
                      </Box>
                      {book.pages !== undefined && (
                        <Typography variant="caption" sx={{ color: '#666666' }}>
                          {book.pages} {t('library.book.pages', isEsperanto ? 'paĝoj' : 'pages')}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={{ padding: '1rem' }}>
                      {renderBookButton(book)}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 2 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'text.secondary',
                      borderColor: 'rgba(0, 255, 0, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        color: '#00ff00',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(0, 255, 0, 0.15)',
                        color: '#00ff00',
                        borderColor: '#00ff00',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 0, 0.25)',
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', paddingY: '4rem' }}>
            <MenuBook sx={{ fontSize: '5rem', color: '#333333', marginBottom: '1rem' }} />
            <Typography variant="h5" sx={{ color: 'text.secondary' }}>
              {t('library.results.noResults', isEsperanto ? 'Neniuj libroj trovitaj' : 'No books found')}
            </Typography>
            <Typography variant="body1" sx={{ color: '#666666', marginTop: '0.5rem' }}>
              {isEsperanto ? 'Provu alian serĉon aŭ filtrilon' : 'Try a different search or filter'}
            </Typography>
          </Box>
        )}

        {/* Acknowledgment Section */}
        <Box
          sx={{
            marginTop: '4rem',
            padding: '2rem',
            backgroundColor: 'rgba(18, 20, 21, 0.6)',
            borderRadius: '8px',
            border: '1px solid rgba(0, 255, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: '#00ff00', marginBottom: '1rem' }}>
            {t('footer.acknowledgments.title', isEsperanto ? 'Dankoj' : 'Acknowledgments')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('footer.acknowledgments.gutenberg')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LibraryPage;
