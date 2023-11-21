import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchBar from "../main-feed/Search";

// make use of this prob https://reactrouter.com/en/main/hooks/use-params
export default function ViewProfile({ user }) {
  useEffect(() => {
    console.log("user", user);
    console.log("user.user", user.user);
  }, []);
  // check if author exists
  // if not, return 404
  // if yes, return profile
  const { author } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postauthor, setPostauthor] = useState(null);
  const [friends, setFriends] = useState(null);
  const [notifications, setNotifications] = useState(null);

  const fake_user = {
    profile_picture: "https://i.imgur.com/7bIhcuD.png",
    username: "fake_user",
  };

  useEffect(() => {
    const getUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com";
    setIsLoading(true);
    console.log("author", author);
    console.log("user", user);

    const getConnections = async () => {
      let connectionsUrl =
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/author/" +
        user.user.user_id +
        "/truefriends";
      const connectionsRes = await axios
        .get(connectionsUrl)
        .then((connectionsRes) => {
          console.log("CONNECTSRES", connectionsRes.data);
          setFriends(
            <Profile
              friends={connectionsRes.data.Friends}
              // username={user.user.username}
              user={user}
            />
          );
        })
        .catch((error) => {
          console.error("Error getting friends:", error);
        });
    };

    const getProfile = async () => {
      try {
        const profileUrl = `${getUrl}/user/${author}`;
        const profileRes = await axios.get(profileUrl);
        setProfile(profileRes.data);
      } catch (error) {
        console.error("Error getting profile:", error);
      }
    };

    const getNotifications = async () => {
      let notificationsUrl =
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/author/" +
        user.user.user_id +
        "/authornotifications";

      const notifsRes = await axios
        .get(notificationsUrl)
        .then((notifsRes) => {
          console.log("NOTIFSRES", notifsRes.data.Notifications);
          setNotifications(
            <Notifications notifications={notifsRes.data.Notifications} />
          );
        })
        .catch((error) => {
          console.error("Error getting notifications:", error);
        });
    };

    const fetchPosts = async () => {
      let postsUrl =
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/author/" + author + "/feedposts_byusername";

      const postsRes = await axios
        .get(postsUrl)
        .then((postsRes) => {
          //Result of post query
          // console.log("POSTSRES", postsRes.data.Posts[0]);
          // console.log("POSTSRES_FULL", postsRes.data.Posts);
          console.log("POSTSRES", postsRes.status);
          setPosts(
            postsRes.data.Posts.map((post, index) => (
              <Post
                key={index}
                user={fake_user}
                title={post.title}
                description={post.content}
                img={post.image_url}
                likes={post.likes_count}
                id={post.post_id}
              />
            ))
          );
        })
        .catch((error) => {
          console.error("Error getting posts:", error);
          setPosts(
            <div className="flex justify-center items-center">
              This user does not exists, did you enter the correct username?
            </div>
          );
        });
    };

    // getProfile(); // Call the getProfile function
    fetchPosts(); // Call the fetchPosts function
    getConnections();
    getNotifications();
    console.log("posts", posts);
  }, [author]);

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
            {/* <Profile friends={friends} username={user.user.username} /> */}
            {friends}
          </div>
          <div className="feed flex flex-col ml-5 w-full mx-auto">
            <div className="flex items-center justify-center">
              You are looking at {author}'s profile
            </div>
            <div className="feed_content mt-5">
              <ul>{posts}</ul>
            </div>
          </div>
          {/* <div
            className="notifications h-fit mx-auto ml-5"
            style={{ position: "sticky", top: "20px" }}
          >
            {notifications}
          </div> */}
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
