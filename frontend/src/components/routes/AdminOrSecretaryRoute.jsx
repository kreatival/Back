import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function AdminOrSecretaryRoute({ children }) {
  const { tokenExist, isAdminOrSecretary } = useAuth();

  if (!tokenExist || !isAdminOrSecretary) {
    return <Navigate to="/inicio" replace />; 
  }


  return children;
}

AdminOrSecretaryRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
