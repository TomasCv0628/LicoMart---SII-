import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import LoginButton from "./LoginButton";
import AuthModal from "./AuthModal";
import { type User, getUserFromStorage } from "../services/auth";
import { Link } from "react-router-dom";

const Navbar: React.FC<{
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  onLogout: () => void;
  search: string;
  setSearch: (v: string) => void;
}> = ({ isLoggedIn, setIsLoggedIn, user, setUser, onLogout, search, setSearch }) => {
  const [showModal, setShowModal] = useState(false);

  const handleLoginClick = () => {
    if (isLoggedIn) {
      onLogout();
    } else {
      setShowModal(true);
    }
  };

  return (
    <nav className="bg-black py-3 px-4 border-b border-[#374151]">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        <Logo />
        <div className="hidden md:flex flex-grow justify-center">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn && user?.rol === "admin" && (
            <Link
              to="/admin"
              className="text-sm px-3 py-2 rounded-md hover:bg-white/20 transition text-white bg-blue-800"
            >
              Admin
            </Link>
          )}
          {isLoggedIn && <CartButton />}
          <LoginButton
            onClick={handleLoginClick}
            label={isLoggedIn ? "Cerrar Sesión" : "Iniciar Sesión"}
            icon={
              isLoggedIn ? (
                <FiLogOut className="text-lg" />
              ) : (
                <FaRegUser className="text-lg" />
              )
            }
          />
        </div>
      </div>
      <AuthModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          const saved = getUserFromStorage();
          if (saved) setUser(saved);
          setShowModal(false);
        }}
      />
    </nav>
  );
};

export default Navbar;
