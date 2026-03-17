import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/Home/Home";
import Navbar from "./components/NavBar/NavBar";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";
import Events from "./pages/Events/Events";
import Admin from "./pages/Admin/Admin";
import AdminRoute from "./components/AdminRoute";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="app-shell app-shell--default">
      <Navbar />
      <main
        className={`app-main ${
          isHomePage ? "app-main--fluid" : "app-main--contained"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/events" element={<Events />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <Signup />
              </PublicOnlyRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
