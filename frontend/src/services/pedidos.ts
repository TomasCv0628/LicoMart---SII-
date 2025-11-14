import api from "./api";

export interface KPIs {
  activos: number;
  pendientes: number;
  ingresosMes: number;
}

export interface TopVendido {
  producto: string;
  ventas: number;
}

export interface PedidoReciente {
  id: number;
  cliente: string;
  estado: string;
  fecha: string;
}

export interface PedidoCompletado {
  id_pedido: number;
  tienda: string;
  nombre_cliente: string;
  nombre_producto: string;
  cantidad: number;
  precio: number;
  fecha: string;
}

export async function getKpis(): Promise<KPIs> {
  const res = await api.get<{ success: boolean; data: KPIs }>("/pedidos/kpis/");
  return res.data.data;
}

export async function getTopVendidos(limit = 5): Promise<TopVendido[]> {
  const res = await api.get<{ success: boolean; data: TopVendido[] }>(
    `/pedidos/top-vendidos/?limit=${limit}`
  );
  return res.data.data;
}

export async function getPedidosRecientes(limit = 10): Promise<PedidoReciente[]> {
  const res = await api.get<{ success: boolean; data: PedidoReciente[] }>(
    `/pedidos/recientes/?limit=${limit}`
  );
  return res.data.data;
}

export async function getPedidosCompletados(params?: URLSearchParams): Promise<PedidoCompletado[]> {
  const queryString = params ? `?${params.toString()}` : '';
  const res = await api.get<{ success: boolean; data: PedidoCompletado[] }>(
    `/pedidos/completados/${queryString}`
  );
  return res.data.data;
}

// Crear pedido desde JSON
export async function createPedidoJson(payload: {
  usuario_id: number;
  fecha?: string; // YYYY-MM-DD
  estado?: "Pendiente" | "En Proceso" | "Completado" | "Cancelado";
  detalles: Array<{ producto_id: number; cantidad: number }>;
}): Promise<{ pedido_id: number; detalles_creados: number }> {
  const res = await api.post<{ success: boolean; pedido_id: number; detalles_creados: number }>(
    "/pedidos/crear-json/",
    payload
  );
  return { pedido_id: res.data.pedido_id, detalles_creados: res.data.detalles_creados };
}

// Actualizar estado de pedido
export async function actualizarEstadoPedido(
  pedidoId: number,
  estado: "Pendiente" | "En Proceso" | "Completado" | "Cancelado"
): Promise<void> {
  await api.patch(`/pedidos/${pedidoId}/estado/`, { estado });
}
