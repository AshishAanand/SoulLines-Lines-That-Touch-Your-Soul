import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.username || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await signup(form.name, form.username, form.email, form.password);
      navigate("/feed"); // redirect to feed after successful signup
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-lg p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Create Your SoulLines Account
          </h1>
          <p className="text-muted-foreground mt-2">
            Join and share thoughts that touch the soul 🌙
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;

