import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Tabs, Tab, Card } from "react-bootstrap";
import { useInventory } from "../../context/InventoryContext";
import { useItem } from "../../context/ItemContext";
import { useAuth } from "../../context/AuthContext";

// Компоненты вкладок
import ItemTableTab from "./components/ItemTableTab";
import CustomFieldsTab from "./components/CustomFieldsTab";
import CustomIdTab from "./components/CustomIdTab";
import GeneralSettingsTab from "./components/GeneralSettingsTab";
import AccessSettingsTab from "./components/AccessSettingsTab";
import DiscussionTab from "./components/DiscussionTab";
import StatisticsTab from "./components/StatisticsTab";

export default function InventoryPage() {
    const { id } = useParams();
    const { getInventoryById, loading: inventoryLoading } = useInventory();
    const { fetchItems, loading: itemsLoading } = useItem();
    const { user } = useAuth();

    const [inventory, setInventory] = useState(null);
    const [error, setError] = useState(null);

    const isLoading = inventoryLoading || itemsLoading || !inventory;

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const invData = await getInventoryById(id);
                setInventory(invData);
                await fetchItems(id);
            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Failed to load inventory data.");
            }
        };
        fetchAllData();
    }, [id, getInventoryById, fetchItems]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-danger mt-4">{error}</p>;
    }

    // Роли
    const isAdmin = user?.role === "ADMIN";
    const isOwner = user?.id === inventory.ownerId;
    const hasWriteAccess = inventory.writeUsers?.some(u => u.id === user?.id);
    const isPublic = inventory.isPublic;

    // Разрешено редактирование айтемов
    const canEditItems = isAdmin || isOwner || (isPublic && user) || (!isPublic && hasWriteAccess);

    const availableTabs = [
        "items",
        ...(isAdmin || isOwner || hasWriteAccess ? ["discussion"] : []),
        ...(isAdmin || isOwner ? ["general", "customId", "access", "customFields"] : []),
        "statistics",
    ];

    return (
        <div className="container py-4">
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <h3>Title: {inventory.title}</h3>
                    <p className="text-muted mb-0">Category: {inventory.category?.name || "No category"}</p>
                    <p>Owner: {inventory.owner.username} </p>
                </Card.Body>
            </Card>

            <Tabs defaultActiveKey="items" id="inventory-tabs" className="mb-3">
                {availableTabs.includes("items") && (
                    <Tab eventKey="items" title="Table of Items">
                        <ItemTableTab
                            inventoryId={inventory.id}
                            canEdit={canEditItems} />
                    </Tab>
                )}

                {availableTabs.includes("discussion") && (
                    <Tab eventKey="discussion" title="Discussion Section">
                        <DiscussionTab inventoryId={inventory.id} />
                    </Tab>
                )}

                {availableTabs.includes("general") && (
                    <Tab eventKey="general" title="General Settings">
                        <GeneralSettingsTab inventory={inventory} />
                    </Tab>
                )}

                {availableTabs.includes("customId") && (
                    <Tab eventKey="customId" title="Custom Inventory Numbers">
                        <CustomIdTab inventory={inventory} />
                    </Tab>
                )}

                {availableTabs.includes("access") && (
                    <Tab eventKey="access" title="Access Settings">
                        <AccessSettingsTab inventory={inventory} />
                    </Tab>
                )}

                {availableTabs.includes("customFields") && (
                    <Tab eventKey="customFields" title="Editable Set of Fields">
                        <CustomFieldsTab inventoryId={inventory.id} />
                    </Tab>
                )}

                {availableTabs.includes("statistics") && (
                    <Tab eventKey="statistics" title="Statistics / Aggregation">
                        <StatisticsTab inventoryId={inventory.id} />
                    </Tab>
                )}
            </Tabs>
        </div>
    );
}
