import type { ReactNode } from "react";

type LoginButtonProps = {
  onClick?: () => void;
  label?: string;
  icon?: ReactNode;
};

const LoginButton: React.FC<LoginButtonProps> = ({
  onClick,
  label = "Iniciar Sesión",
  icon,
}) => {
  return (
    <button
      onClick={onClick}
      className="text-white border border-white flex items-center gap-2 px-2 py-1 rounded hover:bg-white hover:text-black transition cursor-pointer"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default LoginButton;
