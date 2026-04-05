const mongoose = require('mongoose');

// This is the MASTER settings model — every content element on the website
// that admin can change lives here. One document per section.

const settingSchema = new mongoose.Schema({
  key:      { type: String, required: true, unique: true },
  value:    { type: mongoose.Schema.Types.Mixed, required: true },
  label:    String,   // Human readable label for admin panel
  type:     { type: String, enum: ['text', 'textarea', 'richtext', 'image', 'url', 'number', 'boolean', 'json', 'color', 'array'], default: 'text' },
  group:    String,   // e.g. 'brand', 'homepage', 'contact', 'social', 'seo'
  updatedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Setting = mongoose.model('Setting', settingSchema);

// ── Slider / Banner Model ─────────────────────────────────────────
const sliderSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  subtitle:   String,
  image:      String,
  imageId:    String,
  ctaText:    String,
  ctaLink:    String,
  badge:      String,        // e.g. "🔥 Limited Offer"
  isActive:   { type: Boolean, default: true },
  startDate:  Date,          // Schedule - show from this date
  endDate:    Date,          // Schedule - hide after this date
  order:      { type: Number, default: 0 }
}, { timestamps: true });

const Slider = mongoose.model('Slider', sliderSchema);

// ── Popup Model ───────────────────────────────────────────────────
const popupSchema = new mongoose.Schema({
  type:       { type: String, enum: ['welcome', 'exit_intent', 'social_proof', 'offer'], required: true },
  title:      String,
  message:    { type: String, required: true },
  image:      String,
  ctaText:    String,
  ctaLink:    String,
  city:       String,        // For social proof: "Rahul from Mumbai"
  userName:   String,
  courseName: String,
  delay:      { type: Number, default: 5000 }, // ms delay before showing
  isActive:   { type: Boolean, default: true }
}, { timestamps: true });

const Popup = mongoose.model('Popup', popupSchema);

// ── Announcement Bar Model ────────────────────────────────────────
const announcementSchema = new mongoose.Schema({
  message:  { type: String, required: true },
  link:     String,
  linkText: String,
  bgColor:  { type: String, default: '#F0A500' },
  textColor:{ type: String, default: '#000000' },
  isActive: { type: Boolean, default: true },
  startDate:Date,
  endDate:  Date
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);

// ── Nav Link Model ────────────────────────────────────────────────
const navLinkSchema = new mongoose.Schema({
  label:    { type: String, required: true },
  href:     String,
  isDropdown:{ type: Boolean, default: false },
  children: [{
    label:  String,
    href:   String,
    badge:  String
  }],
  isExternal:{ type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  order:    { type: Number, default: 0 }
}, { timestamps: true });

const NavLink = mongoose.model('NavLink', navLinkSchema);

module.exports = { Setting, Slider, Popup, Announcement, NavLink };
