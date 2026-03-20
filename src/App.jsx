import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import GlobalBackground from './components/GlobalBackground';
import Preloader from './components/Preloader';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Workshops = lazy(() => import('./pages/Workshops'));
const WorkshopDetail = lazy(() => import('./pages/WorkshopDetail'));
const Register = lazy(() => import('./pages/Register'));
const Internship = lazy(() => import('./pages/Internship'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
};

function AnimatedRoutes() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('sprouts-admin-token'));

  const handleLogin = () => setIsAdmin(true);
  const handleLogout = () => {
    localStorage.removeItem('sprouts-admin-token');
    setIsAdmin(false);
  };

  // Admin routes — separate layout
  if (location.pathname.startsWith('/admin')) {
    if (!isAdmin) return <AdminLogin onLogin={handleLogin} />;
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="route-loader" style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageWrap><Home /></PageWrap>} />
              <Route path="/about" element={<PageWrap><About /></PageWrap>} />
              <Route path="/services" element={<PageWrap><Services /></PageWrap>} />
              <Route path="/workshops" element={<PageWrap><Workshops /></PageWrap>} />
              <Route path="/events" element={<PageWrap><Workshops /></PageWrap>} />
              <Route path="/workshops/:id" element={<PageWrap><WorkshopDetail /></PageWrap>} />
              <Route path="/workshop/:id" element={<PageWrap><WorkshopDetail /></PageWrap>} />
              <Route path="/events/:id" element={<PageWrap><WorkshopDetail /></PageWrap>} />
              <Route path="/register/:eventId" element={<PageWrap><Register /></PageWrap>} />
              <Route path="/internship" element={<PageWrap><Internship /></PageWrap>} />
              <Route path="/achievements" element={<PageWrap><Achievements /></PageWrap>} />
              <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />
              <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}

function PageWrap({ children }) {
  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ThemeProvider>
      <AnimatePresence>
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>
      
      <GlobalBackground />
      <div className="bg-motif motif-1"></div>
      <div className="bg-motif motif-2"></div>
      <ScrollProgress />
      
      <Router>
        <AppContent onReady={() => setLoading(false)} />
      </Router>
    </ThemeProvider>
  );
}

function AppContent({ onReady }) {
  useEffect(() => {
    const timer = setTimeout(onReady, 2500); // Set to 2.5s as requested
    return () => clearTimeout(timer);
  }, [onReady]);

  return <AnimatedRoutes />;
}
