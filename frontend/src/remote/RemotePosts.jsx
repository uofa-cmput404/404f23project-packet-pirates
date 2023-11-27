import { useEffect, useState } from "react";
import axios from "axios";

export default function RemotePost({
  user,
  post_author,
  title,
  description,
  content,
  img,
  likes,
}) {
  const [comments, setComments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postAuthor, setPostAuthor] = useState("");

  const handleEdit = () => {
    // Handle edit functionality
  };
  const handleLike = async () => {
    // placeholder
    console.log("like");
  };

  const handleShare = async () => {
    // placeholder
    console.log("share");
  };

  useEffect(() => {
    console.log("user", user);
    console.log("title", title);
    console.log("description", description);
    console.log("content", content);
    console.log("img", img);
    console.log("likes", likes);
  }, []);

  return (
    <>
      <li className="list-none mb-5">
        <div
          className="post-container flex flex-col w-full h-full bg-white border border-gray-300 p-4 rounded-lg"
          style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="user-info-section flex flex-row">
            <div className="image-container w-10 h-10 rounded-full overflow-hidden bg-black">
              <img
                src={post_author.profileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="info flex flex-col w-full ml-5">
              <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                {post_author.displayName}
              </span>
              <div className="post-title flex flex-row w-full justify-between items-center">
                <span className="text-center">
                  <h1>{title}</h1>
                </span>

                <button
                  onClick={handleEdit}
                  className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-white rounded-full"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* <div className="privacy-status">
            {is_private && <span className="privacy-private">Private</span>}
            {unlisted && <span className="privacy-unlisted">Unlisted</span>}
            {!is_private && !unlisted && (
              <span className="privacy-public">Public</span>
            )}
          </div> */}

          <div className="description-section flex justify-center items-center">
            <p>{description}</p>
          </div>
          <div className="img-section w-full h-full rounded-lg overflow-hidden">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="likes">
            <span>Likes: {likeCount}</span>
          </div>

          <div className="engagement-section flex flex-row justify-between m-5">
            <button
              onClick={handleLike}
              className={`border border-[#395B64] ${
                hasLiked ? "liked-button" : "not-liked-button"
              } w-fit pl-3 pr-3 text-white rounded-full`}
            >
              <img
                src="/like-button.png"
                alt="Like"
                className="like-button-img"
              />
            </button>

            <button
              onClick={() => setIsCommenting(!isCommenting)}
              className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-white rounded-full comment-button"
            >
              <img
                src="/comment-button.png"
                alt="Comment"
                className="comment-button-img"
              />
            </button>

            <button
              onClick={handleShare}
              className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-white rounded-full share-button"
            >
              <img
                src="/share-button.png"
                alt="Share"
                className="share-button-img"
              />
            </button>
          </div>

          {isCommenting && (
            <div
              className="comment-input"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                type="text"
                placeholder="Enter your comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                onClick={handleCommentSubmit}
                style={{ marginLeft: "8px" }}
              >
                Submit
              </button>
            </div>
          )}

          {/* <div className="comment-section flex flex-col divide-y justify-start">
            <h1>Comments</h1>
            <ul>{comments}</ul>
          </div> */}
        </div>
      </li>
    </>
  );
}
