import { FiShoppingCart } from "react-icons/fi";

const CartButton: React.FC = () => {
  return (
    <button className="border border-white text-white px-2 py-1 rounded flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer">
      <FiShoppingCart className="text-xl" />
    </button>
  );
};

export default CartButton;
