import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, Button, IconButton, RadioGroup, Modal, Box, unstable_useId } from "@mui/material";

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
  const navigate = useNavigate();

  const config = {
    headers: {Authorization: 'Token ' + localStorage.getItem('access_token')}
  };

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


  
  //No remote DELETE like
  const handleLike = async () => {
    //TBD
  };

  //Unimplemented
  const handleEdit = async () => {

  }

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

    //Author url (Creating comment)
    let authUrl = 'https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/' + user.user.user_id

    //Corresponding authorization
    let auth = ''
    if (boxUrl.includes('packet-pirates')) {
      auth = PP_auth
    } else if (boxUrl.includes("super-coding")) {
      auth = SC_auth
    } else if (boxUrl.includes('web-weavers')) {
      auth = WW_auth
    }

    //Get author, send comment to inbox
    try {

      await axios.get(authUrl, auth)
      .then(async (authorResponse) => {

        //NOT SURE YET
        let commentData = {
          type : 'comment',
          author : authorResponse.data,
          comment : commentText,
          contentType : "text/plain",
          published : ":)",
          id : post_id
        }

        await axios.post(boxUrl, commentData, auth)
        .then(() => {

          fetchCommentData()
          console.log("Successfully sent comment to inbox")

        })

      })

    } catch (error) {

      console.log(error)
      
    }

  };

  //Show/hide share options
  const handleButtonShare = () => {
    setShowShareOptions((prev) => !prev);
  };

  //Copy to clipboard
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

  //Open "share to" popup (This does not work with remote friends)
  const handleShareModalOpen = async () => {
    setSharingModalOpen(true);

    // do request to retrieve all your followers
    // this will be those you can directly dm to their inbox
    // ** double check though **
    let followersUrl = 'https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/' + user.user.user_id + '/followers'

    try {
      const response = await axios.get(followersUrl, PP_auth);
      console.log(response)
      setShareableAuthors(response.data["items"]);
    }
    catch(err) { // Handle err
      console.log("Oh no, an error", err);
    }
  };

  //Close "share to" popup
  const handleShareModalClose = () => {
    setSharingModalOpen(false);
  };

  //Share to specified author
  async function handleShareToClick( author ) {
    
    //Inbox url 
    let boxUrl = author.id + '/inbox'
    console.log("BOX URL", boxUrl)
    //Author url (Sending post)
    let authUrl = 'https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/' + user.user.user_id

    let auth = PP_auth
    //Get author, send post to inbox
    
    try {

      await axios.get(authUrl, auth)
      .then(async (authorResponse) => {

        //NOT SURE YET
        let postData = {
          type : 'post',
          title : title,
          id : post_id,
          source : source,
          origin : origin,
          description : description,
          contentType: contentType,
          content : content,
          author : post_author,
          categories : categories,
          comments : '',
          published : published,
          visibility : visibility,
          unlisted : unlisted,
          sent_by : authorResponse.data
        }

        console.log("TEsting sending post", postData)

        //Corresponding authorization
        if (boxUrl.includes('packet-pirates')) {
          auth = PP_auth
        } else if (boxUrl.includes("super-coding")) {
          auth = SC_auth
        } else if (boxUrl.includes('web-weavers')) {
          auth = WW_auth
          boxUrl = boxUrl + "/"
        }
        
        console.log("BOX URL", boxUrl)
        console.log("AUTH FOR POSTING", auth)
        await axios.post(boxUrl, postData, auth)
        .then(() => {
          console.log("POSTED")
          setSharingModalOpen(false);
          console.log("Successfully sent post to inbox")

        })

      })

    } catch (error) {

      console.log(error)
      
    }

  }

  const handleView = () => {
    console.log(post_id)
    navigate("/post/" + post_id);
    window.location.reload(false);
  }

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

      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        maxHeight: '80%',
        overflowY: 'auto',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: '20px',
      }}>

        <h2 id="followers-modal-title" style={{ color: '#0058A2' }}>Share To...</h2>
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
