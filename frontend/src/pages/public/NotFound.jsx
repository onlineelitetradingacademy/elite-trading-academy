import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 — ELITE Trading Academy</title>
      </Helmet>
      <div
        style={{ background: '#0A0A0F' }}
        className="min-h-screen flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="font-display text-9xl md:text-[180px] text-yellow-500 opacity-10 leading-none select-none mb-4">
            404
          </div>
          <h1 className="text-white font-bold text-3xl mb-3 -mt-8">
            Page Not Found
          </h1>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors text-sm"
            >
              Go Home
            </Link>
            <Link
              to="/courses"
              className="border border-yellow-500/40 text-yellow-400 font-semibold px-6 py-3 rounded-xl hover:bg-yellow-500/10 transition-colors text-sm"
            >
              Browse Courses
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
