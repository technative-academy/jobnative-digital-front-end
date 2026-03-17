import { useEffect, useState } from "react";
import { commentsService } from "../services/comments.service";
import { useAuth } from "./useAuth";

export function useComments(companyId, options = {}) {
  const { enabled = true } = options;
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId || !enabled) {
      setComments([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await commentsService.getAll(companyId);
        if (isActive) setComments(res);
      } catch (err) {
        if (isActive) setError(err);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, [companyId, enabled]);

  const addComment = async (body) => {
    const newComment = await commentsService.create(companyId, { body, user_id: user?.id });
    setComments((prev) => [...prev, newComment]);
  };

  const editComment = async (commentId, body) => {
    const updated = await commentsService.update(commentId, { body, user_id: user?.id });
    setComments((prev) => prev.map((c) => c.id === commentId ? updated : c));
  };

  const deleteComment = async (commentId) => {
    await commentsService.delete(commentId, { user_id: user?.id });
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return { comments, isLoading, error, addComment, editComment, deleteComment };
}
