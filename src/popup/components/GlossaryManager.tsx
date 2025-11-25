import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Chip from '@mui/material/Chip';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import { getGlossaryService } from '@/services/glossaryService';
import type { GlossaryEntry } from '@/types/glossary';

const GlossaryManager = () => {
  const glossaryService = getGlossaryService();
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<GlossaryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GlossaryEntry | null>(null);
  const [error, setError] = useState('');

  // Form state
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [searchQuery, entries]);

  const loadEntries = async () => {
    const allEntries = glossaryService.getAllEntries();
    setEntries(allEntries);
  };

  const filterEntries = () => {
    if (!searchQuery.trim()) {
      setFilteredEntries(entries);
      return;
    }

    const results = glossaryService.searchEntries(searchQuery);
    setFilteredEntries(results);
  };

  const handleOpenDialog = (entry?: GlossaryEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setSourceText(entry.sourceText);
      setTargetText(entry.targetText);
      setCaseSensitive(entry.caseSensitive);
      setWholeWord(entry.wholeWord);
      setNotes(entry.notes || '');
    } else {
      setEditingEntry(null);
      setSourceText('');
      setTargetText('');
      setCaseSensitive(false);
      setWholeWord(true);
      setNotes('');
    }
    setDialogOpen(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEntry(null);
    setError('');
  };

  const handleSave = async () => {
    if (!sourceText.trim() || !targetText.trim()) {
      setError('Source and target text are required');
      return;
    }

    try {
      if (editingEntry) {
        await glossaryService.updateEntry(editingEntry.id, {
          sourceText,
          targetText,
          caseSensitive,
          wholeWord,
          notes,
        });
      } else {
        await glossaryService.addEntry(sourceText, targetText, {
          targetLang: 'eo',
          caseSensitive,
          wholeWord,
          notes,
        });
      }

      await loadEntries();
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save entry');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        await glossaryService.deleteEntry(id);
        await loadEntries();
      } catch (err) {
        setError('Failed to delete entry');
      }
    }
  };

  const handleExport = () => {
    const data = glossaryService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esperanto-glossary-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (confirm('Merge with existing glossary? Click Cancel to replace.')) {
        await glossaryService.importData(data, true);
      } else {
        await glossaryService.importData(data, false);
      }

      await loadEntries();
    } catch (err) {
      setError('Failed to import glossary');
    }

    // Reset input
    event.target.value = '';
  };

  const stats = glossaryService.getStats();

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Custom Dictionary/Glossary
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Define custom translations for specific words or phrases. Glossary entries are applied
        after machine translation.
      </Typography>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Chip label={`${stats.totalEntries} entries`} size="small" color="primary" />
        <Chip label={`${stats.totalCategories} categories`} size="small" />
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Entry
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Export
        </Button>
        <Button variant="outlined" size="small" component="label" startIcon={<UploadIcon />}>
          Import
          <input type="file" hidden accept=".json" onChange={handleImport} />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Search */}
      <TextField
        size="small"
        fullWidth
        placeholder="Search entries..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          {searchQuery ? 'No matching entries found' : 'No glossary entries yet. Add your first custom translation!'}
        </Typography>
      ) : (
        <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredEntries.map(entry => (
            <ListItem
              key={entry.id}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                bgcolor: 'background.paper',
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                      {entry.sourceText}
                    </Typography>
                    <Typography variant="body2" component="span" color="text.secondary">
                      →
                    </Typography>
                    <Typography variant="body2" component="span" color="primary">
                      {entry.targetText}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    {entry.caseSensitive && (
                      <Chip label="Case Sensitive" size="small" variant="outlined" />
                    )}
                    {entry.wholeWord && <Chip label="Whole Word" size="small" variant="outlined" />}
                    {entry.usageCount > 0 && (
                      <Chip label={`Used ${entry.usageCount}×`} size="small" color="success" />
                    )}
                    {entry.notes && (
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {entry.notes}
                      </Typography>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" size="small" onClick={() => handleOpenDialog(entry)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton edge="end" size="small" onClick={() => handleDelete(entry.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Most Used Entries */}
      {stats.mostUsedEntries.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" gutterBottom>
            Most Used Entries:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
            {stats.mostUsedEntries.slice(0, 5).map((entry, index) => (
              <Chip
                key={index}
                label={`${entry.sourceText} → ${entry.targetText} (${entry.usageCount}×)`}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEntry ? 'Edit Entry' : 'Add Entry'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Source Text"
            fullWidth
            value={sourceText}
            onChange={e => setSourceText(e.target.value)}
            sx={{ mt: 1, mb: 2 }}
            placeholder="e.g., hello"
            required
          />

          <TextField
            label="Target Text (Esperanto)"
            fullWidth
            value={targetText}
            onChange={e => setTargetText(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="e.g., saluton"
            required
          />

          <TextField
            label="Notes (optional)"
            fullWidth
            multiline
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Add notes about this entry..."
          />

          <FormControlLabel
            control={
              <Switch checked={caseSensitive} onChange={e => setCaseSensitive(e.target.checked)} />
            }
            label="Case Sensitive"
          />

          <FormControlLabel
            control={<Switch checked={wholeWord} onChange={e => setWholeWord(e.target.checked)} />}
            label="Match Whole Word Only"
          />

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              Glossary entries are applied after machine translation. Use them to override or correct
              specific translations.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingEntry ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GlossaryManager;
