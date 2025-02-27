
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCreateProduct, useUpdateProduct, useDeleteProduct, useProduct, useProducts } from "./Api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SidebarProps = {
  setCategoryFilter: (value: string) => void;
  setLimit: (value: number) => void;
  onSelect: (action: string) => void;
};

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
};

export function Sidebar({ setCategoryFilter, setLimit, onSelect }: SidebarProps) {
  const categories: string[] = ["All", "electronics", "jewelery", "men's clothing", "women's clothing"];

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [limitInput, setLimitInput] = useState<string>("");
  const [idInput, setIdInput] = useState<string>("");
  const [formData, setFormData] = useState<Product>({
    id: 0,
    title: "",
    price: 0,
    category: "",
    description: "",
    image: "",
  });
  const [editId, setEditId] = useState<string>("");
  const [editData, setEditData] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const validEditId: number | null = Number(editId) > 0 ? Number(editId) : null;
  const { data: fetchedProduct } = useProduct(validEditId ?? 0);


  const { refetch } = useProducts();

  useEffect(() => {
    setCategoryFilter(selectedCategory);
    refetch();
  }, [selectedCategory, setCategoryFilter, refetch]);

  const handleCreate = () => {
    if (!formData.title || formData.price <= 0 || !formData.category) {
      alert("Please fill all fields correctly");
      return;
    }
    createProduct.mutate({ ...formData, id: Date.now() });
    alert("Product Created Successfully!");
    setFormData({ id: 0, title: "", price: 0, category: "", description: "", image: "" });
    setIsCreateOpen(false);
    onSelect("Create Product");
  };

  const handleEditFetch = () => {
    if (!validEditId) {
      alert("Please enter a valid Product ID");
      return;
    }
    if (fetchedProduct) {
      setEditData(fetchedProduct);
      setIsEditOpen(true);
    } else {
      alert("Product not found!");
    }
  };

  const handleUpdate = () => {
    if (!editData || !editData.id) {
      alert("No product data available for update.");
      return;
    }
    updateProduct.mutate({ id: editData.id, updatedProduct: editData });
    alert("Product Updated Successfully!");
    setEditData(null);
    setIsEditOpen(false);
    onSelect("Edit Product");
  };

  const handleDelete = () => {
    const idToDelete = Number(idInput);
    if (!idInput || isNaN(idToDelete) || idToDelete <= 0) {
      alert("Please enter a valid Product ID to delete");
      return;
    }
    deleteProduct.mutate(idToDelete);
    alert("Product Deleted Successfully!");
    setIdInput("");
    onSelect("Delete Product");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 fixed">
      <h2 className="text-xl font-bold mb-4">Sidebar Menu</h2>

      {/* Select by Category */}
      <label className="block mb-2">Select Category:</label>
      <Select onValueChange={(value) => setSelectedCategory(value)} value={selectedCategory}>
        <SelectTrigger className="w-full mb-4">
          <SelectValue placeholder="Choose category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filter by Limit */}
      <label className="block mb-2">Set Limit:</label>
      <Input 
        type="number" 
        placeholder="Limit" 
        value={limitInput} 
        onChange={(e) => {
          setLimitInput(e.target.value);
          setLimit(Number(e.target.value));
        }} 
        className="mb-4"
      />

      {/* CRUD Operations */}
      <Button className="w-full mb-4" onClick={() => setIsCreateOpen(true)}>Create Product</Button>

      {/* Edit Product */}
      <Input type="number" placeholder="Product ID to Edit" value={editId} onChange={(e) => setEditId(e.target.value)} />
      <Button className="w-full mb-4 mt-2" onClick={handleEditFetch}>Edit Product</Button>

      {/* Delete Product */}
      <Input type="number" placeholder="Product ID to Delete" value={idInput} onChange={(e) => setIdInput(e.target.value)} />
      <Button className="mt-2 w-full" onClick={handleDelete}>Delete</Button>

      {/* Create Product Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Product</DialogTitle>
          </DialogHeader>
          <Input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <Input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
          <Input placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
          <Input placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <Button onClick={handleCreate}>Create</Button>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editData && (
            <>
              <Input placeholder="Title" value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
              <Input type="number" placeholder="Price" value={editData.price} onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })} />
              <Input placeholder="Category" value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
              <Input placeholder="Description" value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
              <Button onClick={handleUpdate}>Update</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
