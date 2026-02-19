import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Method from './pages/Method';
import Practitioners from './pages/Practitioners';
import Contact from './pages/Contact';
import Portal from './pages/Portal';
import ScrollToTop from './components/ui/ScrollToTop';
import Privacy from './pages/Privacy';
import Resources from './pages/Resources';
import Forms from './pages/Forms';
import Testimonials from './pages/Testimonials';
import Feedback from './pages/Feedback';
import Grievance from './pages/Grievance';
import Archive from './pages/Archive';
import Article from './pages/Article';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import BookAppointment from './pages/BookAppointment';
import AdminDashboard from './pages/AdminDashboard';
import AdminPractitioners from './pages/AdminPractitioners';
import AdminServices from './pages/AdminServices';
import AdminBlog from './pages/AdminBlog';
import AdminPatients from './pages/AdminPatients';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/method" element={<Method />} />
                <Route path="/practitioners" element={<Practitioners />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/forms" element={<Forms />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/grievance" element={<Grievance />} />

                <Route path="/blog" element={<Archive />} />
                <Route path="/blog/:slug" element={<Article />} />

                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/portal" element={<Portal />} />
                  <Route path="/book" element={<BookAppointment />} />
                </Route>

                <Route element={<ProtectedRoute adminOnly={true} />}>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="patients" element={<AdminPatients />} />
                    <Route path="practitioners" element={<AdminPractitioners />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="blog" element={<AdminBlog />} />
                  </Route>
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;
