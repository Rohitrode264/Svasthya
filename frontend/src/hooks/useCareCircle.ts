import { useCallback, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

export interface TagDto { id: string; name: string; official: boolean; }
export interface PostDto {
    id: string;
    title: string;
    body: string;
    userAlias: string;
    createdAt: string;
    upvotes: number;
    userHasUpvoted?: boolean;
    _count?: { comments: number };
    tags: { tag: TagDto }[];
}
export interface CommentDto { id: string; userAlias: string; body: string; createdAt: string; }

const authHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `token ${token}` } : undefined;
};

export const useCareCircle = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [posts, setPosts] = useState<PostDto[]>([]);
    const [tags, setTags] = useState<TagDto[]>([]);

    const fetchPosts = useCallback(async (params?: { tag?: string; tags?: string[]; search?: string; limit?: number; offset?: number }) => {
        setLoading(true); setMessage("");
        try {
            const query: any = {};
            if (params?.tag) query.tag = params.tag;
            if (params?.tags?.length) query.tags = params.tags.join(",");
            if (params?.search) query.search = params.search;
            if (params?.limit) query.limit = params.limit;
            if (params?.offset) query.offset = params.offset;
            const res = await axios.get(`${BASE_URL}/posts`, { params: query, headers: authHeaders() });
            setPosts(res.data || []);
        } catch (e: any) {
            setMessage(e.response?.data?.error || "Failed to load posts");
        } finally { setLoading(false); }
    }, []);

    const createPost = useCallback(async (data: { title: string; body: string; tags: string[]; userAlias?: string }, onSuccess?: () => void) => {
        setLoading(true); setMessage("");
        try {
            const res = await axios.post(`${BASE_URL}/posts`, data, { headers: {Authorization:localStorage.getItem('token')} });
            if (res.status === 201) { onSuccess?.(); }
        } catch (e: any) {
            setMessage(e.response?.data?.error || "Failed to create post");
        } finally { setLoading(false); }
    }, []);

    const upvote = useCallback(async (postId: string) => {
        try { await axios.patch(`${BASE_URL}/posts/${postId}/upvote`, {}, { headers: {Authorization:localStorage.getItem('token')} }); }
        catch { /* ignore */ }
    }, []);

    const fetchPost = useCallback(async (id: string): Promise<PostDto & { comments: CommentDto[] }> => {
        const res = await axios.get(`${BASE_URL}/posts/${id}`, { headers: authHeaders() });
        return res.data;
    }, []);

    const addComment = useCallback(async (postId: string, data: { body: string; userAlias?: string }, onSuccess?: () => void) => {
        try {
            const res = await axios.post(`${BASE_URL}/posts/${postId}/comments`, data, { headers: {Authorization:localStorage.getItem('token')} });
            if (res.status === 201) onSuccess?.();
        } catch (e) { /* surface via UI where called */ }
    }, []);

    const fetchTags = useCallback(async () => {
        try { const res = await axios.get(`${BASE_URL}/tags`); setTags(res.data || []); } catch { /* ignore */ }
    }, []);

    return { loading, message, posts, tags, fetchPosts, createPost, upvote, fetchPost, addComment, fetchTags };
};


