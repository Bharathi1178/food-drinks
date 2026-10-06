import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Quote, Plus, X, MapPin, Utensils, User, MessageSquare, Check, Sparkles } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

const STORAGE_KEY = 'bitepos_customer_reviews';

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Rahul Sharma',
    city: 'Indiranagar',
    dish: 'Classic Chicken Burger & Fries',
    rating: 5,
    date: '2 days ago',
    comment:
      'Absolutely loved the chicken burger. Fresh, hot, and really tasty! The secret sauce makes all the difference. Will definitely reorder!',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'rev-2',
    name: 'Priya Sundaram',
    city: 'Koramangala',
    dish: 'Truffle Mushroom Pizza',
    rating: 5,
    date: 'Yesterday',
    comment:
      'The pizza was amazing and delivery was super fast — arrived in 22 minutes steaming hot. Crust had that perfect wood-fired crunch.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'rev-3',
    name: 'Anish Verma',
    city: 'HSR Layout',
    dish: 'Crispy Wings & Cold Brew',
    rating: 5,
    date: '3 days ago',
    comment:
      'Best wings in town hands down! Perfectly glazed, crunchy on the outside and tender inside. Packaging was premium and spill-proof.',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'rev-4',
    name: 'Sneha Roy',
    city: 'Whitefield',
    dish: 'Artisan Pasta & Berry Shake',
    rating: 5,
    date: '5 days ago',
    comment:
      'Super impressed with the food presentation and taste. Finally an online artisan restaurant that tastes like high-end dine-in!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
];

const POPULAR_DISHES = [
  'Classic Chicken Burger & Fries',
  'Truffle Mushroom Pizza',
  'Crispy Wings & Cold Brew',
  'Artisan Pasta & Berry Shake',
  'South Indian Degree Filter Coffee',
  'Warm Sizzling Chocolate Brownie',
];

const POPULAR_LOCATIONS = [
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Velachery',
  'Perungudi',
  'Whitefield',
  'Anna Nagar',
];

export default function CustomerReviews() {
  const { currentCustomer } = useCustomerAuth();

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Cleanse any old isNewCustomer properties
          return parsed.map((r) => {
            const { isNewCustomer, ...rest } = r;
            return rest;
          });
        }
      }
    } catch (e) {
      console.warn('Reviews parse note:', e);
    }
    return INITIAL_REVIEWS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    dish: '',
    rating: 5,
    comment: '',
  });

  // Pre-fill user details if logged in
  useEffect(() => {
    if (currentCustomer && isModalOpen) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || currentCustomer.name || '',
        city: prev.city || currentCustomer.location || currentCustomer.city || '',
      }));
    }
  }, [currentCustomer, isModalOpen]);

  // Open modal if URL has #write-review or custom event
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#write-review') {
        setIsModalOpen(true);
      }
      const handleOpenEvt = (e) => {
        setIsModalOpen(true);
        if (e.detail?.dish) {
          setFormData((prev) => ({ ...prev, dish: e.detail.dish }));
        }
      };
      window.addEventListener('bitepos_open_review_modal', handleOpenEvt);
      return () => window.removeEventListener('bitepos_open_review_modal', handleOpenEvt);
    }
  }, []);

  const handleOpenModal = () => {
    setFormData({
      name: currentCustomer?.name || '',
      city: currentCustomer?.location || currentCustomer?.city || '',
      dish: '',
      rating: 5,
      comment: '',
    });
    setSubmittedSuccess(false);
    setIsModalOpen(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) return;

    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      formData.name.trim()
    )}&background=f97316&color=fff&bold=true&size=120`;

    const newReview = {
      id: `rev-${Date.now()}`,
      name: formData.name.trim(),
      city: formData.city.trim() || 'Food Lover',
      dish: formData.dish.trim() || 'Artisan Special',
      rating: Number(formData.rating) || 5,
      date: 'Just now',
      comment: formData.comment.trim(),
      avatar: avatarUrl,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('Storage save note:', err);
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmittedSuccess(false);
    }, 1200);
  };

  return (
    <section id="reviews" className="py-14 sm:py-20 bg-[#0d121c] border-t border-slate-800 relative select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Real Feedback</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            What Our Customers Say ⭐
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
            Over 25,000+ orders fulfilled with passion and artisan craftsmanship. Read real customer experiences or share your own!
          </p>

          {/* Clean Write a Review Button */}
          <div className="flex items-center justify-center mt-6">
            <button
              type="button"
              onClick={handleOpenModal}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Clean Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-[#131a29] border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/20 group hover:-translate-y-1 relative"
            >
              <div>
                {/* Header: Stars & Quote Icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <Quote className="w-5 h-5 text-slate-700 group-hover:text-amber-500/40 transition-colors" />
                </div>

                {/* Review Text */}
                <p className="text-slate-300 text-sm italic leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Footer: User Details */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-500/30 shrink-0"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      rev.name
                    )}&background=f97316&color=fff&bold=true`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white truncate">
                      {rev.name}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Verified Diner" />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {rev.city} • <span className="text-amber-400/90 font-medium">{rev.dish}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {rev.date || 'Recent'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* INTERACTIVE REVIEW SUBMISSION MODAL                            */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#121927] border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl shadow-black/80 relative max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {submittedSuccess ? (
              /* Success Celebration View */
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-black text-white">Thank You for Your Review!</h3>
                <p className="text-slate-300 text-xs max-w-xs mx-auto">
                  Your feedback has been published! Other food lovers can now read your experience.
                </p>
              </div>
            ) : (
              /* Review Form */
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-black uppercase tracking-wider border border-amber-500/20 mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Customer Feedback</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Share Your BiteCraze Experience
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Help other diners discover what's hot, fresh, and delicious!
                  </p>
                </div>

                {/* Star Rating Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Your Overall Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-lg hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            (hoverRating || formData.rating) >= star
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-400 ml-2">
                      {formData.rating === 5 && '🌟 Outstanding & Delicious!'}
                      {formData.rating === 4 && '😋 Great Taste & Fresh!'}
                      {formData.rating === 3 && '🙂 Good & Satisfying'}
                      {formData.rating === 2 && '😐 Could Be Better'}
                      {formData.rating === 1 && '😕 Needs Improvement'}
                    </span>
                  </div>
                </div>

                {/* Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Your Name <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-3 py-2 bg-[#182133] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      City / Area
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                        placeholder="e.g. Indiranagar, Velachery"
                        className="w-full pl-9 pr-3 py-2 bg-[#182133] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Location Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400">Popular:</span>
                  {POPULAR_LOCATIONS.slice(0, 5).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, city: loc }))}
                      className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>

                {/* Dish Ordered */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Favorite Dish / What Did You Order?
                  </label>
                  <div className="relative">
                    <Utensils className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.dish}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dish: e.target.value }))}
                      placeholder="e.g. Classic Chicken Burger & Fries"
                      className="w-full pl-9 pr-3 py-2 bg-[#182133] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  {/* Dish Suggestions Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                    {POPULAR_DISHES.slice(0, 3).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, dish: d }))}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 cursor-pointer transition-colors"
                      >
                        + {d.split('&')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Your Review & Experience <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.comment}
                    onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="How was the food quality, taste, crunch, packaging, or delivery speed?"
                    className="w-full px-3 py-2.5 bg-[#182133] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                  />
                </div>

                {/* Modal Buttons */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-500/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Review ✨</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
