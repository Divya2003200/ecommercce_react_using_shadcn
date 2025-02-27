import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
 
import { ProductProvider } from './context/ProductContext'
import {Home} from './components/ui/Home'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './components/ui/ErrorBoundry'


function App() {
 

  return (
    <>
     
    
    <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ProductProvider> 
      <Home />
      </ProductProvider>
    </ErrorBoundary>
      
      
    </>
  )
}

export default App
