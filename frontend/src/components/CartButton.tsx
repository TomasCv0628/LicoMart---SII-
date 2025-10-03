import { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { getCarrito, type Carrito } from "../services/carrito";

const CartButton: React.FC = () => {
  const [carrito, setCarrito] = useState<Carrito>({});
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadCarrito();
  }, []);

  const loadCarrito = async () => {
    try {
      const data = await getCarrito();
      setCarrito(data.carrito || {});
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  };

  const toggleCarrito = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleCarrito}
        className="border border-white text-white px-2 py-1 rounded flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer"
      >
        <FiShoppingCart className="text-xl" />
        {Object.keys(carrito).length > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-1 ml-1">
            {Object.keys(carrito).length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[#1A1D21] border border-gray-600 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-3">
              Carrito de Compras
            </h3>
            {Object.keys(carrito).length === 0 ? (
              <p className="text-gray-400">El carrito está vacío</p>
            ) : (
              <div className="space-y-2">
                {Object.values(carrito).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-white text-sm"
                  >
                    <span>{item.nombre}</span>
                    <span>
                      ${item.precio.toLocaleString()} x {item.cantidad}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartButton;
