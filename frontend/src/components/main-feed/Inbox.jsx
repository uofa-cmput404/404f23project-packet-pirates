import { useEffect, useState } from "react";
import { config } from "../../config";
import axios from "axios";
import RemotePost from "../../remote/RemotePosts";

export default function Inbox({ user }) {
  const [inbox, setInbox] = useState({});
  const [inboxPosts, setInboxPosts] = useState([]);

  console.log(user);

  useEffect(() => {
    getInbox();
    // console.log("inbox111", inbox);
  }, []);

  useEffect(() => {
    console.log("inbox111", inbox);
    const posts = Object.values(inbox.posts || {});
    const postComments = inbox.post_comments || {};
    const postLikes = inbox.post_likes || {};
    const followRequests = inbox.follow_requests || {};
    const notifications = inbox.notifications || [];

    // {
    //   posts.map((post) => {
    //     console.log("post", post);
    //     console.log("postasdasdasdasdsads", post.API);
    //     setInboxPosts((inboxPosts) => [...inboxPosts, post]);
    //   });
    // }
    const fetchPostData = async (post) => {
      try {
        console.log("FETCHING POST DATA AT URL:", post.API);
        // const response = await axios.get(post.API);
        const response = await axios.get(
          "http://127.0.0.1:8000/api/authors/5e4b8ac6-c5bb-4a4c-b671-a76300236f5d/posts/bd4f68ae-e148-4732-b3e1-9f210f2c2f4d"
        );

        const postData = response.data; // Adjust this based on the structure of your API response
        setInboxPosts((prevPosts) => [...prevPosts, postData]);
      } catch (error) {
        console.error("Error fetching post data:", error);
        console.log("APDIASPODIASPDIAPSDIPASOID" + post.API);
      }
    };

    posts.forEach((post) => {
      fetchPostData(post);
    });

    console.log("posts", posts);
    console.log("postComments", postComments);
    console.log("postLikes", postLikes);
    console.log("followRequests", followRequests);
    console.log("notifications", notifications);
    console.log("inboxPosts", inboxPosts);
  }, [inbox]); // Add inbox as a dependency

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

  const getInbox = () => {
    console.log("getting inbox: ", user);
    axios
      .get(
        config.API_ENDPOINT + "api/author/" + user.user.user_id + "/inbox/local"
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

  return (
    <>
      <div className="container flex flex-row">
        <div className="inbox">Inbox page</div>
        <div className="sections flex flex-col">
          {/* this is where the psots will be */}
          <div className="posts">
            {inboxPosts.map((post, index) => (
              <RemotePost
                key={index}
                user={user}
                title={post.title}
                description={post.description}
                content={post.content}
                img={post.image_url}
                likes={post.likes_count}
              />
            ))}
          </div>
          <div className="other-info"></div>
        </div>
      </div>
    </>
  );
}
