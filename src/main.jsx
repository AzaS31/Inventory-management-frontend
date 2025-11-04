import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { InventoryProvider } from "./context/InventoryContext.jsx";
import { InventoryAccessProvider } from "./context/InventoryAccessContext.jsx";
import { CategoryProvider } from "./context/CategoryContext";
import { ItemProvider } from './context/ItemContext.jsx';
import { CustomFieldProvider } from './context/CustomFieldContext.jsx';
import { ItemLikeProvider } from "./context/ItemLikeContext";
import { CommentProvider } from './context/CommentContext.jsx';
import { SearchProvider } from './context/SearchContext.jsx';
import { TagProvider } from './context/TagContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <InventoryProvider>
            <InventoryAccessProvider>
              <CategoryProvider>
                <ItemProvider>
                  <ItemLikeProvider>
                    <CustomFieldProvider>
                      <CommentProvider>
                        <SearchProvider>
                          <TagProvider>
                            <App />
                          </TagProvider>
                        </SearchProvider>
                      </CommentProvider>
                    </CustomFieldProvider>
                  </ItemLikeProvider>
                </ItemProvider>
              </CategoryProvider>
            </InventoryAccessProvider>
          </InventoryProvider>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
