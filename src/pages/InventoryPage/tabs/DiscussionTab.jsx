import { useEffect, useState } from "react";
import { useComment } from "../../../context/CommentContext";
import { useAuth } from "../../../context/AuthContext";
import ReactMarkdown from "react-markdown";
import { Button, Form, Dropdown } from "react-bootstrap";

export default function DiscussionTab({ inventoryId }) {
    const { user } = useAuth();
    const { comments, fetchComments, createComment, removeComment } = useComment();
    const [content, setContent] = useState("");

    useEffect(() => {
        if (inventoryId) fetchComments(inventoryId);
    }, [inventoryId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        await createComment(inventoryId, content);
        setContent("");
    };

      return (
        <div className="p-3">
            {user && (
                <Form onSubmit={handleSubmit} className="mb-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your comment using Markdown..."
                    />
                    <Button type="submit" className="mt-2">
                        Send
                    </Button>
                </Form>
            )}

            <div className="mt-4">
                {comments.length === 0 ? (
                    <p className="text-muted">No comments yet.</p>
                ) : (
                    comments.map((c) => (
                        <div key={c.id} className="border-bottom mb-3 pb-2 position-relative">
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <strong>{c.author.username}</strong>{" "}
                                    <span className="text-muted small">
                                        {new Date(c.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                {user?.id === c.author.id && (
                                    <Dropdown align="end">
                                        <Dropdown.Toggle
                                            variant="link"
                                            bsPrefix="p-0 border-0 bg-transparent"
                                            className="text-muted"
                                            id={`dropdown-${c.id}`}
                                        >
                                            <i className="bi bi-three-dots-vertical fs-5"></i>
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                className="text-secondary"
                                                onClick={() => removeComment(c.id)}
                                            >
                                                <i className="bi bi-trash me-2"></i> Delete
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </div>

                            <div className="mt-1">
                                <ReactMarkdown>{c.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
