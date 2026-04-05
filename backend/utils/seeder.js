const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Course = require('../models/Course');
const { Blog, Batch, Webinar, Testimonial, Resource, FranchiseLead } = require('../models/index');
const { Setting, Slider, Popup, Announcement } = require('../models/Setting');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}), Course.deleteMany({}), Blog.deleteMany({}),
      Batch.deleteMany({}), Webinar.deleteMany({}), Testimonial.deleteMany({}),
      Resource.deleteMany({}), Setting.deleteMany({}), Slider.deleteMany({}),
      Popup.deleteMany({}), Announcement.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // ── ADMIN USER ────────────────────────────────────────────────
    const admin = await User.create({
      name: 'Admin User', email: process.env.ADMIN_EMAIL || 'admin@elitetradingacademy.in',
      password: process.env.ADMIN_PASSWORD || 'Admin@Elite2024',
      role: 'admin', isEmailVerified: true, isPhoneVerified: true, phone: '9876543210',
      city: 'Ludhiana', authProvider: 'local'
    });

    // ── FOUNDER/MENTOR ────────────────────────────────────────────
    const founder = await User.create({
      name: 'Your Name', email: 'founder@elitetradingacademy.in',
      password: 'Founder@Elite2024', role: 'mentor',
      isEmailVerified: true, phone: '9876543211',
      bio: 'Founder of ELITE Trading Academy with 8+ years of experience in Forex, Stocks, Crypto and Commodity trading. Trained 5000+ students across India and abroad.',
      expertise: ['Forex', 'Technical Analysis', 'Risk Management', 'Options'],
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-mentor.jpg',
      socialLinks: { instagram: 'https://instagram.com/elitetradingacademy', youtube: 'https://youtube.com/@elitetradingacademy', telegram: 'https://t.me/elitetradingacademy' },
      city: 'Ludhiana'
    });

    console.log('✅ Users created');

    // ── COURSES ───────────────────────────────────────────────────
    const courses = await Course.insertMany([
      {
        title: 'Forex Trading Masterclass — From Zero to Pro',
        subtitle: 'Complete guide to trading Forex markets profitably',
        description: 'Master the Forex market from scratch. Learn technical analysis, fundamental analysis, risk management, and proven strategies used by professional traders worldwide.',
        thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        category: 'forex', courseType: 'recorded', level: 'beginner',
        language: 'bilingual', price: 4999, originalPrice: 9999,
        instructor: founder._id, isPublished: true, isFeatured: true, isPopular: true,
        enrolledCount: 1240,
        whatYouLearn: ['Understanding currency pairs & market structure','Reading candlestick charts','Support & Resistance levels','Entry & exit strategies','Risk management & position sizing','Building a trading plan'],
        includes: ['40+ hours video content','15 PDF study notes','5 live practice sessions','Lifetime access','Certificate of completion'],
        tags: ['forex', 'currency', 'trading', 'beginner'],
        sections: [{
          title: 'Module 1: Introduction to Forex', order: 0,
          lessons: [
            { title: 'What is Forex Trading?', type: 'video', videoDuration: 1200, isPreview: true, isLocked: false, order: 0 },
            { title: 'Currency Pairs Explained', type: 'video', videoDuration: 1800, order: 1 },
            { title: 'How Forex Market Works', type: 'notes', order: 2 },
            { title: 'Module 1 Quiz', type: 'quiz', order: 3, quiz: [{ question: 'What does EUR/USD mean?', options: ['Euro vs US Dollar','Europe vs United States','None'], correct: 0, explanation: 'EUR/USD is the Euro vs US Dollar currency pair' }] }
          ]
        }, {
          title: 'Module 2: Technical Analysis', order: 1,
          lessons: [
            { title: 'Candlestick Patterns', type: 'video', videoDuration: 2400, order: 0 },
            { title: 'Support & Resistance', type: 'video', videoDuration: 2100, order: 1 },
            { title: 'Trend Lines & Channels', type: 'video', videoDuration: 1900, order: 2 }
          ]
        }],
        metaTitle: 'Best Forex Trading Course in India | ELITE Trading Academy',
        metaDescription: 'Learn Forex trading from scratch with our comprehensive course. Join 1200+ students. Bilingual (Hindi+English).'
      },
      {
        title: 'Stock Market Complete Course — NSE & BSE',
        subtitle: 'From investing basics to advanced trading strategies',
        description: 'Complete stock market course covering equity trading, swing trading, options, and fundamental analysis of Indian markets.',
        thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800',
        category: 'stocks', courseType: 'recorded', level: 'beginner',
        language: 'bilingual', price: 3999, originalPrice: 7999,
        instructor: founder._id, isPublished: true, isFeatured: true,
        enrolledCount: 892, tags: ['stocks', 'nse', 'bse', 'equity'],
        whatYouLearn: ['Stock market fundamentals','Equity research & analysis','Technical chart reading','Options basics','Portfolio management'],
        includes: ['35+ hours video','12 PDF notes','Certificate'],
        sections: [{ title: 'Module 1: Stock Market Basics', order: 0, lessons: [{ title: 'Introduction to Stock Market', type: 'video', isPreview: true, isLocked: false, order: 0 }] }]
      },
      {
        title: 'Crypto Trading — Bitcoin, Ethereum & Altcoins',
        subtitle: 'Navigate the crypto market with confidence',
        description: 'Learn crypto trading, DeFi, on-chain analysis, and how to spot the next 10x opportunity safely.',
        thumbnail: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
        category: 'crypto', courseType: 'recorded', level: 'intermediate',
        language: 'english', price: 5999, originalPrice: 11999,
        instructor: founder._id, isPublished: true, enrolledCount: 456,
        tags: ['crypto', 'bitcoin', 'ethereum', 'defi'],
        whatYouLearn: ['Crypto market structure','Bitcoin & Ethereum analysis','Altcoin research','DeFi basics','Portfolio diversification'],
        includes: ['30+ hours video','10 PDF notes']
      },
      {
        title: 'Options & Derivatives Masterclass',
        subtitle: 'Master options trading strategies for consistent profits',
        description: 'Advanced options strategies including covered calls, spreads, straddles, and iron condors for the Indian derivatives market.',
        thumbnail: 'https://images.unsplash.com/photo-1642790551116-18e150f248e9?w=800',
        category: 'options', courseType: 'recorded', level: 'advanced',
        language: 'bilingual', price: 6999, originalPrice: 13999,
        instructor: founder._id, isPublished: true, isPopular: true, enrolledCount: 334,
        tags: ['options', 'derivatives', 'nifty', 'banknifty'],
        whatYouLearn: ['Options Greeks','Bull/Bear spreads','Iron condor','Theta decay strategies'],
        includes: ['45+ hours video','20 PDF notes','Certificate']
      },
      {
        title: 'Technical Analysis — Complete Blueprint',
        subtitle: 'Master charts, patterns and indicators',
        description: 'Deep dive into technical analysis covering all major chart patterns, indicators, and trading systems.',
        thumbnail: 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800',
        category: 'technical_analysis', courseType: 'recorded', level: 'beginner',
        language: 'bilingual', price: 2999, originalPrice: 5999,
        instructor: founder._id, isPublished: true, enrolledCount: 678,
        tags: ['technical analysis', 'charts', 'patterns'],
        whatYouLearn: ['Chart patterns','RSI, MACD, Bollinger Bands','Volume analysis','Dow theory'],
        includes: ['25+ hours video','8 PDF notes']
      },
      {
        title: 'Free Beginner Trading Workshop',
        subtitle: 'Your first step into the world of trading — completely free',
        description: 'A free introductory workshop covering the basics of financial markets, suitable for absolute beginners.',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        category: 'combo', courseType: 'free', level: 'beginner', isFree: true,
        language: 'bilingual', price: 0,
        instructor: founder._id, isPublished: true, isFeatured: true, enrolledCount: 3200,
        tags: ['free', 'beginner', 'workshop'],
        whatYouLearn: ['What are financial markets','Difference between investing & trading','How to open demat account','Basic chart reading'],
        sections: [{ title: 'Getting Started', order: 0, lessons: [{ title: 'Welcome to Trading World', type: 'video', isPreview: true, isLocked: false, order: 0 }] }]
      }
    ]);
    console.log('✅ Courses created');

    // ── BATCHES ───────────────────────────────────────────────────
    await Batch.insertMany([
      { title: 'Forex Pro Batch — May 2026', course: courses[0]._id, type: 'online', mode: 'live', startDate: new Date('2026-05-15'), endDate: new Date('2026-07-15'), schedule: 'Mon, Wed, Fri | 7:00 PM – 9:00 PM IST', totalSeats: 30, enrolledSeats: 18, price: 7999, originalPrice: 14999, instructor: founder._id, whatsappGroup: 'https://chat.whatsapp.com/placeholder', telegramGroup: 'https://t.me/elitetradingacademy', isActive: true, isFeatured: true },
      { title: 'Stock Market Batch — June 2026', course: courses[1]._id, type: 'online', mode: 'live', startDate: new Date('2026-06-01'), schedule: 'Tue, Thu, Sat | 6:00 PM – 8:00 PM IST', totalSeats: 25, enrolledSeats: 10, price: 5999, originalPrice: 9999, instructor: founder._id, isActive: true },
      { title: 'Offline Ludhiana Batch — May 2026', type: 'offline', mode: 'live', startDate: new Date('2026-05-20'), schedule: 'Sat & Sun | 10:00 AM – 2:00 PM', totalSeats: 20, enrolledSeats: 8, price: 9999, originalPrice: 18999, instructor: founder._id, venue: 'ELITE Trading Academy, Ludhiana, Punjab', isActive: true, isFeatured: true }
    ]);
    console.log('✅ Batches created');

    // ── WEBINARS ──────────────────────────────────────────────────
    await Webinar.insertMany([
      { title: 'Free Forex Webinar — Trade Like a Pro', description: 'Join our free live webinar and learn the basics of Forex trading in just 2 hours.', host: founder._id, scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), duration: 120, platform: 'zoom', meetingLink: 'https://zoom.us/j/placeholder', isFree: true, maxAttendees: 500, status: 'upcoming', isActive: true },
      { title: 'Options Trading Masterclass — Live Session', description: 'Advanced options strategies for profitable trading.', host: founder._id, scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), duration: 180, platform: 'zoom', meetingLink: 'https://zoom.us/j/placeholder2', isFree: false, price: 999, maxAttendees: 100, status: 'upcoming', isActive: true }
    ]);
    console.log('✅ Webinars created');

    // ── BLOGS ─────────────────────────────────────────────────────
    await Blog.insertMany([
      { title: 'Top 5 Forex Trading Strategies for Beginners in 2026', excerpt: 'Starting your Forex journey? Here are the 5 most effective strategies used by professional traders.', content: '<p>Forex trading can be overwhelming for beginners. But with the right strategy, you can start making consistent profits...</p>', category: 'forex', tags: ['forex', 'beginner', 'strategy'], author: founder._id, isPublished: true, isFeatured: true, publishedAt: new Date(), readTime: 7, views: 1240, metaTitle: 'Top 5 Forex Trading Strategies for Beginners 2026', metaDescription: 'Learn the top 5 forex trading strategies for beginners. Start your trading journey with proven methods.' },
      { title: 'How to Read Candlestick Charts — Complete Guide', excerpt: 'Candlestick charts are the most popular charting method among traders. Learn to read them like a pro.', content: '<p>Candlestick charts provide a wealth of information in a visual format...</p>', category: 'technical_analysis', tags: ['candlestick', 'charts', 'technical analysis'], author: founder._id, isPublished: true, publishedAt: new Date(), readTime: 10, views: 890 },
      { title: 'Market Analysis — April 2026 Weekly Outlook', excerpt: 'Our weekly market analysis covering Forex, Stocks and Crypto for the week ahead.', content: '<p>This week we are watching key levels on EUR/USD, Nifty 50, and Bitcoin...</p>', category: 'market_analysis', tags: ['market analysis', 'weekly', 'forex', 'stocks'], author: founder._id, isPublished: true, isFeatured: true, publishedAt: new Date(), readTime: 5, views: 560 }
    ]);
    console.log('✅ Blogs created');

    // ── TESTIMONIALS ──────────────────────────────────────────────
    await Testimonial.insertMany([
      { name: 'Rahul Sharma', city: 'Delhi', rating: 5, text: 'Joining ELITE Trading Academy was the best decision of my life. I went from losing money every month to making consistent profits. The Forex course is incredibly detailed and easy to understand.', course: 'Forex Trading Masterclass', type: 'text', isFeatured: true, isActive: true, order: 1 },
      { name: 'Priya Patel', city: 'Mumbai', rating: 5, text: 'I was completely new to trading. After completing the Stock Market course, I can now confidently analyze stocks and make profitable trades. The support from mentors is exceptional!', course: 'Stock Market Complete Course', type: 'text', isFeatured: true, isActive: true, order: 2 },
      { name: 'Amit Kumar', city: 'Bangalore', rating: 5, text: 'The Options & Derivatives masterclass is world-class. I have been trading options for 6 months now and my win rate has gone from 30% to 70%. Thank you ELITE Trading Academy!', course: 'Options & Derivatives Masterclass', type: 'text', isFeatured: true, isActive: true, order: 3 },
      { name: 'Sunita Verma', city: 'Pune', rating: 5, text: 'The live batch format is amazing. Having a fixed schedule and live interaction with the mentor makes learning so much more effective. The WhatsApp group support is also fantastic.', course: 'Forex Pro Batch', type: 'text', isActive: true, order: 4 },
      { name: 'Vikram Singh', city: 'UAE', rating: 5, text: 'Being an Indian in UAE, I was looking for a good trading academy. ELITE Trading Academy is perfect — bilingual courses, IST timing for live classes, and Razorpay for easy payments.', course: 'Technical Analysis Course', type: 'text', isActive: true, order: 5 },
      { name: 'Deepa Nair', city: 'Chennai', rating: 4, text: 'The free beginner workshop gave me so much clarity about financial markets. I then enrolled in the full Forex course and have never looked back. Highly recommend for beginners!', course: 'Free Beginner Workshop', type: 'text', isActive: true, order: 6 },
      { name: 'Arjun Mehta', city: 'Ahmedabad', rating: 5, text: 'Technical analysis course is superb. The way complex concepts like RSI, MACD are explained in simple language is remarkable. I can now read charts like a professional.', course: 'Technical Analysis Complete Blueprint', type: 'text', isFeatured: true, isActive: true, order: 7 },
      { name: 'Kavya Reddy', city: 'Hyderabad', rating: 5, text: 'The 1-on-1 mentorship programme changed my trading completely. Having personalised guidance on my actual trades made a huge difference. My portfolio is up 45% in 3 months!', course: '1-on-1 Mentorship', type: 'text', isFeatured: true, isActive: true, order: 8 }
    ]);
    console.log('✅ Testimonials created');

    // ── RESOURCES ─────────────────────────────────────────────────
    await Resource.insertMany([
      { type: 'broker', title: 'Zerodha', description: 'India\'s largest stockbroker. Best platform for equity & derivatives trading with zero delivery brokerage.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', affiliateLink: 'https://zerodha.com/?c=YOUR_REFERRAL', guideVideoUrl: 'https://youtube.com/watch?v=placeholder', rating: 4.8, tags: ['stocks', 'options', 'equity'], badge: 'Most Popular', isActive: true, isFeatured: true, order: 1 },
      { type: 'broker', title: 'Upstox', description: 'Fast-growing discount broker with a powerful trading platform and advanced charting tools.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', affiliateLink: 'https://upstox.com/?f=YOUR_REFERRAL', guideVideoUrl: 'https://youtube.com/watch?v=placeholder2', rating: 4.6, tags: ['stocks', 'forex', 'commodity'], badge: 'Recommended', isActive: true, isFeatured: true, order: 2 },
      { type: 'broker', title: 'Angel One', description: 'Full-service broker with research reports, robo-advisory and a comprehensive trading app.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', affiliateLink: 'https://angelone.in/?r=YOUR_REFERRAL', guideVideoUrl: 'https://youtube.com/watch?v=placeholder3', rating: 4.4, tags: ['stocks', 'mutual funds', 'ipo'], isActive: true, order: 3 },
      { type: 'broker', title: 'Fyers', description: 'Built for active traders. Exceptional charting, API access and lowest latency order execution.', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400', affiliateLink: 'https://fyers.in/?r=YOUR_REFERRAL', rating: 4.5, tags: ['algo trading', 'api', 'options'], isActive: true, order: 4 },
      { type: 'book', title: 'Trading in the Zone', description: 'Mark Douglas breaks down the psychological barriers that prevent traders from making money. A must-read for every trader.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', affiliateLink: 'https://amazon.in/dp/placeholder', author: 'Mark Douglas', rating: 4.9, tags: ['psychology', 'mindset'], badge: 'Must Read', isActive: true, isFeatured: true, order: 1 },
      { type: 'book', title: 'Technical Analysis of Financial Markets', description: 'The definitive guide to technical analysis by John Murphy. Covers every aspect of chart analysis in detail.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', affiliateLink: 'https://amazon.in/dp/placeholder2', author: 'John Murphy', rating: 4.8, tags: ['technical analysis', 'charts'], isActive: true, order: 2 },
      { type: 'book', title: 'The Intelligent Investor', description: 'Benjamin Graham\'s timeless classic on value investing. Warren Buffett calls it the best book on investing ever written.', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', affiliateLink: 'https://amazon.in/dp/placeholder3', author: 'Benjamin Graham', rating: 4.9, tags: ['investing', 'value investing', 'stocks'], isActive: true, order: 3 },
      { type: 'merchandise', title: 'ELITE Trader Hoodie', description: 'Premium quality hoodie for traders. Coming soon!', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400', isActive: false, order: 1 }
    ]);
    console.log('✅ Resources created');

    // ── SITE SETTINGS ─────────────────────────────────────────────
    const defaultSettings = [
      // Brand
      { key: 'site_name',     value: 'ELITE Trading Academy', label: 'Site Name', type: 'text', group: 'brand' },
      { key: 'site_tagline',  value: 'Where Traders Become Elite', label: 'Tagline', type: 'text', group: 'brand' },
      { key: 'site_logo',     value: '', label: 'Logo URL', type: 'image', group: 'brand' },
      { key: 'site_favicon',  value: '', label: 'Favicon URL', type: 'image', group: 'brand' },
      { key: 'primary_color', value: '#F0A500', label: 'Primary Color (Gold)', type: 'color', group: 'brand' },
      // Contact
      { key: 'contact_phone',    value: '+91 98765 43210', label: 'Phone', type: 'text', group: 'contact' },
      { key: 'contact_whatsapp', value: '+91 98765 43210', label: 'WhatsApp Number', type: 'text', group: 'contact' },
      { key: 'contact_email',    value: 'info@elitetradingacademy.in', label: 'Email', type: 'text', group: 'contact' },
      { key: 'contact_address',  value: 'ELITE Trading Academy, Ludhiana, Punjab 141001, India', label: 'Address', type: 'textarea', group: 'contact' },
      { key: 'google_maps_link', value: 'https://maps.google.com/?q=Ludhiana+Punjab', label: 'Google Maps Link', type: 'url', group: 'contact' },
      { key: 'business_hours',   value: 'Mon–Sat: 10:00 AM – 7:00 PM IST', label: 'Business Hours', type: 'text', group: 'contact' },
      // Social Links
      { key: 'social_instagram', value: 'https://instagram.com/elitetradingacademy', label: 'Instagram URL', type: 'url', group: 'social' },
      { key: 'social_youtube',   value: 'https://youtube.com/@elitetradingacademy', label: 'YouTube URL', type: 'url', group: 'social' },
      { key: 'social_telegram',  value: 'https://t.me/elitetradingacademy', label: 'Telegram Link', type: 'url', group: 'social' },
      { key: 'social_whatsapp_community', value: 'https://chat.whatsapp.com/placeholder', label: 'WhatsApp Community', type: 'url', group: 'social' },
      { key: 'social_instagram_followers', value: '12K+', label: 'Instagram Followers', type: 'text', group: 'social' },
      // Homepage Stats (all admin editable)
      { key: 'stat_students',    value: '5,000+', label: 'Students Trained', type: 'text', group: 'stats' },
      { key: 'stat_experience',  value: '8+', label: 'Years Experience', type: 'text', group: 'stats' },
      { key: 'stat_courses',     value: '20+', label: 'Courses Available', type: 'text', group: 'stats' },
      { key: 'stat_satisfaction',value: '95%', label: 'Student Satisfaction', type: 'text', group: 'stats' },
      { key: 'stat_webinars',    value: '500+', label: 'Webinars Conducted', type: 'text', group: 'stats' },
      { key: 'stat_instagram',   value: '12K+', label: 'Instagram Followers', type: 'text', group: 'stats' },
      // SEO
      { key: 'meta_title',       value: 'ELITE Trading Academy — Where Traders Become Elite', label: 'Default Meta Title', type: 'text', group: 'seo' },
      { key: 'meta_description', value: 'Learn Forex, Stocks, Crypto & Commodity trading from India\'s premier trading academy. Join 5000+ students trained by ELITE Trading Academy.', label: 'Default Meta Description', type: 'textarea', group: 'seo' },
      { key: 'meta_keywords',    value: 'forex trading course, stock market course india, crypto trading, commodity trading, trading academy india, elite trading academy', label: 'Meta Keywords', type: 'text', group: 'seo' },
      { key: 'google_analytics_id', value: 'G-XXXXXXXXXX', label: 'Google Analytics ID', type: 'text', group: 'seo' },
      { key: 'meta_pixel_id',    value: '1234567890', label: 'Meta Pixel ID', type: 'text', group: 'seo' },
      // About section
      { key: 'founder_name',     value: 'Your Name', label: 'Founder Name', type: 'text', group: 'about' },
      { key: 'founder_title',    value: 'Founder & Head Mentor', label: 'Founder Title', type: 'text', group: 'about' },
      { key: 'founder_photo',    value: '', label: 'Founder Photo URL', type: 'image', group: 'about' },
      { key: 'founder_bio',      value: 'With 8+ years of experience in financial markets, I founded ELITE Trading Academy with one mission: to make professional trading education accessible to every Indian. From Ludhiana to the world, we are training the next generation of elite traders.', label: 'Founder Bio', type: 'textarea', group: 'about' },
      { key: 'about_mission',    value: 'To empower every Indian with the knowledge and skills to achieve financial freedom through smart trading.', label: 'Mission Statement', type: 'textarea', group: 'about' },
      { key: 'about_vision',     value: 'To become India\'s most trusted and comprehensive trading education platform.', label: 'Vision Statement', type: 'textarea', group: 'about' },
      // Tawk.to live chat
      { key: 'tawkto_id',       value: '', label: 'Tawk.to Property ID', type: 'text', group: 'integrations' },
      // Zoom default
      { key: 'default_zoom_link', value: 'https://zoom.us/j/placeholder', label: 'Default Zoom Link', type: 'url', group: 'integrations' },
      // Affiliate settings
      { key: 'affiliate_global_commission', value: '20', label: 'Global Affiliate Commission (%)', type: 'number', group: 'affiliate' },
      { key: 'affiliate_min_purchase',      value: '1000', label: 'Min Purchase for Affiliate (₹)', type: 'number', group: 'affiliate' },
      { key: 'affiliate_min_payout',        value: '500', label: 'Minimum Payout Amount (₹)', type: 'number', group: 'affiliate' },
      { key: 'affiliate_cookie_days',       value: '30', label: 'Cookie Duration (days)', type: 'number', group: 'affiliate' },
      // Footer
      { key: 'footer_copyright', value: '© 2026 ELITE Trading Academy. All rights reserved.', label: 'Footer Copyright Text', type: 'text', group: 'footer' },
      { key: 'footer_tagline',   value: 'Where Traders Become Elite', label: 'Footer Tagline', type: 'text', group: 'footer' },
      // Policies
      { key: 'policy_refund',    value: '<p>We offer a 7-day refund policy for all recorded courses. Live batches are non-refundable once started. Contact us at info@elitetradingacademy.in for refund requests.</p>', label: 'Refund Policy', type: 'richtext', group: 'policies' },
      { key: 'policy_privacy',   value: '<p>Your privacy is important to us. We collect only necessary information and never sell your data to third parties...</p>', label: 'Privacy Policy', type: 'richtext', group: 'policies' },
      { key: 'policy_terms',     value: '<p>By using our platform, you agree to our terms of service. All content is for educational purposes only and not financial advice...</p>', label: 'Terms of Service', type: 'richtext', group: 'policies' }
    ];

    await Setting.insertMany(defaultSettings.map(s => ({ ...s, updatedBy: admin._id })));
    console.log('✅ Settings created');

    // ── SLIDERS ───────────────────────────────────────────────────
    await Slider.insertMany([
      { title: 'Learn to Trade Like a Pro', subtitle: 'Join 5,000+ students mastering Forex, Stocks & Crypto', ctaText: 'Explore Courses', ctaLink: '/courses', badge: '🔥 New Batch Starting May 15', isActive: true, order: 1 },
      { title: '🎉 Special Launch Offer — 50% OFF', subtitle: 'All courses at half price this month only. Limited seats!', ctaText: 'Grab the Deal', ctaLink: '/courses', badge: '⏰ Offer Ends Soon', isActive: true, order: 2 },
      { title: 'Free Forex Webinar — This Sunday', subtitle: 'Register now for our free live session. Limited spots available.', ctaText: 'Register Free', ctaLink: '/webinars', badge: '🆓 Completely Free', isActive: true, order: 3 },
      { title: 'Personal 1-on-1 Mentorship Now Available', subtitle: 'Get personalised guidance from our expert mentor. Limited slots.', ctaText: 'Apply Now', ctaLink: '/courses?type=mentorship', badge: '💎 Premium Programme', isActive: true, order: 4 }
    ]);
    console.log('✅ Sliders created');

    // ── ANNOUNCEMENT BAR ──────────────────────────────────────────
    await Announcement.create({ message: '🔥 New Forex Batch Starting May 15 | Limited 30 Seats | ', link: '/batches', linkText: 'Book Your Seat Now →', bgColor: '#F0A500', textColor: '#000000', isActive: true });
    console.log('✅ Announcement created');

    // ── SOCIAL PROOF POPUPS ───────────────────────────────────────
    await Popup.insertMany([
      { type: 'social_proof', message: 'just enrolled in Forex Trading Masterclass', userName: 'Rahul', city: 'Delhi', courseName: 'Forex Trading Masterclass', isActive: true },
      { type: 'social_proof', message: 'just purchased Stock Market Complete Course', userName: 'Priya', city: 'Mumbai', courseName: 'Stock Market Course', isActive: true },
      { type: 'social_proof', message: 'just joined the Forex Pro Live Batch', userName: 'Amit', city: 'Bangalore', isActive: true },
      { type: 'social_proof', message: 'just enrolled in Options & Derivatives Masterclass', userName: 'Sunita', city: 'Pune', isActive: true },
      { type: 'welcome', title: 'Welcome to ELITE Trading Academy!', message: 'Get 10% off your first course. Use code: WELCOME10', ctaText: 'Claim Discount', ctaLink: '/courses', delay: 5000, isActive: true },
      { type: 'exit_intent', title: 'Wait! Don\'t Leave Yet', message: 'Get a FREE market analysis guide before you go!', ctaText: 'Get Free Guide', ctaLink: '/free-guide', isActive: true }
    ]);
    console.log('✅ Popups created');

    console.log('\n🚀 ═══════════════════════════════════════════');
    console.log('   ELITE Trading Academy — Seeding Complete!');
    console.log('═══════════════════════════════════════════');
    console.log(`   Admin: ${process.env.ADMIN_EMAIL || 'admin@elitetradingacademy.in'}`);
    console.log(`   Pass:  ${process.env.ADMIN_PASSWORD || 'Admin@Elite2024'}`);
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seed();
