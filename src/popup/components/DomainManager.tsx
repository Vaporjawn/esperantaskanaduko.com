import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import { useSettings } from '../hooks/useSettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`domain-tabpanel-${index}`}
      aria-labelledby={`domain-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const DomainManager = () => {
  const { settings, addToWhitelist, removeFromWhitelist, addToBlacklist, removeFromBlacklist } =
    useSettings();
  const [activeTab, setActiveTab] = useState(0);
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState('');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setNewDomain('');
    setError('');
  };

  const validateDomain = (domain: string): boolean => {
    // Basic domain validation
    const domainPattern = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainPattern.test(domain);
  };

  const handleAddDomain = async () => {
    const domain = newDomain.trim().toLowerCase();

    if (!domain) {
      setError('Please enter a domain');
      return;
    }

    if (!validateDomain(domain)) {
      setError('Invalid domain format (e.g., example.com)');
      return;
    }

    try {
      if (activeTab === 0) {
        // Whitelist
        if (settings.whitelistedDomains.includes(domain)) {
          setError('Domain already in whitelist');
          return;
        }
        if (settings.blacklistedDomains.includes(domain)) {
          setError('Domain is in blacklist. Remove it from blacklist first.');
          return;
        }
        await addToWhitelist(domain);
      } else {
        // Blacklist
        if (settings.blacklistedDomains.includes(domain)) {
          setError('Domain already in blacklist');
          return;
        }
        if (settings.whitelistedDomains.includes(domain)) {
          setError('Domain is in whitelist. Remove it from whitelist first.');
          return;
        }
        await addToBlacklist(domain);
      }

      setNewDomain('');
      setError('');
    } catch (err) {
      setError('Failed to add domain');
    }
  };

  const handleRemoveDomain = async (domain: string, type: 'whitelist' | 'blacklist') => {
    try {
      if (type === 'whitelist') {
        await removeFromWhitelist(domain);
      } else {
        await removeFromBlacklist(domain);
      }
    } catch (err) {
      setError(`Failed to remove domain from ${type}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddDomain();
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
        Domain Management
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Control which domains should automatically translate or never translate.
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab
          icon={<CheckCircleIcon />}
          iconPosition="start"
          label={`Whitelist (${settings.whitelistedDomains.length})`}
        />
        <Tab
          icon={<BlockIcon />}
          iconPosition="start"
          label={`Blacklist (${settings.blacklistedDomains.length})`}
        />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="e.g., example.com"
          value={newDomain}
          onChange={e => setNewDomain(e.target.value)}
          onKeyPress={handleKeyPress}
          error={!!error}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDomain}
          sx={{ minWidth: 100 }}
        >
          Add
        </Button>
      </Box>

      <TabPanel value={activeTab} index={0}>
        {settings.whitelistedDomains.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No whitelisted domains yet. Whitelisted domains will automatically translate when
            visited.
          </Typography>
        ) : (
          <List dense>
            {settings.whitelistedDomains.map(domain => (
              <ListItem
                key={domain}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: 'success.light',
                  '&:hover': { bgcolor: 'success.light' },
                }}
              >
                <ListItemText
                  primary={domain}
                  secondary="Auto-translate enabled"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ color: 'success.dark' }}
                />
                <ListItemSecondaryAction>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Whitelist"
                    size="small"
                    color="success"
                    sx={{ mr: 1 }}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
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
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {settings.blacklistedDomains.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No blacklisted domains yet. Blacklisted domains will never translate automatically.
          </Typography>
        ) : (
          <List dense>
            {settings.blacklistedDomains.map(domain => (
              <ListItem
                key={domain}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: 'error.light',
                  '&:hover': { bgcolor: 'error.light' },
                }}
              >
                <ListItemText
                  primary={domain}
                  secondary="Translation disabled"
                  primaryTypographyProps={{ fontWeight: 500 }}
                  secondaryTypographyProps={{ color: 'error.dark' }}
                />
                <ListItemSecondaryAction>
                  <Chip
                    icon={<BlockIcon />}
                    label="Blacklist"
                    size="small"
                    color="error"
                    sx={{ mr: 1 }}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
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
      </TabPanel>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="caption">
          <strong>Tip:</strong> Whitelisted domains will automatically translate when you visit
          them. Blacklisted domains will never translate automatically.
        </Typography>
      </Alert>
    </Box>
  );
};

export default DomainManager;
