
import { createContext, useContext, useReducer, ReactNode } from "react";
import { ProductState, productReducer, ProductAction } from "@/reducers/productReducer";

type ProductContextType = {
  state: ProductState;
  dispatch: React.Dispatch<ProductAction>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productReducer, { products: [] });

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
