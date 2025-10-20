import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import { InventoryProvider } from "./context/InventoryContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InventoryProvider>
          <App />
        </InventoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
