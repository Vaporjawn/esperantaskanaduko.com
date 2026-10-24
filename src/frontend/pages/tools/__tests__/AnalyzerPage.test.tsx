import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AnalyzerPage from '../AnalyzerPage';

const renderPage = () =>
  render(
    <MemoryRouter>
      <AnalyzerPage />
    </MemoryRouter>
  );

describe('AnalyzerPage', () => {
  it('analyses the sample sentence on load, one row per word', () => {
    renderPage();
    const table = screen.getByRole('table');
    // header row + the 8 words of the sample sentence
    expect(within(table).getAllByRole('row')).toHaveLength(9);
    expect(within(table).getByText('libron')).toBeInTheDocument();
  });

  it('marks the accusative plural of a noun', () => {
    renderPage();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'librojn' } });
    const row = within(screen.getByRole('table')).getByText('librojn').closest('tr') as HTMLElement;
    expect(within(row).getByText('Noun')).toBeInTheDocument();
    expect(within(row).getByText(/plural, accusative/)).toBeInTheDocument();
  });

  it('shows no table for empty input', () => {
    renderPage();
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '   ' } });
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('limits the input length', () => {
    renderPage();
    const box = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(box, { target: { value: 'a'.repeat(5000) } });
    expect(box.value).toHaveLength(2000);
  });
});
