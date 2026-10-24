import React from 'react';
import { AppBar, Toolbar, Box, IconButton, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../languageSwitcher/languageSwitcher';
import { UserMenu } from '../../../components/auth/UserMenu';
import { DesktopNav } from './desktopNav';
import { MobileNav } from './mobileNav';
import { useThemeMode } from '../../../contexts/ThemeContext';

export const NavBar: React.FC = () => {
  const { t } = useTranslation();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { mode, toggleTheme } = useThemeMode();

  const isDark = mode === 'dark';

  const navItems = [
    { text: t('navigation.main.home'), link: '/' },
    {
      text: t('navigation.main.library'),
      children: [
        { text: t('library.filters.allBooks'), link: '/library' },
        { text: t('resources.sections.concertVideos.title'), link: '/library/esperanto-live-concert-videos' },
      ],
    },
    {
      text: t('navigation.main.resources'),
      children: [
        { text: t('resources.categories.all'), link: '/resources' },
        { text: t('resources.categories.learning'), link: '/resources/learning' },
        { text: t('resources.categories.grammar'), link: '/resources/grammar' },
        { text: t('resources.categories.tools'), link: '/resources/tools' },
        { text: t('resources.categories.books'), link: '/resources/books' },
        { text: t('resources.categories.music'), link: '/resources/music' },
        { text: t('resources.categories.audio'), link: '/resources/audio' },
        { text: t('resources.categories.video'), link: '/resources/video' },
        { text: t('resources.categories.community'), link: '/resources/community' },
        { text: t('resources.categories.events'), link: '/resources/events' },
        { text: t('resources.categories.organizations'), link: '/resources/organizations' },
        { text: t('resources.categories.culture'), link: '/resources/culture' },
        { text: t('resources.categories.news'), link: '/resources/news' },
      ],
    },
    {
      text: t('navigation.main.play', 'Extras'),
      children: [
        { text: t('navigation.main.hangman', 'Pendumulo (hangman)'), link: '/games/pendumulo' },
        { text: t('navigation.secondary.analyzer', 'Analyzer'), link: '/tools/analyzer' },
      ],
    },
    { text: t('navigation.main.about'), link: '/about' },
    { text: t('navigation.secondary.donate'), link: '/donate' },
    {
      text: 'External',
      children: [
        { text: 'MangaDex', link: 'https://mangadex.org/group/18541/esperanta-skanaduko' },
        { text: t('navigation.secondary.contact'), link: 'mailto:esperantaSkanaduko@gmail.com' },
      ],
    },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: isDark ? 'rgba(0, 20, 0, 0.8)' : 'rgba(232, 245, 232, 0.92)',
        backdropFilter: 'blur(10px)',
        boxShadow: isDark
          ? '0 8px 32px 0 rgba(0, 255, 0, 0.1)'
          : '0 8px 32px 0 rgba(0, 102, 0, 0.08)',
        borderBottom: isDark
          ? '1px solid rgba(0, 255, 0, 0.2)'
          : '1px solid rgba(0, 102, 0, 0.15)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center' }}>
          {isMobile ? (
            <MobileNav navItems={navItems} />
          ) : (
            <DesktopNav navItems={navItems} />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip
            title={
              isDark
                ? t('theme.switchToLight', 'Switch to light mode')
                : t('theme.switchToDark', 'Switch to dark mode')
            }
            arrow
          >
            <IconButton
              onClick={toggleTheme}
              size="small"
              aria-label={
                isDark
                  ? t('theme.switchToLight', 'Switch to light mode')
                  : t('theme.switchToDark', 'Switch to dark mode')
              }
              sx={{
                color: 'primary.main',
                transition: 'transform 0.3s ease, color 0.2s ease',
                '&:hover': {
                  transform: 'rotate(20deg) scale(1.15)',
                  backgroundColor: isDark
                    ? 'rgba(0, 255, 0, 0.08)'
                    : 'rgba(0, 102, 0, 0.08)',
                },
              }}
            >
              {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <LanguageSwitcher />
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
