
import { useState } from "react";
import { Sidebar } from "../ui/sidebar";
import { useProducts } from "../ui/Api";

export function Home() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [limit, setLimit] = useState<number>(10);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar setCategoryFilter={setCategoryFilter} setLimit={setLimit} onSelect={setSelectedAction} />

      {/* Main Content */}
      <div className="ml-64 p-4 w-full">
        <h1 className="text-2xl font-bold mb-4">Home Page</h1>
        {selectedAction && <p>Selected Action: {selectedAction}</p>}
        
        <DisplayProducts categoryFilter={categoryFilter} limit={limit} />
      </div>
    </div>
  );
}

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
};

interface DisplayProductsProps {
  categoryFilter: string;
  limit: number;
}

function DisplayProducts({ categoryFilter, limit }: DisplayProductsProps) {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products.</p>;


  const filteredProducts = (products as Product[] || [])
    .filter((product) => categoryFilter === "All" || product.category.toLowerCase() === categoryFilter.toLowerCase())
    .slice(0, limit);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border p-4 rounded-md shadow-md w-64 h-80 flex flex-col items-center">
            <img src={product.image} alt={product.title} className="w-32 h-32 object-contain mb-2" />
            <h3 className="font-bold text-center text-sm mb-1">{product.title}</h3>
            <p className="text-lg font-semibold">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
