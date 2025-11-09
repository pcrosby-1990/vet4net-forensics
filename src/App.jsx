import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Reports from './pages/Reports';
import DAG from './pages/DAG';
import About from './pages/About';
import GlyphIndex from './pages/GlyphIndex';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/dag" element={<DAG />} />
        <Route path="/about" element={<About />} />
        <Route path="/glyphs" element={<GlyphIndex />} />
      </Routes>
    </Router>
  );
}

export default App;
