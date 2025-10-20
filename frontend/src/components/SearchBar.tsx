import { FaSearch } from "react-icons/fa";

const SearchBar: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="flex items-center bg-[#464763] rounded-[10px] px-3 py-1 w-80">
      <FaSearch className="text-white mr-2" />
      <input
        type="text"
        placeholder="Buscar licores y cervezas..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-white w-full focus:outline-none placeholder-gray-300"
      />
    </div>
  );
};

export default SearchBar;
