import { Link } from 'react-router-dom';
import { useSettingsStore } from '../../context/store';
import { FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { SiTelegram } from 'react-icons/si';

const footerLinks = {
  'Courses': [
    { label: 'Forex Trading',         href: '/courses?category=forex' },
    { label: 'Stock Market',           href: '/courses?category=stocks' },
    { label: 'Crypto Trading',         href: '/courses?category=crypto' },
    { label: 'Options & Derivatives',  href: '/courses?category=options' },
    { label: 'Technical Analysis',     href: '/courses?category=technical_analysis' },
    { label: 'Free Workshop',          href: '/courses?isFree=true' },
  ],
  'Learn More': [
    { label: 'Live Batches',           href: '/batches' },
    { label: 'Webinars',               href: '/webinars' },
    { label: 'Blog & Analysis',        href: '/blog' },
    { label: 'Financial Calculators',  href: '/calculators' },
    { label: 'Resources & Brokers',    href: '/resources' },
    { label: 'Gallery',                href: '/gallery' },
  ],
  'Company': [
    { label: 'About Us',               href: '/about' },
    { label: 'Testimonials',           href: '/testimonials' },
    { label: "FAQ's",                  href: '/faq' },
    { label: 'Franchise Programme',    href: '/franchise' },
    { label: 'Affiliate Programme',    href: '/affiliate' },
    { label: 'Careers',               href: '/careers' },
  ],
  'Legal': [
    { label: 'Privacy Policy',         href: '/privacy-policy' },
    { label: 'Terms of Service',       href: '/terms-of-service' },
    { label: 'Refund Policy',          href: '/refund-policy' },
    { label: 'Contact Us',             href: '/contact' },
  ],
};

export default function Footer() {
  const { getSetting } = useSettingsStore();

  return (
    <footer className="bg-dark-800 border-t border-dark-500">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center font-display text-dark-900 text-xl font-bold">E</div>
              <div>
                <div className="font-display text-white text-lg tracking-wider leading-none">ELITE</div>
                <div className="text-gold text-xs tracking-widest font-medium">TRADING ACADEMY</div>
              </div>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6">
              {getSetting('about_mission', "Empowering traders with world-class education in Forex, Stocks, Crypto & Commodity markets. Join India's fastest-growing trading academy.")}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mb-6">
              <a href={getSetting('social_instagram')} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-600 hover:bg-pink-500/20 border border-dark-400 hover:border-pink-500/50 rounded-lg flex items-center justify-center text-muted hover:text-pink-400 transition-all">
                <FiInstagram size={18} />
              </a>
              <a href={getSetting('social_youtube')} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-600 hover:bg-red-500/20 border border-dark-400 hover:border-red-500/50 rounded-lg flex items-center justify-center text-muted hover:text-red-400 transition-all">
                <FiYoutube size={18} />
              </a>
              <a href={getSetting('social_telegram')} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-600 hover:bg-blue-500/20 border border-dark-400 hover:border-blue-500/50 rounded-lg flex items-center justify-center text-muted hover:text-blue-400 transition-all">
                <SiTelegram size={16} />
              </a>
              <a href={`https://wa.me/${getSetting('contact_whatsapp', '919876543210').replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-dark-600 hover:bg-green-500/20 border border-dark-400 hover:border-green-500/50 rounded-lg flex items-center justify-center text-muted hover:text-green-400 transition-all">
                <FiSend size={16} />
              </a>
            </div>

            {/* Instagram Badge */}
            <div className="flex items-center gap-2 bg-dark-600 border border-dark-400 rounded-lg px-4 py-3 w-fit">
              <FiInstagram size={16} className="text-pink-400" />
              <span className="text-sm text-white font-semibold">{getSetting('social_instagram_followers', '12K+')} Followers</span>
              <a href={getSetting('social_instagram')} target="_blank" rel="noopener noreferrer" className="text-xs text-gold hover:underline ml-1">Follow →</a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-muted text-sm hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Row */}
        <div className="mt-12 pt-8 border-t border-dark-500 grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href={`tel:${getSetting('contact_phone', '+919876543210')}`}
            className="flex items-center gap-3 text-muted hover:text-white transition-colors">
            <FiPhone size={16} className="text-gold flex-shrink-0" />
            <span className="text-sm">{getSetting('contact_phone', '+91 98765 43210')}</span>
          </a>
          <a href={`mailto:${getSetting('contact_email', 'info@elitetradingacademy.in')}`}
            className="flex items-center gap-3 text-muted hover:text-white transition-colors">
            <FiMail size={16} className="text-gold flex-shrink-0" />
            <span className="text-sm">{getSetting('contact_email', 'info@elitetradingacademy.in')}</span>
          </a>
          <a href={getSetting('google_maps_link', 'https://maps.google.com')} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 text-muted hover:text-white transition-colors group">
            <FiMapPin size={16} className="text-gold flex-shrink-0" />
            <span className="text-sm group-hover:text-gold transition-colors">
              {getSetting('contact_address', 'Ludhiana, Punjab, India')}
              <span className="text-gold text-xs ml-1">→ Maps</span>
            </span>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-dark-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">{getSetting('footer_copyright', '© 2026 ELITE Trading Academy. All rights reserved.')}</p>
          <p className="text-muted text-xs">⚠️ Trading involves risk. Educational content only — not financial advice.</p>
        </div>
      </div>
    </footer>
  );
}
