
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProductContext } from "@/context/ProductContext";
import { Product } from "@/reducers/productReducer";

const API_URL = "https://fakestoreapi.com/products";

 
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

 
export const useProduct = (id: number) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axios.get<Product>(`${API_URL}/${id}`);
      return data;
    },
  });
};
 
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
