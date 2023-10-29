import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Site from "./Site";
import Notifications from "../main-feed/Notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function MainPage({ user }) {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState(null)
  //const [friends, setFriends] = useState()
  //const [notifications, getNotifications] = useState()



  useEffect(() => {
    //Get data on homepage load
    setIsLoading(true)

    const getPosts = async () => {

      let postsUrl = "http://127.0.0.1:8000/api/author/" + user.user.user_id + "/feedposts"

      const postsRes = await axios
      .get(postsUrl)
      .then((postsRes) => {
        
        //Result of post query
        //console.log("POSTSRES", postsRes.data.Posts[0])

        setPosts(postsRes.data.Posts.map((post, index) => (
          <Post
            key={index}
            user={user}
            title={post.title}
            description={post.content}
            img={post.image_url}
            likes={post.likes_count}
            id={post.post_id}
          />
        )))

      }).then(() => { setIsLoading(false) })
      .catch((error) => {
        console.error("Error getting posts:", error);
      });

    };

    /////////// This stuff will probably have to be implemented in the respective components //////////////////////

    // const getFriends = async () => {

    //   const friendsRes = await axios
    //   .get("http://localhost:8000/api/friends")
    //   .then((friendsRes) => {
    //     console.log(friendsRes.data);

    //   })
    //   .catch((error) => {
    //     console.error("Error getting friends:", error);
    //   });

    //   setFriends(friendsRes.data)

    // };

    // const getNotifications = async () => {

    //   const notifsRes = await axios
    //   .get("http://localhost:8000/api/notifications")
    //   .then((notifsRes) => {
    //     console.log(notifsRes.data);

    //   })
    //   .catch((error) => {
    //     console.error("Error getting notifications:", error);
    //   });

    //   setFriends(notifsRes.data)

    // };

    getPosts();
    //getFriends();
    //getNotifications();

  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      await axios.get("/api/logout");
      window.location.reload(false);
      console.log("logged out");
    } 
    catch (err) {
      console.log(err);
    } 
  };

  //example of friends json
  const friends = [
    {
      username: "USERNAME1",
      pfp: "https://picsum.photos/200",
    },
    {
      username: "USERNAME2",
      pfp: "https://picsum.photos/200",
    },
    {
      username: "USERNAME3",
      pfp: "https://picsum.photos/200",
    },
    {
      username: "USERNAME4",
      pfp: "https://picsum.photos/200",
    },
    {
      username: "USERNAME5",
      pfp: "https://picsum.photos/200",
    },
  ];

  // example of notifications json
  const notifications = [
    {
      username: "USERNAME1",
      imageSrc: "https://source.unsplash.com/200x200",
      type: "Requested to follow",
    },
    {
      username: "USERNAME2",
      imageSrc: "https://source.unsplash.com/200x201",
      type: "Liked your post",
    },
    {
      username: "USERNAME3",
      imageSrc: "https://source.unsplash.com/200x202",
      type: "Commented on your post",
    },
  ];


  return (
    <>
      <div className="flex justify-center items-center w-screen">
        <div className="main w-full max-w-[70rem] flex flex-row justify-center m-7">
          <div
            className="profile h-fit mx-auto"
            style={{ position: "sticky", top: "20px" }}
          >
            <Profile friends={friends} username={user.user.username} />
          </div>
          <div className="feed flex flex-col ml-5 w-full mx-auto">
            <div className="">
              <CreatePost user={user} />
            </div>
            <div className="feed_content mt-5">
              <ul>
                {posts}
              </ul>
            </div>
          </div>
          <div className="flex-col justify-center mx-4">
            <button 
              onClick={handleLogout}
              className='block rounded-lg text-white bg-primary-dark w-3/5 mx-auto my-4 py-2 shadow-md hover:bg-primary-color transition duration-200 ease-in'>
              Logout
            </button>
            <div
              className="notifications h-fit mx-auto"
              style={{ position: "sticky", top: "20px" }}
            >
              <Notifications notifications={notifications} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
