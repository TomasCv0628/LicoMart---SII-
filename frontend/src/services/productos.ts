import api from "./api";
import type { Producto } from "./index";

export const getProductos = async (): Promise<Producto[]> => {
  const res = await api.get<{ productos: Producto[] }>("/productos/");
  return res.data.productos;
};
