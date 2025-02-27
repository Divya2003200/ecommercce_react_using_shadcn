// export type Product = {
//     id: number;
//     title: string;
//     price: number;
//     category: string;
//     description: string;
//     image: string;
//   };
  
//   export type ProductState = {
//     products: Product[];
//   };
  
//   export type ProductAction =
//     | { type: "SET_PRODUCTS"; payload: Product[] }
//     | { type: "ADD_PRODUCT"; payload: Product }
//     | { type: "UPDATE_PRODUCT"; payload: Product }
//     | { type: "DELETE_PRODUCT"; payload: number };
  
//   export const productReducer = (state: ProductState, action: ProductAction): ProductState => {
//     switch (action.type) {
//       case "SET_PRODUCTS":
//         return { ...state, products: action.payload };
//       case "ADD_PRODUCT":
//         return { ...state, products: [action.payload, ...state.products] };
//       case "UPDATE_PRODUCT":
//         return {
//           ...state,
//           products: state.products.map((product) =>
//             product.id === action.payload.id ? action.payload : product
//           ),
//         };
//       case "DELETE_PRODUCT":
//         return {
//           ...state,
//           products: state.products.filter((product) => product.id !== action.payload),
//         };
//       default:
//         return state;
//     }
//   };
export type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
};

export type ProductState = {
  products: Product[];
};

export type ProductAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: number };

export const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload }; // Ensures state consistency
    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] }; // Keeps new product at the top
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
      };
    default:
      return state;
  }
};
