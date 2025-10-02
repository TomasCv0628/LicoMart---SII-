import React from "react";

type Categoria = "Todos" | "Cervezas" | "Whiskeys" | "Vinos" | "Vodkas";

interface Props {
  categoriaSeleccionada: Categoria;
  onCambiarCategoria: (categoria: Categoria) => void;
}

const categorias: Categoria[] = [
  "Todos",
  "Cervezas",
  "Whiskeys",
  "Vinos",
  "Vodkas",
];

const FiltroCategorias: React.FC<Props> = ({
  categoriaSeleccionada,
  onCambiarCategoria,
}) => {
  return (
    <ul className="space-y-5">
      {categorias.map((categoria) => (
        <li
          key={categoria}
          onClick={() => onCambiarCategoria(categoria)}
          className={`cursor-pointer px-2 py-3 rounded-md text-base font-semibold transition-colors ${
            categoria === categoriaSeleccionada
              ? "bg-[rgba(0,80,255,0.2)] text-[#2563EB]"
              : "text-white hover:bg-[#2a2d31]"
          }`}
        >
          {categoria}
        </li>
      ))}
    </ul>
  );
};

export default FiltroCategorias;
