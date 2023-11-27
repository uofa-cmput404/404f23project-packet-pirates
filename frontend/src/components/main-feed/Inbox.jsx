import { useEffect, useState } from "react";
import { config } from "../../config";
import axios from "axios";
import RemotePost from "../../remote/RemotePosts";

export default function Inbox({ user }) {
  const [inbox, setInbox] = useState({});
  const [inboxPosts, setInboxPosts] = useState([]);
  const [showPost, setShowPost] = useState([]);
  const [postsFetched, setPostsFetched] = useState(false);

  const [inboxComments, setInboxComments] = useState([])

  const token = {
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Token ' + localStorage.getItem('access_token'),
    }
  };

  console.log(user);

  const fetchCommentData = async () => {

    try {

      await axios
        
        .get("https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + user.user.user_id + "/inbox/local/comments", token)

        .then((res) => {

          console.log("TESTING COMMENTS", res)

          setInboxComments(res.data.map((comment, index) => {

            return(
              <li className="mt-4" key={index}>
                <div className="comments">
                  <div className="comment flex flex-row">
                    <div className="pfp image-container w-10 h-10 rounded-full overflow-hidden bg-black">
                      <img
                        src={comment.author.profileImage}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="engagement flex flex-col ml-4">
                      <div className="username">
                        <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
                          {comment.author.displayName}
                        </span>
                      </div>
                      <div className="">
                        <span>Likes</span>
                        <span className="ml-3">{comment.likes}</span>
                      </div>
                    </div>
                    <div className="comment-container border border-black rounded-lg p-2 mb-4 w-full ml-5">
                      <div className="comment">{comment.comment}</div>
                    </div>
                  </div>
                </div>
              </li>
            )

          }));

        });

    } catch (error) {

      console.error("Error fetching comment data:", error);
      throw error; // Rethrow the error to be caught by Promise.all

    }

  }

  const fetchPostData = async () => {

    try {
      // console.log("FETCHING POST DATA AT URL:", post.API);
      // const response = await axios.get(post.API)
      await axios
        .get(
          "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + user.user.user_id + "/inbox/local/posts", token
        )

        .then((res) => {
          console.log("res", res);

          setShowPost(() => [
            res.data.map((post, index) => {
              return (
                <RemotePost
                  key={index}
                  user={user}
                  post_author={post.author}
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

      throw error; // Rethrow the error to be caught by Promise.all

    }
  };

  useEffect(() => {
    getInbox();
  }, []);

  useEffect(() => {

    //console.log("inbox111", inbox);
    //const posts = Object.values(inbox.posts || {});
    //const postComments = inbox.post_comments || {};
    //const postLikes = inbox.post_likes || {};
    //const followRequests = inbox.follow_requests || {};
    //const notifications = inbox.notifications || [];

    //console.log("posts", posts);
    //console.log("postComments", postComments);
    //console.log("postLikes", postLikes);
    //console.log("followRequests", followRequests);
    //console.log("notifications", notifications);
    //console.log("inboxPosts", inboxPosts);

    fetchPostData()
    fetchCommentData()
    setPostsFetched(true);

  }, [inbox]);

  const getInbox = async () => {

    console.log("getting inbox: ", user);

    await axios
      .get(
        config.API_ENDPOINT + "author/" + user.user.user_id + "/inbox/local", token
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

  // const testApi = () => {
  //   console.log("test");
  //   console.log(user);
  //   axios
  //     .get(config.NODE_NET_ENDPOINT + "authors/", {
  //       auth: {
  //         username: "Pirate",
  //         password: "Pirate",
  //       },
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       console.log("Request succeeded", res.data);
  //     })
  //     .catch((err) => {
  //       console.error("Request failed", err);
  //     });
  //   console.log("test2");

  //   getInbox();
  // };

  return (
    <>
      <div className="container flex flex-col">
        <div className="inbox">Inbox page</div>
        <div className="sections flex flex-row justify-between">
          <div className="posts">{showPost}</div>
          <div className="other-info">
            <div className="">{inboxComments}</div>
            
          </div>
        </div>
      </div>
    </>
  );
}
