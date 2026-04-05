const mongoose = require('mongoose');
const slugify = require('slugify');

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    type: {
      type: String,
      enum: ['video', 'notes', 'quiz', 'qa', 'live'],
      default: 'video',
    },
    videoUrl: String,
    videoPublicId: String,
    videoDuration: Number, // seconds
    notesUrl: String,
    notesPublicId: String,
    content: String, // rich text for notes
    isPreview: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    quiz: [
      {
        question: String,
        options: [String],
        correct: Number,
        explanation: String,
      },
    ],
    qnaEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  lessons: [lessonSchema],
});

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
    helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title required'],
      trim: true,
    },
    slug: { type: String, unique: true, sparse: true },
    subtitle: String,
    description: { type: String, required: true },
    thumbnail: String,
    thumbnailId: String,
    previewVideo: String,
    language: {
      type: String,
      enum: ['english', 'hindi', 'bilingual'],
      default: 'english',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'beginner',
    },
    category: {
      type: String,
      enum: [
        'forex',
        'stocks',
        'crypto',
        'commodity',
        'options',
        'technical_analysis',
        'fundamental_analysis',
        'risk_management',
        'psychology',
        'combo',
      ],
      required: true,
    },
    courseType: {
      type: String,
      enum: ['recorded', 'live_online', 'live_offline', 'mentorship', 'free'],
      default: 'recorded',
    },

    // Pricing
    price: { type: Number, required: true, default: 0 },
    originalPrice: Number,
    currency: { type: String, default: 'INR' },
    isFree: { type: Boolean, default: false },

    // Content
    sections: [sectionSchema],
    whatYouLearn: [String],
    requirements: [String],
    includes: [String], // e.g. "10 hours video", "5 PDFs"
    tags: [String],

    // Instructor
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Stats
    enrolledCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },

    // SEO
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],

    // Status
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },

    // Affiliate commission override
    affiliateCommission: { type: Number, default: null }, // null = use global setting

    publishedAt: Date,
  },
  { timestamps: true },
);

// Auto-generate slug
courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug =
      slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  // Recalculate average rating
  if (this.reviews.length > 0) {
    this.averageRating =
      this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
