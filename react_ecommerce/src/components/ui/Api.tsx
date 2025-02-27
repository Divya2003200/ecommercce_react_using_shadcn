// import axios from "axios";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const API_URL = "https://fakestoreapi.com/products";

// // Fetch all products
// export const useProducts = () => {
//   return useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const { data } = await axios.get(API_URL);
//       return data;
//     },
//   });
// };

// // Fetch products by category
// export const useProductsByCategory = (category: string) => {
//   return useQuery({
//     queryKey: ["products", category],
//     queryFn: async () => {
//       const { data } = await axios.get(`${API_URL}/category/${category}`);
//       return data;
//     },
//   });
// };

// // Fetch products with limit
// export const useProductsByLimit = (limit: number) => {
//   return useQuery({
//     queryKey: ["products", limit],
//     queryFn: async () => {
//       const { data } = await axios.get(`${API_URL}?limit=${limit}`);
//       return data;
//     },
//   });
// };

// // Fetch a single product by ID
// export const useProduct = (id: number) => {
//   return useQuery({
//     queryKey: ["product", id],
//     queryFn: async () => {
//       const { data } = await axios.get(`${API_URL}/${id}`);
//       return data;
//     },
//   });
// };

// // Create a new product
// export const useCreateProduct = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (newProduct: any) => {
//       const { data } = await axios.post(API_URL, newProduct);
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });
// };

// // Update an existing product
// export const useUpdateProduct = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async ({ id, updatedProduct }: { id: number; updatedProduct: any }) => {
//       const { data } = await axios.put(`${API_URL}/${id}`, updatedProduct);
//       return data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });
// };

// // Delete a product
// export const useDeleteProduct = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (id: number) => {
//       await axios.delete(`${API_URL}/${id}`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["products"] });
//     },
//   });
// };
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductContext } from "@/context/ProductContext";
import { Product } from "@/reducers/productReducer";

const API_URL = "https://fakestoreapi.com/products";

// Fetch all products
export const useProducts = () => {
  const { dispatch } = useProductContext();

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get<Product[]>(API_URL);
      dispatch({ type: "SET_PRODUCTS", payload: data });
      return data;
    },
  });
};

// Fetch a single product
export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axios.get<Product>(`${API_URL}/${id}`);
      return data;
    },
  });
};

// Create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useProductContext();

  return useMutation<Product, Error, Product>({
    mutationFn: async (newProduct) => {
      const { data } = await axios.post<Product>(API_URL, newProduct);
      return data;
    },
    onSuccess: (data) => {
      dispatch({ type: "ADD_PRODUCT", payload: data });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Update an existing product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useProductContext();

  return useMutation<Product, Error, { id: number; updatedProduct: Product }>({
    mutationFn: async ({ id, updatedProduct }) => {
      const { data } = await axios.put<Product>(`${API_URL}/${id}`, updatedProduct);
      return data;
    },
    onSuccess: (data) => {
      dispatch({ type: "UPDATE_PRODUCT", payload: data });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useProductContext();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: (_, id) => {
      dispatch({ type: "DELETE_PRODUCT", payload: id });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
