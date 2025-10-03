import api from "./api";
import type { Producto } from "./index";

export const getProductos = async (): Promise<Producto[]> => {
  try {
    console.log("Cargando productos desde:", "/productos/");
    const res = await api.get<{ productos: Producto[] }>("/productos/");
    console.log("Productos cargados:", res.data);
    return res.data.productos;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    throw error;
  }
};
