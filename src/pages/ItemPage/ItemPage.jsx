import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spinner } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useItem } from "../../context/ItemContext";
import { useItemLike } from "../../context/ItemLikeContext";
import Breadcrumbs from "../../components/Breadcrumbs";
import Tooltip from "../../components/Tooltip";
import { getAccessInfo } from "../../utils/accessUtils";

const ItemPage = () => {
    const { inventoryId, itemId } = useParams();
    const { user } = useAuth();
    const { getItemById, deleteItem } = useItem();
    const { toggleLike, hasLiked } = useItemLike();
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

    if (loading) return <Spinner animation="border" />;
    if (!item) return <p>Item not found</p>;

    const handleEdit = () => {
        navigate(`/inventory/${inventoryId}/item/${itemId}/edit`);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteItem(item.inventoryId, item.id);
            navigate(`/inventory/${inventoryId}`);
        } catch (err) {
            console.error(err);
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

            <Card className="mb-3 d-flex flex-row p-3 shadow-none border-0">
                <div>
                    <div
                        style={{
                            width: "400px",
                            height: "400px",
                            backgroundColor: "#ddd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.9rem",
                            color: "#555",
                            flexShrink: 0,
                        }}
                    >
                        Cover Image
                    </div>
                    <div className="mt-3 d-flex gap-2 align-items-center">
                        {canEdit && (
                            <>
                                <Tooltip message="Edit item" showIcon={false}>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={handleEdit}
                                        className="d-flex align-items-center justify-content-center p-2"
                                        style={{ width: "40px", height: "40px" }}
                                    >
                                        <i className="bi bi-pencil fs-5"></i>
                                    </Button>
                                </Tooltip>

                                <Tooltip message="Delete item" showIcon={false}>
                                    <Button
                                        variant="outline-danger"
                                        onClick={handleDelete}
                                        className="d-flex align-items-center justify-content-center p-2"
                                        style={{ width: "40px", height: "40px" }}
                                    >
                                        <i className="bi bi-trash fs-5"></i>
                                    </Button>
                                </Tooltip>
                            </>
                        )}
                        <Tooltip message="Log in to like this item" show={!user}>
                            <Button
                                variant={isLiked ? "primary" : "outline-primary"}
                                className="w-auto px-3 py-1 d-flex align-items-center gap-2"
                                onClick={handleLike}
                                disabled={!user}
                                style={!user ? { pointerEvents: "none" } : {}}
                            >
                                <i className={`bi ${isLiked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"} fs-5`}></i>
                                {likes}
                            </Button>
                        </Tooltip>
                    </div>
                </div>

                <div className="flex-grow-1 ms-5 d-flex flex-column">
                    <div>
                        <h3>{item.name}</h3>
                        <div className="mb-2">
                            <strong>Inventory:</strong> {item.inventory?.title || "—"} <br />
                            <strong>Custom ID:</strong> {item.customId} <br />
                            <strong>Created By:</strong> {item.creator?.username || "—"} <br />
                            <strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()} <br />
                        </div>

                        {item.customValues?.length > 0 && (
                            <div className="mt-2 d-flex flex-wrap gap-3">
                                {item.customValues
                                    .filter(cv => cv.customField?.showInTable)
                                    .map(cv => (
                                        <div key={cv.id} className="text">
                                            <strong>{cv.customField?.name || "Field"}:</strong> {cv.value ?? "-"}
                                        </div>
                                    ))}
                            </div>
                        )}

                        {item.description && (
                            <div className="mb-2">
                                <strong>Description:</strong>
                                <div>{item.description}</div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ItemPage;
