export default function Post() {
  return (
    <>
      <div
        className="post-container flex flex-col w-full h-full bg-white border border-gray-300 p-4 rounded-lg"
        style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 0.2)" }}
      >
        <div className="user-info-section flex flex-row">
          <div className="image-container w-10 h-10 rounded-full overflow-hidden bg-black">
            <img
              src="https://picsum.photos/200"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="info flex flex-col w-full ml-5">
            <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-white rounded-full">
              USERNAME
            </span>
            <div className="post-title flex flex-row w-full justify-between items-center">
              <span className="text-center">
                <h1>TITLE OF POST</h1>
              </span>
              <span className="">Edit Button</span>
            </div>
          </div>
        </div>
        <div className="description-section flex justify-center items-center">
          THIS IS A POST
        </div>
        <div className="img-section w-full h-full rounded-lg overflow-hidden">
          <img
            src="https://picsum.photos/200"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="engagement-section flex flex-row justify-between m-5">
          {/* likes share? */}
          <div className="likes">
            {" "}
            <span className="mr-4">Like</span>
            <span className="mr-4">4</span>
          </div>
          <span className="border border-[#395B64] bg-[#395B64] w-fit pl-3 pr-3 text-white rounded-full">
            Share
          </span>
        </div>

        <div className="comment-section flex flex-col divide-y">
          <h1>Comments</h1>
          <div className="comments">
            <div className="comment">UsSr1</div>
            <div className="comment">UsSr1</div>
          </div>
        </div>
      </div>
    </>
  );
}
