import { useEffect, useState } from "react";
import { getProductos } from "../services/productos";
import { agregarAlCarrito, getCarrito, type Carrito } from "../services/carrito";
import type { Producto } from "../services";
import type { User } from "../services/auth";
import FiltroCategorias from "../components/FiltroCategorias";

type Categoria = "Todos" | "Cervezas" | "Whiskeys" | "Vinos" | "Vodkas";

function Home({
  isLoggedIn,
  user,
}: {
  isLoggedIn: boolean;
  user: User | null;
}) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria>("Todos");
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [carritoCant, setCarritoCant] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar los productos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    const loadCarrito = async () => {
      try {
        const data = await getCarrito();
        const map: Record<number, number> = {};
        const carrito: Carrito = (data.carrito as Carrito) || {};
        for (const [key, item] of Object.entries(carrito)) {
          const id = Number(key);
          map[id] = item.cantidad || 0;
        }
        setCarritoCant(map);
      } catch (e) {
        // noop
      }
    };
    loadCarrito();

    const onUpdated = () => {
      loadCarrito();
      (async () => {
        try {
          const data = await getProductos();
          setProductos(data);
        } catch (e) {
          // noop
        }
      })();
    };
    window.addEventListener("carrito:updated", onUpdated);
    return () => window.removeEventListener("carrito:updated", onUpdated);
  }, []);

  const handleAgregarAlCarrito = async (productoId: number) => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      return;
    }

    setAddingToCart(productoId);
    try {
      await agregarAlCarrito(productoId, 1);
      window.dispatchEvent(new Event("carrito:updated"));
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert("Error al agregar el producto al carrito");
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return <p className="text-center text-white">Cargando productos...</p>;
  }

  return (
    <div className="min-h-screen flex gap-8 p-6 bg-black">
      {/* Sidebar Filtro */}
      <aside className="bg-[#1A1D21] p-4 rounded-xl w-48 shrink-0 self-start">
        <h2 className="text-[#2563EB] font-bold text-lg mb-1">Categorias</h2>
        <p className="text-white font-light text-sm mb-4">
          Filtra tipo de bebida
        </p>
        <FiltroCategorias
          categoriaSeleccionada={categoriaSeleccionada}
          onCambiarCategoria={setCategoriaSeleccionada}
        />
      </aside>

      {/* Catálogo */}
      <main className="flex-1">
        <div className="mb-6 flex justify-between">
          <h1 className="text-white text-lg font-semibold">
            {categoriaSeleccionada}
          </h1>
          {isLoggedIn && user && (
            <p className="text-gray-300 text-sm mt-1">
              Bienvenido, {user.nombre}!
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-[#1A1D21] rounded-2xl shadow-lg overflow-hidden flex flex-col"
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-white text-lg font-semibold">
                  {producto.nombre}
                </h2>
                <p className="text-gray-400 text-sm flex-1">
                  {producto.descripcion}
                </p>
                <div className="flex justify-between text-gray-300 text-sm mt-2">
                  <p>${producto.precio.toLocaleString()}</p>
                  <p>
                    Stock: {Math.max(0, (producto.stock - (carritoCant[producto.id] || 0)))}
                  </p>
                </div>
                <button
                  onClick={() => handleAgregarAlCarrito(producto.id)}
                  disabled={
                    addingToCart === producto.id ||
                    (producto.stock - (carritoCant[producto.id] || 0)) <= 0
                  }
                  className="bg-[#D97706] hover:bg-[#c46b05] text-white font-semibold rounded-md mt-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart === producto.id
                    ? "Agregando..."
                    : (producto.stock - (carritoCant[producto.id] || 0)) <= 0
                      ? "Sin stock"
                      : "Agregar al carrito"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
