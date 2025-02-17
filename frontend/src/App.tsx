import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/login-page/login-page";
import RegisterPage from "./pages/register-page/register-page";
import LandingPage from "./pages/landing-page/landing-page";
import BlogPage from "./pages/blog-create-page/blog-page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/homepage/homepage";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<HomePage/>} />
        <Route path="/blog" element={<BlogPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
