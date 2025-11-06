import { createContext, useContext, useState, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmContext = createContext();
export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [resolveCallback, setResolveCallback] = useState(null);

    const confirm = useCallback((msg) => {
        setMessage(msg);
        setIsOpen(true);
        return new Promise((resolve) => {
            setResolveCallback(() => resolve);
        });
    }, []);

    const handleConfirm = () => {
        if (resolveCallback) resolveCallback(true);
        setIsOpen(false);
    };

    const handleCancel = () => {
        if (resolveCallback) resolveCallback(false);
        setIsOpen(false);
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            <Modal
                show={isOpen}
                onHide={handleCancel}
                centered
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Action</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>{message}</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </ConfirmContext.Provider>
    );
}
