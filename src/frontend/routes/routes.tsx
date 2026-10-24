import React, { Suspense } from 'react';
import { Routes as Router, Route } from 'react-router-dom';
import { LoadingFallback } from '../../components/LoadingFallback';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Layout } from '../components/Layout';

/**
 * Lazy-loaded page components with automatic code splitting.
 * Each route is loaded on-demand for optimal performance.
 */
const Homepage = React.lazy(() => import('../pages/HomePage'));
const AboutPage = React.lazy(() => import('../pages/about/AboutPage'));
const AuthPage = React.lazy(() => import('../pages/AuthPage'));
const LibraryPage = React.lazy(() => import('../pages/library/LibraryPage'));
const DonatePage = React.lazy(() => import('../pages/DonatePage'));
const HangmanPage = React.lazy(() => import('../pages/games/HangmanPage'));
const AnalyzerPage = React.lazy(() => import('../pages/tools/AnalyzerPage'));
const NotFoundPage = React.lazy(() => import('../pages/NotFoundPage'));
const EsperantoLiveConcertVideosPage = React.lazy(
  () => import('../pages/library/EsperantoLiveConcertVideosPage')
);
const ResourcePage = React.lazy(() => import('../pages/resources/ResourcePage'));
const LearningResourcesPage = React.lazy(() => import('../pages/resources/LearningResourcesPage'));
const GrammarResourcesPage = React.lazy(() => import('../pages/resources/GrammarResourcesPage'));
const ToolsResourcesPage = React.lazy(() => import('../pages/resources/ToolsResourcesPage'));
const BooksResourcesPage = React.lazy(() => import('../pages/resources/BooksResourcesPage'));
const MusicResourcesPage = React.lazy(() => import('../pages/resources/MusicResourcesPage'));
const AudioResourcesPage = React.lazy(() => import('../pages/resources/AudioResourcesPage'));
const VideoResourcesPage = React.lazy(() => import('../pages/resources/VideoResourcesPage'));
const CommunityResourcesPage = React.lazy(() => import('../pages/resources/CommunityResourcesPage'));
const EventsResourcesPage = React.lazy(() => import('../pages/resources/EventsResourcesPage'));
const OrganizationsResourcesPage = React.lazy(() => import('../pages/resources/OrganizationsResourcesPage'));
const CultureResourcesPage = React.lazy(() => import('../pages/resources/CultureResourcesPage'));
const NewsResourcesPage = React.lazy(() => import('../pages/resources/NewsResourcesPage'));

/**
 * Route Wrapper Component
 * Wraps each route with layout and error boundary for consistent experience.
 */
const RouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ErrorBoundary>
    <Layout>{children}</Layout>
  </ErrorBoundary>
);

/**
 * Application Routes Configuration
 *
 * All routes are lazy-loaded with Suspense for loading states and
 * ErrorBoundary for error handling.
 *
 * Protected routes: use <ProtectedRoute> from src/components/ProtectedRoute.tsx
 * to require authentication. Example:
 *
 *   import { ProtectedRoute } from '../../components/ProtectedRoute';
 *
 *   <Route
 *     path="/settings"
 *     element={
 *       <RouteWrapper>
 *         <ProtectedRoute>
 *           <SettingsPage />
 *         </ProtectedRoute>
 *       </RouteWrapper>
 *     }
 *   />
 */
const Routes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Router>
        <Route
          path="/"
          element={
            <RouteWrapper>
              <Homepage />
            </RouteWrapper>
          }
        />
        <Route
          path="/library"
          element={
            <RouteWrapper>
              <LibraryPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/games/pendumulo"
          element={
            <RouteWrapper>
              <HangmanPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/tools/analyzer"
          element={
            <RouteWrapper>
              <AnalyzerPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/donate"
          element={
            <RouteWrapper>
              <DonatePage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources"
          element={
            <RouteWrapper>
              <ResourcePage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/learning"
          element={
            <RouteWrapper>
              <LearningResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/grammar"
          element={
            <RouteWrapper>
              <GrammarResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/tools"
          element={
            <RouteWrapper>
              <ToolsResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/books"
          element={
            <RouteWrapper>
              <BooksResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/music"
          element={
            <RouteWrapper>
              <MusicResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/audio"
          element={
            <RouteWrapper>
              <AudioResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/video"
          element={
            <RouteWrapper>
              <VideoResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/community"
          element={
            <RouteWrapper>
              <CommunityResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/events"
          element={
            <RouteWrapper>
              <EventsResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/organizations"
          element={
            <RouteWrapper>
              <OrganizationsResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/culture"
          element={
            <RouteWrapper>
              <CultureResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/resources/news"
          element={
            <RouteWrapper>
              <NewsResourcesPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/about"
          element={
            <RouteWrapper>
              <AboutPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/library/esperanto-live-concert-videos"
          element={
            <RouteWrapper>
              <EsperantoLiveConcertVideosPage />
            </RouteWrapper>
          }
        />
        <Route
          path="/auth"
          element={
            <RouteWrapper>
              <AuthPage />
            </RouteWrapper>
          }
        />
        {/* Catch-all 404 route — must be last */}
        <Route
          path="*"
          element={
            <RouteWrapper>
              <NotFoundPage />
            </RouteWrapper>
          }
        />
      </Router>
    </Suspense>
  );
};

export default Routes;
