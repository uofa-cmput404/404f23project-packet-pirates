import { useEffect, useState } from "react";
import axios from "axios";

export default function Post({
  user,
  title,
  description,
  img,
  likes,
  id
}) {

  const [comments, setComments] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [likeCount, setLikeCount] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleEdit = () => {
    // Handle edit functionality
  };

  const handleLike = () => {
    if (!hasLiked) {
        // Increment the like count and send a POST request to update it
        const newLikeCount = likeCount + 1;
        axios.post("http://127.0.0.1:8000/api/author/" + id + "/editpost", { like_count: newLikeCount }, {
            withCredentials: true,
        })
        .then((response) => {
            // Handle success
            setLikeCount(newLikeCount);
            setHasLiked(true);
        })
        .catch((error) => {
            // Handle errors
            console.error("Error updating like count:", error);
        });
    }
  };

  const handleShare = () => {
    // Handle share functionality
  };

  const handleComment = () => {
    // Handle comment functionality
  };


  useEffect(() => {
    //Get data on post load

    const getComments = async () => {

      let commentsUrl = "http://127.0.0.1:8000/api/author/" + id + "/postcomments"

      const commentsRes = await axios
      .get(commentsUrl)
      .then((commentsRes) => {

        //Result of comments query
        //console.log("COMMENTSRES", commentsRes.data.Comments)
        
        setComments(commentsRes.data.Comments.map((comment, index) => (
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
        )))

        setIsLoading(false)

      })
      .catch((error) => {
        console.error("Error getting comments:", error);
      });

    };

    getComments();

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
                src={user.profile_picture}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="info flex flex-col w-full ml-5">
              <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                {user.username}
              </span>
              <div className="post-title flex flex-row w-full justify-between items-center">
                
                <span className="text-center">
                  <h1>{title}</h1>
                </span>

                <button onClick={handleEdit} className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-white rounded-full">
                  Edit
                </button>
              </div>
            </div>
            
          </div>
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
              className={`border border-[#395B64] ${hasLiked ? 'liked-button' : 'not-liked-button'} w-fit pl-3 pr-3 text-white rounded-full`}
              disabled={hasLiked}
            >
              Like
            </button>

            <button onClick={handleComment} className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-white rounded-full">
              Comment
            </button>

            <button onClick={handleShare} className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-white rounded-full">
              Share
            </button>
          </div>

          <div className="comment-section flex flex-col divide-y justify-start">
            <h1>Comments</h1>
            <ul>
              {comments}
            </ul>
          </div>
        </div>
      </li>
    </>
  );

}
