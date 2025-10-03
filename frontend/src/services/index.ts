//Producto
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  imagen: string;
}

export * from "./auth";
export * from "./productos";
export * from "./carrito";
export * from "./api";
