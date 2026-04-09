import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { courseAPI } from '../../utils/api';
import { useAuthStore } from '../../context/store';
import toast from 'react-hot-toast';
import {
  FiPlay,
  FiCheckCircle,
  FiLock,
  FiDownload,
  FiMessageCircle,
  FiChevronDown,
  FiChevronUp,
  FiMenu,
  FiX,
  FiBookOpen,
  FiArrowLeft,
} from 'react-icons/fi';

export default function CoursePlayer() {
  const { slug } = useParams();
  const { user } = useAuthStore();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  const [question, setQuestion] = useState('');
  const [qnaList, setQnaList] = useState([]);
  const [submittingQ, setSubmittingQ] = useState(false);

  useEffect(() => {
    courseAPI
      .getOne(slug)
      .then((r) => {
        const c = r.data.data;
        setCourse(c);
        // Open first section and set first lesson
        if (c.sections?.length > 0) {
          setOpenSections({ 0: true });
          const firstLesson = c.sections[0]?.lessons?.[0];
          if (firstLesson) setActiveLesson({ ...firstLesson, sectionIndex: 0 });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (activeLesson && course) {
      courseAPI
        .getLessonQnA?.(course._id, activeLesson._id)
        ?.then((r) => setQnaList(r.data.data || []))
        ?.catch(() => {});
    }
  }, [activeLesson?._id]);

  const markComplete = async (lessonId) => {
    try {
      await courseAPI.markComplete(lessonId);
      toast.success('Lesson marked complete! ✅');
    } catch {
      toast.error('Failed to mark complete');
    }
  };

  const submitQuestion = async () => {
    if (!question.trim()) return;
    setSubmittingQ(true);
    try {
      const res = await courseAPI.askQuestion?.(
        course._id,
        activeLesson._id,
        question,
      );
      if (res) {
        setQnaList((prev) => [res.data.data, ...prev]);
        setQuestion('');
        toast.success('Question posted!');
      }
    } catch {
      toast.error('Failed to post question');
    } finally {
      setSubmittingQ(false);
    }
  };

  const totalLessons =
    course?.sections?.reduce((a, s) => a + s.lessons?.length, 0) || 0;
  const completedCount =
    course?.sections?.reduce(
      (a, s) =>
        a +
        s.lessons?.filter((l) => user?.completedLessons?.includes(l._id))
          .length,
      0,
    ) || 0;
  const progress = totalLessons
    ? Math.round((completedCount / totalLessons) * 100)
    : 0;

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl mx-auto mb-3 animate-pulse flex items-center justify-center font-bold text-gray-900 text-xl">
            E
          </div>
          <p className="text-gray-400 text-sm">Loading course...</p>
        </div>
      </div>
    );

  if (!course)
    return (
      <div className="text-center py-20">
        <h2 className="text-white text-xl font-bold mb-3">Course not found</h2>
        <Link
          to="/dashboard/courses"
          className="text-yellow-400 hover:underline"
        >
          ← My Courses
        </Link>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>{course.title} — ELITE Trading Academy</title>
      </Helmet>
      <div className="flex flex-col h-screen bg-gray-950 -m-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
            <Link
              to="/dashboard/courses"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <FiArrowLeft size={14} /> My Courses
            </Link>
            <span className="text-gray-600">›</span>
            <h1 className="text-white text-sm font-medium truncate max-w-xs hidden md:block">
              {course.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-yellow-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-yellow-400 text-xs font-semibold">
                {progress}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 300, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex-shrink-0 overflow-hidden border-r border-gray-700"
              >
                <div className="w-[300px] h-full overflow-y-auto bg-gray-900">
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-gray-400 text-xs">
                      {completedCount}/{totalLessons} lessons completed
                    </p>
                  </div>
                  {course.sections?.map((section, si) => (
                    <div key={si} className="border-b border-gray-800">
                      <button
                        onClick={() =>
                          setOpenSections((prev) => ({
                            ...prev,
                            [si]: !prev[si],
                          }))
                        }
                        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                      >
                        <div>
                          <p className="text-white text-xs font-semibold">
                            {section.title}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {section.lessons?.length} lessons
                          </p>
                        </div>
                        {openSections[si] ? (
                          <FiChevronUp size={14} className="text-gray-400" />
                        ) : (
                          <FiChevronDown size={14} className="text-gray-400" />
                        )}
                      </button>
                      <AnimatePresence>
                        {openSections[si] && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            {section.lessons?.map((lesson, li) => {
                              const isActive = activeLesson?._id === lesson._id;
                              const isCompleted =
                                user?.completedLessons?.includes(lesson._id);
                              return (
                                <button
                                  key={li}
                                  onClick={() => {
                                    setActiveLesson({
                                      ...lesson,
                                      sectionIndex: si,
                                    });
                                    setActiveTab('content');
                                  }}
                                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${isActive ? 'bg-yellow-500/10 border-r-2 border-yellow-500' : 'hover:bg-gray-800'}`}
                                >
                                  <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isCompleted ? 'bg-green-500/20 text-green-400' : isActive ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-500'}`}
                                  >
                                    {isCompleted ? (
                                      <FiCheckCircle size={10} />
                                    ) : lesson.isLocked ? (
                                      <FiLock size={10} />
                                    ) : (
                                      <FiPlay size={9} className="ml-0.5" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-xs font-medium line-clamp-2 ${isActive ? 'text-yellow-400' : isCompleted ? 'text-gray-400 line-through' : 'text-gray-300'}`}
                                    >
                                      {lesson.title}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {lesson.type === 'quiz' && (
                                        <span className="text-xs text-purple-400">
                                          Quiz
                                        </span>
                                      )}
                                      {lesson.type === 'notes' && (
                                        <span className="text-xs text-blue-400">
                                          Notes
                                        </span>
                                      )}
                                      {lesson.videoDuration > 0 && (
                                        <span className="text-xs text-gray-600">
                                          {Math.floor(
                                            lesson.videoDuration / 60,
                                          )}
                                          m
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeLesson ? (
              <>
                {/* Video Area */}
                <div className="bg-black flex-shrink-0">
                  {activeLesson.videoUrl ? (
                    <div className="aspect-video max-h-[55vh] w-full">
                      {activeLesson.videoUrl.includes('youtube') ||
                      activeLesson.videoUrl.includes('youtu.be') ? (
                        <iframe
                          src={activeLesson.videoUrl
                            .replace('watch?v=', 'embed/')
                            .replace('youtu.be/', 'youtube.com/embed/')}
                          className="w-full h-full"
                          allowFullScreen
                          title={activeLesson.title}
                        />
                      ) : activeLesson.videoUrl.includes('vimeo') ? (
                        <iframe
                          src={`https://player.vimeo.com/video/${activeLesson.videoUrl.split('/').pop()}`}
                          className="w-full h-full"
                          allowFullScreen
                          title={activeLesson.title}
                        />
                      ) : (
                        <video
                          src={activeLesson.videoUrl}
                          controls
                          className="w-full h-full"
                          controlsList="nodownload"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video max-h-[40vh] flex items-center justify-center bg-gray-800">
                      <div className="text-center">
                        <FiBookOpen
                          size={48}
                          className="text-gray-600 mx-auto mb-3"
                        />
                        <p className="text-gray-400 text-sm">
                          {activeLesson.type === 'quiz'
                            ? 'Quiz Lesson'
                            : activeLesson.type === 'notes'
                              ? 'Notes Lesson'
                              : 'No video for this lesson'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lesson Info + Tabs */}
                <div className="flex-1 overflow-y-auto">
                  {/* Lesson header */}
                  <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-white font-bold text-lg">
                        {activeLesson.title}
                      </h2>
                      <p className="text-gray-500 text-xs mt-0.5 capitalize">
                        {course.sections?.[activeLesson.sectionIndex]?.title}
                      </p>
                    </div>
                    <button
                      onClick={() => markComplete(activeLesson._id)}
                      className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                    >
                      <FiCheckCircle size={14} /> Mark Complete
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-700 px-4">
                    {['content', 'notes', 'quiz', 'qa'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        {tab === 'qa' ? 'Q&A' : tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {activeTab === 'content' && (
                      <div>
                        {activeLesson.description && (
                          <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            {activeLesson.description}
                          </p>
                        )}
                        {activeLesson.content && (
                          <div
                            className="prose-dark text-gray-300 text-sm"
                            dangerouslySetInnerHTML={{
                              __html: activeLesson.content,
                            }}
                          />
                        )}
                        {!activeLesson.description && !activeLesson.content && (
                          <p className="text-gray-500 text-sm">
                            Watch the video above for this lesson's content.
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === 'notes' && (
                      <div>
                        {activeLesson.notesUrl ? (
                          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <FiDownload
                                size={20}
                                className="text-yellow-400"
                              />
                              <div>
                                <p className="text-white font-medium text-sm">
                                  Lesson Notes Available
                                </p>
                                <p className="text-gray-500 text-xs">
                                  Download the PDF notes for this lesson
                                </p>
                              </div>
                            </div>
                            <a
                              href={activeLesson.notesUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-yellow-500 text-gray-900 font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors"
                            >
                              <FiDownload size={14} /> Download Notes PDF
                            </a>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No downloadable notes for this lesson.
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === 'quiz' && (
                      <div>
                        {activeLesson.quiz?.length > 0 ? (
                          <div className="space-y-5">
                            {activeLesson.quiz.map((q, qi) => (
                              <div
                                key={qi}
                                className="bg-gray-800 border border-gray-700 rounded-xl p-5"
                              >
                                <p className="text-white font-semibold text-sm mb-3">
                                  {qi + 1}. {q.question}
                                </p>
                                <div className="space-y-2">
                                  {q.options?.map((opt, oi) => (
                                    <button
                                      key={oi}
                                      className="w-full text-left text-sm text-gray-300 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg px-4 py-2.5 transition-colors"
                                    >
                                      {String.fromCharCode(65 + oi)}. {opt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No quiz for this lesson.
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === 'qa' && (
                      <div className="space-y-4">
                        {/* Ask question */}
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                          <p className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                            <FiMessageCircle
                              size={14}
                              className="text-yellow-400"
                            />{' '}
                            Ask a Question
                          </p>
                          <textarea
                            rows={3}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask anything about this lesson..."
                            className="w-full bg-gray-900 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all placeholder-gray-500"
                          />
                          <button
                            onClick={submitQuestion}
                            disabled={submittingQ || !question.trim()}
                            className="mt-2 bg-yellow-500 text-gray-900 font-bold px-4 py-2 rounded-xl text-sm hover:bg-yellow-400 transition-colors disabled:opacity-60"
                          >
                            {submittingQ ? 'Posting...' : 'Post Question'}
                          </button>
                        </div>

                        {/* Q&A list */}
                        {qnaList.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-6">
                            No questions yet. Be the first to ask!
                          </p>
                        ) : (
                          qnaList.map((qna, i) => (
                            <div
                              key={i}
                              className="bg-gray-800 border border-gray-700 rounded-xl p-4"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-7 h-7 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xs font-bold">
                                  {qna.user?.name?.[0]}
                                </div>
                                <span className="text-white text-xs font-medium">
                                  {qna.user?.name}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm mb-3">
                                {qna.question}
                              </p>
                              {qna.answer && (
                                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 mt-2">
                                  <p className="text-green-400 text-xs font-semibold mb-1">
                                    Mentor Answer:
                                  </p>
                                  <p className="text-gray-300 text-sm">
                                    {qna.answer}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <FiPlay size={48} className="text-gray-600 mx-auto mb-4" />
                  <h3 className="text-white font-bold text-lg mb-2">
                    Select a lesson to start
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Choose any lesson from the sidebar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
