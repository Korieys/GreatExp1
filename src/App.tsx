
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

const App = () => {
  return (
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
            <Route path="/portal" element={<Portal />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/grievance" element={<Grievance />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
