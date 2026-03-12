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

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className={`app-shell ${isAuthPage ? "app-shell--auth" : "app-shell--default"}`}>
      {isAuthPage ? null : <Navbar />}
      <main className={`app-main ${isAuthPage ? "app-main--auth" : "app-main--default"}`}>
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
          <Route
            path="/events"
            element={
              <PublicOnlyRoute>
                <Events />
              </PublicOnlyRoute>
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
