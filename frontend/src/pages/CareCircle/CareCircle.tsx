"use client";
import React, { useState, useEffect } from "react";
import { Search, Plus, MessageCircle, ThumbsUp, X, UsersRound } from "lucide-react";
import { useCareCircle } from "../../hooks/useCareCircle";
import { useNavigate, useParams } from "react-router-dom";
import { MainWrapper } from "../../component/Wrapper/MainWrapper";
import { Button } from "../../component/Button";

type Tag = { id: string; name: string };
type TagRel = { tag: Tag };
interface Post {
  id: string;
  title: string;
  body: string;
  userAlias: string | null;
  upvotes: number;
  userHasUpvoted?: boolean;
  tags: TagRel[];
  _count?: { comments: number };
  createdAt: string | Date;
}

const PostCard: React.FC<{ post: Post; onOpen: (id: string) => void; onUpvote: (id: string) => void }> = ({ post, onOpen, onUpvote }) => {
  const timeAgo = (date: string | Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div
      onClick={() => onOpen(post.id)}
      className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-600 transition line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{post.userAlias || "Anonymous"}</p>
          </div>
        </div>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((t: TagRel) => (
              <span
                key={t.tag.id}
                className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-teal-50 to-green-50 text-teal-700 border border-teal-200 font-medium"
              >
                #{t.tag.name}
              </span>
            ))}
            {post.tags.length > 3 && <span className="text-xs px-3 py-1 text-gray-500">+{post.tags.length - 3}</span>}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-400">{timeAgo(post.createdAt)}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition">
              <MessageCircle size={16} />
              <span className="text-sm font-medium">{post._count?.comments ?? 0}</span>
            </div>
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onUpvote(post.id);
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                post.userHasUpvoted ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <ThumbsUp size={16} />
              <span className="text-sm font-medium">{post.upvotes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreatePostModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; body: string; tags: string[]; userAlias?: string }) => void;
  loading: boolean;
}> = ({ isOpen, onClose, onSubmit, loading }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [userAlias, setUserAlias] = useState("");

  const handleSubmit = () => {
    onSubmit({
      title,
      body,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      userAlias: userAlias || undefined,
    });
    setTitle("");
    setBody("");
    setTags("");
    setUserAlias("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Share Your Thoughts</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Story</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder="Share your experience, thoughts, or support..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:outline-none transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., anxiety, support, wellness"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name (optional)</label>
            <input
              value={userAlias}
              onChange={(e) => setUserAlias(e.target.value)}
              placeholder="Leave blank for Anonymous"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:outline-none transition"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !body.trim()}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition transform hover:scale-105"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CareCircle: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { posts, tags, loading, message, fetchPosts, fetchTags, createPost, upvote } = useCareCircle();

  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => { fetchTags(); }, [fetchTags]);
  useEffect(() => { fetchPosts({ search: query, tags: selectedTags }); }, [fetchPosts, query, selectedTags]);

  const toggleTag = (name: string) => setSelectedTags(prev => prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]);
  const handleUpvote = async (id: string) => { await upvote(id); await fetchPosts({ search: query, tags: selectedTags }); };

  return (
    <MainWrapper>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text flex items-center gap-2">
                <UsersRound size={24} /> CareCircle
              </h1>
              <p className="text-gray-600 mt-1">A supportive community for wellbeing</p>
            </div>
            <Button onClick={() => setShowCreate(true)} variant="outline" size="sm">
              <Plus size={20} /> New Post
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <div className="lg:sticky lg:top-8 h-fit">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-200 focus:outline-none transition"
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Topics</h3>
                  <div className="space-y-2 h-80 overflow-y-auto">
                    {tags.map(t => (
                      <button
                        key={t.id}
                        onClick={() => toggleTag(t.name)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${selectedTags.includes(t.name)
                          ? "bg-gradient-to-r from-teal-500 to-green-500 text-white font-medium"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      >
                        #{t.name}
                      </button>
                    ))}
                  </div>
                  {selectedTags.length > 0 && (
                    <button onClick={() => setSelectedTags([])} className="w-full mt-3 text-sm text-gray-600 hover:text-gray-900 font-medium">
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl animate-pulse" />)}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                  <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">No posts found</h3>
                  <p className="text-gray-600 mt-2">
                    {selectedTags.length > 0 ? "Try adjusting your filters" : "Be the first to share something"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map(p => <PostCard key={p.id} post={p} onOpen={id => navigate(`/${userId}/carecircle/${id}`)} onUpvote={handleUpvote} />)}
                </div>
              )}
              {message && <div className="text-sm text-red-600 mt-3">{message}</div>}
            </div>
          </div>
        </div>

        <CreatePostModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSubmit={async (data) => {
            await createPost(data, async () => {
              setShowCreate(false);
              await fetchPosts({ search: query, tags: selectedTags });
            });
          }}
          loading={loading}
        />
      </div>
    </MainWrapper>
  );
};

export default CareCircle;
