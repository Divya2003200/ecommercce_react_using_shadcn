import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ProductProvider } from './context/ProductContext.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     
   <QueryClientProvider client={queryClient}>
    <ProductProvider> 
      <App />
      </ProductProvider>
    </QueryClientProvider>
   
  </StrictMode>,
)
