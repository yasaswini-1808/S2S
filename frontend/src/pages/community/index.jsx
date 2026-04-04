import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAlert } from '../../context/AlertContext';
import { MessageSquare, Heart, Send, Loader2, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const { addAlert } = useAlert();
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/community/posts');
      setPosts(res.data);
    } catch (err) {
      addAlert('Failed to load posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post('http://localhost:8000/api/community/posts', { content });
      setPosts([res.data, ...posts]);
      setContent('');
      addAlert('Posted successfully!', 'success');
    } catch (err) {
      addAlert('Failed to post', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold dark:text-white">Community</h2>
        <p className="text-gray-500 mt-2">Connect, share ideas, and get help from peers.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-8">
        <form onSubmit={handlePost}>
          <textarea
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none dark:text-white transition-all"
            rows="3"
            placeholder="What's on your mind? Got a question?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-70 font-semibold"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : posts.length === 0 ? (
           <p className="text-center text-gray-500 dark:text-gray-400 py-10">No posts yet. Be the first to start a conversation!</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                  {post.user_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white leading-tight">{post.user_name}</h4>
                  <span className="text-xs text-gray-400">
                    {new Date(post.createdAt || Date.now()).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-wrap">{post.content}</p>
              
              <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors text-sm font-medium">
                  <Heart className="w-5 h-5" />
                  <span>{post.likes || 0} Likes</span>
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500 transition-colors text-sm font-medium">
                  <MessageSquare className="w-5 h-5" />
                  <span>{post.comments?.length || 0} Comments</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
