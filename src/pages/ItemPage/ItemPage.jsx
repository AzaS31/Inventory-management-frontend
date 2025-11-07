import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spinner, Dropdown } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useItem } from "../../context/ItemContext";
import { useItemLike } from "../../context/ItemLikeContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import Tooltip from "../../components/Tooltip";
import { getAccessInfo } from "../../utils/accessUtils";
import { useConfirm } from "../../context/ConfirmContext";
import { useNotification } from "../../context/NotificationContext";

const ItemPage = () => {
    const { inventoryId, itemId } = useParams();
    const { user } = useAuth();
    const { getItemById, deleteItem } = useItem();
    const { toggleLike, hasLiked } = useItemLike();
    const confirm = useConfirm();
    const { notify } = useNotification();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const loadItem = async () => {
            setLoading(true);
            try {
                const data = await getItemById(inventoryId, itemId);
                setItem(data);
                setLikes(data.likesCount || 0);

                if (user) {
                    const liked = await hasLiked(data.id);
                    setIsLiked(liked);
                }
            } catch (err) {
                console.error(err);
                setItem(null);
            } finally {
                setLoading(false);
            }
        };
        loadItem();
    }, [inventoryId, itemId, getItemById, user, hasLiked]);

    if (loading) return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>;
    if (!item) return <p className="text-center text-danger mt-4">Item not found</p>;

    const handleEdit = () => navigate(`/inventory/${inventoryId}/item/${itemId}/edit`);

    const handleDelete = async () => {
        const confirmed = await confirm(`Are you sure you want to delete ${item.name}?`);
        if (!confirmed) return;

        try {
            await deleteItem(item.inventoryId, item.id);
            navigate(`/inventory/${inventoryId}`);
            notify(`${item.name} is deleted`)
        } catch (err) {
            console.error(err);
            notify("Failed to delete item");
        }
    };

    const handleLike = async () => {
        try {
            const liked = await toggleLike(item.id);
            setIsLiked(liked);
            setLikes(prev => prev + (liked ? 1 : -1));
        } catch (error) {
            console.error("Failed to toggle like:", error);
        }
    };

    const { canEdit } = getAccessInfo({
        user,
        ownerId: item.creatorId,
        isPublic: item.isPublic ?? false,
        accesses: item.accesses ?? []
    });

    return (
        <div className="container mt-4">
            <Breadcrumbs
                labelsMap={{
                    inventory: "Inventory",
                    item: item.name || "Item",
                }}
                idsMap={{
                    inventory: item.inventoryId,
                    item: `item/${item.id}`,
                }}
            />

            <Card className="p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3 className="mb-0">{item.name}</h3>

                    <div className="d-flex align-items-center gap-2">
                        <Tooltip message={!user ? "Log in to like this item" : ""} show={!user}>
                            <Button
                                variant={isLiked ? "primary" : "outline-primary"}
                                className="d-flex align-items-center gap-2 px-3 py-1"
                                onClick={handleLike}
                                disabled={!user}
                                style={!user ? { pointerEvents: "none" } : {}}
                            >
                                <i className={`bi ${isLiked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"} fs-5`}></i>
                                {likes}
                            </Button>
                        </Tooltip>

                        {canEdit && (
                            <Dropdown align="end">
                                <Dropdown.Toggle
                                    variant="link"
                                    bsPrefix="bg-transparent border-0"
                                    className="text-dark"
                                    id="item-actions"
                                >
                                    <i className="bi bi-three-dots-vertical fs-5"></i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={handleEdit}>
                                        <i className="bi bi-pencil me-2"></i> Edit Item
                                    </Dropdown.Item>
                                    <Dropdown.Item className="text-danger" onClick={handleDelete}>
                                        <i className="bi bi-trash me-2"></i> Delete Item
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                    </div>
                </div>

                <div className="mb-3 text-dark">
                    {[
                        { label: "Inventory", value: item.inventory?.title },
                        { label: "Custom ID", value: item.customId },
                        { label: "Author", value: item.author },
                        { label: "Year", value: item.year },
                        { label: "Pages", value: item.pages },
                        { label: "Created By", value: item.creator?.username },
                        { label: "Created", value: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : null },
                    ].map(({ label, value }) => (
                        value !== undefined && value !== null ? (
                            <div key={label}>
                                <strong>{label}:</strong> {value || "—"}
                            </div>
                        ) : null
                    ))}
                </div>

                {item.customValues?.length > 0 && (
                    <div className="mt-3">
                        <h6 className="fw-semibold mb-2">Custom Fields:</h6>
                        <div className="d-flex flex-column gap-2">
                            {item.customValues
                                .filter(cv => cv.customField)
                                .map(cv => (
                                    <div key={cv.id}>
                                        <strong>{cv.customField?.name || "Field"}:</strong> {cv.value ?? "-"}
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {item.description && (
                    <div className="mt-4">
                        <h6 className="fw-semibold mb-2">Description:</h6>
                        <div>{item.description}</div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ItemPage;
