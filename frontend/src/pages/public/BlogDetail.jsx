import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogAPI } from '../../utils/api';
import { FiClock, FiEye, FiArrowLeft, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI
      .getOne(slug)
      .then((r) => setBlog(r.data.data))
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading)
    return (
      <div
        className="min-h-screen pt-24 flex items-center justify-center"
        style={{ background: '#0A0A0F' }}
      >
        <div className="text-yellow-500 font-display text-2xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  if (!blog)
    return (
      <div
        className="min-h-screen pt-24 flex items-center justify-center"
        style={{ background: '#0A0A0F' }}
      >
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">Post not found</h2>
          <Link to="/blog" className="text-yellow-400 hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || blog.title} — ELITE Trading Academy</title>
        <meta
          name="description"
          content={blog.metaDescription || blog.excerpt}
        />
      </Helmet>

      <div style={{ background: '#0A0A0F' }} className="min-h-screen">
        <div className="container-custom max-w-4xl mx-auto pt-28 pb-20">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm mb-8"
          >
            <FiArrowLeft size={14} /> Back to Blog
          </Link>

          {/* Header */}
          <div className="mb-8">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 capitalize`}
            >
              {blog.category?.replace('_', ' ')}
            </span>
            <h1 className="text-white font-bold text-3xl md:text-4xl leading-tight mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
              {blog.author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold overflow-hidden">
                    {blog.author.avatar ? (
                      <img
                        src={blog.author.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      blog.author.name?.[0]
                    )}
                  </div>
                  <span>{blog.author.name}</span>
                </div>
              )}
              <span className="flex items-center gap-1">
                <FiClock size={12} /> {blog.readTime} min read
              </span>
              {blog.views > 0 && (
                <span className="flex items-center gap-1">
                  <FiEye size={12} /> {blog.views?.toLocaleString()} views
                </span>
              )}
              <span>
                {new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <button
                onClick={share}
                className="flex items-center gap-1 hover:text-yellow-400 transition-colors ml-auto"
              >
                <FiShare2 size={14} /> Share
              </button>
            </div>
          </div>

          {/* Thumbnail */}
          {blog.thumbnail && (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8 border border-gray-700"
            />
          )}

          {/* Content */}
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-8 prose-dark"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-gray-900 border border-yellow-500/20 rounded-2xl p-8 text-center">
            <h3 className="text-white font-bold text-xl mb-2">
              Ready to start trading?
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              Join our expert-led courses and learn to trade profitably.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors text-sm"
            >
              Explore Courses →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
