import { Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { Account } from "../pages/Account";
import { Discover } from "../pages/Discover";
import { Evolucao } from "../pages/Evolucao";
import { Goals } from "../pages/Goals";
import { Habits } from "../pages/Habits";
import { Home } from "../pages/Home";
import { Journal } from "../pages/Journal";
import { ListDetail } from "../pages/ListDetail";
import { ListForm } from "../pages/ListForm";
import { Lists } from "../pages/Lists";
import { Login } from "../pages/Login";
import { NotFound } from "../pages/NotFound";
import { Profile } from "../pages/Profile";
import { Progresso } from "../pages/Progresso";
import { Register } from "../pages/Register";

// Define as rotas da aplicação.
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/u/:username" element={<Profile />} />
      <Route path="/descobrir" element={<Discover />} />
      <Route path="/progresso" element={<Progresso />} />
      <Route
        path="/conta"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route
        path="/listas"
        element={
          <ProtectedRoute>
            <Lists />
          </ProtectedRoute>
        }
      />
      <Route
        path="/listas/nova"
        element={
          <ProtectedRoute>
            <ListForm />
          </ProtectedRoute>
        }
      />
      <Route path="/listas/:id" element={<ListDetail />} />
      <Route
        path="/listas/:id/editar"
        element={
          <ProtectedRoute>
            <ListForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/habitos"
        element={
          <ProtectedRoute>
            <Habits />
          </ProtectedRoute>
        }
      />
      <Route
        path="/metas"
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/diario"
        element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/evolucao"
        element={
          <ProtectedRoute>
            <Evolucao />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
