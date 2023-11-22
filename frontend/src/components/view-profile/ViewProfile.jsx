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
  const [authorInfo, setAuthorInfo] = useState(null);
  const [profileHeader, setProfileHeader] = useState(null);

  const fake_user = {
    profile_picture: "https://i.imgur.com/7bIhcuD.png",
    username: "fake_user",
  };

  useEffect(() => {
    const getUrl = "http://127.0.0.1:8000";
    setIsLoading(true);
    console.log("author", author);
    console.log("user", user);

    const getConnections = async () => {
      let connectionsUrl =
        "http://127.0.0.1:8000/api/author/" +
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
        "http://127.0.0.1:8000/api/author/" +
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
        "http://127.0.0.1:8000/api/author/" + author + "/feedposts_byusername";

      const postsRes = await axios
        .get(postsUrl)
        .then((postsRes) => {
          console.log("POSTSRES", postsRes.status);
          console.log("posts", postsRes.data.Posts);
          if (author === user.user.username) {
            setPosts(
              postsRes.data.Posts.map((post, index) => (
                <Post
                  key={index}
                  user={user}
                  post_author={post.author}
                  title={post.title}
                  description={post.content}
                  img={post.image_url}
                  likes={post.likes_count}
                  id={post.post_id}
                />
              ))
            );
          } else {
            setPosts(
              postsRes.data.Posts.filter((post) => !post.is_private) // Filter before map
                .map((post, index) => (
                  <Post
                    key={index}
                    user={user}
                    post_author={post.author}
                    title={post.title}
                    description={post.content}
                    img={post.image_url}
                    likes={post.likes_count}
                    id={post.post_id}
                  />
                ))
            );
          }
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

    const getAuthorInfo = async () => {
      let authUrl = "http://127.0.0.1:8000/api/author/" + author + "/username";

      const authRes = await axios
        .get(authUrl)
        .then((authRes) => {
          setAuthorInfo(authRes.data);
          setProfileHeader(
            <div className="top-box bg-white p-4 mb-4 text-center rounded-md flex flex-col items-center w-1/2 max-w-[70rem] top-0 border border-gray-300 shadow-md">
              {/* User's Profile Picture */}
              <img
                src={
                  "http://127.0.0.1:8000" + authRes.data.Author.profile_picture
                }
                alt={`${user.user.username}'s Profile`}
                className="w-12 h-12 rounded-full object-cover mb-4"
              />

              {/* User's Name */}
              <h2 className="text-xl font-semibold mb-2">
                {author + "'s profile"}
              </h2>

              {/* Follow Button */}
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleFollow}
              >
                Follow
              </button>
            </div>
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };

    // getProfile(); // Call the getProfile function
    fetchPosts(); // Call the fetchPosts function
    getConnections();
    getNotifications();
    getAuthorInfo();
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

  // console.log("AUTHOR INFO", authorInfo)

  const handleFollow = async (event) => {
    event.preventDefault();

    let notifsUrl =
      "http://127.0.0.1:8000/api/" + user.user.user_id + "/createnotif";

    const data = {
      author: author,
      notification_author: user.user.user_id,
      notif_author_pfp: "http://127.0.0.1:8000" + user.user.profile_picture,
      notif_author_username: user.user.username,
      message: "Requested to follow you",
      is_follow_notification: true,
      url: "",
    };

    try {
      const res = await axios.post(notifsUrl, data).then((res) => {
        console.log(res.data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen">
        <div className="main w-full max-w-[70rem] flex flex-col justify-center items-center m-7">
          {/* Spacer to push down content
          <div className="invisible h-16"></div> */}

          {/* Visible Box at the Top */}
          {profileHeader}

          <div>
            {/* Profile Header Section */}
            {profile && (
              <div className="profile-header mt-4 p-4 border border-gray-300 rounded-md text-center">
                <img
                  src={profile.profile_picture}
                  alt={`${profile.username}'s Profile`}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
                <h2 className="text-xl font-semibold">{profile.username}</h2>
                {/* Add more details about the profile here if needed */}
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
                  Follow
                </button>
              </div>
            )}

            <div className="flex flex-row w-full mx-auto">
              <div
                className="profile h-fit mx-auto"
                style={{ position: "sticky", top: "20px" }}
              >
                {friends}
              </div>
              <div className="feed flex flex-col ml-5 w-full mx-auto">
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
        </div>
      </div>
    </>
  );
}
