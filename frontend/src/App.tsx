import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
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

  return (
    <BrowserRouter>
      <Navbar
        isLoggedIn={isLoggedInState}
        setIsLoggedIn={setIsLoggedInState}
        user={user}
        onLogout={handleLogout}
        search={searchQuery}
        setSearch={setSearchQuery}
      />
      <Routes>
        <Route
          path="/"
          element={<Home isLoggedIn={isLoggedInState} user={user} search={searchQuery} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
