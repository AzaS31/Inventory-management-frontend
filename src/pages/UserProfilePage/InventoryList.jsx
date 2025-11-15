import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import InventoryTableBase from "../../components/InventoryTableBase";

export default function InventoryList({ userId, fetchDataFn, data }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            setLoading(true);
            await fetchDataFn(userId);
            setLoading(false);
        };
        fetchData();
    }, [userId, fetchDataFn]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return <InventoryTableBase data={data} />;
}
