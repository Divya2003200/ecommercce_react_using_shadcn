import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/stores/store"

const Sidebar = () => {
  const { activeTab, setActiveTab } = useSidebarStore();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold">Sidebar</h2>
      <div className="mt-4 flex flex-col gap-2">
        <Button 
          variant={activeTab === "products" ? "default" : "secondary"} 
          onClick={() => setActiveTab("products")}
        >
          Products
        </Button>
        <Button 
          variant={activeTab === "carts" ? "default" : "secondary"} 
          onClick={() => setActiveTab("carts")}
        >
          Carts
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
