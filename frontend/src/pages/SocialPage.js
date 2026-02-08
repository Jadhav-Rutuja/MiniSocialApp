import React, { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import Header from "../components/Header";
import ProfilePage from "../components/ProfilePage";

const SocialPage = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [error] = useState("");
  const [commentText, setCommentText] = useState({});
  const [profileNewPostText, setProfileNewPostText] = useState("");
  const [profileNewPostImage, setProfileNewPostImage] = useState("");
  const [userPostsState, setUserPostsState] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");

  const getAvatarInitials = (username = "User") =>
    username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getAvatarColor = (username = "User") => {
    const colors = [
      "#FF6B6B","#4ECDC4","#45B7D1","#FFA07A",
      "#98D8C8","#F7DC6F","#BB8FCE","#85C1E2",
      "#F8B88B","#A9DFBF",
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++)
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    return colors[Math.abs(hash) % colors.length];
  };

  const fetchUser = useCallback(async () => {
    try {
      const res = await API.get("/auth/me", {
        headers: { Authorization: token }
      });
      setUser(res.data);
    } catch (err) {
      console.log("Failed to fetch user");
    }
  }, [token]);

  const fetchPosts = useCallback(async (pageNum = 1) => {
    try {
      const res = await API.get(`/posts?page=${pageNum}`, {
        headers: { Authorization: token }
      });

      if (pageNum === 1) setPosts(res.data);
      else setPosts((prev) => [...prev, ...res.data]);
    } catch (err) {
      console.log("Failed to fetch posts");
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [fetchUser, fetchPosts]);

  useEffect(() => {
    if (user) {
      setUserPostsState(posts.filter((p) => p.userId?._id === user._id));
    }
  }, [posts, user]);

  const handleLike = async (postId) => {
    try {
      await API.put(`/posts/like/${postId}`, {}, {
        headers: { Authorization: token }
      });
      fetchPosts();
    } catch {
      console.log("Like failed");
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]) return;

    try {
      await API.put(
        `/posts/comment/${postId}`,
        { text: commentText[postId] },
        { headers: { Authorization: token } }
      );

      setCommentText({ ...commentText, [postId]: "" });
      fetchPosts();
    } catch {
      console.log("Comment failed");
    }
  };

  const toggleFollow = async (userId) => {
    try {
      await API.put(`/users/follow/${userId}`, {}, {
        headers: { Authorization: token }
      });
      fetchPosts();
    } catch {
      console.log("Follow/unfollow failed");
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userId?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMorePosts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  if (!user) return null;

  const styles = {
    container: { minHeight: "100vh", backgroundColor: "#f0f2f5", paddingBottom: 40 },
    feedWrapper: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 1200, margin: "20px auto", padding: "0 20px" },
    postCard: { background: "white", borderRadius: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" },
    postHeader: { display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #e5e7eb" },
    userInfo: { display: "flex", alignItems: "center", gap: 10 },
    userAvatar: (color) => ({
      width: 40,
      height: 40,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: color,
      color: "white",
      fontWeight: 600
    }),
    postContent: { padding: "12px 16px" },
    postImage: { width: "100%", height: 250, objectFit: "cover", borderRadius: 8 },
    postActions: { display: "flex", gap: 10, padding: "8px 16px" },
    actionBtn: { border: "none", background: "none", cursor: "pointer" },
    commentWrapper: { display: "flex", gap: 8, marginTop: 8 },
    commentInput: { flex: 1, border: "1px solid #ccc", borderRadius: 20, padding: "8px 12px" },
    commentBtn: { padding: "8px 12px", borderRadius: 20, backgroundColor: "#1877f2", color: "white", border: "none", cursor: "pointer" },
  };

  return (
    <div style={styles.container}>
      <Header
        username={user.username}
        profilePhoto={user.profilePhoto}
        onProfileClick={() => setShowProfile(true)}
      />

      <input
        type="text"
        placeholder="Search users/posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: "90%", margin: "10px auto", display: "block", padding: 8 }}
      />

      <div style={styles.feedWrapper}>
        {filteredPosts.map((post) => (
          <div key={post._id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <div style={styles.userInfo}>
                {post.userId?.profilePhoto ? (
                  <img src={post.userId.profilePhoto} alt="" style={{ width: 40, height: 40, borderRadius: "50%" }} />
                ) : (
                  <div style={styles.userAvatar(getAvatarColor(post.userId?.username))}>
                    {getAvatarInitials(post.userId?.username)}
                  </div>
                )}
                <strong>{post.userId?.username || "Unknown"}</strong>
              </div>

              {post.userId?._id !== user._id && (
                <button
                  style={styles.actionBtn}
                  onClick={() => toggleFollow(post.userId?._id)}
                >
                  Follow
                </button>
              )}
            </div>

            <div style={styles.postContent}>
              {post.text && <p>{post.text}</p>}
              {post.imageURL && <img src={post.imageURL} alt="" style={styles.postImage} />}
            </div>

            <div style={styles.postActions}>
              <button style={styles.actionBtn} onClick={() => handleLike(post._id)}>
                👍 Like ({post.likes?.length || 0})
              </button>
            </div>

            <div style={{ padding: "0 16px 16px 16px" }}>
              {post.comments?.map((c, i) => (
                <div key={i}>
                  <b>{c.userId?.username || "Unknown"}:</b> {c.text}
                </div>
              ))}

              <div style={styles.commentWrapper}>
                <input
                  type="text"
                  placeholder="Add comment..."
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText({ ...commentText, [post._id]: e.target.value })
                  }
                  style={styles.commentInput}
                />
                <button onClick={() => handleComment(post._id)} style={styles.commentBtn}>
                  Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={loadMorePosts}
        style={{ ...styles.commentBtn, display: "block", margin: "20px auto" }}
      >
        Load More Posts
      </button>

      {showProfile && (
        <ProfilePage
          username={user.username}
          profilePhoto={user.profilePhoto}
          user={user}
          onClose={() => setShowProfile(false)}
          profileNewPostText={profileNewPostText}
          setProfileNewPostText={setProfileNewPostText}
          profileNewPostImage={profileNewPostImage}
          setProfileNewPostImage={setProfileNewPostImage}
          userPosts={userPostsState}
          setUserPosts={setUserPostsState}
          error={error}
          commentText={commentText}
          setCommentText={setCommentText}
          handleLike={handleLike}
          handleComment={handleComment}
        />
      )}
    </div>
  );
};

export default SocialPage;
