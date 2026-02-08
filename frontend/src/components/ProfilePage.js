import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";

const ProfilePage = ({
  username,
  profilePhoto,
  user,
  onClose,
  profileNewPostText,
  setProfileNewPostText,
  profileNewPostImage,
  setProfileNewPostImage,
  userPosts,
  setUserPosts,
  error,
  commentText,
  setCommentText,
  handleLike,
  handleComment,
  handleDelete
}) => {
  const [following, setFollowing] = useState(false);
  const token = localStorage.getItem("token");

  const getAvatarInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name = "User") => {
    const colors = ["#FF6B6B","#4ECDC4","#45B7D1","#FFA07A","#98D8C8","#F7DC6F","#BB8FCE","#85C1E2","#F8B88B","#A9DFBF"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // Fetch posts
  const fetchMyPosts = useCallback(async () => {
    try {
      const res = await API.get(`/posts/user/${user._id}`, {
        headers: { Authorization: token }
      });
      setUserPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts");
    }
  }, [user, token, setUserPosts]);

  // Check following
  const checkFollowing = useCallback(async () => {
    try {
      const res = await API.get(`/users/${user._id}`, {
        headers: { Authorization: token }
      });

      const followingList = res.data.following || [];
      setFollowing(followingList.includes(user._id));
    } catch (err) {
      console.error("Failed to check following");
    }
  }, [user, token]);

  useEffect(() => {
    if (user?._id) {
      fetchMyPosts();
      checkFollowing();
    }
  }, [fetchMyPosts, checkFollowing, user]);

  // Create post
  const onCreatePost = async () => {
    if (!profileNewPostText && !profileNewPostImage) {
      alert("Add text or image");
      return;
    }

    try {
      await API.post(
        "/posts",
        { text: profileNewPostText, imageURL: profileNewPostImage },
        { headers: { Authorization: token } }
      );

      setProfileNewPostText("");
      setProfileNewPostImage("");
      fetchMyPosts();
    } catch (err) {
      console.error("Failed to create post");
    }
  };

  // Edit post
  const handleEditPost = async (post) => {
    const newText = prompt("Edit post text", post.text) ?? post.text;
    const newImage = prompt("Edit image URL", post.imageURL ?? "") ?? post.imageURL ?? "";

    try {
      await API.put(
        `/posts/${post._id}`,
        { text: newText, imageURL: newImage },
        { headers: { Authorization: token } }
      );
      fetchMyPosts();
    } catch (err) {
      console.error("Edit failed");
    }
  };

  // Follow / unfollow
  const toggleFollow = async () => {
    try {
      await API.put(
        `/users/follow/${user._id}`,
        {},
        { headers: { Authorization: token } }
      );

      setFollowing(prev => !prev);
    } catch (err) {
      console.error("Follow/Unfollow failed");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 10,
          padding: 30,
          maxWidth: 600,
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto"
        }}
      >
        {/* PROFILE HEADER */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
          <div style={{ textAlign: "center" }}>
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                style={{ borderRadius: "50%", width: 100, height: 100, objectFit: "cover", marginBottom: 10 }}
              />
            ) : (
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: getAvatarColor(username),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 30,
                  marginBottom: 10
                }}
              >
                {getAvatarInitials(username)}
              </div>
            )}
            <h2>{username}'s Profile</h2>
          </div>

          <button
            style={{
              height: 35,
              padding: "0 12px",
              borderRadius: 5,
              backgroundColor: "#1877f2",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
            onClick={toggleFollow}
          >
            {following ? "Unfollow" : "Follow"}
          </button>
        </div>

        {/* CREATE POST */}
        <div style={{ background: "#f5f5f5", padding: 20, borderRadius: 8, marginBottom: 30 }}>
          <h4>Create New Post</h4>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <textarea
            value={profileNewPostText}
            onChange={(e) => setProfileNewPostText(e.target.value)}
            rows={3}
            placeholder="What's on your mind?"
            style={{ width: "97%", padding: 10, marginBottom: 10 }}
          />

          <input
            value={profileNewPostImage}
            onChange={(e) => setProfileNewPostImage(e.target.value)}
            placeholder="Image URL (optional)"
            style={{ width: "97%", padding: 10, marginBottom: 10 }}
          />

          <button
            onClick={onCreatePost}
            style={{
              width: "101%",
              padding: 10,
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: 5
            }}
          >
            Post
          </button>
        </div>

        {/* POSTS */}
        <h4>Your Posts</h4>

        {userPosts.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>No posts yet</p>
        ) : (
          userPosts.map((post) => (
            <div key={post._id} style={{ border: "1px solid #ddd", padding: 15, borderRadius: 8, marginBottom: 15 }}>
              <p style={{ fontSize: 12, color: "#666" }}>
                {new Date(post.createdAt).toLocaleString()}
              </p>

              {post.text && <p>{post.text}</p>}
              {post.imageURL && <img src={post.imageURL} alt="" style={{ width: "100%", borderRadius: 5 }} />}

              <div style={{ marginTop: 10 }}>
                <button onClick={() => handleLike(post._id)} style={{ marginRight: 10 }}>
                  👍 {post.likes?.length || 0}
                </button>

                <button
                  onClick={() => handleDelete(post._id)}
                  style={{
                    marginRight: 10,
                    backgroundColor: "#e53935",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: 4
                  }}
                >
                  Delete
                </button>

                <button onClick={() => handleEditPost(post)} style={{ marginRight: 10 }}>
                  ✏️ Edit
                </button>
              </div>

              {/* COMMENTS */}
              <div style={{ marginTop: 10 }}>
                {post.comments?.map((c, i) => (
                  <p key={i}>
                    <b>{c.userId?.username || "User"}:</b> {c.text}
                  </p>
                ))}

                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText({ ...commentText, [post._id]: e.target.value })
                    }
                    placeholder="Add comment..."
                    style={{ flex: 1 }}
                  />
                  <button onClick={() => handleComment(post._id)}>Comment</button>
                </div>
              </div>
            </div>
          ))
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 10,
            backgroundColor: "#ff6b6b",
            color: "white",
            border: "none",
            borderRadius: 5
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
