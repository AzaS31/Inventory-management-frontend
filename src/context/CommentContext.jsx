import { createContext, useContext, useState, useCallback } from "react";
import { CommentService } from "../services/CommentService";

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]);

    const fetchComments = useCallback(async (inventoryId) => {
        const data = await CommentService.getComments(inventoryId);
        setComments(data);
    }, []); 

    const createComment = useCallback(async (inventoryId, content) => {
        const newComment = await CommentService.addComment(inventoryId, content);
        setComments((prev) => [...prev, newComment]);
    }, []); 

    const removeComment = useCallback(async (commentId) => {
        await CommentService.deleteComment(commentId);
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    }, []);

    return (
        <CommentContext.Provider value={{ comments, fetchComments, createComment, removeComment }}>
            {children}
        </CommentContext.Provider>
    );
};

export const useComment = () => useContext(CommentContext);
