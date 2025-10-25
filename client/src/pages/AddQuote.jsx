import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api.js';

const AddQuote = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    text: '',
    author: '',
    tags: '',
  });

  const [status, setStatus] = useState({ loading: false, message: '', success: false });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: '', success: false });

    try {
      // Sending to backend
      const res = await API.post('api/quotes', {
        text: formData.text,
        author: formData.author,
        tags: formData.tag,
      });

      if (res.status === 201 || res.status === 200) {
        setStatus({
          loading: false,
          message: 'Quote added successfully! ✨',
          success: true,
        });

        // Clear form fields
        setFormData({
          text: '',
          author: '',
          tags: '',
        });

        // Redirect after delay
        setTimeout(() => navigate('/feed'), 1200);
      }
    } catch (err) {
      console.error('Error adding quote:', err);
      setStatus({
        loading: false,
        message: err.response?.data?.message || 'Something went wrong. Please try again.',
        success: false,
      });
    }
  };

  return (
    <div className="flex items-center justify-center py-16 px-6 bg-gradient-to-br relative overflow-hidden">

      {/* Glowing Orbs (Background Decoration) */}
      <div className="absolute top-20 left-1/3 w-72 h-72 bg-gradient-to-tr from-indigo-400 to-teal-300 opacity-30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-gradient-to-bl from-teal-400 to-indigo-300 opacity-30 blur-3xl rounded-full animate-pulse delay-300"></div>

      <div className="w-full max-w-2xl bg-white/30 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_8px_40px_rgba(79,70,229,0.2)] p-10 sm:p-12 relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent tracking-tight mb-2">
            Add a New Quote
          </h1>
          <p className="text-sm text-slate-600">
            “Words have power — share one that moves hearts.”
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quote */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">Quote</label>
            <textarea
              name="text"
              value={formData.quote}
              onChange={handleChange}
              className="w-full p-4 bg-white/60 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition backdrop-blur-md"
              rows="4"
              placeholder="Write something inspiring..."
              required
            />
          </div>

          {/* Author & Source */}
          <div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="w-full p-3 bg-white/60 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition backdrop-blur-md"
                placeholder="e.g. Maya Angelou"
                required
              />
            </div>

          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">Category</label>
            <div className="relative">
              <select
                name="tags"
                value={formData.category}
                onChange={handleChange}
                className="w-full appearance-none p-3 pl-4 pr-10 bg-gradient-to-r from-white/80 to-indigo-50/80 border border-gray-200 rounded-2xl shadow-sm text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition duration-200 cursor-pointer backdrop-blur-md"
                required
              >
                <option value="">Select a category</option>
                <option value="inspiration">🌅 Inspiration</option>
                <option value="philosophy">📜 Philosophy</option>
                <option value="life">🌿 Life</option>
                <option value="love">❤️ Love</option>
                <option value="wisdom">🧠 Wisdom</option>
              </select>

              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9.75L12 13.5l3.75-3.75" />
              </svg>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4 pt-2 justify-center">
            <button
              type="submit"
              disabled={status.loading}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-2xl shadow-lg transition-all duration-200 cursor-pointer ${
                status.loading
                  ? 'bg-indigo-300 text-white'
                  : 'bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400 text-white hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {status.loading ? 'Adding...' : '✨ Add Quote'}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-5 py-3 bg-white/60 border border-gray-200 text-slate-700 rounded-2xl shadow-sm hover:bg-white/80 transition backdrop-blur-md hover:cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Message */}
          {status.message && (
            <p
              className={`text-center text-sm mt-4 ${
                status.success ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {status.message}
            </p>
          )}

          <p className="text-xs text-center text-slate-500 mt-3">
            Your words might brighten someone’s day 🌤️
          </p>
        </form>
      </div>
    </div>
  );
};

export default AddQuote;
