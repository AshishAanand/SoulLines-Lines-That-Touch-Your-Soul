const FollowButton = ({
    targetUsername,
    userToken,
    initialState = {},
    onUpdate,
}) => {
    const [isFollowing, setIsFollowing] = useState(initialState.isFollowing || false);
    const [followersCount, setFollowersCount] = useState(initialState.followersCount || 0);
    const [followingCount, setFollowingCount] = useState(initialState.followingCount || 0);
    const [loading, setLoading] = useState(false);

    const toggleFollow = async () => {
        if (!userToken) return alert("Please log in first");

        setLoading(true);
        const prev = { isFollowing, followersCount, followingCount };

        // optimistic update
        setIsFollowing(!isFollowing);
        setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);

        try {
            const res = await API.post(`/api/social/follow/${targetUsername}`, {}, {
                headers: { Authorization: `Bearer ${userToken}` },
            });

            if (res.data.success) {
                setIsFollowing(res.data.isFollowing);
                setFollowersCount(res.data.followersCount);
                setFollowingCount(res.data.followingCount);
                onUpdate?.(res.data);
            } else {
                // rollback
                setIsFollowing(prev.isFollowing);
                setFollowersCount(prev.followersCount);
            }
        } catch (err) {
            console.error("Follow toggle failed:", err);
            setIsFollowing(prev.isFollowing);
            setFollowersCount(prev.followersCount);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={toggleFollow}
                disabled={loading}
                className={`px-3 py-1.5 rounded-full font-semibold text-sm transition ${isFollowing ? "bg-gray-200 text-black" : "bg-primary text-white"
                    }`}
            >
                {isFollowing ? "Following" : "Follow"}
            </button>

            <span className="text-sm text-muted-foreground">
                {followersCount} followers
            </span>
            <span className="text-sm text-muted-foreground">
                {followingCount} following
            </span>
        </div>
    );
}

export default FollowButton;