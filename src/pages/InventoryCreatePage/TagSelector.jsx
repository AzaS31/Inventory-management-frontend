import { useState, useEffect } from "react";
import { Form, Badge, Spinner } from "react-bootstrap";
import { useTags } from "../../context/TagContext";

export default function TagSelector({ value = [], onChange, assignTags, inventoryId }) {
    const { searchTags } = useTags();
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (!input.trim()) {
            setSuggestions([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await searchTags(input);
                setSuggestions(res.filter(s => !value.some(v => v === s.name)));
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [input]);

    const handleAddTag = (tagName) => {
        if (!tagName.trim() || value.includes(tagName)) return;
        onChange([...value, tagName]);
        setInput("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleRemoveTag = (tagName) => {
        const newTags = value.filter(t => t !== tagName);
        onChange(newTags);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            handleAddTag(input.trim());
        }
    };

    return (
        <div className="mb-3 position-relative">
            <Form.Label>Tags</Form.Label>
            <Form.Control
                type="text"
                value={input}
                placeholder="Type and press Enter..."
                onChange={(e) => {
                    setInput(e.target.value);
                    setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
            />

            {loading && (
                <div className="position-absolute end-0 top-0 mt-2 me-3">
                    <Spinner animation="border" size="sm" />
                </div>
            )}

            {showSuggestions && suggestions.length > 0 && (
                <ul
                    className="list-group position-absolute w-100 mt-1 shadow-sm"
                    style={{ zIndex: 10, maxHeight: "150px", overflowY: "auto" }}
                >
                    {suggestions.map((s) => (
                        <li
                            key={s.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleAddTag(s.name)}
                            style={{ cursor: "pointer" }}
                        >
                            {s.name}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-2 d-flex flex-wrap gap-2">
                {value.map((tag) => (
                    <Badge
                        key={tag}
                        bg="secondary"
                        className="p-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveTag(tag)}
                    >
                        {tag} ✕
                    </Badge>
                ))}
            </div>
        </div>
    );
}
