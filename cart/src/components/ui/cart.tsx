import React, { useState } from "react";
import {
  useCarts,
  useCart,
  useAddCart,
  useUpdateCart,
  useDeleteCart,
} from "@/Api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Product {
  productId: number;
  quantity: number;
}

interface Cart {
  id: number;
  userId: number;
  date: string;
  products: Product[];
}

const CartPage: React.FC = () => {
  const { data: carts, isLoading, error, refetch } = useCarts();
  const [cartIdInput, setCartIdInput] = useState<string>("");
  const [cartIdToFetch, setCartIdToFetch] = useState<number | null>(null);
  const { data: selectedCart, isLoading: isCartLoading, refetch: refetchCart } = useCart(cartIdToFetch || 0);
  const addCart = useAddCart();
  const updateCart = useUpdateCart();
  const deleteCart = useDeleteCart();

  // State for add cart form
  const [newCart, setNewCart] = useState<Omit<Cart, "id">>({
    userId: 1,
    date: new Date().toISOString().split("T")[0],
    products: [{ productId: 1, quantity: 1 }],
  });

  const handleAddCart = () => {
    addCart.mutate(newCart, {
      onSuccess: () => {
        refetch(); // Refresh cart list
        setNewCart({ userId: 1, date: new Date().toISOString().split("T")[0], products: [{ productId: 1, quantity: 1 }] });
      },
    });
  };

  const handleUpdateCart = (cartId: number) => {
    const updatedCart: Partial<Cart> = {
      userId: 1,
      date: new Date().toISOString().split("T")[0],
      products: [{ productId: Math.floor(Math.random() * 10) + 1, quantity: Math.floor(Math.random() * 5) + 1 }],
    };
    updateCart.mutate({ cartId, updatedCart }, {
      onSuccess: () => {
        refetch(); // Refresh all carts
        if (cartId === cartIdToFetch) refetchCart(); // Refresh selected cart
      },
    });
  };

  const handleDeleteCart = (cartId: number) => {
    deleteCart.mutate(cartId, {
      onSuccess: () => {
        refetch(); // Refresh the cart list after deletion
      },
    });
  };

  const handleFetchCart = () => {
    const cartIdNum = parseInt(cartIdInput);
    if (!isNaN(cartIdNum)) {
      setCartIdToFetch(cartIdNum);
      refetchCart();
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );

  if (error) return <p className="text-red-500">Error fetching carts</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Cart Management</h2>

      {/* Add Cart Form */}
      <div className="p-4 border rounded mb-4">
        <h3 className="text-lg font-semibold">Add New Cart</h3>
        <Input
          type="number"
          placeholder="User ID"
          value={newCart.userId}
          onChange={(e) => setNewCart({ ...newCart, userId: Number(e.target.value) })}
          className="mb-2"
        />
        <Input
          type="date"
          value={newCart.date}
          onChange={(e) => setNewCart({ ...newCart, date: e.target.value })}
          className="mb-2"
        />
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Product ID"
            value={newCart.products[0].productId}
            onChange={(e) =>
              setNewCart({
                ...newCart,
                products: [{ productId: Number(e.target.value), quantity: newCart.products[0].quantity }],
              })
            }
            className="mb-2"
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={newCart.products[0].quantity}
            onChange={(e) =>
              setNewCart({
                ...newCart,
                products: [{ productId: newCart.products[0].productId, quantity: Number(e.target.value) }],
              })
            }
            className="mb-2"
          />
        </div>
        <Button onClick={handleAddCart}>Add Cart</Button>
      </div>

      {/* Fetch Specific Cart */}
      <div className="flex gap-2 mb-4">
        <Input
          type="number"
          placeholder="Enter Cart ID"
          value={cartIdInput}
          onChange={(e) => setCartIdInput(e.target.value)}
        />
        <Button onClick={handleFetchCart}>Fetch Cart</Button>
      </div>

      {/* Display fetched cart */}
      {isCartLoading ? (
        <p>Loading cart details...</p>
      ) : (
        selectedCart && (
          <Card className="mt-6 p-4 shadow-md">
            <CardContent>
              <h3 className="text-xl font-bold">Cart Details</h3>
              <p>ID: {selectedCart.id}</p>
              <p>User ID: {selectedCart.userId}</p>
              <p>Date: {selectedCart.date}</p>
              <p className="font-semibold">Products:</p>
              <ul className="list-disc ml-5">
                {selectedCart.products.map((p:any) => (
                  <li key={p.productId}>
                    Product {p.productId} - Quantity: {p.quantity}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )
      )}

      {/* Display all carts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {carts?.map((cart:Cart) => (
          <Card key={cart.id} className="p-4 shadow-md">
            <CardContent>
              <p className="text-lg font-semibold">
                Cart ID: {cart.id} | User ID: {cart.userId}
              </p>
              <p>Date: {cart.date}</p>
              <p className="font-semibold">Products:</p>
              <ul className="list-disc ml-5">
                {cart.products.map((p) => (
                  <li key={p.productId}>
                    Product {p.productId} - Quantity: {p.quantity}
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  className="bg-yellow-500 text-white hover:bg-yellow-600"
                  onClick={() => handleUpdateCart(cart.id)}
                >
                  Update
                </Button>
                <Button
                  variant="outline"
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDeleteCart(cart.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CartPage;
