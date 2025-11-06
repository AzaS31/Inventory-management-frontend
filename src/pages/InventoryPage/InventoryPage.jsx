import { Dropdown, Card, Spinner, Tabs, Tab } from "react-bootstrap";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInventory } from "../../context/InventoryContext";
import { useItem } from "../../context/ItemContext";
import { useAuth } from "../../context/AuthContext";
import ItemTableTab from "./tabs/ItemTableTab";
import GeneralSettingsTab from "./tabs/GeneralSettingsTab";
import CustomFieldsTab from "./tabs/CustomFieldsTab";
import CustomIdTab from "./tabs/CustomIdTab";
import AccessSettingsTab from "./tabs/AccessSettingsTab";
import DiscussionTab from "./tabs/DiscussionTab";
import StatisticsTab from "./tabs/StatisticsTab";
import Breadcrumbs from "../../components/Breadcrumbs";
import ReactMarkdown from "react-markdown";
import { getAccessInfo } from "../../utils/accessUtils";

export default function InventoryPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { getInventoryById, updateInventoryCustomIdFormat, deleteInventory } = useInventory();
    const { fetchItems, loading: itemsLoading } = useItem();
    const { user } = useAuth();

    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const invData = await getInventoryById(id);
                setInventory(invData);
                await fetchItems(id);
            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Failed to load inventory data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id, getInventoryById, fetchItems]);

    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get("tab") || "items";
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const newTab = new URLSearchParams(location.search).get("tab");
        if (newTab && newTab !== activeTab) setActiveTab(newTab);
    }, [location.search]);

    const handleTabSelect = (key) => {
        setActiveTab(key);
        navigate(`?tab=${key}`, { replace: true });
    };

    const isLoading = loading || itemsLoading;
    if (isLoading)
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status" />
            </div>
        );
    if (error) return <p className="text-center text-danger mt-4">{error}</p>;

    const { isAdmin, isOwner, canEdit: canEditItems } = getAccessInfo({
        user,
        ownerId: inventory.ownerId,
        isPublic: inventory.isPublic,
        accesses: inventory.accesses
    });

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this inventory?");
        if (!confirmed) return;

        try {
            await deleteInventory(inventory.id, inventory.ownerId);
            alert("Inventory deleted successfully");

            const from = location.state?.from;
            if (from) {
                navigate(from, { replace: true });
            } else {
                navigate("/inventories");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete inventory");
        }
    };

    const availableTabs = [
        "items",
        "discussion",
        ...(isAdmin || isOwner ? ["general", "customId", "access", "customFields"] : []),
        "statistics",
    ];

    return (
        <div className="container py-4">
            <Breadcrumbs
                labelsMap={{ inventory: inventory.title }}
                idsMap={{ inventory: inventory.id }}
            />

            <Card className="shadow-sm mb-4">
                <Card.Body className="d-flex justify-content-between align-items-start">
                    <div>
                        <h3>Title: {inventory.title}</h3>
                        <p className="text-muted mb-0">Category: {inventory.category?.name || "No category"}</p>
                        <p>Owner: {inventory.owner.username}</p>
                    </div>

                    {(isOwner || isAdmin) && (
                        <Dropdown align="end">
                            <Dropdown.Toggle bsPrefix="bg-transparent" variant="link" className="text-dark">
                                <i className="bi bi-three-dots-vertical"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleDelete} className="text-danger">
                                    <i className="bi bi-trash me-2"></i> Delete Inventory
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </Card.Body>
            </Card>

            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <ReactMarkdown>
                        {inventory.description || "No description provided."}
                    </ReactMarkdown>
                </Card.Body>
            </Card>

            <Tabs id="inventory-tabs" className="mb-3" activeKey={activeTab} onSelect={handleTabSelect}>
                {availableTabs.includes("items") && (
                    <Tab eventKey="items" title="Table of Items">
                        <ItemTableTab inventoryId={inventory.id} canEdit={canEditItems} />
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
                        <CustomIdTab inventory={inventory} onSaveCustomIdFormat={updateInventoryCustomIdFormat} />
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
