// /src/pages/InventoryPage/components/StatisticsTab.jsx

import React from 'react';

const StatisticsTab = ({ inventoryId }) => {
    return (
        <div className="p-3">
            <h4>Статистика / Агрегация</h4>
            <p>Статистические данные для инвентаря с ID: {inventoryId}.</p>
            <p className="text-muted">Здесь могут быть графики, общее количество айтемов, история изменений и т.д.</p>
        </div>
    );
};

export default StatisticsTab;