import { useEffect, useState } from "react";
import axios from "axios";
import { unstable_useId } from "@mui/material";

export default function RemotePost({
  user,
  post_author,
  title,
  description,
  content,
  img,
  likes,
  post_id,
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

  const SC_auth = {
    auth: {
      username: 'packet_pirates',
      password: 'pass123$'
    }
  }

  const PP_auth = {
    auth: {
      username: 'packetpirates',
      password: 'cmput404'
    }
  }

  const WW_auth = {
    auth: {
      username: 'packet-pirates',
      password: '12345'
    }
  }

  const handleEdit = () => {
    // Handle edit functionality
  };
  
  //No remote DELETE like
  const handleLike = async () => {
    //TBD
  };

  const fetchCommentData = async () => {

    //Comments url
    let url = post_id + '/comments'

    //Corresponding authorization
    let auth = ''
    if (url.includes('packet-pirates')) {
      auth = PP_auth
    } else if (url.includes("super-coding")) {
      auth = SC_auth
    } else if (url.includes('web-weavers')) {
      auth = WW_auth
      url = url + '/'
    }

    try {

      axios.get(url, auth)
      
      .then((response) => {

        console.log("ZONGER", response.data)

        //Unpack response
        let postComments = []

        if (url.includes("packet-pirates")){

          postComments = response.data

        } else if (url.includes("super-coding")){

          postComments = response.data.comments

        }

        setComments(

          postComments.map((comment, index) => {
            
            return(
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
            )

          })
        );

      });

    } catch (error) {

      console.log(error)

    } 

  };

  //Not Finished -- need to determine POST format (Comment ID undetermined when request is sent)
  const handleCommentSubmit = async () => {
    
    setIsCommenting(false); // Hide comment input field

    //Inbox url
    let boxUrl = post_author.id + '/inbox'

    //Corresponding authorization
    let auth = ''
    if (boxUrl.includes('packet-pirates')) {
      auth = PP_auth
    } else if (boxUrl.includes("super-coding")) {
      auth = SC_auth
    }

    //NOT SURE YET
    let commentData = {
      type : 'comment',
      author : user,
      comment : commentText,
      contentType : "text/plain",
      published : Date.now(),
      id : post_id + uuid
    }

    //Send comment to inbox
    try {

      await axios.post(boxUrl, commentData, auth)
      .then(() => {
        //Refresh page?
        console.log("Successfully sent comment to inbox")
      })

    } catch (error) {

      console.log(error)
      
    }

  };

  const handleButtonShare = () => {
    setShowShareOptions((prev) => !prev);
  };

  const handleCopyLink = () => {
    
    navigator.clipboard.writeText(post_id) // Copy link to clipboard
      .then(() => {
        console.log('Link copied to clipboard:', post_id);
      })
      .catch((error) => {
        console.error('Error copying link to clipboard:', error);
      });
  
    setShowShareOptions(false); // Close share options
  };

  useEffect(() => {
    console.log("user", user);
    console.log("title", title);
    console.log("description", description);
    console.log("content", content);
    console.log("img", img);
    console.log("likes", likes);
    console.log("author", post_author)
    fetchCommentData()
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
    </>
  );
}
