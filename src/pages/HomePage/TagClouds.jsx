import { useEffect } from "react";
import { useTags } from "../../context/TagContext";
import { useSearch } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

export default function TagClouds() {
    const { allTags, fetchAllTags, loading } = useTags();
    const { search } = useSearch();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllTags();
    }, [fetchAllTags]);

    if (loading) return <Spinner animation="border" />;

    if (!allTags.length)
        return <p className="text-muted mt-3">No tags found.</p>;

    const maxCount = Math.max(...allTags.map((t) => t.usageCount || 1));

    const handleTagClick = async (tagName) => {
        await search(tagName);
        navigate(`/search?q=${encodeURIComponent(tagName)}`);
    };

    return (
        <div
            className="p-4"
            style={{
                marginBottom: "4rem",
                textAlign: "left", 
            }}
        >
            <h4 className="mb-3">Popular Tags</h4>
            <div className="d-flex flex-wrap gap-2">
                {allTags.map((tag) => {
                    const size = 0.9 + ((tag.usageCount || 1) / maxCount) * 1.1;

                    return (
                        <span
                            key={tag.id}
                            onClick={() => handleTagClick(tag.name)}
                            style={{
                                cursor: "pointer",
                                fontSize: `${size}rem`,
                                color: "#0d6efd",
                                fontWeight: 500,
                                transition: "transform 0.15s ease, color 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = "#0b5ed7";
                                e.target.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = "#0d6efd";
                                e.target.style.transform = "scale(1)";
                            }}
                        >
                            #{tag.name}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
