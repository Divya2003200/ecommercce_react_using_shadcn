
import { useAddProduct, useUpdateProduct, useDeleteProduct } from "@/Api/api";
import { useSidebarStore } from "@/stores/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const Products = () => {
  const queryClient = useQueryClient();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const {
    products,
    setProducts,
    addProduct: addToStore,
    updateProduct: updateInStore,
    deleteProduct: deleteFromStore,
    setUpdateProductId,
    updateProductId,
    searchCategory,
    setSearchCategory,
    productLimit,
    setProductLimit,
    cart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  } = useSidebarStore();

  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
  });

  const [updatedTitle, setUpdatedTitle] = useState<string>("");
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data));
  }, [setProducts]);

  if (!products.length) return <p>Loading products...</p>;

  const filteredProducts = products
    .filter((product) =>
      searchCategory ? product.category.toLowerCase().includes(searchCategory.toLowerCase()) : true
    )
    .slice(0, productLimit);


  const totalCartPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

 
  const handleCheckout = () => {
    if (cart.length === 0) {
      setCheckoutMessage("Cart is empty. Please add some products.");
    } else {
      setCheckoutMessage(`Purchase successful! Total amount: ₹${totalCartPrice.toFixed(2)}`);
      clearCart();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Products</h2>

     
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        />
        <Input
          placeholder="Set Limit"
          type="number"
          value={productLimit.toString()}
          onChange={(e) => setProductLimit(Number(e.target.value))}
        />
      </div>

     
      <div className="border p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Add New Product</h3>
        <Input placeholder="Title" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
        <Input placeholder="Price" type="number" value={newProduct.price.toString()} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
        <Input placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
        <Input placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
        <Input placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
        <Button
          className="mt-2"
          onClick={() => {
            const tempProduct = { ...newProduct, id: Date.now() };
            addToStore(tempProduct);
            addProduct.mutate(tempProduct, {
              onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
            });
            setNewProduct({ title: "", price: 0, description: "", category: "", image: "" });
          }}
        >
          Add Product
        </Button>
      </div>

     
      {updateProductId && (
        <div className="border p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-lg font-semibold">Update Product</h3>
          <Input
            placeholder="Update Title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <Button
            className="mt-2"
            onClick={() => {
              updateInStore(updateProductId, { title: updatedTitle });
              updateProduct.mutate(
                { productId: updateProductId, updatedProduct: { title: updatedTitle } },
                {
                  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
                }
              );
              setUpdateProductId(null);
              setUpdatedTitle("");
            }}
          >
            Confirm Update
          </Button>
        </div>
      )}

      <ul className="mt-4">
        {filteredProducts.map((product) => (
          <li key={product.id} className="p-2 border mt-2 flex justify-between items-center">
            <img src={product.image} alt={product.title} className="w-20 h-20 object-cover rounded-md" />
            <span className="font-semibold text-center">{product.title}</span>
            <span className="text-sm text-gray-600">₹{product.price}</span>
            <div>
              <Button onClick={() => { setUpdateProductId(product.id); setUpdatedTitle(product.title); }}>Update</Button>
              <Button
                className="ml-2"
                onClick={() => {
                  deleteFromStore(product.id);
                  deleteProduct.mutate(product.id, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }) });
                }}
              >
                Delete
              </Button>
              <Button className="ml-2" onClick={() => addToCart(product)}>Add to Cart</Button>
            </div>
          </li>
        ))}
      </ul>

     
      <h2 className="text-xl font-bold mt-8">Cart</h2>
      {cart.length === 0 ? (
        <p>No items in the cart</p>
      ) : (
        <ul className="mt-4">
          {cart.map((item) => (
            <li key={item.id} className="p-2 border mt-2 flex justify-between items-center">
              <img src={item.product.image} alt={item.product.title} className="w-16 h-16 object-cover rounded-md" />
              <span className="font-semibold text-center">{item.product.title}</span>
              <span className="text-sm text-gray-600">₹{(item.product.price * item.quantity).toFixed(2)}</span>
              <div className="flex items-center">
                <Button className="mr-2" onClick={() => updateCartItem(item.id, item.quantity - 1)}>-</Button>
                <span>{item.quantity}</span>
                <Button className="ml-2" onClick={() => updateCartItem(item.id, item.quantity + 1)}>+</Button>
              </div>
              <Button className="ml-2" onClick={() => removeCartItem(item.id)}>Remove</Button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-bold">Total: ₹{totalCartPrice.toFixed(2)}</h3>
        <Button className="mt-2" onClick={handleCheckout}>Checkout</Button>
        {checkoutMessage && <p className="mt-2 text-green-600">{checkoutMessage}</p>}
      </div>
    </div>
  );
};

export default Products;
