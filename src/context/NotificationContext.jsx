import { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const notify = useCallback((message, type = "info", delay = 3000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, delay);
    }, []);

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <ToastContainer position="top-end" className="p-3">
                {notifications.map(({ id, message, type }) => (
                    <Toast key={id} bg={type} onClose={() => setNotifications(prev => prev.filter(n => n.id !== id))} autohide delay={3000}>
                        <Toast.Header>
                            <strong className="me-auto">{type.toUpperCase()}</strong>
                        </Toast.Header>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
