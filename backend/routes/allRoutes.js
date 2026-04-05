// ============================================================
// ELITE TRADING ACADEMY — ALL ROUTES
// ============================================================
const express = require('express');
const ctrl = require('../controllers/mainController');
const courseCtrl = require('../controllers/courseController');
const payCtrl = require('../controllers/paymentController');
const settingCtrl = require('../controllers/settingController');
const { protect, authorize, adminOnly, checkPermission } = require('../middleware/auth');

// ── USER ROUTES ───────────────────────────────────────────────────
const userRouter = express.Router();
userRouter.get('/',          protect, adminOnly, ctrl.getUsers);
userRouter.get('/profile',   protect, ctrl.updateProfile);
userRouter.put('/profile',   protect, ctrl.updateProfile);
userRouter.get('/:id',       protect, authorize('admin','sub_admin'), ctrl.getUser);
userRouter.put('/:id',       protect, adminOnly, ctrl.updateUser);
userRouter.get('/admin/stats', protect, adminOnly, ctrl.getDashboardStats);
module.exports.userRoutes = userRouter;

// ── COURSE ROUTES ─────────────────────────────────────────────────
const courseRouter = express.Router();
courseRouter.get('/',                   courseCtrl.getCourses);
courseRouter.get('/admin/all',          protect, authorize('admin','sub_admin','mentor'), courseCtrl.adminGetCourses);
courseRouter.get('/my',                 protect, courseCtrl.getMyEnrolledCourses);
courseRouter.get('/:slug',              courseCtrl.getCourse);
courseRouter.post('/',                  protect, authorize('admin','sub_admin','mentor'), courseCtrl.createCourse);
courseRouter.put('/:id',               protect, authorize('admin','sub_admin','mentor'), courseCtrl.updateCourse);
courseRouter.delete('/:id',            protect, adminOnly, courseCtrl.deleteCourse);
courseRouter.patch('/:id/publish',     protect, authorize('admin','sub_admin'), courseCtrl.togglePublish);
courseRouter.post('/:id/sections',     protect, authorize('admin','sub_admin','mentor'), courseCtrl.addSection);
courseRouter.post('/:id/sections/:sectionId/lessons', protect, authorize('admin','sub_admin','mentor'), courseCtrl.addLesson);
courseRouter.put('/:id/sections/:sectionId/lessons/:lessonId', protect, authorize('admin','sub_admin','mentor'), courseCtrl.updateLesson);
courseRouter.post('/lessons/:lessonId/complete', protect, courseCtrl.markLessonComplete);
courseRouter.post('/lessons/:lessonId/bookmark', protect, courseCtrl.bookmarkLesson);
courseRouter.post('/:slug/reviews',    protect, courseCtrl.addReview);
// Q&A
courseRouter.get('/:courseId/lessons/:lessonId/qna',  protect, ctrl.getLessonQnA);
courseRouter.post('/:courseId/lessons/:lessonId/qna', protect, ctrl.askQuestion);
courseRouter.put('/qna/:id/answer',    protect, authorize('admin','mentor'), ctrl.answerQuestion);
module.exports.courseRoutes = courseRouter;

// ── PAYMENT ROUTES ────────────────────────────────────────────────
const payRouter = express.Router();
payRouter.post('/create-order',    protect, payCtrl.createOrder);
payRouter.post('/verify',          protect, payCtrl.verifyPayment);
payRouter.get('/my',               protect, payCtrl.getMyPayments);
payRouter.get('/all',              protect, adminOnly, payCtrl.getAllPayments);
payRouter.get('/analytics',        protect, adminOnly, payCtrl.getRevenueAnalytics);
module.exports.paymentRoutes = payRouter;

// ── COUPON ROUTES ─────────────────────────────────────────────────
const couponRouter = express.Router();
couponRouter.post('/validate', protect, ctrl.validateCoupon);
couponRouter.get('/',   protect, adminOnly, ctrl.getCoupons);
couponRouter.post('/',  protect, adminOnly, ctrl.createCoupon);
couponRouter.put('/:id', protect, adminOnly, ctrl.updateCoupon);
couponRouter.delete('/:id', protect, adminOnly, ctrl.deleteCoupon);
module.exports.couponRoutes = couponRouter;

// ── BLOG ROUTES ───────────────────────────────────────────────────
const blogRouter = express.Router();
blogRouter.get('/',           ctrl.getBlogs);
blogRouter.get('/admin/all',  protect, authorize('admin','sub_admin','mentor'), ctrl.adminGetBlogs);
blogRouter.get('/:slug',      ctrl.getBlog);
blogRouter.post('/',    protect, authorize('admin','sub_admin','mentor'), ctrl.createBlog);
blogRouter.put('/:id',  protect, authorize('admin','sub_admin','mentor'), ctrl.updateBlog);
blogRouter.delete('/:id', protect, adminOnly, ctrl.deleteBlog);
module.exports.blogRoutes = blogRouter;

// ── BATCH ROUTES ──────────────────────────────────────────────────
const batchRouter = express.Router();
batchRouter.get('/',     ctrl.getBatches);
batchRouter.post('/',    protect, adminOnly, ctrl.createBatch);
batchRouter.put('/:id',  protect, adminOnly, ctrl.updateBatch);
batchRouter.delete('/:id', protect, adminOnly, ctrl.deleteBatch);
module.exports.batchRoutes = batchRouter;

// ── WEBINAR ROUTES ────────────────────────────────────────────────
const webinarRouter = express.Router();
webinarRouter.get('/',          ctrl.getWebinars);
webinarRouter.get('/:id',       ctrl.getWebinar);
webinarRouter.post('/:id/register', protect, ctrl.registerWebinar);
webinarRouter.post('/',         protect, adminOnly, ctrl.createWebinar);
webinarRouter.put('/:id',       protect, adminOnly, ctrl.updateWebinar);
webinarRouter.delete('/:id',    protect, adminOnly, ctrl.deleteWebinar);
module.exports.webinarRoutes = webinarRouter;

// ── AFFILIATE ROUTES ──────────────────────────────────────────────
const affiliateRouter = express.Router();
affiliateRouter.post('/apply',          protect, ctrl.applyAffiliate);
affiliateRouter.get('/my',              protect, ctrl.getMyAffiliate);
affiliateRouter.get('/track/:code',     ctrl.trackClick);
affiliateRouter.post('/payout',         protect, ctrl.requestPayout);
affiliateRouter.get('/',                protect, adminOnly, ctrl.getAffiliates);
affiliateRouter.put('/:id',            protect, adminOnly, ctrl.updateAffiliate);
affiliateRouter.post('/bypass/:userId', protect, adminOnly, ctrl.adminBypassAffiliate);
affiliateRouter.get('/payouts/all',    protect, adminOnly, ctrl.getPayouts);
affiliateRouter.put('/payouts/:id',    protect, adminOnly, ctrl.processPayout);
module.exports.affiliateRoutes = affiliateRouter;

// ── FRANCHISE ROUTES ──────────────────────────────────────────────
const franchiseRouter = express.Router();
franchiseRouter.post('/',     ctrl.submitFranchiseLead);
franchiseRouter.get('/',      protect, authorize('admin','sub_admin'), ctrl.getFranchiseLeads);
franchiseRouter.put('/:id',   protect, authorize('admin','sub_admin'), ctrl.updateFranchiseLead);
module.exports.franchiseRoutes = franchiseRouter;

// ── TESTIMONIAL ROUTES ────────────────────────────────────────────
const testimonialRouter = express.Router();
testimonialRouter.get('/',       ctrl.getTestimonials);
testimonialRouter.post('/',      protect, adminOnly, ctrl.createTestimonial);
testimonialRouter.put('/:id',    protect, adminOnly, ctrl.updateTestimonial);
testimonialRouter.delete('/:id', protect, adminOnly, ctrl.deleteTestimonial);
module.exports.testimonialRoutes = testimonialRouter;

// ── RESOURCE ROUTES ───────────────────────────────────────────────
const resourceRouter = express.Router();
resourceRouter.get('/',        ctrl.getResources);
resourceRouter.post('/',       protect, adminOnly, ctrl.createResource);
resourceRouter.put('/:id',     protect, adminOnly, ctrl.updateResource);
resourceRouter.delete('/:id',  protect, adminOnly, ctrl.deleteResource);
module.exports.resourceRoutes = resourceRouter;

// ── GALLERY ROUTES ────────────────────────────────────────────────
const galleryRouter = express.Router();
galleryRouter.get('/',        ctrl.getGallery);
galleryRouter.post('/',       protect, adminOnly, ctrl.createGalleryItem);
galleryRouter.put('/:id',     protect, adminOnly, ctrl.updateGalleryItem);
galleryRouter.delete('/:id',  protect, adminOnly, ctrl.deleteGalleryItem);
module.exports.galleryRoutes = galleryRouter;

// ── SETTINGS ROUTES ───────────────────────────────────────────────
const settingRouter = express.Router();
settingRouter.get('/',                    settingCtrl.getPublicSettings);
settingRouter.get('/group/:group',        settingCtrl.getSettingsByGroup);
settingRouter.put('/',                    protect, adminOnly, settingCtrl.updateSetting);
settingRouter.put('/bulk',               protect, adminOnly, settingCtrl.bulkUpdateSettings);
settingRouter.get('/sliders',            settingCtrl.getSliders);
settingRouter.get('/sliders/all',        protect, adminOnly, settingCtrl.getAllSliders);
settingRouter.post('/sliders',           protect, adminOnly, settingCtrl.createSlider);
settingRouter.put('/sliders/:id',        protect, adminOnly, settingCtrl.updateSlider);
settingRouter.delete('/sliders/:id',     protect, adminOnly, settingCtrl.deleteSlider);
settingRouter.get('/popups',             settingCtrl.getActivePopups);
settingRouter.get('/popups/all',         protect, adminOnly, settingCtrl.getAllPopups);
settingRouter.post('/popups',            protect, adminOnly, settingCtrl.createPopup);
settingRouter.put('/popups/:id',         protect, adminOnly, settingCtrl.updatePopup);
settingRouter.delete('/popups/:id',      protect, adminOnly, settingCtrl.deletePopup);
settingRouter.get('/announcement',       settingCtrl.getActiveAnnouncement);
settingRouter.get('/announcements/all',  protect, adminOnly, settingCtrl.getAllAnnouncements);
settingRouter.post('/announcements',     protect, adminOnly, settingCtrl.createAnnouncement);
settingRouter.put('/announcements/:id',  protect, adminOnly, settingCtrl.updateAnnouncement);
settingRouter.delete('/announcements/:id', protect, adminOnly, settingCtrl.deleteAnnouncement);
module.exports.settingRoutes = settingRouter;

// ── SUPPORT ROUTES ────────────────────────────────────────────────
const supportRouter = express.Router();
supportRouter.post('/',         ctrl.createTicket);
supportRouter.get('/',          protect, adminOnly, ctrl.getTickets);
supportRouter.get('/my',        protect, ctrl.getMyTickets);
supportRouter.post('/:id/reply', protect, ctrl.replyTicket);
module.exports.supportRoutes = supportRouter;

// ── CAREER ROUTES ─────────────────────────────────────────────────
const careerRouter = express.Router();
careerRouter.get('/',         ctrl.getCareers);
careerRouter.post('/',        protect, adminOnly, ctrl.createCareer);
careerRouter.put('/:id',      protect, adminOnly, ctrl.updateCareer);
careerRouter.delete('/:id',   protect, adminOnly, ctrl.deleteCareer);
module.exports.careerRoutes = careerRouter;

// ── NOTIFICATION ROUTES (placeholder) ────────────────────────────
const notifRouter = express.Router();
notifRouter.get('/', protect, (req, res) => res.json({ success: true, data: [] }));
module.exports.notificationRoutes = notifRouter;

// ── LANDING PAGE ROUTES (placeholder) ────────────────────────────
const landingRouter = express.Router();
landingRouter.get('/', (req, res) => res.json({ success: true, data: [] }));
module.exports.landingRoutes = landingRouter;

// ── ANALYTICS ROUTES ──────────────────────────────────────────────
const analyticsRouter = express.Router();
analyticsRouter.get('/revenue', protect, adminOnly, payCtrl.getRevenueAnalytics);
analyticsRouter.get('/dashboard', protect, adminOnly, ctrl.getDashboardStats);
module.exports.analyticsRoutes = analyticsRouter;
