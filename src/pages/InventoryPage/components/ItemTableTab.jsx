import { useState } from "react";
import TableToolbar from "../../../components/Inventories/TableToolbar";
import ItemTable from "../../../components/ItemTable";
import { useItem } from "../../../context/ItemContext";

export default function ItemTableTab({ inventoryId, canEdit }) {
    const { items, fetchItems, createItem, updateItem, deleteItems } = useItem();
    const [selectedItems, setSelectedItems] = useState([]);

    const handleCreate = () => { if (canEdit) createItem(inventoryId); };
    const handleEdit = () => { if (canEdit) updateItem(selectedItems[0]); };
    const handleDelete = () => { if (canEdit) deleteItems(selectedItems); };

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
                onSelectionChange={setSelectedItems}
                canEdit={canEdit}
            />
        </>
    );
}
