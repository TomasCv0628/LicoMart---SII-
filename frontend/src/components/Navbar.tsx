import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import LoginButton from "./LoginButton";

const Navbar: React.FC = () => {
  //simulacion logeado
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <nav className="bg-black py-3 px-4 border-b border-[#374151]">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Logo />

        {/* SearchBar: ocultar en pantallas pequeñas */}
        <div className="hidden md:flex flex-grow justify-center">
          <SearchBar />
        </div>

        {/* Botones: carrito y login */}
        <div className="flex items-center gap-3">
          {/* Muestra boton de carrito si esta logeado */}
          {isLoggedIn && <CartButton />}

          {/* Muestra boton de login si no esta logueado*/}
          <LoginButton
            onClick={() => setIsLoggedIn(!isLoggedIn)}
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
    </nav>
  );
};

export default Navbar;
