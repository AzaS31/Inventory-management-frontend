import { useState, useEffect } from "react";
import { useCategory } from "../../context/CategoryContext";
import Pagination from "../../components/Pagination";
import { Table, Form, Button, InputGroup, Row, Col } from "react-bootstrap";

export default function CategoryManager() {
    const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategory();
    const [selectedIds, setSelectedIds] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editing, setEditing] = useState(null);
    const [editName, setEditName] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === displayedCategories.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(displayedCategories.map(cat => cat.id));
        }
    };

    const handleCreate = () => {
        if (!newCategory.trim()) return;
        createCategory(newCategory);
        setNewCategory("");
    };

    const handleEdit = () => {
        if (selectedIds.length !== 1) return;
        const cat = categories.find(c => c.id === selectedIds[0]);
        setEditing(cat.id);
        setEditName(cat.name);
    };

    const handleSaveEdit = () => {
        if (!editName.trim()) return;
        updateCategory(editing, { name: editName });
        setEditing(null);
        setSelectedIds([]);
    };

    const handleDelete = () => {
        selectedIds.forEach(id => deleteCategory(id));
        setSelectedIds([]);
    };

    if (loading) return <p>Loading categories...</p>;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const displayedCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="mb-4">
            <h5 className="mb-3">Categories</h5>

            <Row className="align-items-center mb-3">
                <Col xs="auto">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder={editing ? "Edit category" : "New category"}
                            value={editing ? editName : newCategory}
                            onChange={(e) =>
                                editing ? setEditName(e.target.value) : setNewCategory(e.target.value)
                            }
                            className="no-focus-outline"
                        />
                        <Button
                            variant={editing ? "success" : "primary"}
                            onClick={editing ? handleSaveEdit : handleCreate}
                            disabled={editing ? !editName.trim() : !newCategory.trim()}
                        >
                            {editing ? "Save" : "Add"}
                        </Button>
                    </InputGroup>
                </Col>
                <Col xs="auto">
                    <Button
                        variant="outline-secondary"
                        onClick={handleEdit}
                        disabled={selectedIds.length !== 1 || editing !== null}
                        className="me-2"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="outline-secondary"
                        onClick={handleDelete}
                        disabled={selectedIds.length === 0 || editing !== null}
                    >
                        Delete
                    </Button>
                </Col>
                <Col className="text-end">
                    <small className="text-muted">
                        {selectedIds.length > 0
                            ? `${selectedIds.length} selected`
                            : "No categories selected"}
                    </small>
                </Col>
            </Row>

            <Table bordered hover responsive>
                <thead className="table-light">
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                checked={selectedIds.length === displayedCategories.length && displayedCategories.length > 0}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th>#</th>
                        <th>Name</th>
                        <th>UpdatedAt</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedCategories.map((cat, index) => (
                        <tr key={cat.id}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedIds.includes(cat.id)}
                                    onChange={() => handleSelect(cat.id)}
                                />
                            </td>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{cat.name}</td>
                            <td>{new Date(cat.updatedAt).toLocaleString()}</td>
                            <td>{new Date(cat.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination
                totalItems={categories.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
