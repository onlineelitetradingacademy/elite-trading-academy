import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { supportAPI } from '../../utils/api';
import { useSettingsStore } from '../../context/store';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiMessageCircle,
} from 'react-icons/fi';
import { SiTelegram } from 'react-icons/si';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const { getSetting } = useSettingsStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await supportAPI.create({ ...data, category: 'general' });
      toast.success('Message sent! We will respond within 24 hours. 🎉');
      reset();
    } catch {
      toast.error('Failed to send. Please try WhatsApp or email directly.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FiPhone,
      label: 'Phone',
      value: getSetting('contact_phone', '+91 98765 43210'),
      href: `tel:${getSetting('contact_phone', '+919876543210')}`,
    },
    {
      icon: FiMail,
      label: 'Email',
      value: getSetting('contact_email', 'info@elitetradingacademy.in'),
      href: `mailto:${getSetting('contact_email')}`,
    },
    {
      icon: FiClock,
      label: 'Hours',
      value: getSetting('business_hours', 'Mon–Sat: 10 AM – 7 PM IST'),
      href: null,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us — ELITE Trading Academy</title>
      </Helmet>
      <section
        className="relative pt-28 pb-10 overflow-hidden"
        style={{ background: '#0A0A0F' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% -10%, rgba(240,165,0,0.1), transparent)',
          }}
        />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-flex items-center gap-2 text-yellow-500 text-xs font-semibold uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5">
            Get in Touch
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-white mb-4 tracking-wide">
            CONTACT{' '}
            <span
              style={{
                background: 'linear-gradient(135deg,#F0A500,#FFD166)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              US
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Have questions? Our team is here to help you start your trading
            journey.
          </p>
        </div>
      </section>

      <section className="py-14" style={{ background: '#0A0A0F' }}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon size={18} className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-white font-medium hover:text-yellow-400 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-white font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contact */}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-3">
                <h3 className="text-white font-semibold mb-4">Quick Contact</h3>
                <a
                  href={`https://wa.me/${getSetting('contact_whatsapp', '919876543210').replace(/\D/g, '')}?text=Hi! I have a question about ELITE Trading Academy.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl hover:bg-green-500/20 transition-all w-full"
                >
                  <FiMessageCircle size={18} />{' '}
                  <span className="font-medium">Chat on WhatsApp</span>
                </a>
                <a
                  href={getSetting('social_telegram')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-xl hover:bg-blue-500/20 transition-all w-full"
                >
                  <SiTelegram size={16} />{' '}
                  <span className="font-medium">Join Telegram</span>
                </a>
              </div>

              {/* Address */}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiMapPin size={18} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Address</p>
                    <a
                      href={getSetting(
                        'google_maps_link',
                        'https://maps.google.com',
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium hover:text-yellow-400 transition-colors text-sm leading-relaxed"
                    >
                      {getSetting('contact_address', 'Ludhiana, Punjab, India')}
                      <span className="block text-yellow-400 text-xs mt-1">
                        📍 Click for directions →
                      </span>
                    </a>
                  </div>
                </div>
                <div className="mt-4 rounded-xl overflow-hidden border border-gray-700 h-40">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109694.87516038716!2d75.7332817!3d30.9009738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a837462345a5b%3A0x5b79f4c576e14d1e!2sLudhiana%2C%20Punjab!5e0!3m2!1sen!2sin!4v1680000000000"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Location"
                  />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                <h2 className="text-white font-bold text-2xl mb-6">
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                        {...register('name', { required: 'Name is required' })}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                        {...register('email', {
                          required: 'Email is required',
                        })}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500"
                      {...register('phone')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <select
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all"
                      {...register('subject', { required: true })}
                    >
                      <option value="">Select a topic</option>
                      <option>Course Enquiry</option>
                      <option>Batch Registration</option>
                      <option>Mentorship Programme</option>
                      <option>Franchise Enquiry</option>
                      <option>Technical Support</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-3 outline-none transition-all placeholder-gray-500 resize-none"
                      {...register('message', {
                        required: 'Message is required',
                      })}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                  >
                    {loading ? (
                      'Sending...'
                    ) : (
                      <>
                        <FiSend size={16} /> Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
