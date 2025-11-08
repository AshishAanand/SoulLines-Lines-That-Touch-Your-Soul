import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Quote, Users, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import API from "../services/api";

// ------------------ Avatar ------------------
const Avatar = ({ name = "User", color = "#6366F1", size = 96 }) => {
  const initials = (name || "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        fontSize: size / 3.2,
      }}
      className="rounded-full text-white font-extrabold flex items-center justify-center shadow-md flex-shrink-0"
    >
      {initials}
    </div>
  );
};

// ------------------ Stat Box ------------------
const Stat = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center rounded-xl bg-indigo-50/40 p-4 w-full sm:w-32">
    <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
      {Icon && <Icon className="w-5 h-5" />}
      {value}
    </div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

// ------------------ Profile ------------------
const Profile = () => {
  const { username } = useParams();
  const { user } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [followData, setFollowData] = useState({
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  });
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState(null);

  const isOwnProfile = !username || username === user?.username;

  // ------------------ Fetch Data ------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Fetch user profile (by username or self)
        const userRes = isOwnProfile
          ? await API.get("/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          })
          : await API.get(`/api/users/${username}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

        const profileData = userRes.data.user || userRes.data;
        setProfileUser(profileData);

        // Fetch quotes
        const quoteRes = await API.get(
          `/api/quotes/${profileData._id}/quotes`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuotes(quoteRes.data.quotes || []);

        // Fetch follow info (skip for self)
        if (!isOwnProfile) {
          const followRes = await API.get(
            `/api/social/follow/${profileData.username}/status`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (followRes.data.success) {
            setFollowData({
              followersCount: followRes.data.followersCount,
              followingCount: followRes.data.followingCount,
              isFollowing: followRes.data.isFollowing,
            });
          }
        } else {
          setFollowData({
            followersCount: profileData.followers?.length || 0,
            followingCount: profileData.following?.length || 0,
            isFollowing: false,
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, user]);

  // ------------------ Follow Toggle ------------------
  const handleFollowToggle = async () => {
    if (followLoading || !profileUser) return;
    setFollowLoading(true);

    try {
      const res = await API.post(
        `/api/social/follow/${profileUser.username}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.success) {
        setFollowData((prev) => ({
          ...prev,
          followersCount: res.data.followersCount,
          isFollowing: res.data.isFollowing,
        }));
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  // ------------------ UI States ------------------
  if (loading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading quotes...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </div>
    );

  if (!profileUser)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        User not found.
      </div>
    );

  // ------------------ Main Render ------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* ---------- Header ---------- */}
        <section className="bg-white/70 backdrop-blur-sm shadow-md rounded-2xl p-6 sm:p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <Avatar name={profileUser.username} color="#6366F1" size={100} />

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                    {profileUser.name}
                  </h1>
                  <p className="text-gray-500">@{profileUser.username}</p>
                </div>

                {!isOwnProfile && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={followLoading}
                    onClick={handleFollowToggle}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${followData.isFollowing
                        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                  >
                    {followLoading
                      ? "Processing..."
                      : followData.isFollowing
                        ? "Following"
                        : "Follow"}
                  </motion.button>
                )}
              </div>

              {/* ---------- Stats ---------- */}
              <div className="mt-5 flex flex-wrap justify-start gap-4">
                <Stat label="Quotes" value={quotes?.length || 0} icon={Quote} />
                <Stat
                  label="Followers"
                  value={followData.followersCount}
                  icon={Users}
                />
                <Stat
                  label="Following"
                  value={followData.followingCount}
                  icon={UserPlus}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Quotes Section ---------- */}
        <section className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm p-6 sm:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {isOwnProfile
                ? "Your Quotes"
                : `${profileUser.name}'s Quotes`}
            </h2>
            <span className="text-sm text-gray-500">{quotes.length} total</span>
          </div>

          {quotes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {isOwnProfile
                ? "You haven’t added any quotes yet."
                : "This user hasn’t posted any quotes yet."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {quotes.map((q) => (
                <motion.article
                  key={q._id}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 bg-gradient-to-tr from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md"
                >
                  <p className="text-gray-800 italic leading-relaxed">
                    “{q.text}”
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="text-red-500">❤️</span>
                      <span>{q.likes?.length || 0}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
};

export default Profile;
