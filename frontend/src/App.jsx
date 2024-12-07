import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import Patients from "./pages/Pacientes/Patients";
import History from "./pages/Pacientes/History";
import Profile from "./pages/Profile/Profile";
import ClininalInfo from "./pages/ClinicalInfo/ClininalInfo";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import Users from "./pages/Users/Users";
import ResetPassword from "./sections/Login/ResetPassword";
import LandingPage from "./pages/Landing/LandingPage";
import Reasons from "./pages/Reasons/Reasons";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import Support from "./pages/Support/Support";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound/NotFound";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { AdminRoute } from "./components/routes/AdminRoute";
import { AdminOrSecretaryRoute } from "./components/routes/AdminOrSecretaryRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<Layout />}>
        <Route path="/iniciar-sesion" element={<Login />} />
        <Route path="/recuperar-contrasenia" element={<ResetPassword />} />
        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/cambiar-contraseña"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes/historia-clinica/:id"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/motivos"
          element={
            <AdminOrSecretaryRoute>
              <Reasons />
            </AdminOrSecretaryRoute>
          }
        />
        <Route
          path="/perfil/soporte"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />
        <Route
          path="usuarios/añadir"
          element={
            <AdminRoute>
              <Register />
            </AdminRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/info-clinica"
          element={
            <AdminRoute>
              <ClininalInfo />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
