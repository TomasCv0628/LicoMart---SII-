import { useEffect, useState } from "react";
import { getProductos } from "../services/productos";
import type { Producto } from "../services";
import FiltroCategorias from "../components/FiltroCategorias";

type Categoria = "Todos" | "Cervezas" | "Whiskeys" | "Vinos" | "Vodkas";

function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<Categoria>("Todos");

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
        <h1 className="text-white text-lg font-semibold mb-6">
          {categoriaSeleccionada}
        </h1>
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
                  <p>Stock: {producto.stock}</p>
                </div>
                <button className="bg-[#D97706] hover:bg-[#c46b05] text-white font-semibold rounded-md mt-4 py-2 transition-colors">
                  Agregar al carrito
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
