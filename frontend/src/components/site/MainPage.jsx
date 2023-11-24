import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Site from "./Site";
import Notifications from "../main-feed/Notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import SearchBar from "../main-feed/Search";

export default function MainPage({ user }) {
  const navigate = useNavigate();

  const [posts, setPosts] = useState(null);
  const [friends, setFriends] = useState();
  const [notifications, setNotifications] = useState();

  const getPosts = async () => {
    let postsUrl =
      "http://127.0.0.1:8000/api/author/" + user.user.user_id + "/feedposts";

    const postsRes = await axios
      .get(postsUrl)
      .then((postsRes) => {
        //Result of post query
        console.log("POSTSRES_fomr", postsRes.data.Posts[0]);

        setPosts(
          postsRes.data.Posts.map((post, index) => {
              const image_conditions = post.image_url === null && post.image_file != null
              // console.log("TESTING", image_conditions)
              const image = image_conditions ? 'http://127.0.0.1:8000' + post.image_file : post.image_url
              // console.log("IMAGE", image)
              return (
                <Post
                  key={index}
                  user={user}
                  post_author={post.author}
                  title={post.title}
                  description={post.content}
                  img={image}
                  img_url={post.image_url}
                  likes={post.likes_count}
                  id={post.post_id}
                />
              );
            })
          );
        

      })
      .then(() => {})
      .catch((error) => {
        console.error("Error getting posts:", error);
      });
  };
  console.log("user", user);
  const getConnections = async () => {
    let connectionsUrl =
      "http://127.0.0.1:8000/api/author/" + user.user.user_id + "/truefriends";

    const connectionsRes = await axios
      .get(connectionsUrl)
      .then((connectionsRes) => {
        console.log("CONNECTSRES", connectionsRes.data);
        setFriends(
          <Profile friends={connectionsRes.data.Friends} user={user} />
        );
      })
      .catch((error) => {
        console.error("Error getting friends:", error);
      });
  };

  const getNotifications = async () => {
    let notificationsUrl =
      "http://127.0.0.1:8000/api/author/" +
      user.user.user_id +
      "/authornotifications";

    const notifsRes = await axios
      .get(notificationsUrl)
      .then((notifsRes) => {
        console.log("NOTIFSRES", notifsRes.data.Notifications);
        setNotifications(
          <Notifications notifications={notifsRes.data.Notifications} user = {user}/>
        );
      })
      .catch((error) => {
        console.error("Error getting notifications:", error);
      });
  };

  useEffect(() => {
    //Get data on homepage load
    console.log("user", user);

    getPosts();
    getConnections();
    getNotifications();
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      await axios.get("/api/logout");
      window.location.reload(false);
      console.log("logged out");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen">
        <div className="main w-full max-w-[70rem] flex flex-row justify-center m-7">
          <div
            className="profile h-fit mx-auto"
            style={{ position: "sticky", top: "20px" }}
          >
            {friends}
          </div>
          <div className="feed flex flex-col ml-5 w-full mx-auto">
            <div className="">
              <CreatePost user={user} />
            </div>
            <div className="feed_content mt-5">
              <ul>{posts}</ul>
            </div>
          </div>

          <div className="flex-col justify-center mx-4">
            <div className="search-bar">
              <SearchBar />
            </div>
            <div
              className="notifications h-fit mx-auto"
              style={{ position: "sticky", top: "20px" }}
            >
              {notifications}
            </div>
            <button
              onClick={handleLogout}
              className="sticky top-[270px] block rounded-lg text-white bg-primary-dark w-3/5 mx-auto my-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
