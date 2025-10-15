"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { MainWrapper } from "../../component/Wrapper/MainWrapper";
import { useCareCircle } from "../../hooks/useCareCircle";

const PostPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPost, addComment, upvote } = useCareCircle();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [alias, setAlias] = useState("");
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchPost(id);
        if (mounted) setPost(data);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [id, fetchPost]);

  const handleSubmitComment = async () => {
    if (!id || !comment.trim()) return;
    await addComment(id, { body: comment, userAlias: alias || undefined }, async () => {
      setComment("");
      setAlias("");
      const data = await fetchPost(id);
      setPost(data);
    });
  };

  const getInitial = (name?: string) => (name ? name[0].toUpperCase() : "?");

  return (
    <MainWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition p-2 -ml-2" onClick={() => navigate(-1)}>
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="text-sm text-slate-500">Community Stories</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Loading */}
          {loading && <p className="text-center text-gray-400 py-12">Loading...</p>}

          {/* Post */}
          {!loading && post && (
            <article className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-200 overflow-hidden mb-8">
              <div className="px-8 py-10 border-b border-slate-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-4">
                      {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                          {getInitial(post.userAlias)}
                        </div>
                        <span className="font-medium text-slate-900">{post.userAlias}</span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <time>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((t: any) => (
                      <span key={t.tag.id} className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition cursor-pointer">
                        #{t.tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-8 py-10">
                <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                  {post.body}
                </div>
              </div>

              {/* Actions */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                <button onClick={() => setUpvoted(!upvoted)} className={`flex items-center gap-2 px-4 py-2 rounded-full transition font-medium ${upvoted ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-200'}`}>
                  <Heart size={18} fill={upvoted ? 'currentColor' : 'none'} /> {(post.upvotes || 0) + (upvoted ? 1 : 0)}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-700 hover:bg-slate-100 transition font-medium ring-1 ring-slate-200">
                  <MessageCircle size={18} /> {post.comments?.length || 0}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-700 hover:bg-slate-100 transition ring-1 ring-slate-200">
                  <Share2 size={18} />
                </button>
                <button onClick={() => setSaved(!saved)} className={`flex items-center gap-2 px-4 py-2 rounded-full transition ring-1 ${saved ? 'bg-blue-100 text-blue-700 ring-blue-200' : 'bg-white text-slate-700 hover:bg-slate-100 ring-slate-200'}`}>
                  <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
            </article>
          )}

          {/* Not Found */}
          {!loading && !post && <p className="text-center text-gray-400 py-12"></p>}

          {/* Comments */}
          {post && (
            <section className="bg-white rounded-3xl shadow-lg ring-1 ring-slate-200 overflow-hidden">
              <div className="px-8 py-10 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <MessageCircle size={28} className="text-emerald-600" />
                  Responses ({post.comments?.length || 0})
                </h2>
              </div>

              <div className="divide-y divide-slate-100 max-h-[32rem] overflow-y-auto">
                {(post.comments?.length > 0 ? post.comments : []).map((c: any) => (
                  <div key={c.id} className="px-8 py-6 hover:bg-slate-50 transition group">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {getInitial(c.userAlias)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-slate-900">{c.userAlias || 'Anonymous'}</span>
                          <span className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{c.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {(!post.comments || post.comments.length === 0) && (
                  <div className="px-8 py-12 text-center">
                    <MessageCircle size={32} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">No responses yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Add Comment */}
              <div className="px-8 py-10 bg-gradient-to-br from-slate-50 to-emerald-50 border-t border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Share your thoughts</h3>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="Your name or alias (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-sm"
                  />

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="What's on your mind? Share your thoughts, experiences, or encouragement..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm leading-relaxed"
                  />

                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setComment(''); setAlias(''); }} className="px-6 py-2.5 rounded-full border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 transition">
                      Clear
                    </button>
                    <button onClick={handleSubmitComment} disabled={!comment.trim()} className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      Post Response
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </MainWrapper>
  );
};

export default PostPage;
