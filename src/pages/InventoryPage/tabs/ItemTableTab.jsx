import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableToolbar from "../../../components/TableToolbar";
import ItemTable from "../../../components/ItemTable";
import { useItem } from "../../../context/ItemContext";
import { useCustomFields } from "../../../context/CustomFieldContext";

export default function ItemTableTab({ inventoryId, canEdit }) {
    const { items, deleteBatch } = useItem();
    const { fields } = useCustomFields(); 
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

    const handleCreate = () => {
        if (canEdit) navigate(`/inventory/${inventoryId}/item/create`);
    };

    const handleEdit = () => {
        if (canEdit && selectedItems.length === 1) {
            const itemId = selectedItems[0];
            navigate(`/inventory/${inventoryId}/item/${itemId}?tab=edit`);
        }
    };

    const handleDelete = async () => {
        if (canEdit && selectedItems.length > 0) {
            try {
                await deleteBatch(inventoryId, selectedItems);
                setSelectedItems([]);
            } catch (err) {
                console.error("Failed to delete items:", err);
            }
        }
    };

    return (
        <>
            <TableToolbar
                selectedCount={selectedItems.length}
                onCreate={canEdit ? handleCreate : undefined}
                onEdit={canEdit ? handleEdit : undefined}
                onDelete={canEdit ? handleDelete : undefined}
                label="items"
            />
            <ItemTable
                items={items}
                customFields={fields} 
                selectable={canEdit}                
                selected={selectedItems}            
                onSelect={id => {
                    setSelectedItems(prev =>
                        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                    );
                }}
                onSelectAll={checked => {
                    if (checked) {
                        const pageIds = items
                            .slice(0, items.length)   
                            .map(item => item.id);
                        setSelectedItems(pageIds);
                    } else {
                        setSelectedItems([]);
                    }
                }}
            />
        </>
    );
}
