import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import EditPost from "../components/main-feed/EditPost";
import Popup from "reactjs-popup";
import {
  Avatar,
  Button,
  IconButton,
  RadioGroup,
  Modal,
  Box,
  unstable_useId,
} from "@mui/material";

export default function RemotePost({
  user,
  post_author,
  title,
  description,
  content,
  img,
  likes,
  post_id,
  categories,
  contentType,
  count,
  origin,
  published,
  source,
  unlisted,
  visibility,
}) {
  const [comments, setComments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postAuthor, setPostAuthor] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [sharingModalOpen, setSharingModalOpen] = useState(false);
  const [shareableAuthors, setShareableAuthors] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();

  const config = {
    headers: { Authorization: "Token " + localStorage.getItem("access_token") },
  };

  const SC_auth = {
    auth: {
      username: "packet_pirates",
      password: "pass123$",
    },
  };

  const PP_auth = {
    auth: {
      username: "packetpirates",
      password: "cmput404",
    },
  };

  const WW_auth = {
    auth: {
      username: "packet-pirates",
      password: "12345",
    },
  };

  const NN_auth = {
    auth: {
      username: "Pirate",
      password: "Pirate",
    },
  };

  var auth = "";

  if (post_id.includes("packet-pirates")) {
    auth = PP_auth;
  } else if (post_id.includes("super-coding")) {
    auth = SC_auth;
  } else if (post_id.includes("web-weavers")) {
    auth = WW_auth;
    // post_id = post_id + "/";
  } else if (post_id.includes("node-net")) {
    auth = NN_auth;
  }

  const handleLikeLocal = async () => {
    const newLikeState = !hasLiked;

    // Calculate the new like count based on the like state
    const newLikeCount = newLikeState ? likeCount + 1 : likeCount - 1;

    // Update the like status
    setLikeCount(newLikeCount);
    setHasLiked(newLikeState);

    const post_uuid = post_id.split("/")[6];

    try {
      if (newLikeState) {
        // If liking, make a POST request to add a like
        await axios.post(
          "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" +
            post_uuid +
            "/postlikes",
          {
            post_object_id: post_uuid,
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
          "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" +
            post_uuid +
            "/postlikes",
          {
            data: {
              post_object_id: post_uuid,
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

  const handleLikeRemote = async () => {
    if (!hasLiked) {
      const newLikeState = !hasLiked;

      // Calculate the new like count based on the like state
      const newLikeCount = newLikeState ? likeCount + 1 : likeCount - 1;

      // Update the like status
      setLikeCount(newLikeCount);
      setHasLiked(newLikeState);

      //Inbox url
      let boxUrl = post_author.id + "/inbox";

      //Author url (Creating like)
      let authUrl =
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" +
        user.user.user_id;

      //Corresponding authorization
      var auth = "";
      if (boxUrl.includes("packet-pirates")) {
        auth = PP_auth;
      } else if (boxUrl.includes("super-coding")) {
        auth = SC_auth;
      } else if (boxUrl.includes("web-weavers")) {
        auth = WW_auth;
        boxUrl = boxUrl + "/";
      } else if (boxUrl.includes("node-net")) {
        auth = NN_auth;
      }

      //Get author, send comment to inbox
      try {
        await axios.get(authUrl, PP_auth).then(async (authorResponse) => {
          //NOT SURE YET
          let likeData = {
            context: "",
            type: "Like",
            author: authorResponse.data,
            summary: user.user.username + " likes your post",
            object: post_id,
          };

          if (boxUrl.includes("web-weavers")) {
            likeData = {
              context: "",
              type: "Like",
              author: authorResponse.data.id,
              summary: user.user.username + " likes your post",
              object: post_id,
            };
          }

          await axios.post(boxUrl, likeData, auth).then(() => {
            console.log("Like sent to inbox");
          });
        });
      } catch (error) {
        console.log(error);

        // Revert changes
        setLikeCount(likeCount); // Reset like count
        setHasLiked(!hasLiked); // Toggle like state back
      }
    }
  };

  //Unimplemented
  const handleEdit = async () => {};

  const fetchCommentData = async () => {
    //Comments url
    let url = post_id + "/comments";

    try {
      axios
        .get(url, auth)

        .then((response) => {

          //Unpack response
          let postComments = [];

          if (url.includes("packet-pirates")) {
            postComments = response.data;
          } else if (url.includes("super-coding")) {
            postComments = response.data.comments;
          } else if (url.includes("web-weavers")) {
            postComments = response.data.items;
          }
          // } else if (url.includes("node-net")) {

          // }

          setComments(
            postComments.map((comment, index) => {
              return (
                <li className="mt-4" key={index}>
                  <div className="comments">
                    <div className="comment flex flex-row">
                      <div className="pfp image-container w-10 h-10 rounded-full overflow-hidden bg-black">
                        <img
                          src={comment.author.profileImage}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="engagement flex flex-col ml-4">
                        <div className="username">
                          <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                            {comment.author.displayName}
                          </span>
                        </div>
                        <div className="">
                          <span>Likes</span>
                          <span className="ml-3">{comment.likes}</span>
                        </div>
                      </div>
                      <div className="comment-container border border-black rounded-lg p-2 mb-4 w-full ml-5">
                        <div className="comment">{comment.comment}</div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async () => {
    setIsCommenting(false); // Hide comment input field

    //Inbox url
    let boxUrl = post_author.id + "/inbox";

    //Author url (Creating comment)
    let authUrl =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" +
      user.user.user_id;

    //Corresponding authorization
    let auth = "";
    if (boxUrl.includes("packet-pirates")) {
      auth = PP_auth;
    } else if (boxUrl.includes("super-coding")) {
      auth = SC_auth;
    } else if (boxUrl.includes("web-weavers")) {
      boxUrl = boxUrl + "/";
      auth = WW_auth;
    } else if (boxUrl.includes("node-net")) {
      auth = NN_auth;
    }

    //Get author, send comment to inbox
    try {
      await axios.get(authUrl, PP_auth).then(async (authorResponse) => {
        //NOT SURE YET
        var commentData = {
          type: "comment",
          author: authorResponse.data,
          comment: commentText,
          contentType: "text/plain",
          published: ":)",
          id: post_id,
        };

        if (boxUrl.includes("web-weavers")) {
          // They need to handle comments differently
          commentData = {
            type: "comment",
            author: authorResponse.data.id,
            comment: commentText,
            contentType: "text/plain",
            id: post_id,
          };
          var commentUrl = post_id + "/comments/";

          await axios.post(commentUrl, commentData, auth).then((response) => {
            var commentData2 = {
              id: response.data.id,
              type: "comment",
            };

            axios.post(boxUrl, commentData2, auth).then(() => {
              fetchCommentData();
            });
          });
        } else {
          await axios.post(boxUrl, commentData, auth).then(() => {
            fetchCommentData();
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Show/hide share options
  const handleButtonShare = () => {
    setShowShareOptions((prev) => !prev);
  };

  //Copy to clipboard
  const handleCopyLink = () => {
    // post_id is the endpoint to get the post
    var id = post_id;
    var id = post_id.split("/").pop();
    // the id of the post, used as the last part of url

    var post_link =
      "https://packet-pirates-frontend-46271456b73c.herokuapp.com/post/" + id;

    navigator.clipboard
      .writeText(post_link) // Copy link to clipboard
      .then(() => {
        console.log("Link copied to clipboard:", post_link);
      })
      .catch((error) => {
        console.error("Error copying link to clipboard:", error);
      });

    setShowShareOptions(false); // Close share options
  };

  //Open "share to" popup (This does not work with remote friends)
  const handleShareModalOpen = async () => {
    setSharingModalOpen(true);

    // do request to retrieve all your followers
    // this will be those you can directly dm to their inbox
    // ** double check though **
    let followersUrl =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" +
      user.user.user_id +
      "/followers";

    try {
      const response = await axios.get(followersUrl, PP_auth);
      setShareableAuthors(response.data["items"]);
    } catch (err) {
      // Handle err
      console.log("Oh no, an error", err);
    }
  };

  //Close "share to" popup
  const handleShareModalClose = () => {
    setSharingModalOpen(false);
  };

  //Share to specified author
  async function handleShareToClick(author) {
    //Inbox url
    let boxUrl = author.id + "/inbox";
    //Author url (Sending post)
    let authUrl =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" +
      user.user.user_id;

    if (boxUrl.includes("packet-pirates")) {
      auth = PP_auth;
    } else if (boxUrl.includes("super-coding")) {
      auth = SC_auth;
    } else if (boxUrl.includes("web-weavers")) {
      auth = WW_auth;
      boxUrl = boxUrl + "/";
    } else if (boxUrl.includes("node-net")) {
      auth = NN_auth;
    }

    try {
      await axios.get(authUrl, PP_auth).then(async (authorResponse) => {
        //NOT SURE YET
        let postData = {
          type: "post",
          title: title,
          id: post_id,
          source: source,
          origin: origin,
          description: description,
          contentType: contentType,
          content: content,
          author: post_author,
          categories: categories,
          comments: "",
          published: published,
          visibility: visibility,
          unlisted: unlisted,
          sent_by: authorResponse.data,
        };

        //Corresponding authorization

        await axios.post(boxUrl, postData, auth).then(() => {
          setSharingModalOpen(false);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleView = () => {
    // post_id is the endpoint to get the post
    var id = post_id;
    var id = post_id.split("/").pop();
    // the id of the post, used as the last part of url
    navigate("/post/" + id, { state: { api: post_id } });
    window.location.reload(false);
  };

  async function checkLikeStatus() {
    //Likes url
    let likUrl = post_id + "/likes";

    //Corresponding authorization
    let auth = "";
    if (post_id.includes("packet-pirates")) {
      auth = PP_auth;
    } else if (post_id.includes("super-coding")) {
      auth = SC_auth;
    } else if (post_id.includes("web-weavers")) {
      auth = WW_auth;
      likUrl = likUrl + "/";
    } else if (post_id.includes("node-net")) {
      auth = NN_auth;
    }

    await axios.get(likUrl, auth).then((likeResponse) => {
      let likesList = [];

      if (post_id.includes("web-weavers")) {
        likesList = likeResponse["data"]["items"];
      } else {
        likesList = likeResponse["data"];
      }

      for (let like in likesList) {
        if (
          likesList[like]["author"]["id"].split("/")[4] === user.user.user_id
        ) {
          setHasLiked(true);
        }
      }
    });
  }

  const handleEditAccess = () => {
    //Check if user is viewing own profile

    let profPath = "user/" + user.user.username;

    try {
      if (!window.location.href.includes(profPath)) {
        return;
      }

      if (!(user.user.user_id == post_author["id"].split("/")[4])) {
        return;
      }

      setIsEditable(true);
    } catch {
      console.log("Error has occured");
    }
  };

  useEffect(() => {
    fetchCommentData();
    checkLikeStatus();
    handleEditAccess();
  }, []);
  return (
    <>
      <li className="list-none mb-5 min-w-[620px] max-w-[620px]">
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
                          img_url=""
                          id={post_id.split("/")[6]}
                          visibility={visibility}
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
            {unlisted && <span className="privacy-unlisted">Unlisted</span>}
            {visibility === "PUBLIC" && !unlisted && (
              <span className="privacy-private">Public</span>
            )}
            {visibility === "FRIENDS" && !unlisted && (
              <span className="privacy-private">Friend</span>
            )}
            {visibility === "PRIVATE" && !unlisted && (
              <span className="privacy-private">Private</span>
            )}
          </div>

          <div className="description-section flex justify-center items-center preserve-newline">
            {contentType === "text/markdown" ? (
              <p>
                <ReactMarkdown>{description}</ReactMarkdown>
              </p>
            ) : (
              <p>{description}</p>
            )}
          </div>

          <div className="img-section w-full h-full rounded-lg overflow-hidden">
            {img !== "" && (
              <img src={img} alt="" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="likes">
            <span>Likes: {likeCount}</span>
          </div>

          <div className="engagement-section flex flex-row justify-between m-5">
            <button
              onClick={
                post_id.includes("packet-pirates")
                  ? handleLikeLocal
                  : handleLikeRemote
              }
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
              {post_id.includes("packet-pirates") ? (
                <button
                  className="share-option-button copy-link"
                  onClick={handleCopyLink}
                >
                  Copy Link
                </button>
              ) : (
                true
              )}
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

          <div className="flex flex-row justify-between mt-2">
            {/* <div className="likes">
              <span>Likes: {likeCount}</span>
            </div> */}
            {post_id.includes("packet-pirates") ? (
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
            ) : (
              true
            )}
          </div>

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
                    src={author.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="username ml-5">
                  <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                    {author.displayName}
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
