import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Quotes from "./pages/Quotes.jsx";
import About from "./pages/About.jsx";
import AddQuote from "./pages/AddQuote.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Quotes />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/add-quote"
          element={
            <PrivateRoute>
              <AddQuote />
            </PrivateRoute>
          }
        />

        {/* ✅ Own profile (logged-in user) */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ✅ Public user profile by username */}
        <Route
          path="/profile/:username"
          element={<Profile />}
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
