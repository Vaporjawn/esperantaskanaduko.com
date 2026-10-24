# PHASE 4: MATERIAL-UI POPUP INTERFACE

**Phase Objective**: Build React popup UI with Material-UI components for extension control

**Estimated Time**: 2-3 hours
**Total Tasks in Phase 4**: 42 tasks
**Completion**: 0/42 tasks complete (0%)

**Prerequisites**:
- ✅ Phase 1 Complete (Vite project setup)
- ✅ Phase 2 Complete (Translation service)
- ✅ Phase 3 Complete (Background service worker)
- ✅ React 18+ installed
- ✅ Material-UI 5+ installed

---

## STEP 4.1: Create Popup Structure

**Step Objective**: Set up popup directory and React entry point

### Task 4.1.1: Create Popup Directory and Files
- [ ] 4.1.1.1 **Create popup directory**
      ```powershell
      New-Item -Path "src/popup" -ItemType Directory
      ```
- [ ] 4.1.1.2 **Verify directory created**
      ```powershell
      ls src
      ```
      - Confirm `popup/` in list
- [ ] 4.1.1.3 **Create Popup.tsx**
      ```powershell
      New-Item -Path "src/popup/Popup.tsx" -ItemType File
      ```
- [ ] 4.1.1.4 **Create popup.html**
      ```powershell
      New-Item -Path "public/popup.html" -ItemType File
      ```
- [ ] 4.1.1.5 **Create index.tsx entry point**
      ```powershell
      New-Item -Path "src/popup/index.tsx" -ItemType File
      ```

### Task 4.1.2: Create popup.html Template
- [ ] 4.1.2.1 **Open popup.html**
      ```powershell
      code public/popup.html
      ```
- [ ] 4.1.2.2 **Add HTML structure**
      ```html
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Esperanto Translator</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/popup/index.tsx"></script>
        </body>
      </html>
      ```
- [ ] 4.1.2.3 **Save file**
- [ ] 4.1.2.4 **Verify HTML structure**
      - Has root div
      - Script points to popup/index.tsx

### Task 4.1.3: Create React Entry Point
- [ ] 4.1.3.1 **Open src/popup/index.tsx**
      ```powershell
      code src/popup/index.tsx
      ```
- [ ] 4.1.3.2 **Add imports**
      ```typescript
      import React from 'react';
      import ReactDOM from 'react-dom/client';
      import Popup from './Popup';
      import '@fontsource/roboto/300.css';
      import '@fontsource/roboto/400.css';
      import '@fontsource/roboto/500.css';
      import '@fontsource/roboto/700.css';
      ```
      - Roboto fonts for Material-UI
- [ ] 4.1.3.3 **Get root element**
      ```typescript
      const rootElement = document.getElementById('root');

      if (!rootElement) {
        throw new Error('Root element not found');
      }
      ```
- [ ] 4.1.3.4 **Create React root and render**
      ```typescript
      const root = ReactDOM.createRoot(rootElement);

      root.render(
        <React.StrictMode>
          <Popup />
        </React.StrictMode>
      );
      ```
- [ ] 4.1.3.5 **Save file**
- [ ] 4.1.3.6 **Install Roboto fonts**
      ```powershell
      npm install @fontsource/roboto
      ```
      - Wait for installation (~5-10 seconds)

---

## STEP 4.2: Create Material-UI Theme

**Step Objective**: Set up custom theme with brand colors

### Task 4.2.1: Create Theme File
- [ ] 4.2.1.1 **Create theme.ts**
      ```powershell
      New-Item -Path "src/popup/theme.ts" -ItemType File
      ```
- [ ] 4.2.1.2 **Open theme.ts**
      ```powershell
      code src/popup/theme.ts
      ```
- [ ] 4.2.1.3 **Add imports**
      ```typescript
      import { createTheme } from '@mui/material/styles';
      ```

### Task 4.2.2: Define Theme Configuration
- [ ] 4.2.2.1 **Create theme object**
      ```typescript
      export const theme = createTheme({
      ```
- [ ] 4.2.2.2 **Configure color palette**
      ```typescript
        palette: {
          primary: {
            main: '#4CAF50', // Green for Esperanto
            light: '#80E27E',
            dark: '#087F23',
          },
          secondary: {
            main: '#2196F3', // Blue accent
            light: '#6EC6FF',
            dark: '#0069C0',
          },
          error: {
            main: '#f44336',
          },
          background: {
            default: '#ffffff',
            paper: '#f5f5f5',
          },
        },
      ```
      - Green represents Esperanto flag
- [ ] 4.2.2.3 **Configure typography**
      ```typescript
        typography: {
          fontFamily: 'Roboto, Arial, sans-serif',
          h6: {
            fontWeight: 500,
          },
          button: {
            textTransform: 'none', // No all-caps buttons
          },
        },
      ```
- [ ] 4.2.2.4 **Configure component defaults**
      ```typescript
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      ```
- [ ] 4.2.2.5 **Close theme object**
      ```typescript
      });
      ```
- [ ] 4.2.2.6 **Save file**

---

## STEP 4.3: Build Popup Component Structure

**Step Objective**: Create main Popup component with state management

### Task 4.3.1: Define Component Interfaces
- [ ] 4.3.1.1 **Open src/popup/Popup.tsx**
      ```powershell
      code src/popup/Popup.tsx
      ```
- [ ] 4.3.1.2 **Add imports**
      ```typescript
      import React, { useState, useEffect } from 'react';
      import {
        ThemeProvider,
        CssBaseline,
        Box,
        AppBar,
        Toolbar,
        Typography,
        Button,
        CircularProgress,
        Alert,
        IconButton,
      } from '@mui/material';
      import CloseIcon from '@mui/icons-material/Close';
      import TranslateIcon from '@mui/icons-material/Translate';
      import RestoreIcon from '@mui/icons-material/Restore';
      import { theme } from './theme';
      ```
- [ ] 4.3.1.3 **Define TranslationState interface**
      ```typescript
      interface TranslationState {
        isTranslated: boolean;
        originalLanguage?: string;
        timestamp?: number;
      }
      ```
- [ ] 4.3.1.4 **Define component state type**
      ```typescript
      interface PopupState {
        loading: boolean;
        translationState: TranslationState | null;
        error: string | null;
      }
      ```

### Task 4.3.2: Create Popup Component Shell
- [ ] 4.3.2.1 **Define Popup component**
      ```typescript
      const Popup: React.FC = () => {
      ```
- [ ] 4.3.2.2 **Initialize state**
      ```typescript
        const [state, setState] = useState<PopupState>({
          loading: true,
          translationState: null,
          error: null,
        });
      ```
- [ ] 4.3.2.3 **Add helper setState functions**
      ```typescript
        const setLoading = (loading: boolean) => {
          setState(prev => ({ ...prev, loading }));
        };

        const setError = (error: string | null) => {
          setState(prev => ({ ...prev, error }));
        };

        const setTranslationState = (translationState: TranslationState | null) => {
          setState(prev => ({ ...prev, translationState }));
        };
      ```

### Task 4.3.3: Implement useEffect for Initial State
- [ ] 4.3.3.1 **Add useEffect hook**
      ```typescript
        useEffect(() => {
      ```
- [ ] 4.3.3.2 **Get current tab**
      ```typescript
          const getCurrentTab = async () => {
            const tabs = await chrome.tabs.query({
              active: true,
              currentWindow: true
            });
            return tabs[0];
          };
      ```
- [ ] 4.3.3.3 **Request translation state**
      ```typescript
          const loadState = async () => {
            try {
              setLoading(true);
              const tab = await getCurrentTab();

              if (!tab?.id) {
                setError('No active tab found');
                return;
              }

              chrome.runtime.sendMessage(
                { type: 'GET_STATE', tabId: tab.id },
                (response) => {
                  if (chrome.runtime.lastError) {
                    setError(chrome.runtime.lastError.message);
                  } else if (response.success) {
                    setTranslationState(response.data);
                  } else {
                    setError(response.error || 'Failed to get state');
                  }
                  setLoading(false);
                }
              );
            } catch (err) {
              setError(err.message || 'Unknown error');
              setLoading(false);
            }
          };
      ```
- [ ] 4.3.3.4 **Call loadState**
      ```typescript
          loadState();
        }, []);
      ```
      - Empty dependency array = run once on mount

---

## STEP 4.4: Implement Translation Actions

**Step Objective**: Add translate and revert button handlers

### Task 4.4.1: Create Translate Handler
- [ ] 4.4.1.1 **Define handleTranslate function**
      ```typescript
        const handleTranslate = async () => {
      ```
- [ ] 4.4.1.2 **Set loading state**
      ```typescript
          try {
            setLoading(true);
            setError(null);
      ```
- [ ] 4.4.1.3 **Get current tab**
      ```typescript
            const tabs = await chrome.tabs.query({
              active: true,
              currentWindow: true
            });

            if (!tabs[0]?.id) {
              setError('No active tab');
              setLoading(false);
              return;
            }
      ```
- [ ] 4.4.1.4 **Send translate message**
      ```typescript
            chrome.runtime.sendMessage(
              { type: 'TRANSLATE_PAGE', tabId: tabs[0].id },
              (response) => {
                if (chrome.runtime.lastError) {
                  setError(chrome.runtime.lastError.message);
                } else if (response.success) {
                  setTranslationState({
                    isTranslated: true,
                    timestamp: Date.now(),
                  });
                } else {
                  setError(response.error || 'Translation failed');
                }
                setLoading(false);
              }
            );
          } catch (err) {
            setError(err.message || 'Unknown error');
            setLoading(false);
          }
        };
      ```

### Task 4.4.2: Create Revert Handler
- [ ] 4.4.2.1 **Define handleRevert function**
      ```typescript
        const handleRevert = async () => {
      ```
- [ ] 4.4.2.2 **Set loading state**
      ```typescript
          try {
            setLoading(true);
            setError(null);
      ```
- [ ] 4.4.2.3 **Get current tab**
      ```typescript
            const tabs = await chrome.tabs.query({
              active: true,
              currentWindow: true
            });

            if (!tabs[0]?.id) {
              setError('No active tab');
              setLoading(false);
              return;
            }
      ```
- [ ] 4.4.2.4 **Send revert message**
      ```typescript
            chrome.runtime.sendMessage(
              { type: 'REVERT_PAGE', tabId: tabs[0].id },
              (response) => {
                if (chrome.runtime.lastError) {
                  setError(chrome.runtime.lastError.message);
                } else if (response.success) {
                  setTranslationState({
                    isTranslated: false,
                  });
                } else {
                  setError(response.error || 'Revert failed');
                }
                setLoading(false);
              }
            );
          } catch (err) {
            setError(err.message || 'Unknown error');
            setLoading(false);
          }
        };
      ```

### Task 4.4.3: Create Close Popup Handler
- [ ] 4.4.3.1 **Define handleClose function**
      ```typescript
        const handleClose = () => {
          window.close();
        };
      ```
      - Closes popup window

---

## STEP 4.5: Build UI Component Tree

**Step Objective**: Create JSX structure with Material-UI components

### Task 4.5.1: Create Main Container
- [ ] 4.5.1.1 **Start return statement**
      ```typescript
        return (
          <ThemeProvider theme={theme}>
            <CssBaseline />
      ```
      - ThemeProvider applies custom theme
      - CssBaseline normalizes styles
- [ ] 4.5.1.2 **Create main Box container**
      ```typescript
            <Box
              sx={{
                width: 320,
                minHeight: 200,
                bgcolor: 'background.default',
              }}
            >
      ```
      - Fixed width popup
      - Minimum height for content

### Task 4.5.2: Create App Bar Header
- [ ] 4.5.2.1 **Add AppBar component**
      ```typescript
              <AppBar position="static" elevation={0}>
                <Toolbar>
      ```
- [ ] 4.5.2.2 **Add title with icon**
      ```typescript
                  <TranslateIcon sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Esperanto Translator
                  </Typography>
      ```
- [ ] 4.5.2.3 **Add close button**
      ```typescript
                  <IconButton
                    color="inherit"
                    onClick={handleClose}
                    edge="end"
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
      ```

### Task 4.5.3: Create Content Area
- [ ] 4.5.3.1 **Add content Box**
      ```typescript
              <Box sx={{ p: 2 }}>
      ```
      - 16px padding all sides
- [ ] 4.5.3.2 **Add error alert (conditional)**
      ```typescript
                {state.error && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                  >
                    {state.error}
                  </Alert>
                )}
      ```
      - Shows errors if present
      - Dismissible

### Task 4.5.4: Create Translation Status Display
- [ ] 4.5.4.1 **Add status Typography**
      ```typescript
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Status:{' '}
                  {state.loading ? (
                    'Loading...'
                  ) : state.translationState?.isTranslated ? (
                    <Box component="span" color="success.main" fontWeight="bold">
                      Translated to Esperanto
                    </Box>
                  ) : (
                    <Box component="span">
                      Original Language
                    </Box>
                  )}
                </Typography>
      ```
- [ ] 4.5.4.2 **Add timestamp (if translated)**
      ```typescript
                {state.translationState?.isTranslated &&
                 state.translationState.timestamp && (
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                    Translated at: {new Date(state.translationState.timestamp).toLocaleTimeString()}
                  </Typography>
                )}
      ```

### Task 4.5.5: Create Action Buttons
- [ ] 4.5.5.1 **Add button container**
      ```typescript
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
      ```
- [ ] 4.5.5.2 **Add Translate button**
      ```typescript
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleTranslate}
                    disabled={state.loading || state.translationState?.isTranslated}
                    startIcon={
                      state.loading ?
                        <CircularProgress size={20} color="inherit" /> :
                        <TranslateIcon />
                    }
                  >
                    {state.loading ? 'Translating...' : 'Translate to Esperanto'}
                  </Button>
      ```
      - Disabled when loading or already translated
      - Shows spinner when loading
- [ ] 4.5.5.3 **Add Revert button**
      ```typescript
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleRevert}
                    disabled={state.loading || !state.translationState?.isTranslated}
                    startIcon={<RestoreIcon />}
                  >
                    Revert to Original
                  </Button>
      ```
      - Disabled when loading or not translated
- [ ] 4.5.5.4 **Close button container**
      ```typescript
                </Box>
      ```

### Task 4.5.6: Close Component JSX
- [ ] 4.5.6.1 **Close content Box**
      ```typescript
              </Box>
      ```
- [ ] 4.5.6.2 **Close main Box**
      ```typescript
            </Box>
      ```
- [ ] 4.5.6.3 **Close ThemeProvider**
      ```typescript
          </ThemeProvider>
        );
      };
      ```
- [ ] 4.5.6.4 **Export component**
      ```typescript
      export default Popup;
      ```

---

## STEP 4.6: Update Vite Configuration

**Step Objective**: Configure Vite to build popup bundle

### Task 4.6.1: Update vite.config.ts for Popup
- [ ] 4.6.1.1 **Open vite.config.ts**
      ```powershell
      code vite.config.ts
      ```
- [ ] 4.6.1.2 **Add popup to build.rollupOptions.input**
      - Should already have background entry
      - Add popup: 'public/popup.html'
      ```typescript
      input: {
        popup: 'public/popup.html',
        background: 'src/background/background.ts',
      },
      ```
- [ ] 4.6.1.3 **Save file**
- [ ] 4.6.1.4 **Verify config**
      - Both popup and background entries present

### Task 4.6.2: Update manifest.json for Popup
- [ ] 4.6.2.1 **Open public/manifest.json**
      ```powershell
      code public/manifest.json
      ```
- [ ] 4.6.2.2 **Add action field**
      ```json
      "action": {
        "default_popup": "popup.html",
        "default_icon": {
          "16": "icons/icon16.png",
          "48": "icons/icon48.png",
          "128": "icons/icon128.png"
        },
        "default_title": "Translate to Esperanto"
      },
      ```
      - Defines popup behavior
- [ ] 4.6.2.3 **Save file**

---

## STEP 4.7: Testing and Validation

**Step Objective**: Test popup in Chrome extension

### Task 4.7.1: Install Material-UI Icons
- [ ] 4.7.1.1 **Install @mui/icons-material**
      ```powershell
      npm install @mui/icons-material
      ```
      - Wait ~10-15 seconds
- [ ] 4.7.1.2 **Verify installation**
      ```powershell
      npm list @mui/icons-material
      ```
      - Should show version number

### Task 4.7.2: Build Extension
- [ ] 4.7.2.1 **Run build**
      ```powershell
      npm run build
      ```
      - Wait for build to complete
- [ ] 4.7.2.2 **Check for errors**
      - No build errors
      - Warnings acceptable
- [ ] 4.7.2.3 **Verify dist/ contains popup.html**
      ```powershell
      ls dist
      ```
      - Should see popup.html

### Task 4.7.3: Reload Extension in Chrome
- [ ] 4.7.3.1 **Open chrome://extensions/**
- [ ] 4.7.3.2 **Click reload button** on extension
      - Circular arrow icon
- [ ] 4.7.3.3 **Check for errors**
      - No red error badge

### Task 4.7.4: Test Popup UI
- [ ] 4.7.4.1 **Click extension icon in toolbar**
      - Popup should appear
- [ ] 4.7.4.2 **Verify popup dimensions**
      - 320px wide
      - Content visible
- [ ] 4.7.4.3 **Check header**
      - Green AppBar with title
      - Translate icon present
      - Close button works
- [ ] 4.7.4.4 **Check status display**
      - Shows "Original Language" initially
      - No errors displayed
- [ ] 4.7.4.5 **Check buttons**
      - Translate button enabled
      - Revert button disabled (not translated yet)

### Task 4.7.5: Test Theme and Styling
- [ ] 4.7.5.1 **Verify colors**
      - Primary green: #4CAF50
      - AppBar uses primary color
      - Buttons use theme colors
- [ ] 4.7.5.2 **Verify typography**
      - Roboto font loaded
      - Title readable
      - Text properly sized
- [ ] 4.7.5.3 **Verify spacing**
      - Consistent padding
      - Button gaps appropriate
      - No overflow issues
- [ ] 4.7.5.4 **Check button styles**
      - Rounded corners (8px)
      - Proper hover effects
      - Icons aligned correctly

### Task 4.7.6: Test Error Handling
- [ ] 4.7.6.1 **Open DevTools for popup**
      - Right-click popup → Inspect
- [ ] 4.7.6.2 **Check console for errors**
      - No red errors
      - React warnings acceptable
- [ ] 4.7.6.3 **Test error alert**
      - Manually trigger error state (modify code temporarily)
      - Verify error Alert shows
      - Verify dismiss button works
- [ ] 4.7.6.4 **Restore code if modified**

### Task 4.7.7: Test State Management
- [ ] 4.7.7.1 **Open popup DevTools console**
- [ ] 4.7.7.2 **Check initial state load**
      - GET_STATE message sent
      - Response received
      - No errors in console
- [ ] 4.7.7.3 **Verify loading states**
      - Loading shows initially
      - Disappears when state loaded
      - Buttons update correctly

### Task 4.7.8: Final Validation Checklist
- [ ] 4.7.8.1 **Popup opens correctly**
      - Click extension icon
      - Popup appears
      - Correct size (320px)
- [ ] 4.7.8.2 **All UI elements present**:
      - [ ] AppBar with title and icons
      - [ ] Close button
      - [ ] Status display
      - [ ] Translate button
      - [ ] Revert button
      - [ ] Error alert (when errors)
- [ ] 4.7.8.3 **Material-UI theme working**:
      - [ ] Colors correct
      - [ ] Fonts loaded (Roboto)
      - [ ] Spacing consistent
      - [ ] Components styled
- [ ] 4.7.8.4 **State management functional**:
      - [ ] Loads initial state
      - [ ] Updates on actions
      - [ ] Loading states work
      - [ ] Error states work
- [ ] 4.7.8.5 **TypeScript compilation successful**
      ```powershell
      npx tsc --noEmit
      ```
      - No type errors
- [ ] 4.7.8.6 **Responsive to window size**
      - Popup looks good at 320px width
      - Content not cut off
- [ ] 4.7.8.7 **Git commit (optional)**
      ```powershell
      git add src/popup/ public/popup.html
      git commit -m "feat: implement Material-UI popup interface"
      ```
- [ ] 4.7.8.8 **Ready for Phase 5**
      - ✅ ALL PHASE 4 TASKS COMPLETE (42/42)
      - Popup UI fully functional
      - Can proceed to content script

---

## 📊 PHASE 4 PROGRESS TRACKING

**Overall Completion**: 0/42 tasks (0%)

### Step Breakdown:
- [ ] Step 4.1: Popup Structure (5 tasks, 0%)
- [ ] Step 4.2: Material-UI Theme (6 tasks, 0%)
- [ ] Step 4.3: Component Structure (8 tasks, 0%)
- [ ] Step 4.4: Translation Actions (7 tasks, 0%)
- [ ] Step 4.5: UI Component Tree (16 tasks, 0%)
- [ ] Step 4.6: Vite Configuration (4 tasks, 0%)
- [ ] Step 4.7: Testing (16 tasks, 0%)

---

**Next File**: PHASE-05-CONTENT-SCRIPT-TOGGLE.instructions.md
