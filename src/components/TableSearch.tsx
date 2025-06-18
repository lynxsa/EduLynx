import Image from "next/image";

interface TableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TableSearch = ({ value, onChange, placeholder = "Search..." }: TableSearchProps) => {
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="Search icon" width={14} height={14} aria-hidden="true" />
      <label htmlFor="table-search-input" className="sr-only">Search table</label>
      <input
        id="table-search-input"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-[200px] p-2 bg-transparent outline-none"
        aria-label="Search table"
      />
    </div>
  );
};

export default TableSearch;