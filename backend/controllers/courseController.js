const Course = require('../models/Course');
const User = require('../models/User');
const { Payment } = require('../models/index');

// ── GET ALL COURSES (public) ──────────────────────────────────────
exports.getCourses = async (req, res, next) => {
  try {
    const { category, level, courseType, language, isFree, featured, search, sort, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };

    if (category)   query.category   = category;
    if (level)      query.level      = level;
    if (courseType) query.courseType = courseType;
    if (language)   query.language   = language;
    if (isFree)     query.isFree     = isFree === 'true';
    if (featured)   query.isFeatured = true;
    if (search)     query.$text      = { $search: search };

    const sortOptions = {
      newest:   { createdAt: -1 },
      popular:  { enrolledCount: -1 },
      rating:   { averageRating: -1 },
      price_low:{ price: 1 },
      price_high:{ price: -1 }
    };

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar bio')
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-sections');

    const total = await Course.countDocuments(query);

    res.json({ success: true, data: courses, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// ── GET SINGLE COURSE ─────────────────────────────────────────────
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isPublished: true })
      .populate('instructor', 'name avatar bio expertise socialLinks')
      .populate('reviews.user', 'name avatar');

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // Check enrollment - lock lesson content for non-enrolled
    let isEnrolled = false;
    if (req.user) {
      isEnrolled = req.user.enrolledCourses?.some(c => c.toString() === course._id.toString());
    }

    // If not enrolled, only return preview lessons
    const courseData = course.toObject();
    if (!isEnrolled && !['admin','sub_admin','mentor'].includes(req.user?.role)) {
      courseData.sections = courseData.sections.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson => ({
          ...lesson,
          videoUrl: lesson.isPreview ? lesson.videoUrl : null,
          notesUrl: lesson.isPreview ? lesson.notesUrl : null,
          content:  lesson.isPreview ? lesson.content  : null,
          quiz:     lesson.isPreview ? lesson.quiz     : []
        }))
      }));
    }

    res.json({ success: true, data: courseData, isEnrolled });
  } catch (err) { next(err); }
};

// ── CREATE COURSE (admin/mentor) ──────────────────────────────────
exports.createCourse = async (req, res, next) => {
  try {
    req.body.instructor = req.body.instructor || req.user.id;
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) { next(err); }
};

// ── UPDATE COURSE ─────────────────────────────────────────────────
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
};

// ── DELETE COURSE ─────────────────────────────────────────────────
exports.deleteCourse = async (req, res, next) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) { next(err); }
};

// ── PUBLISH / UNPUBLISH ───────────────────────────────────────────
exports.togglePublish = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    course.isPublished = !course.isPublished;
    if (course.isPublished && !course.publishedAt) course.publishedAt = new Date();
    await course.save();
    res.json({ success: true, message: `Course ${course.isPublished ? 'published' : 'unpublished'}`, data: course });
  } catch (err) { next(err); }
};

// ── ADD SECTION ───────────────────────────────────────────────────
exports.addSection = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    course.sections.push({ title: req.body.title, order: course.sections.length });
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (err) { next(err); }
};

// ── ADD LESSON ────────────────────────────────────────────────────
exports.addLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    const section = course.sections.id(req.params.sectionId);
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    section.lessons.push({ ...req.body, order: section.lessons.length });
    await course.save();
    res.status(201).json({ success: true, data: course });
  } catch (err) { next(err); }
};

// ── UPDATE LESSON ─────────────────────────────────────────────────
exports.updateLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    const section = course.sections.id(req.params.sectionId);
    const lesson = section?.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });
    Object.assign(lesson, req.body);
    await course.save();
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
};

// ── MARK LESSON COMPLETE ──────────────────────────────────────────
exports.markLessonComplete = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user.completedLessons.includes(lessonId)) {
      user.completedLessons.push(lessonId);
      await user.save();
    }
    res.json({ success: true, message: 'Lesson marked as complete' });
  } catch (err) { next(err); }
};

// ── BOOKMARK LESSON ───────────────────────────────────────────────
exports.bookmarkLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const user = await User.findById(req.user.id);
    const idx = user.bookmarkedLessons.indexOf(lessonId);
    if (idx === -1) user.bookmarkedLessons.push(lessonId);
    else user.bookmarkedLessons.splice(idx, 1);
    await user.save();
    res.json({ success: true, bookmarked: idx === -1 });
  } catch (err) { next(err); }
};

// ── ADD REVIEW ────────────────────────────────────────────────────
exports.addReview = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    const alreadyReviewed = course.reviews.some(r => r.user.toString() === req.user.id);
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Already reviewed' });
    const isEnrolled = req.user.enrolledCourses.some(c => c.toString() === course._id.toString());
    if (!isEnrolled) return res.status(403).json({ success: false, message: 'Must be enrolled to review' });
    course.reviews.push({ user: req.user.id, rating: req.body.rating, comment: req.body.comment });
    await course.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (err) { next(err); }
};

// ── GET ENROLLED COURSES (student dashboard) ──────────────────────
exports.getMyEnrolledCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledCourses',
      select: 'title thumbnail slug category courseType sections',
      populate: { path: 'instructor', select: 'name avatar' }
    });
    // Add progress per course
    const coursesWithProgress = user.enrolledCourses.map(course => {
      const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
      const completedLessons = course.sections.reduce((acc, s) =>
        acc + s.lessons.filter(l => user.completedLessons.includes(l._id.toString())).length, 0);
      return { ...course.toObject(), progress: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0, totalLessons, completedLessons };
    });
    res.json({ success: true, data: coursesWithProgress });
  } catch (err) { next(err); }
};

// ── ADMIN: GET ALL COURSES ────────────────────────────────────────
exports.adminGetCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name')
      .sort({ createdAt: -1 })
      .select('title category courseType price enrolledCount isPublished isFeatured createdAt');
    res.json({ success: true, data: courses });
  } catch (err) { next(err); }
};
