import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RouteStatus({ message }) {
  return (
    <div className="route-status" role="status" aria-live="polite">
      {message}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isReady } = useAuth();
  const location = useLocation();

  if (!isReady) {
    return <RouteStatus message="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return <RouteStatus message="Loading account access..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export { ProtectedRoute, PublicOnlyRoute };
