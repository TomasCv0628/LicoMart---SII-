import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import {
  isLoggedIn,
  getUserFromStorage,
  clearUserFromStorage,
  type User,
} from "./services/auth";

function App() {
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Verificar si hay un usuario logueado al cargar la app
    if (isLoggedIn()) {
      const savedUser = getUserFromStorage();
      if (savedUser) {
        setUser(savedUser);
        setIsLoggedInState(true);
      }
    }
  }, []);

  const handleLogout = () => {
    clearUserFromStorage();
    setUser(null);
    setIsLoggedInState(false);
  };

  const AdminRoute = () => {
    if (isLoggedInState && user?.rol === "admin") return <Admin />;
    return <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Navbar
        isLoggedIn={isLoggedInState}
        setIsLoggedIn={setIsLoggedInState}
        user={user}
        setUser={setUser}
        onLogout={handleLogout}
        search={searchQuery}
        setSearch={setSearchQuery}
      />
      <Routes>
        <Route
          path="/"
          element={<Home isLoggedIn={isLoggedInState} user={user} search={searchQuery} />}
        />
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
