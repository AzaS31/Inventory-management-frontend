import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { InventoryProvider } from "./context/InventoryContext.jsx";
import { CategoryProvider } from "./context/CategoryContext";
import { ItemProvider } from './context/ItemContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <InventoryProvider>
            <CategoryProvider>
              <ItemProvider>
                <App />
              </ItemProvider>
            </CategoryProvider>
          </InventoryProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)