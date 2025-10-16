export default function Notification({ message, type = "info", onClose }) {
    if (!message) return null;

    const alertClass = {
        success: "alert-success",
        error: "alert-danger",
        warning: "alert-warning",
        info: "alert-info",
    }[type];

    return (
        <div className={`alert ${alertClass} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
    );
}
