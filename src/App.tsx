
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
