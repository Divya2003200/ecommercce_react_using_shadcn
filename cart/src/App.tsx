
import Products from './components/ui/products'
import Carts from "./components/ui/cart"
import Sidebar from './components/ui/sidebar';
import { useSidebarStore } from './stores/store';

function App() {
  const { activeTab } = useSidebarStore();

  return (
    <div className="flex">
      <Sidebar/>
      <div className="flex-1 p-4">
        {activeTab === "products" ? <Products /> : <Carts />}
      </div>
    </div>
  );
}

export default App;
