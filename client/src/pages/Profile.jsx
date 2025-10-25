// // /H:/Work/Projects/Quote_Sharing_app/client/src/pages/Profile.jsx
// import React, { useEffect, useState } from "react";

// const sampleUser = {
//     name: "Alex Morgan",
//     handle: "@alexm",
//     bio: "Frontend dev, coffee enthusiast, quote collector.",
//     avatarColor: "#6C5CE7",
//     stats: { quotes: 24, followers: 482, following: 120 },
//     quotes: [
//         { id: 1, text: "Do the thing you fear and the death of fear is certain.", likes: 12 },
//         { id: 2, text: "Small daily improvements are the key to staggering long-term results.", likes: 8 },
//         { id: 3, text: "Simplicity is the ultimate sophistication.", likes: 21 },
//     ],
// };

// const Avatar = ({ name, color, size = 96 }) => {
//     const initials = name
//         .split(" ")
//         .map((s) => s[0])
//         .slice(0, 2)
//         .join("")
//         .toUpperCase();

//     const style = {
//         backgroundColor: color,
//         width: `${size}px`,
//         height: `${size}px`,
//         fontSize: `${size / 3.2}px`,
//     };

//     return (
//         <div
//             style={style}
//             className="rounded-full text-white font-extrabold flex items-center justify-center flex-shrink-0"
//             aria-hidden
//         >
//             {initials}
//         </div>
//     );
// };

// const Stat = ({ label, value }) => (
//     <div className="flex flex-col items-center px-4">
//         <div className="text-lg font-semibold">{value}</div>
//         <div className="text-sm text-gray-500">{label}</div>
//     </div>
// );

// export default function Profile() {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Replace with real fetch to your API/auth
//         const t = setTimeout(() => {
//             setUser(sampleUser);
//             setLoading(false);
//         }, 350);
//         return () => clearTimeout(t);
//     }, []);

//     if (loading || !user) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//                 <div className="text-gray-500">Loading profile…</div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-4xl mx-auto space-y-6">
//                 <header className="bg-white rounded-lg shadow-sm p-6">
//                     <div className="flex items-start gap-6">
//                         <Avatar name={user.name} color={user.avatarColor} size={96} />

//                         <div className="flex-1">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <div className="text-2xl font-semibold">{user.name}</div>
//                                     <div className="text-sm text-gray-500">{user.handle}</div>
//                                 </div>

//                                 <div className="hidden sm:flex items-center gap-2">
//                                     <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
//                                         Edit Profile
//                                     </button>
//                                     <button className="border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
//                                         Share
//                                     </button>
//                                 </div>
//                             </div>

//                             <p className="mt-4 text-gray-700">{user.bio}</p>

//                             <div className="mt-4 flex items-center gap-6">
//                                 <Stat label="Quotes" value={user.stats.quotes} />
//                                 <Stat label="Followers" value={user.stats.followers} />
//                                 <Stat label="Following" value={user.stats.following} />
//                             </div>

//                             <div className="mt-4 sm:hidden flex items-center gap-2">
//                                 <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
//                                     Edit Profile
//                                 </button>
//                                 <button className="border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">
//                                     Share
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </header>

//                 <main className="bg-white rounded-lg shadow-sm p-6">
//                     <div className="flex items-center justify-between">
//                         <h3 className="text-lg font-semibold">Your Quotes</h3>
//                         <div className="text-sm text-gray-500">{user.quotes.length} total</div>
//                     </div>

//                     <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {user.quotes.map((q) => (
//                             <article key={q.id} className="p-4 bg-gray-50 rounded-md border border-gray-100 flex flex-col justify-between">
//                                 <p className="text-gray-800 italic">“{q.text}”</p>

//                                 <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-red-500">❤️</span>
//                                         <span>{q.likes}</span>
//                                     </div>

//                                     <div className="flex items-center gap-2">
//                                         <button className="text-indigo-600 hover:underline text-sm">Edit</button>
//                                         <button className="text-red-600 hover:underline text-sm">Delete</button>
//                                     </div>
//                                 </div>
//                             </article>
//                         ))}
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Avatar = ({ name = "User", color, size = 96 }) => {
    const initials = (name || "User")
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const style = {
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 3.2}px`,
    };

    return (
        <div
            style={style}
            className="rounded-full text-white font-extrabold flex items-center justify-center flex-shrink-0"
            aria-hidden
        >
            {initials}
        </div>
    );
};

const Stat = ({ label, value }) => (
    <div className="flex flex-col items-center px-4">
        <div className="text-lg font-semibold">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
    </div>
);

const Profile = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [userQuotes, setUserQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1. Fetch current user
                const res = await API.get('/api/users/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });

                const userData = res.data.user || res.data; // safe fallback
                setUserData(userData);

                console.log("User data:", userData);

                // 2. Fetch user-specific quotes
                const quotesRes = await API.get(`/api/quotes/${userData._id}/quotes`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setUserQuotes(quotesRes.data.quotes || []);
                console.log("User quotes:", quotesRes.data.quotes);
            } catch (err) {
                console.error(err);
                setError("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);


    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading profile…</div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
                {error}
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">No profile data found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <header className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-start gap-6">
                        <Avatar name={userData.username} color="#6C5CE7" size={96} />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-semibold">{userData.name}</div>
                                    <div className="text-sm text-gray-500">@{userData.username}</div>
                                </div>
                                <div className="hidden sm:flex items-center gap-2">
                                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">Edit Profile</button>
                                    <button className="border border-gray-300 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50">Share</button>
                                </div>
                            </div>
                            <p className="mt-4 text-gray-700">{userData.bio}</p>
                            <div className="mt-4 flex items-center gap-6">
                                <Stat label="Quotes" value={userQuotes?.length || 0} />
                                <Stat label="Followers" value={userData.followers?.length || 0} />
                                <Stat label="Following" value={userData.following?.length || 0} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Quotes */}
                <main className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Your Quotes</h3>
                        <div className="text-sm text-gray-500">{userQuotes.length} total</div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userQuotes.length === 0 ? <p>No quotes yet.</p> : userQuotes.map((q) => (
                            <article key={q._id} className="p-4 bg-gray-50 rounded-md border border-gray-100 flex flex-col justify-between">
                                <p className="text-gray-800 italic">“{q.text}”</p>
                                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-500">❤️</span>
                                        <span>{q.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="text-indigo-600 hover:underline text-sm">Edit</button>
                                        <button className="text-red-600 hover:underline text-sm">Delete</button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}


export default Profile;