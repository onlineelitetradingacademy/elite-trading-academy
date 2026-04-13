import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { useAuthStore, useSettingsStore } from './context/store';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminLayout from './components/layout/AdminLayout';
import Loader from './components/common/Loader';
import SocialProofPopup from './components/common/SocialProofPopup';
import FloatingContact from './components/common/FloatingContact';

// ── Lazy Imports — Public ─────────────────────────────────────────
const Home = lazy(() => import('./pages/public/Home'));
const Courses = lazy(() => import('./pages/public/Courses'));
const CourseDetail = lazy(() => import('./pages/public/CourseDetail'));
const Batches = lazy(() => import('./pages/public/Batches'));
const Mentorship = lazy(() => import('./pages/public/Mentorship'));
const Webinars = lazy(() => import('./pages/public/Webinars'));
const Blog = lazy(() => import('./pages/public/Blog'));
const BlogDetail = lazy(() => import('./pages/public/BlogDetail'));
const About = lazy(() => import('./pages/public/About'));
const Testimonials = lazy(() => import('./pages/public/Testimonials'));
const FAQ = lazy(() => import('./pages/public/FAQ'));
const Resources = lazy(() => import('./pages/public/Resources'));
const Franchise = lazy(() => import('./pages/public/Franchise'));
const Affiliate = lazy(() => import('./pages/public/Affiliate'));
const Gallery = lazy(() => import('./pages/public/Gallery'));
const Calculators = lazy(() => import('./pages/public/Calculators'));
const Careers = lazy(() => import('./pages/public/Careers'));
const Contact = lazy(() => import('./pages/public/Contact'));
const LandingPage = lazy(() => import('./pages/public/LandingPage'));
const Privacy = lazy(() => import('./pages/public/Policy'));
const Terms = lazy(() => import('./pages/public/Policy'));
const Refund = lazy(() => import('./pages/public/Policy'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

// ── Lazy Imports — Auth ───────────────────────────────────────────
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const VerifyOTP = lazy(() => import('./pages/auth/VerifyOTP'));
const ForgotPass = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPass = lazy(() => import('./pages/auth/ResetPassword'));
const GoogleSuccess = lazy(() => import('./pages/auth/GoogleSuccess'));

// ── Lazy Imports — Student Dashboard ─────────────────────────────
const Dashboard = lazy(() => import('./pages/student/Dashboard'));
const MyCourses = lazy(() => import('./pages/student/MyCourses'));
const CoursePlayer = lazy(() => import('./pages/student/CoursePlayer'));
const TradingTools = lazy(() => import('./pages/student/TradingTools'));
const AffiliateHub = lazy(() => import('./pages/student/AffiliateHub'));
const Profile = lazy(() => import('./pages/student/Profile'));
const MyTickets = lazy(() => import('./pages/student/MyTickets'));
const Checkout = lazy(() => import('./pages/student/Checkout'));

// ── Lazy Imports — Admin ──────────────────────────────────────────
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminBatches = lazy(() => import('./pages/admin/AdminBatches'));
const AdminWebinars = lazy(() => import('./pages/admin/AdminWebinars'));
const AdminRevenue = lazy(() => import('./pages/admin/AdminRevenue'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminAffiliate = lazy(() => import('./pages/admin/AdminAffiliate'));
const AdminFranchise = lazy(() => import('./pages/admin/AdminFranchise'));
const AdminResources = lazy(() => import('./pages/admin/AdminResources'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport'));
const AdminCareers = lazy(() => import('./pages/admin/AdminCareers'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));

// ── Route Guards ──────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};

const AdminRoute = ({ children, permission }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  const isAllowed = user?.role === 'admin' || user?.role === 'sub_admin';
  return isAllowed ? children : <Navigate to="/dashboard" replace />;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const { fetchSettings, getSetting, isLoaded } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
    if (isAuthenticated) fetchMe();
  }, []);

  // Tawk.to useEffect
  useEffect(() => {
    if (!isLoaded) return;
    const tawkId = getSetting('tawkto_id');
    if (!tawkId) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://embed.tawk.to/${tawkId}`;
    s.charset = 'UTF-8';
    s.setAttribute('crossorigin', '*');
    document.body.appendChild(s);
  }, [isLoaded]);

  // ← ADD META PIXEL useEffect

  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'meta-pixel-script';
    script.innerHTML = `
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '4086466794994800');
    fbq('track', 'PageView');
  `;
    document.head.appendChild(script);
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A28',
              color: '#E8E8F0',
              border: '1px solid rgba(240,165,0,0.2)',
            },
            success: {
              iconTheme: { primary: '#F0A500', secondary: '#0A0A0F' },
            },
          }}
        />
        <SocialProofPopup />
        <FloatingContact />

        <Suspense fallback={<Loader />}>
          <Routes>
            {/* ── PUBLIC ROUTES ── */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:slug" element={<CourseDetail />} />
              <Route path="/batches" element={<Batches />} />
              <Route path="/mentorship" element={<Mentorship />} />
              <Route path="/webinars" element={<Webinars />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/franchise" element={<Franchise />} />
              <Route path="/affiliate" element={<Affiliate />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/privacy-policy"
                element={<Privacy type="privacy" />}
              />
              <Route
                path="/terms-of-service"
                element={<Terms type="terms" />}
              />
              <Route path="/refund-policy" element={<Refund type="refund" />} />
            </Route>

            {/* ── LANDING PAGES (no nav/footer) ── */}
            <Route path="/l/:variant" element={<LandingPage />} />

            {/* ── AUTH ROUTES ── */}
            <Route element={<AuthLayout />}>
              <Route
                path="/auth/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="/auth/register"
                element={
                  <GuestRoute>
                    <Register />
                  </GuestRoute>
                }
              />
              <Route path="/auth/verify-otp" element={<VerifyOTP />} />
              <Route
                path="/auth/forgot-password"
                element={
                  <GuestRoute>
                    <ForgotPass />
                  </GuestRoute>
                }
              />
              <Route
                path="/auth/reset-password/:token"
                element={
                  <GuestRoute>
                    <ResetPass />
                  </GuestRoute>
                }
              />
              <Route path="/auth/google/success" element={<GoogleSuccess />} />
            </Route>

            {/* ── STUDENT DASHBOARD ── */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="courses/:slug/learn" element={<CoursePlayer />} />
              <Route path="trading-tools" element={<TradingTools />} />
              <Route path="affiliate" element={<AffiliateHub />} />
              <Route path="profile" element={<Profile />} />
              <Route path="support" element={<MyTickets />} />
            </Route>

            {/* ── CHECKOUT ── */}
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />

            {/* ── ADMIN PANEL ── */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="batches" element={<AdminBatches />} />
              <Route path="webinars" element={<AdminWebinars />} />
              <Route path="revenue" element={<AdminRevenue />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="affiliate" element={<AdminAffiliate />} />
              <Route path="franchise" element={<AdminFranchise />} />
              <Route path="resources" element={<AdminResources />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="support" element={<AdminSupport />} />
              <Route path="careers" element={<AdminCareers />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}
