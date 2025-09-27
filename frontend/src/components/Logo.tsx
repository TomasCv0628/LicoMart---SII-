import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link
      to="/"
      className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-[#2563EB] to-[#FFC300]"
    >
      LicoMart
    </Link>
  );
};

export default Logo;
