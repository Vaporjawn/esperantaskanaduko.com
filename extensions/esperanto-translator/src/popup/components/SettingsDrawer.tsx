import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import { useSettings } from '../hooks/useSettings';
import GlossaryManager from './GlossaryManager';
import { CacheSettings } from './CacheSettings';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDrawer = ({ open, onClose }: SettingsDrawerProps) => {
  const { settings, updateSettings } = useSettings();
  const [newDomain, setNewDomain] = useState('');
  const [domainError, setDomainError] = useState('');

  const handleAddDomain = (type: 'whitelist' | 'blacklist') => {
    if (!newDomain.trim()) {
      setDomainError('Domain cannot be empty');
      return;
    }

    // Basic domain validation
    const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
    if (!domainPattern.test(newDomain.replace(/^\*\./, ''))) {
      setDomainError('Invalid domain format');
      return;
    }

    const key = type === 'whitelist' ? 'whitelistedDomains' : 'blacklistedDomains';
    const currentDomains = settings[key];

    if (currentDomains.includes(newDomain)) {
      setDomainError('Domain already exists');
      return;
    }

    updateSettings({ [key]: [...currentDomains, newDomain] });
    setNewDomain('');
    setDomainError('');
  };

  const handleRemoveDomain = (domain: string, type: 'whitelist' | 'blacklist') => {
    const key = type === 'whitelist' ? 'whitelistedDomains' : 'blacklistedDomains';
    const currentDomains = settings[key];
    updateSettings({ [key]: currentDomains.filter(d => d !== domain) });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 2, maxHeight: '100vh', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Settings</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* General Settings */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                General
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoTranslate}
                    onChange={e => updateSettings({ autoTranslate: e.target.checked })}
                  />
                }
                label="Auto-translate pages"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ ml: 4, mt: -0.5 }}>
                Automatically translate whitelisted domains on page load
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.preserveFormatting}
                    onChange={e => updateSettings({ preserveFormatting: e.target.checked })}
                  />
                }
                label="Preserve formatting"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableCache}
                    onChange={e => updateSettings({ enableCache: e.target.checked })}
                  />
                }
                label="Enable cache"
              />
            </Box>

            <Divider />

            {/* Translation Quality */}
            <Box>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Typography variant="subtitle2" color="text.secondary">
                    Translation Quality
                  </Typography>
                </FormLabel>
                <RadioGroup
                  value={settings.translationQuality}
                  onChange={e => updateSettings({ translationQuality: e.target.value as 'fast' | 'balanced' | 'accurate' })}
                >
                  <FormControlLabel
                    value="fast"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body2">Fast</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Quick translations, lower accuracy
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="balanced"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body2">Balanced</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Good balance of speed and quality
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="accurate"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body2">Accurate</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Best quality, slower translations
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Divider />

            {/* Whitelisted Domains */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Whitelisted Domains
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                Auto-translate these domains when enabled
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="example.com or *.wikipedia.org"
                  value={newDomain}
                  onChange={e => {
                    setNewDomain(e.target.value);
                    setDomainError('');
                  }}
                  error={!!domainError}
                  helperText={domainError}
                />
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddDomain('whitelist')}
                >
                  Add
                </Button>
              </Box>

              {settings.whitelistedDomains.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No whitelisted domains
                </Typography>
              ) : (
                <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                  {settings.whitelistedDomains.map(domain => (
                    <ListItem key={domain}>
                      <ListItemText primary={domain} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleRemoveDomain(domain, 'whitelist')}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Divider />

            {/* Blacklisted Domains */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Blacklisted Domains
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
                Never translate these domains
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="example.com or *.github.com"
                  value={newDomain}
                  onChange={e => {
                    setNewDomain(e.target.value);
                    setDomainError('');
                  }}
                  error={!!domainError}
                  helperText={domainError}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddDomain('blacklist')}
                >
                  Add
                </Button>
              </Box>

              {settings.blacklistedDomains.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No blacklisted domains
                </Typography>
              ) : (
                <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                  {settings.blacklistedDomains.map(domain => (
                    <ListItem key={domain}>
                      <ListItemText primary={domain} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleRemoveDomain(domain, 'blacklist')}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Divider />

            {/* Keyboard Shortcuts */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Keyboard Shortcuts
              </Typography>
              <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                <ListItem>
                  <ListItemText
                    primary="Translate Page"
                    secondary={navigator.platform.includes('Mac') ? 'Cmd+Shift+E' : 'Ctrl+Shift+E'}
                  />
                  <Chip label="Active" size="small" color="primary" variant="outlined" />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Restore Original"
                    secondary={navigator.platform.includes('Mac') ? 'Cmd+Shift+R' : 'Ctrl+Shift+R'}
                  />
                  <Chip label="Active" size="small" color="primary" variant="outlined" />
                </ListItem>
              </List>
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="caption">
                  Keyboard shortcuts can be customized in chrome://extensions/shortcuts
                </Typography>
              </Alert>
            </Box>

            <Divider />

            {/* Cache Settings */}
            <Box>
              <CacheSettings />
            </Box>

            <Divider />

            {/* Custom Glossary */}
            <Box>
              <GlossaryManager />
            </Box>

            <Divider />

            {/* API Configuration */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                API Configuration
              </Typography>
              <TextField
                label="API Key"
                type="password"
                size="small"
                fullWidth
                value={settings.apiKey || ''}
                onChange={e => updateSettings({ apiKey: e.target.value })}
                helperText="Google Cloud Translation API key"
              />
            </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SettingsDrawer;
