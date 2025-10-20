import { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import {
  getCarrito,
  type Carrito,
  eliminarDelCarrito,
  confirmarCompra,
} from "../services/carrito";

const CartButton: React.FC = () => {
  const [carrito, setCarrito] = useState<Carrito>({});
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCarrito();

    const onUpdated = () => {
      loadCarrito();
    };
    window.addEventListener("carrito:updated", onUpdated);
    return () => {
      window.removeEventListener("carrito:updated", onUpdated);
    };
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

  const handleEliminar = async (productoId: number) => {
    try {
      await eliminarDelCarrito(productoId);
      await loadCarrito();
      window.dispatchEvent(new Event("carrito:updated"));
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  };

  const handleConfirmar = async () => {
    if (Object.keys(carrito).length === 0) return;
    setSubmitting(true);
    try {
      await confirmarCompra();
      await loadCarrito();
      window.dispatchEvent(new Event("carrito:updated"));
    } catch (error) {
      console.error("Error al confirmar compra:", error);
    } finally {
      setSubmitting(false);
    }
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
                {Object.entries(carrito).map(([productoId, item]) => (
                  <div
                    key={productoId}
                    className="flex justify-between items-center text-white text-sm"
                  >
                    <span>{item.nombre}</span>
                    <div className="flex items-center gap-2">
                      <span>
                        ${item.precio.toLocaleString()} x {item.cantidad}
                      </span>
                      <button
                        onClick={() => handleEliminar(Number(productoId))}
                        className="text-red-400 hover:text-red-300 text-xs border border-red-400 px-2 py-0.5 rounded"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handleConfirmar}
                    disabled={submitting}
                    className="mt-3 w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold rounded px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Enviando..." : "Enviar carrito"}
                  </button>
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
