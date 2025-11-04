import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Spinner, Tabs, Tab, Card } from "react-bootstrap";
import { useInventory } from "../../context/InventoryContext";
import { useItem } from "../../context/ItemContext";
import { useAuth } from "../../context/AuthContext";
import ItemTableTab from "./tabs/ItemTableTab";
import CustomFieldsTab from "./tabs/CustomFieldsTab";
import CustomIdTab from "./tabs/CustomIdTab";
import GeneralSettingsTab from "./tabs/GeneralSettingsTab";
import AccessSettingsTab from "./tabs/AccessSettingsTab";
import DiscussionTab from "./tabs/DiscussionTab";
import StatisticsTab from "./tabs/StatisticsTab";
import Breadcrumbs from "../../components/Breadcrumbs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAccessInfo } from "../../utils/accessUtils";

export default function InventoryPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { getInventoryById, updateInventoryCustomIdFormat, loading: inventoryLoading } = useInventory();
    const { fetchItems, loading: itemsLoading } = useItem();
    const { user } = useAuth();

    const [inventory, setInventory] = useState(null);
    const [error, setError] = useState(null);

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

    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get("tab") || "items";
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const newTab = new URLSearchParams(location.search).get("tab");
        if (newTab && newTab !== activeTab) {
            setActiveTab(newTab);
        }
    }, [location.search]);

    const handleTabSelect = (key) => {
        setActiveTab(key);
        navigate(`?tab=${key}`, { replace: true });
    };

    const isLoading = inventoryLoading || itemsLoading || !inventory;

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

    const { isAdmin, isOwner, canEdit: canEditItems } = getAccessInfo({
        user,
        ownerId: inventory.ownerId,
        isPublic: inventory.isPublic,
        accesses: inventory.accesses
    });

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
                <Card.Body>
                    <h3>Title: {inventory.title}</h3>
                    <p className="text-muted mb-0">Category: {inventory.category?.name || "No category"}</p>
                    <p>Owner: {inventory.owner.username}</p>
                </Card.Body>
            </Card>
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
                        <CustomIdTab
                            inventory={inventory}
                            onSaveCustomIdFormat={updateInventoryCustomIdFormat}
                        />
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
