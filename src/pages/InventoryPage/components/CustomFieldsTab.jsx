// /src/pages/InventoryPage/components/CustomFieldsTab.jsx

import React from 'react';

const CustomFieldsTab = ({ inventoryId }) => {
    return (
        <div className="p-3">
            <h4>Настраиваемый набор полей</h4>
            <p>Здесь будут настройки полей инвентаря с ID: {inventoryId}.</p>
            <p className="text-muted">Этот раздел позволяет определять, какие дополнительные поля будут доступны для айтемов в данном инвентаре.</p>
        </div>
    );
};

export default CustomFieldsTab;