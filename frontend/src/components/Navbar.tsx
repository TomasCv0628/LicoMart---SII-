import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import LoginButton from "./LoginButton";
import AuthModal from "./AuthModal";
import { type User } from "../services/auth";

const Navbar: React.FC<{
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  user: User | null;
  onLogout: () => void;
  search: string;
  setSearch: (v: string) => void;
}> = ({ isLoggedIn, setIsLoggedIn, onLogout, search, setSearch }) => {
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
          setShowModal(false);
        }}
      />
    </nav>
  );
};

export default Navbar;
