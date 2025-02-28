import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CARTS_API_URL = "https://fakestoreapi.com/carts";
const PRODUCTS_API_URL = "https://fakestoreapi.com/products";


export const useCarts = () => {
  return useQuery({
    queryKey: ["carts"],
    queryFn: async () => {
      const { data } = await axios.get(CARTS_API_URL);
      return data;
    },
  });
};


export const useCart = (cartId: number) => {
  return useQuery({
    queryKey: ["cart", cartId],
    queryFn: async () => {
      const { data } = await axios.get(`${CARTS_API_URL}/${cartId}`);
      return data;
    },
    enabled: !!cartId,
  });
};


export const useAddCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCart: { userId: number; date: string; products: { productId: number; quantity: number }[] }) => {
      const { data } = await axios.post(CARTS_API_URL, newCart);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
  });
};


export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cartId, updatedCart }: { cartId: number; updatedCart: any }) => {
      const { data } = await axios.put(`${CARTS_API_URL}/${cartId}`, updatedCart);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
  });
};


export const useDeleteCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cartId: number) => {
      await axios.delete(`${CARTS_API_URL}/${cartId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
  });
};


export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get(PRODUCTS_API_URL);
      return data;
    },
  });
};


export const useProduct = (productId: number) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await axios.get(`${PRODUCTS_API_URL}/${productId}`);
      return data;
    },
    enabled: !!productId,
  });
};


export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProduct: { title: string; price: number; description: string; category: string; image: string }) => {
      const { data } = await axios.post(PRODUCTS_API_URL, newProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};


export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, updatedProduct }: { productId: number; updatedProduct: any }) => {
      const { data } = await axios.put(`${PRODUCTS_API_URL}/${productId}`, updatedProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};


export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) => {
      await axios.delete(`${PRODUCTS_API_URL}/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};


export const useProductsByCategory = (category: string) => {
    return useQuery({
      queryKey: ["products", category],
      queryFn: async () => {
        const { data } = await axios.get(`${PRODUCTS_API_URL}/category/${category}`);
        return data;
      },
      enabled: !!category,
    });
  };
  
  
  export const useSortedProducts = (sort: "asc" | "desc", limit: number) => {
    return useQuery({
      queryKey: ["products", sort, limit],
      queryFn: async () => {
        const { data } = await axios.get(`${PRODUCTS_API_URL}?sort=${sort}&limit=${limit}`);
        return data;
      },
      enabled: !!limit,
    });
  };
  
