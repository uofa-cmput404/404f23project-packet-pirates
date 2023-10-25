import CreatePost from "../main-feed/CreatePost";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Site from "./Site";
import Notifications from "../main-feed/Notifications";
import axios from "axios";

export default function MainPage() {
  // should be fetched from backend

  axios.get("http://localhost:5000/api/posts").then((res) => {
    console.log(res.data);
  });

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

  return (
    <>
      <div className="main w-full max-w-[70rem] flex flex-row justify-center m-7">
        <div
          className="profile h-fit mx-auto"
          style={{ position: "sticky", top: "20px" }}
        >
          <Profile friends={friends} />
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
          <Notifications />
        </div>
      </div>
    </>
  );
}
