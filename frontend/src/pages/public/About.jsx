import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useSettingsStore } from '../../context/store';
import {
  FiInstagram,
  FiYoutube,
  FiAward,
  FiUsers,
  FiTrendingUp,
  FiStar,
  FiArrowRight,
} from 'react-icons/fi';
import { SiTelegram } from 'react-icons/si';

const timeline = [
  {
    year: '2016',
    title: 'Started Trading',
    desc: 'Began journey in financial markets with Forex trading.',
  },
  {
    year: '2018',
    title: 'Consistent Profitability',
    desc: 'Achieved consistent results across Forex, Stocks & Commodity markets.',
  },
  {
    year: '2020',
    title: 'First Students',
    desc: 'Started mentoring friends and family, seeing remarkable results.',
  },
  {
    year: '2022',
    title: 'Academy Founded',
    desc: 'Founded ELITE Trading Academy to empower traders across India.',
  },
  {
    year: '2024',
    title: '5000+ Students',
    desc: 'Trained over 5,000 students across India and abroad.',
  },
  {
    year: '2026',
    title: 'Going Global',
    desc: 'Expanding with franchise model and online presence worldwide.',
  },
];

const mediaFeatures = [
  'Forbes',
  'Economic Times',
  'Business Standard',
  'Zee Business',
  'Money Control',
  'NDTV Profit',
];

export default function About() {
  const { getSetting, settings } = useSettingsStore();

  const stats = [
    {
      label: 'Students Trained',
      value: settings?.stat_students || '5,000+',
      icon: FiUsers,
      color: 'text-yellow-400',
    },
    {
      label: 'Years Experience',
      value: settings?.stat_experience || '8+',
      icon: FiAward,
      color: 'text-purple-400',
    },
    {
      label: 'Success Rate',
      value: settings?.stat_satisfaction || '95%',
      icon: FiStar,
      color: 'text-green-400',
    },
    {
      label: 'Webinars Done',
      value: settings?.stat_webinars || '500+',
      icon: FiTrendingUp,
      color: 'text-blue-400',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us — ELITE Trading Academy</title>
      </Helmet>

      {/* Hero */}
      <section
        className="relative pt-28 pb-20 overflow-hidden"
        style={{ background: '#0A0A0F' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(240,165,0,0.12), transparent)',
          }}
        />
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5">
                Our Story
              </span>
              <h1 className="font-display text-5xl md:text-6xl text-white mb-6 tracking-wide leading-tight">
                MEET THE{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  FOUNDER
                </span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                {getSetting(
                  'founder_bio',
                  'With 8+ years of experience in financial markets, I founded ELITE Trading Academy with one mission: to make professional trading education accessible to every Indian. From Ludhiana to the world, we are training the next generation of elite traders.',
                )}
              </p>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <a
                  href={getSetting('social_instagram')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <FiInstagram size={16} />{' '}
                  {getSetting('social_instagram_followers', '12K+')} Followers
                </a>
                <a
                  href={getSetting('social_youtube')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <FiYoutube size={16} /> YouTube
                </a>
                <a
                  href={getSetting('social_telegram')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <SiTelegram size={14} /> Telegram
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 flex justify-center"
            >
              <div className="relative">
                <div
                  className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-yellow-500/30"
                  style={{ boxShadow: '0 0 60px rgba(240,165,0,0.2)' }}
                >
                  {getSetting('founder_photo') ? (
                    <img
                      src={getSetting('founder_photo')}
                      alt={getSetting('founder_name')}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-8xl font-display text-yellow-500">
                        {getSetting('founder_name', 'Y')[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-gray-900 px-4 py-2 rounded-xl font-bold text-sm">
                  {getSetting('founder_title', 'Founder & Head Mentor')}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-gray-900 border-y border-gray-700">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <s.icon size={28} className={`${s.color} mx-auto mb-2`} />
                <div className={`font-display text-4xl ${s.color} mb-1`}>
                  {s.value}
                </div>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {[
              {
                label: 'Our Mission',
                icon: '🎯',
                text: getSetting(
                  'about_mission',
                  'To empower every Indian with the knowledge and skills to achieve financial freedom through smart trading.',
                ),
              },
              {
                label: 'Our Vision',
                icon: '🚀',
                text: getSetting(
                  'about_vision',
                  "To become India's most trusted and comprehensive trading education platform.",
                ),
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl p-8 transition-all"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2">
                  {item.label}
                </h3>
                <p className="text-white text-lg font-semibold leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Timeline */}
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl text-white mb-3">
              THE{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                JOURNEY
              </span>
            </h2>
            <p className="text-gray-400">
              From a passionate trader to building India's premier trading
              academy
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gray-700 hidden md:block" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                  >
                    <div className="bg-gray-900 border border-gray-700 hover:border-yellow-500/30 rounded-2xl p-5 inline-block text-left transition-all">
                      <h3 className="text-white font-bold text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center font-display text-gray-900 font-bold text-sm flex-shrink-0 z-10">
                    {item.year.slice(2)}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="py-14 bg-gray-900 border-y border-gray-700">
        <div className="container-custom text-center">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-6 font-semibold">
            As Featured In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {mediaFeatures.map((m, i) => (
              <motion.div
                key={m}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-gray-600 font-display text-xl hover:text-gray-400 transition-colors tracking-wider"
              >
                {m}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <h2 className="font-display text-4xl text-white mb-4">
            START YOUR{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ELITE JOURNEY
            </span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of traders who have transformed their financial
            future with us.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/courses"
              className="bg-yellow-500 text-gray-900 font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors"
            >
              Explore Courses <FiArrowRight />
            </Link>
            <Link
              to="/contact"
              className="border border-yellow-500/40 text-yellow-400 font-semibold px-8 py-3.5 rounded-xl hover:bg-yellow-500/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
