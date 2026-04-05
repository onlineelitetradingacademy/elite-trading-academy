const { Setting, Slider, Popup, Announcement, NavLink } = require('../models/Setting');

// ── SETTINGS (key-value store for all website content) ────────────

// Get all settings (public - filtered)
exports.getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find({}).select('-updatedBy');
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

// Get settings by group
exports.getSettingsByGroup = async (req, res, next) => {
  try {
    const settings = await Setting.find({ group: req.params.group });
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

// Update setting (admin only - just type new value)
exports.updateSetting = async (req, res, next) => {
  try {
    const { key, value, label, type, group } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value, label, type, group, updatedBy: req.user.id },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, message: 'Setting updated', data: setting });
  } catch (err) { next(err); }
};

// Bulk update settings
exports.bulkUpdateSettings = async (req, res, next) => {
  try {
    const { settings } = req.body; // array of {key, value, group, type, label}
    const ops = settings.map(s => ({
      updateOne: {
        filter: { key: s.key },
        update: { ...s, updatedBy: req.user.id },
        upsert: true
      }
    }));
    await Setting.bulkWrite(ops);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) { next(err); }
};

// ── SLIDERS ───────────────────────────────────────────────────────
exports.getSliders = async (req, res, next) => {
  try {
    const now = new Date();
    const query = { isActive: true, $or: [{ startDate: { $lte: now } }, { startDate: null }], $and: [{ $or: [{ endDate: { $gte: now } }, { endDate: null }] }] };
    const sliders = await Slider.find(query).sort('order');
    res.json({ success: true, data: sliders });
  } catch (err) { next(err); }
};

exports.getAllSliders = async (req, res, next) => {
  try {
    const sliders = await Slider.find().sort('order');
    res.json({ success: true, data: sliders });
  } catch (err) { next(err); }
};

exports.createSlider = async (req, res, next) => {
  try {
    const slider = await Slider.create(req.body);
    res.status(201).json({ success: true, data: slider });
  } catch (err) { next(err); }
};

exports.updateSlider = async (req, res, next) => {
  try {
    const slider = await Slider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: slider });
  } catch (err) { next(err); }
};

exports.deleteSlider = async (req, res, next) => {
  try {
    await Slider.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Slider deleted' });
  } catch (err) { next(err); }
};

// ── POPUPS ────────────────────────────────────────────────────────
exports.getActivePopups = async (req, res, next) => {
  try {
    const popups = await Popup.find({ isActive: true });
    res.json({ success: true, data: popups });
  } catch (err) { next(err); }
};

exports.getAllPopups = async (req, res, next) => {
  try {
    const popups = await Popup.find();
    res.json({ success: true, data: popups });
  } catch (err) { next(err); }
};

exports.createPopup = async (req, res, next) => {
  try {
    const popup = await Popup.create(req.body);
    res.status(201).json({ success: true, data: popup });
  } catch (err) { next(err); }
};

exports.updatePopup = async (req, res, next) => {
  try {
    const popup = await Popup.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: popup });
  } catch (err) { next(err); }
};

exports.deletePopup = async (req, res, next) => {
  try {
    await Popup.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Popup deleted' });
  } catch (err) { next(err); }
};

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────
exports.getActiveAnnouncement = async (req, res, next) => {
  try {
    const now = new Date();
    const ann = await Announcement.findOne({
      isActive: true,
      $or: [{ startDate: { $lte: now } }, { startDate: null }],
      $and: [{ $or: [{ endDate: { $gte: now } }, { endDate: null }] }]
    }).sort({ createdAt: -1 });
    res.json({ success: true, data: ann });
  } catch (err) { next(err); }
};

exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const anns = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, data: anns });
  } catch (err) { next(err); }
};

exports.createAnnouncement = async (req, res, next) => {
  try {
    const ann = await Announcement.create(req.body);
    res.status(201).json({ success: true, data: ann });
  } catch (err) { next(err); }
};

exports.updateAnnouncement = async (req, res, next) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: ann });
  } catch (err) { next(err); }
};

exports.deleteAnnouncement = async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (err) { next(err); }
};
