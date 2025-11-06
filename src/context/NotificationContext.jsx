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
            <ToastContainer
                className="position-fixed top-50 start-50 translate-middle p-3"
                style={{ zIndex: 2000 }}
            >
                {notifications.map(({ id, message, type }) => (
                    <Toast
                        key={id}
                        bg={type}
                        onClose={() =>
                            setNotifications(prev => prev.filter(n => n.id !== id))
                        }
                        autohide
                        delay={2000}
                    >
                        <Toast.Header closeButton={true}>
                            <strong className="me-auto">
                                {type.toUpperCase()}
                            </strong>
                        </Toast.Header>
                        <Toast.Body className="text-center fs-5">
                            {message}
                        </Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
