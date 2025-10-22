import { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useInventory } from "../../context/InventoryContext";
import { useCategory } from "../../context/CategoryContext";
import { AuthContext } from "../../context/AuthContext";
import InventoryForm from "../../components/Inventories/InventoryForm";

export default function InventoryEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const {
        getInventoryById,
        updateMyInventory,
        updateSharedWithMeInventory
    } = useInventory();
    const { categories, fetchCategories } = useCategory();

    const [form, setForm] = useState({
        title: "",
        description: "",
        isPublic: false,
        categoryId: "",
    });

    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (categories.length === 0) {
                    await fetchCategories();
                }

                const data = await getInventoryById(id);

                setForm({
                    title: data.title,
                    description: data.description || "",
                    isPublic: data.isPublic,
                    categoryId: data.categoryId || "",
                });

                // Определяем, является ли текущий пользователь владельцем
                setIsOwner(data.ownerId === user?.id);
            } catch (err) {
                console.error("Failed to load inventory:", err);
                alert("Failed to load inventory");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, user]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isOwner) {
                await updateMyInventory(id, form);
            } else {
                await updateSharedWithMeInventory(id, form);
            }
            navigate(`/inventories/${id}`);
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update inventory");
        }
    };

    if (loading) return <p className="text-center mt-5">Loading...</p>;

    return (
        <Container className="mt-4">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h4 className="mb-3">Edit Inventory</h4>
                    <InventoryForm
                        {...form}
                        categories={categories}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={() => navigate("/inventories")}
                    />
                </Col>
            </Row>
        </Container>
    );
}
