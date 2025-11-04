import { OverlayTrigger, Tooltip as BSTooltip } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Tooltip({
    children,
    message,
    show = true,
    placement = "top",
    showIcon = true, 
}) {
    if (!show) return children;

    return (
        <OverlayTrigger
            placement={placement}
            container={typeof document !== "undefined" ? document.body : undefined}
            containerPadding={0}
            popperConfig={{
                strategy: "fixed",
                modifiers: [
                    { name: "preventOverflow", options: { boundary: "viewport" } },
                    { name: "flip", options: { fallbackPlacements: ["top", "bottom", "right", "left"] } },
                ],
            }}
            overlay={<BSTooltip id="tooltip">{message}</BSTooltip>}
        >
            <span className="d-inline-flex align-items-center" style={{ cursor: "pointer" }}>
                {children}
                {showIcon && <i className="bi bi-question-circle text-primary ms-1"></i>}
            </span>
        </OverlayTrigger>
    );
}
