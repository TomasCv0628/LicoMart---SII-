import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-black py-2 px-6">
      <div className="flex justify-between items-center mx-20">
        <Link
          to="/"
          className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-blue-300 to-yellow-400"
        >
          LicoMart
        </Link>
        <input type="text" className="bg-gray-500" />
        <div className="flex gap-3">
          <button>🛒</button>
          <button className="text-white">Iniciar Sesión</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
