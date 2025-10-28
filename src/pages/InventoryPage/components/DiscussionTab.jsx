// /src/pages/InventoryPage/components/DiscussionTab.jsx

import React from 'react';

const DiscussionTab = ({ inventoryId }) => {
    return (
        <div className="p-3">
            <h4>Раздел обсуждений</h4>
            <p>Обсуждения, связанные с инвентарем с ID: {inventoryId}.</p>
            <p className="text-muted">Здесь будут отображаться комментарии или лента активности, связанные с инвентарем.</p>
        </div>
    );
};

export default DiscussionTab;