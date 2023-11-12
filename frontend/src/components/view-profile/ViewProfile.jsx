import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

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
              username={user.user.username}
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
  //example of friends json
  // const friends = [
  //   {
  //     username: "USERNAME1",
  //     pfp: "https://picsum.photos/200",
  //   },
  //   {
  //     username: "USERNAME2",
  //     pfp: "https://picsum.photos/200",
  //   },
  //   {
  //     username: "USERNAME3",
  //     pfp: "https://picsum.photos/200",
  //   },
  //   {
  //     username: "USERNAME4",
  //     pfp: "https://picsum.photos/200",
  //   },
  //   {
  //     username: "USERNAME5",
  //     pfp: "https://picsum.photos/200",
  //   },
  // ];

  // example of notifications json
  // const notifications = [
  //   {
  //     username: "USERNAME1",
  //     imageSrc: "https://source.unsplash.com/200x200",
  //     type: "Requested to follow",
  //   },
  //   {
  //     username: "USERNAME2",
  //     imageSrc: "https://source.unsplash.com/200x201",
  //     type: "Liked your post",
  //   },
  //   {
  //     username: "USERNAME3",
  //     imageSrc: "https://source.unsplash.com/200x202",
  //     type: "Commented on your post",
  //   },
  // ];

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
          <div
            className="notifications h-fit mx-auto ml-5"
            style={{ position: "sticky", top: "20px" }}
          >
            {/* <Notifications notifications={notifications} /> */}
            {notifications}
          </div>
        </div>
      </div>
    </>
  );
}
