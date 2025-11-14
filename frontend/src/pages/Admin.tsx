import { useEffect, useState } from "react";
import { getProductos } from "../services/productos";
import type { Producto, KPIs, TopVendido, PedidoReciente } from "../services";
import { getKpis, getTopVendidos, getPedidosRecientes, actualizarEstadoPedido, getPedidosCompletados } from "../services/pedidos";
import type { PedidoCompletado } from "../services/pedidos";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function Admin() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [topVendidos, setTopVendidos] = useState<TopVendido[]>([]);
  const [pedidosRecientes, setPedidosRecientes] = useState<PedidoReciente[]>([]);
  const [pedidosCompletados, setPedidosCompletados] = useState<PedidoCompletado[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [loadingCompletados, setLoadingCompletados] = useState(true);

  const fetchAll = async () => {
    try {
      const [prods, kpiData, topData, recentData] = await Promise.all([
        getProductos(),
        getKpis(),
        getTopVendidos(5),
        getPedidosRecientes(10),
      ]);
      setProductos(prods);
      setKpis(kpiData);
      setTopVendidos(topData);
      setPedidosRecientes(recentData);
    } catch (e) {
      setError("No se pudieron cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidosCompletados = async () => {
    try {
      setLoadingCompletados(true);
      const data = await getPedidosCompletados();
      setPedidosCompletados(data);
    } catch (e) {
      console.error("Error cargando pedidos completados:", e);
    } finally {
      setLoadingCompletados(false);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchPedidosCompletados();
  }, []);

  const handleEstadoChange = async (pedidoId: number, estado: "Pendiente" | "En Proceso" | "Completado" | "Cancelado") => {
    try {
      setUpdatingId(pedidoId);
      await actualizarEstadoPedido(pedidoId, estado);
      await fetchAll();
    } catch {}
    finally {
      setUpdatingId(null);
    }
  };

  const labels = productos.map((p) => p.nombre);
  const stocks = productos.map((p) => p.stock);

  const pieData = {
    labels,
    datasets: [
      {
        label: "Stock",
        data: stocks,
        backgroundColor: [
          "#6366F1", // indigo-500
          "#22C55E", // emerald-500
          "#F59E0B", // amber-500
          "#EF4444", // red-500
          "#06B6D4", // cyan-500
          "#84CC16", // lime-500
          "#A855F7", // purple-500
          "#14B8A6", // teal-500
          "#3B82F6", // blue-500
          "#EAB308", // yellow-500
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      legend: { position: "bottom" as const, labels: { boxWidth: 12, color: "#e5e7eb" } },
      title: { display: true, text: "Stock", color: "#f3f4f6" },
    },
  };

  return (
    <div className="container mx-auto p-4 space-y-4 bg-black">
      <div className="flex items-center justify-between bg-blue-800 p-3">
        <h1 className="text-2xl font-semibold text-white">LicoMart - Dashboard Administrator</h1>
        <span className="text-sm px-3 py-1 rounded text-white">Admin</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg p-4 text-center border border-emerald-500/40 bg-emerald-600/15">
          <div className="text-lg font-semibold text-white">Pedidos Activos</div>
          <div className="text-3xl font-bold mt-2 text-white">{kpis?.activos ?? 0}</div>
        </div>
        <div className="rounded-lg p-4 text-center border border-amber-500/40 bg-amber-600/15">
          <div className="text-lg font-semibold text-white">Pedidos Pendientes</div>
          <div className="text-3xl font-bold mt-2 text-white">{kpis?.pendientes ?? 0}</div>
        </div>
        <div className="rounded-lg p-4 text-center border border-indigo-500/40 bg-indigo-600/15">
          <div className="text-lg font-semibold text-white">Ingresos al mes</div>
          <div className="text-3xl font-bold mt-2 text-white">${" "+(kpis?.ingresosMes ?? 0).toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          {loading && <p>Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && productos.length === 0 && (
            <p>No hay productos para mostrar.</p>
          )}
          {!loading && !error && productos.length > 0 && (
            <div className="flex flex-col">
              <div className="text-xl font-semibold mb-2 text-white">Inventario de Productos</div>
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  <Pie data={pieData} options={options} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-xl font-semibold mb-2 text-white">Top Productos Vendidos</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/10 bg-white/10">
                  <th className="py-2 pr-4 text-white">Producto</th>
                  <th className="py-2 text-white">Ventas</th>
                </tr>
              </thead>
              <tbody>
                {topVendidos.map((t) => (
                  <tr key={t.producto} className="border-b border-white/5">
                    <td className="py-2 pr-4 text-white">{t.producto}</td>
                    <td className="py-2 font-semibold text-white">{t.ventas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white/5 rounded-lg p-4">
        <div className="text-sm font-semibold mb-3 text-white">Pedidos Recientes</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-white/10 bg-white/10">
                <th className="py-2 px-2 text-white">ID</th>
                <th className="py-2 px-2 text-white">Cliente</th>
                <th className="py-2 px-2">Estado del pedido</th>
                <th className="py-2 px-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pedidosRecientes.map((p) => (
                <tr key={p.id} className="border-b border-white/5">
                  <td className="py-2 px-2 text-white">{p.id}</td>
                  <td className="py-2 px-2 text-white">{p.cliente}</td>
                  <td className="py-2 px-2 text-white">
                    <select
                      className="bg-black/40 border border-white/20 rounded px-2 py-1 text-white"
                      value={p.estado}
                      disabled={updatingId === p.id}
                      onChange={(e) =>
                        handleEstadoChange(
                          p.id,
                          e.target.value as "Pendiente" | "En Proceso" | "Completado" | "Cancelado"
                        )
                      }
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Proceso">En Proceso</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="py-2 px-2 text-white">{p.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Pedidos Completados */}
      <div className="bg-white/5 rounded-lg p-4 mt-6">
        <div className="text-xl font-semibold mb-4 text-white">Pedidos Completados</div>
        {loadingCompletados ? (
          <p className="text-white">Cargando pedidos completados...</p>
        ) : pedidosCompletados.length === 0 ? (
          <p className="text-white">No hay pedidos completados para mostrar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/10 bg-white/10">
                  <th className="py-2 px-2 text-white">#</th>
                  <th className="py-2 px-2 text-white">ID Pedido</th>
                  <th className="py-2 px-2 text-white">Tienda</th>
                  <th className="py-2 px-2 text-white">Cliente</th>
                  <th className="py-2 px-2 text-white">Producto</th>
                  <th className="py-2 px-2 text-white text-right">Cantidad</th>
                  <th className="py-2 px-2 text-white text-right">Precio</th>
                  <th className="py-2 px-2 text-white">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidosCompletados.map((pedido, index) => (
                  <tr key={`${pedido.id_pedido}-${index}`} className="border-b border-white/5">
                    <td className="py-2 px-2 text-white">{index + 1}</td>
                    <td className="py-2 px-2 text-white">{pedido.id_pedido}</td>
                    <td className="py-2 px-2 text-white">{pedido.tienda}</td>
                    <td className="py-2 px-2 text-white">{pedido.nombre_cliente}</td>
                    <td className="py-2 px-2 text-white">{pedido.nombre_producto}</td>
                    <td className="py-2 px-2 text-white text-right">{pedido.cantidad}</td>
                    <td className="py-2 px-2 text-white text-right">${pedido.precio.toFixed(2)}</td>
                    <td className="py-2 px-2 text-white">{new Date(pedido.fecha).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
