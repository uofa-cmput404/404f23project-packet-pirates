import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown'
import Cookies from "universal-cookie";

import {
  Avatar,
  Button,
  IconButton,
  RadioGroup,
  Modal,
  Box,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import EditPost from "../main-feed/EditPost";

export default function Post({
  user,
  post_author,
  title,
  content_type,
  description,
  img,
  img_url,
  likes,
  id,
  is_private,
  unlisted,
}) {
  const [comments, setComments] = useState(null);
  const [commentsData, setCommentsData] = useState({});
  const [postLikes, setPostLikes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postAuthor, setPostAuthor] = useState("");
  const navigate = useNavigate();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [sharingModalOpen, setSharingModalOpen] = useState(false);
  const [shareableAuthors, setShareableAuthors] = useState([]);

  const config = {
    headers: { Authorization: "Token " + localStorage.getItem("access_token") },
  };

  const handleEdit = () => {
    // Handle edit functionality
  };

  const handleEditAccess = () => {
    try {
      if (user.user.user_id == post_author) {
        setIsEditable(true);
      }
    } catch {
      console.log(":^]");
    }
  };

  const handleLike = async () => {
    const newLikeState = !hasLiked;

    // Calculate the new like count based on the like state
    const newLikeCount = newLikeState ? likeCount + 1 : likeCount - 1;

    // Update the like status
    setLikeCount(newLikeCount);
    setHasLiked(newLikeState);

    try {
      if (newLikeState) {
        // If liking, make a POST request to add a like
        await axios.post(
          "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + id + "/postlikes",
          {
            post_object_id: id,
            author: user,
            like_count: newLikeCount,
          },
          config,
          {
            withCredentials: true,
          }
        );
      } else {
        // If unliking, make a DELETE request to remove the like
        await axios.delete(
          "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + id + "/postlikes",
          {
            data: {
              post_object_id: id,
              author: user,
              like_count: newLikeCount,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + localStorage.getItem("access_token"),
            },
          }
        );
      }
    } catch (error) {
      // If error found, revert any changes made
      console.error("Error updating like status:", error);

      // Revert changes
      setLikeCount(likeCount); // Reset like count
      setHasLiked(!hasLiked); // Toggle like state back
    }
  };

  useEffect(() => {
    // Check if the current user has liked the post
    const checkLikeStatus = async () => {
      try {
        const response = await axios.get(
          "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + id + "/postlikes",
          config
        );
        const likedByCurrentUser = response.data["Post Likes"].some(
          (like) => like.author === user.user.user_id
        );
        setHasLiked(likedByCurrentUser);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [id, user]);

  const handleButtonShare = () => {
    setShowShareOptions((prev) => !prev);
  };

  const handleShareModalOpen = async () => {
    setSharingModalOpen(true);

    // do request to retrieve all your followers
    // this will be those you can directly dm to their inbox
    // ** double check though **
    let url =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + user.user.user_id + "/authorfollowers";

    try {
      const response = await axios.get(url, config);
      setShareableAuthors(response.data["Friends"]);
    } catch (err) {
      // Handle err
      console.log("Oh no, an error", err);
    }
  };

  const handleShareModalClose = () => {
    setSharingModalOpen(false);
  };

  async function handleShareToClick(author) {
    console.log("SHARED TO FOLLOWER", author);
    let url = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + author.friend + "/inbox/local";
    let API = window.location.origin + `/posts/${id}`;

    let shareData = {
      author: author,
      posts: {
        [id]: {
          origin: "local",
          API: API,
          "post author": post_author,
        },
      },
      post_comments: commentsData,
      post_likes: postLikes,
      follow_requests: null,
    };

    console.log("SHARED DATA WITH CLICKED AUTHOR", shareData);

    try {
      const response = await axios.post(url, shareData, config);
      console.log("RESPONSE", response);
      console.log("DATA", response.data);
    } catch (err) {
      console.log("Error when sharing to followers inbox");
    }
    setSharingModalOpen(false);
  }

  const handleCopyLink = () => {
    const postLink = window.location.origin + `/post/${id}`; // Construct link to post based on current URL

    navigator.clipboard
      .writeText(postLink) // Copy link to clipboard
      .then(() => {
        console.log("Link copied to clipboard:", postLink);
      })
      .catch((error) => {
        console.error("Error copying link to clipboard:", error);
      });

    setShowShareOptions(false); // Close share options
  };

  const handleView = () => {
    navigate("/post/" + id);
    // navigate("/post/" + id, { state: { api: post_id } });

    window.location.reload(false);
  };

  const handleCommentSubmit = async () => {
    setIsCommenting(false); // Hide comment input field

    console.log("USER!!!", user);

    let commentsUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + id + "/postcomments";
    let authorUrl =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + user.user.user_id + "/simpleauthor";

    const authorRes = await axios
      .get(authorUrl, config)
      .then(async (authorRes) => {
        await axios
          .post(
            commentsUrl,
            {
              text: commentText,
              author: user.user.user_id,
              author_picture:
                "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com" + authorRes.data.Author.profile_picture,
              author_username: authorRes.data.Author.username,
            },
            config,
            {
              withCredentials: true,
            }
          )
          .then(() => {
            getComments();
          });
      })
      .catch((error) => {
        // Handle errors
        console.error("Error creating comment:", error);
      });
  };

  const getPostLikes = async () => {
    let likesUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + id + "/postlikes";

    const likesRes = await axios.get(likesUrl, config).then((likesRes) => {
      console.log("LIKE RES DATA", likesRes.data);
      likesRes.data["Post Likes"].map((like) => {
        console.log("INDIVIDUAL LIKE", like);
        let singleLikeUrl =
          window.location.origin + `/author/${id}` + "/postlikes";
        let nextLike = {
          [like.like_id]: {
            post: id,
            API: singleLikeUrl,
            author: like.author,
          },
        };

        setPostLikes((postLikes) => ({
          ...postLikes,
          ...nextLike,
        }));
      });
    });
  };

  const getComments = async () => {
    let commentsUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + id + "/postcomments";

    const commentsRes = await axios
      .get(commentsUrl, config)
      .then((commentsRes) => {
        //console.log("COMMENT RES DATA", commentsRes.data);
        commentsRes.data.Comments.map((comment) => {
          console.log("INDIVIDUAL COMMENT", comment);
          let singleCommentUrl =
            window.location.origin +
            `/posts/${id}` +
            `/comments/${comment.comment_id}`;
          let nextComment = {
            [comment.comment_id]: {
              origin: "local",
              API: singleCommentUrl,
              "comment author": comment.author,
            },
          };

          setCommentsData((commentsData) => ({
            ...commentsData,
            ...nextComment,
          }));
        });

        setComments(
          commentsRes.data.Comments.map((comment, index) => (
            <li className="mt-4" key={index}>
              <div className="comments">
                <div className="comment flex flex-row">
                  <div className="pfp image-container w-10 h-10 rounded-full overflow-hidden bg-black">
                    <img
                      src={comment.author_picture}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="engagement flex flex-col ml-4">
                    <div className="username">
                      <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                        {comment.author_username}
                      </span>
                    </div>
                    <div className="">
                      <span>Likes</span>
                      <span className="ml-3">{comment.likes}</span>
                    </div>
                  </div>
                  <div className="comment-container border border-black rounded-lg p-2 mb-4 w-full ml-5">
                    <div className="comment">{comment.text}</div>
                  </div>
                </div>
              </div>
            </li>
          ))
        );

        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting comments:", error);
      });
  };

  const getPostAuthor = async () => {
    let authorUrl =
      "http://127.0.0.1:8000/author/" + post_author + "/simpleauthor";

    const authorRes = await axios
      .get(authorUrl, config)
      .then((authorRes) => {
        //Result of author query
        console.log("authorRes hehehe", authorRes.data.Comments);
        setPostAuthor(authorRes.data.Author);
      })
      .catch((error) => {
        console.error("Error getting author:", error);
      });
  };

  useEffect(() => {
    //Get data on post load
    handleEditAccess();
    getComments();
    getPostAuthor();
    getPostLikes();
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
                src={"http://127.0.0.1:8000" + postAuthor.profile_picture}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="info flex flex-col w-full ml-5">
              <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                {postAuthor.username}
              </span>
              <div className="post-title flex flex-row w-full justify-between items-center">
                <span className="text-center">
                  <h1>{title}</h1>
                </span>

                {/* Post Edit Button */}
                {isEditable && (
                  <Popup
                    trigger={
                      <button
                        onClick={handleEdit}
                        className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-white rounded-full"
                      >
                        Edit
                      </button>
                    }
                    modal={true}
                    closeOnDocumentClick={false}
                  >
                    {(close) => (
                      <>
                        <EditPost
                          user={user}
                          titl={title}
                          description={description}
                          img={img}
                          img_url={img_url}
                          id={id}
                          is_private={is_private}
                          unlisted={unlisted}
                        />

                        <button
                          className="close absolute top-[.5rem] right-[.95rem]"
                          onClick={close}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </Popup>
                )}
              </div>
            </div>
          </div>

          <div className="privacy-status">
            {is_private && <span className="privacy-private">Private</span>}
            {unlisted && <span className="privacy-unlisted">Unlisted</span>}
            {!is_private && !unlisted && (
              <span className="privacy-public">Public</span>
            )}
          </div>

          <div className="description-section flex justify-center items-center">
            {content_type === "text/markdown" ?
              <p><ReactMarkdown>{description}</ReactMarkdown></p>
              :
              <p>{description}</p>
            }
          </div>
          <div className="img-section w-full h-full rounded-lg overflow-hidden">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-row justify-between mt-2">
            <div className="likes">
              <span>Likes: {likeCount}</span>
            </div>
            <button
              onClick={handleView}
              className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-lm-custom-black rounded-full view-button"
            >
              View
              <img
                src="/view-button.png"
                alt="View"
                className="view-button-img"
              />
            </button>
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
              onClick={handleButtonShare}
              className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-white rounded-full share-button"
            >
              <img
                src="/share-button.png"
                alt="Share"
                className="share-button-img"
              />
            </button>
          </div>

          {showShareOptions && (
            <div className="share-options-box">
              <button
                className="share-option-button send-post"
                onClick={handleShareModalOpen}
              >
                Send Post
              </button>
              <button
                className="share-option-button copy-link"
                onClick={handleCopyLink}
              >
                Copy Link
              </button>
            </div>
          )}

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

          <div className="comment-section flex flex-col divide-y justify-start">
            <h1>Comments</h1>
            <ul>{comments}</ul>
          </div>
        </div>
      </li>

      <Modal
        open={sharingModalOpen}
        onClose={handleShareModalClose}
        aria-labelledby="followers-modal-title"
        aria-describedby="followers-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            maxHeight: "80%",
            overflowY: "auto",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: "20px",
          }}
        >
          <h2 id="followers-modal-title" style={{ color: "#0058A2" }}>
            Share To...
          </h2>
          <ul id="followers-modal-description" className="followersList">
            {shareableAuthors.map((author, index) => (
              <li key={index}>
                <div className="image-container w-10 h-10 rounded-full overflow-hidden bg-black">
                  <img
                    src={author.friend_pfp}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="username ml-5">
                  <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                    {author.friend_username}
                  </span>
                </div>
                <button
                  className="rounded-lg text-white bg-primary-dark w-min m-4 p-2 shadow-md hover:bg-primary-color transition duration-200 ease-in"
                  onClick={() => handleShareToClick(author)}
                >
                  Share
                </button>
              </li>
            ))}
          </ul>
        </Box>
      </Modal>
    </>
  );
}
