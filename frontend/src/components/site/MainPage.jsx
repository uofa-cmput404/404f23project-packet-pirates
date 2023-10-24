import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Site from "./Site";

export default function MainPage() {
  return (
    <>
      <div className="main max-w-[100rem] h-screen flex flex-row justify-center mt-5">
        <div className="profile h-fit mx-auto">
          <Profile />
        </div>
        <div className="feed flex flex-col ml-5 mx-auto">
          <div className="">
            <CreatePost />
          </div>
          <div className="feed_content mt-5">
            <Post />
          </div>
        </div>
        <div className="profile h-fit mx-auto ml-5">
          <Profile />
        </div>
      </div>
    </>
  );
}
