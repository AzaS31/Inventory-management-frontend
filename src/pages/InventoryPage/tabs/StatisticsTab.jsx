const StatisticsTab = ({ inventoryId }) => {
    return (
        <div className="p-3">
            <h4>Statistics / Aggregation</h4>
            <p>Statistical data for the inventory with ID: {inventoryId}.</p>
        </div>
    );
};

export default StatisticsTab;