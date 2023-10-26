import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Site from "./Site";
import Notifications from "../main-feed/Notifications";
import axios from "axios";
import { useEffect, useState } from "react";

export default function MainPage({ user }) {

  //const [posts, setPosts] = useState([])
  //const [friends, setFriends] = useState()
  //const [notifications, getNotifications] = useState()


  // useEffect(() => {
    //Get data on homepage load

    // const getPosts = async () => {

    //   const postsRes = await axios
    //   .get("http://localhost:8000/api/posts")
    //   .then((postsRes) => {
    //     console.log(postsRes.data);

    //   })
    //   .catch((error) => {
    //     console.error("Error getting posts:", error);
    //   });

    //   console.log(postsRes.data)
    //   setPosts(postsRes.data)

    // };

    // const getFriends = async () => {

    //   const friendsRes = await axios
    //   .get("http://localhost:8000/api/friends")
    //   .then((friendsRes) => {
    //     console.log(friendsRes.data);

    //   })
    //   .catch((error) => {
    //     console.error("Error getting posts:", error);
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
    //     console.error("Error getting posts:", error);
    //   });

    //   setFriends(notifsRes.data)

    // };

    // getPosts();
    //getFriends();
    //getNotifications();

  // }, []);

  //example of posts json
  const posts = [
    {
      user: {
        username: "obama",
        pfp: "https://picsum.photos/200",
      },
      title: "TITLE OF POST",
      description: "THIS IS A POST",
      img: "https://picsum.photos/200",
      likes: 4,
      id: crypto.randomUUID(),
      comments: [
        {
          user: {
            username: "USERNAME",
            pfp: "https://picsum.photos/200",
          },
          likes: 4,
          comment: "sfdsfsdfsdfdsfsd",
        },
      ],
    },
    {
      user: {
        username: "Joe",
        pfp: "https://picsum.photos/200",
      },
      title: "Joe's Post",
      description: "This is Joe's post",
      img: "https://picsum.photos/200",
      likes: 4,
      id: crypto.randomUUID(),
      comments: [
        {
          user: {
            username: "USERNAME",
            pfp: "https://picsum.photos/200",
          },
          likes: 4,
          comment: "sfdsfsdfsdfdsfsd",
        },
      ],
    },
  ];

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
              <CreatePost />
            </div>
            <div className="feed_content mt-5">
              <ul>
                {posts.map((post) => (
                  <Post
                    user={post.user}
                    title={post.title}
                    description={post.description}
                    img={post.img}
                    likes={post.likes}
                    comments={post.comments}
                    key={post.id}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div
            className="notifications h-fit mx-auto ml-5"
            style={{ position: "sticky", top: "20px" }}
          >
            <Notifications notifications={notifications} />
          </div>
        </div>
      </div>
    </>
  );
}
