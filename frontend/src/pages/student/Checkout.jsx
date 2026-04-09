import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  useCartStore,
  useAuthStore,
  useSettingsStore,
} from '../../context/store';
import { paymentAPI, couponAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiTag,
  FiCheckCircle,
  FiShield,
  FiLock,
} from 'react-icons/fi';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { item, coupon, discount, applyCoupon, clearCart, getFinalPrice } =
    useCartStore();
  const { user } = useAuthStore();
  const { getSetting } = useSettingsStore();
  const [couponInput, setCouponInput] = useState('');
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // If no item in cart, redirect
  useEffect(() => {
    if (!item) navigate('/courses');
  }, [item]);

  const finalPrice = getFinalPrice();

  const checkCoupon = async () => {
    if (!couponInput.trim()) return;
    setCheckingCoupon(true);
    try {
      const res = await couponAPI.validate({
        code: couponInput.toUpperCase(),
        amount: item?.price,
      });
      applyCoupon(res.data.coupon, res.data.coupon.discount);
      toast.success(
        `Coupon "${res.data.coupon.code}" applied! You save ₹${res.data.coupon.discount} 🎉`,
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handlePayment = async () => {
    if (!agreed) {
      toast.error('Please agree to terms and conditions');
      return;
    }
    setLoading(true);
    try {
      // Create Razorpay order
      const res = await paymentAPI.createOrder({
        itemId: item._id,
        itemType: item.itemType || 'Course',
        couponCode: coupon?.code,
      });

      if (res.data.free) {
        toast.success('Enrolled successfully! 🎉');
        clearCart();
        navigate('/dashboard/courses');
        return;
      }

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      script.onload = () => {
        const options = {
          key: res.data.key,
          amount: res.data.order.amount,
          currency: 'INR',
          name: 'ELITE Trading Academy',
          description: item?.title,
          order_id: res.data.order.id,
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone,
          },
          theme: { color: '#F0A500' },
          handler: async (response) => {
            try {
              await paymentAPI.verify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                paymentId: res.data.paymentId,
              });
              toast.success('Payment successful! Welcome to the course! 🎉');
              clearCart();
              navigate('/dashboard/courses');
            } catch {
              toast.error('Payment verification failed. Contact support.');
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast('Payment cancelled');
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      };
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Payment initialization failed',
      );
      setLoading(false);
    }
  };

  if (!item) return null;

  const originalDiscount = item.originalPrice
    ? item.originalPrice - item.price
    : 0;
  const totalDiscount = discount + originalDiscount;

  return (
    <>
      <Helmet>
        <title>Checkout — ELITE Trading Academy</title>
      </Helmet>
      <div
        className="min-h-screen pt-24 pb-16"
        style={{ background: '#0A0A0F' }}
      >
        <div className="container-custom max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <FiArrowLeft size={16} /> Back
            </button>
            <div className="h-px flex-1 bg-gray-700" />
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-xs">
                E
              </div>
              <span className="text-gray-400">ELITE Trading Academy</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left — Order Details */}
            <div className="lg:col-span-3 space-y-5">
              <h1 className="text-2xl font-bold text-white">Order Summary</h1>

              {/* Product Card */}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex gap-4">
                <img
                  src={
                    item.thumbnail ||
                    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200'
                  }
                  alt={item.title}
                  className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 capitalize">
                    {item.category?.replace('_', ' ')} • {item.language}
                  </p>
                  <p className="text-yellow-400 font-bold mt-2">
                    ₹{item.price?.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Coupon */}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <FiTag size={14} className="text-yellow-400" /> Have a Coupon?
                </h3>
                {coupon ? (
                  <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                    <FiCheckCircle size={16} className="text-green-400" />
                    <span className="text-green-400 text-sm font-medium">
                      "{coupon.code}" — ₹{discount} off!
                    </span>
                    <button
                      onClick={() => {
                        applyCoupon(null, 0);
                        setCouponInput('');
                      }}
                      className="ml-auto text-gray-500 hover:text-white text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(e.target.value.toUpperCase())
                      }
                      className="flex-1 bg-gray-800 border border-gray-600 focus:border-yellow-500 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all placeholder-gray-500 uppercase"
                    />
                    <button
                      onClick={checkCoupon}
                      disabled={checkingCoupon}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
                    >
                      {checkingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* What you get */}
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-3">
                  What's Included
                </h3>
                {(
                  item.includes || [
                    'Video lessons (bilingual)',
                    'PDF notes & resources',
                    'Quizzes & assignments',
                    'Certificate of completion',
                    'Lifetime access',
                    'Community support',
                  ]
                ).map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5">
                    <FiCheckCircle
                      size={13}
                      className="text-green-400 flex-shrink-0"
                    />
                    <span className="text-gray-300 text-sm">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Payment */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 sticky top-24">
                <h2 className="text-white font-bold text-lg mb-5">
                  Price Breakdown
                </h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Original Price</span>
                    <span className="text-gray-300">
                      ₹{(item.originalPrice || item.price)?.toLocaleString()}
                    </span>
                  </div>
                  {originalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Course Discount</span>
                      <span className="text-green-400">
                        -₹{originalDiscount?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        Coupon ({coupon?.code})
                      </span>
                      <span className="text-green-400">
                        -₹{discount?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-700 pt-3 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-yellow-400 font-bold text-xl">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 text-center">
                      <span className="text-green-400 text-xs font-semibold">
                        🎉 You're saving ₹{totalDiscount.toLocaleString()}!
                      </span>
                    </div>
                  )}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 accent-yellow-500"
                  />
                  <span className="text-xs text-gray-400">
                    I agree to the{' '}
                    <Link
                      to="/terms-of-service"
                      target="_blank"
                      className="text-yellow-400 hover:underline"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/refund-policy"
                      target="_blank"
                      className="text-yellow-400 hover:underline"
                    >
                      Refund Policy
                    </Link>
                  </span>
                </label>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-all mb-3"
                >
                  {loading ? (
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <FiLock size={16} /> Pay ₹{finalPrice.toLocaleString()}{' '}
                      Securely
                    </>
                  )}
                </motion.button>

                <div className="flex items-center justify-center gap-4 mt-3">
                  <FiShield size={14} className="text-gray-500" />
                  <span className="text-gray-500 text-xs">
                    256-bit SSL secured
                  </span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-500 text-xs">
                    Powered by Razorpay
                  </span>
                </div>

                <p className="text-gray-600 text-xs text-center mt-3">
                  7-day refund policy. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
