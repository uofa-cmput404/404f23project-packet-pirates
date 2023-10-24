export default function Post({
  user,
  title,
  description,
  img,
  likes,
  comments,
}) {
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
                src={user.pfp}
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
                <span className="">Edit Button</span>
              </div>
            </div>
          </div>
          <div className="description-section flex justify-center items-center">
            <p>{description}</p>
          </div>
          <div className="img-section w-full h-full rounded-lg overflow-hidden">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="engagement-section flex flex-row justify-between m-5">
            {/* likes share? */}
            <div className="likes">
              {" "}
              <span className="mr-4">Like</span>
              <span className="mr-4">{likes}</span>
            </div>
            <span className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-white rounded-full">
              Share
            </span>
          </div>

          <div className="comment-section flex flex-col divide-y justify-start">
            <h1>Comments</h1>
            <ul>
              {comments.map((comment, index) => (
                <li className="mt-4" key={index}>
                  <div className="comments">
                    <div className="comment flex flex-row">
                      <div className="pfp image-container w-10 h-10 rounded-full overflow-hidden bg-black">
                        <img
                          src={comment.user.pfp}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="engagement flex flex-col ml-4">
                        <div className="username">
                          <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                            {comment.user.username}
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
              ))}
            </ul>
          </div>
        </div>
      </li>
    </>
  );
}
