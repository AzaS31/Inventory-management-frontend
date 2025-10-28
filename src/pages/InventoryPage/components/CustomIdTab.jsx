// /src/pages/InventoryPage/components/CustomIdTab.jsx

import React from 'react';

const CustomIdTab = ({ inventory }) => {
    return (
        <div className="p-3">
            <h4>Настраиваемые номера инвентаря</h4>
            <p>Настройки кастомных ID для инвентаря: **{inventory.title}**.</p>
            <p className="text-muted">Здесь можно настроить формат и префиксы для автоматической нумерации айтемов.</p>
        </div>
    );
};

export default CustomIdTab;