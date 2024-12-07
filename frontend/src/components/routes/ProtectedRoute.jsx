import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { tokenExist, hasValidRole } = useAuth();

  if (!tokenExist || !hasValidRole) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
