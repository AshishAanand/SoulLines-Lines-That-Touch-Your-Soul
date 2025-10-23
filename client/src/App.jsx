import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Quotes from "./pages/Quotes.jsx";
import About from "./pages/About.jsx";

function App() {
  return (
    // <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Quotes />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
    // </div>
  );
}

export default App;
