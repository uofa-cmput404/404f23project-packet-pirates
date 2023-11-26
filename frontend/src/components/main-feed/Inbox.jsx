import { useEffect, useState } from "react";
import { config } from "../../config";
import axios from "axios";
import RemotePost from "../../remote/RemotePosts";

export default function Inbox({ user }) {
  const [inbox, setInbox] = useState({});
  const [inboxPosts, setInboxPosts] = useState([]);
  const [showPost, setShowPost] = useState([]);
  const [postsFetched, setPostsFetched] = useState(false);

  console.log(user);

  useEffect(() => {
    getInbox();
  }, []);

  useEffect(() => {
    console.log("inbox111", inbox);
    const posts = Object.values(inbox.posts || {});
    const postComments = inbox.post_comments || {};
    const postLikes = inbox.post_likes || {};
    const followRequests = inbox.follow_requests || {};
    const notifications = inbox.notifications || [];
    const fetchPostData = async (post) => {
      try {
        console.log("FETCHING POST DATA AT URL:", post.API);
        // const response = await axios.get(post.API)
        const response = await axios
          .get(
            "http://127.0.0.1:8000/authors/5e4b8ac6-c5bb-4a4c-b671-a76300236f5d/posts/bd4f68ae-e148-4732-b3e1-9f210f2c2f4d"
          )
          .then((res) => {
            console.log("res", res.data);
            setShowPost((prev) => [
              ...prev,
              res.data.map((post, index) => {
                return (
                  <RemotePost
                    key={index}
                    user={user}
                    title={post.title}
                    description={post.description}
                    content={post.content}
                    img={post.image_url}
                    likes={post.likes_count}
                  />
                );
              }),
            ]);
          });
      } catch (error) {
        console.error("Error fetching post data:", error);
        console.log("APDIASPODIASPDIAPSDIPASOID" + post.API);
        throw error; // Rethrow the error to be caught by Promise.all
      }
    };

    posts.forEach((post) => {
      console.log("post", post);
      fetchPostData(post);
    });
    setPostsFetched(true);
    console.log("posts", posts);
    console.log("postComments", postComments);
    console.log("postLikes", postLikes);
    console.log("followRequests", followRequests);
    console.log("notifications", notifications);
    console.log("inboxPosts", inboxPosts);
  }, [inbox, postsFetched]);

  const getInbox = () => {
    console.log("getting inbox: ", user);
    axios
      .get(
        config.API_ENDPOINT + "/author/" + user.user.user_id + "/inbox/local"
      )
      .then((res) => {
        console.log("inbox", res);
        setInbox(res.data);
        console.log("inbox2", inbox);
      })
      .catch((err) => {
        console.log("error getting inbox", err);
      });
  };

  const testApi = () => {
    console.log("test");
    console.log(user);
    axios
      .get(config.NODE_NET_ENDPOINT + "authors/", {
        auth: {
          username: "Pirate",
          password: "Pirate",
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log("Request succeeded", res.data);
      })
      .catch((err) => {
        console.error("Request failed", err);
      });
    console.log("test2");

    getInbox();
  };
  return (
    <>
      <div className="container flex flex-col">
        <div className="inbox">Inbox page</div>
        <div className="sections flex flex-row justify-between">
          <div className="posts">{showPost}</div>
          <div className="other-info">
            <div className="">comments</div>
            <div className="">likes</div>
            <div className="">follow</div>
          </div>
        </div>
      </div>
    </>
  );
}
