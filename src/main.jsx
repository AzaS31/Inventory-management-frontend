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
import { ConfirmProvider } from './context/ConfirmContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx'; // ✅ добавь импорт

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
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
                              <ConfirmProvider>
                                <App />
                              </ConfirmProvider>
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
      </NotificationProvider>
    </BrowserRouter>
  </StrictMode>
);
