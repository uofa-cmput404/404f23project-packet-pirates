import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { config } from "../../config";
import axios from "axios";
import RemotePost from "../../remote/RemotePosts";
import { Navigate, useNavigate } from "react-router-dom";

export default function Inbox({ user }) {
  //const [inbox, setInbox] = useState({});
  const [inboxPosts, setInboxPosts] = useState([]);
  const [showPost, setShowPost] = useState([]);
  const [postsFetched, setPostsFetched] = useState(false);
  const [inboxComments, setInboxComments] = useState([]);
  const [user_inbox, setInbox] = useState(null);
  const navigate = useNavigate();

  const SC_auth = {
    auth: {
      username: "packet_pirates",
      password: "pass123$",
    },
  };

  const PP_auth = {
    auth: {
      username: "packetpirates",
      password: "cmput404",
    },
  };

  const WW_auth = {
    auth: {
      username: "packet-pirates",
      password: "12345",
    },
  };

  const NN_auth = {
    auth: {
      username: "Pirate",
      password: "Pirate",
    },
  };

  const token = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + localStorage.getItem("access_token"),
    },
  };

  console.log(user);

  // const fetchCommentData = async () => {
  //   await axios.get("https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + user.user.user_id + "/inbox/local/comments", token)
  //   .then((res) => {
  //     console.log(res)
  //   });
  // };

  // const fetchPostData = async () => {
  //   await axios.get("https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + user.user.user_id + "/inbox/local/posts", token)
  //   .then((res) => {
  //     console.log(res)
  //   });
  // };

  // const fetchCommentData = async () => {

  // try {
  //   console.log("Sending request for comments")
  // const fetchCommentData = async (inbox) => {

  //   try {

  //     await axios

  //       .get("http://127.0.0.1:8000/author/" + user.user.user_id + "/inbox/local/comments", token)

  //       .then((res) => {

  //         console.log("TESTING COMMENTS", res)

  //         setInboxComments(res.data.map((comment, index) => {

  //           return(
  //             <li className="mt-4" key={index}>
  //               <div className="comments">
  //                 <div className="comment flex flex-row">
  //                   <div className="pfp image-container w-10 h-10 rounded-full overflow-hidden bg-black">
  //                     <img
  //                       src={comment.author.profileImage}
  //                       alt="profile"
  //                       className="w-full h-full object-cover"
  //                     />
  //                   </div>
  //                   <div className="engagement flex flex-col ml-4">
  //                     <div className="username">
  //                       <span className="border border-[#A5C9CA] bg-[#A5C9CA] w-fit pl-3 pr-3 text-black rounded-full">
  //                         {comment.author.displayName}
  //                       </span>
  //                     </div>
  //                     <div className="">
  //                       <span>Likes</span>
  //                       <span className="ml-3">{comment.likes}</span>
  //                     </div>
  //                   </div>
  //                   <div className="comment-container border border-black rounded-lg p-2 mb-4 w-full ml-5">
  //                     <div className="comment">{comment.comment}</div>
  //                   </div>
  //                 </div>
  //               </div>
  //             </li>
  //           )

  //         }));

  //       });

  //   } catch (error) {

  //     console.error("Error fetching comment data:", error);
  //     throw error; // Rethrow the error to be caught by Promise.all

  //   }

  // }

  const fetchPostData = async (inbox) => {
    let posts = Object.values(inbox.posts);

    const imageUrls = [];
    const likeUrls = [];

    //Create array of url-auth pairs again :(
    for (let id in posts) {
      //Post url
      let imUrl = posts[id]["id"] + "/image";

      //Likes url
      let likUrl = posts[id]["id"] + "/likes";

      //Corresponding authorization
      var auth = "";
      if (imUrl.includes("packet-pirates")) {
        auth = PP_auth;
      } else if (imUrl.includes("super-coding")) {
        auth = SC_auth;
      } else if (imUrl.includes("web-weavers")) {
        auth = WW_auth;
        imUrl = imUrl + "/";
        likUrl = likUrl + "/";
      } else if (imUrl.includes("node-net")) {
        auth = NN_auth;
      }

      imageUrls.push([imUrl, auth]);
      likeUrls.push([likUrl, auth]);
    }

    //Send request for each url-auth
    const imgRequests = imageUrls.map(([url, auth]) =>
      axios
        .get(url, auth)
        .then((response) => response)
        .catch((error) => console.error("Error", error))
    );

    const likRequests = likeUrls.map(([url, auth]) =>
      axios
        .get(url, auth)
        .then((response) => response)
        .catch((error) => console.error("Error", error))
    );

    Promise.all(imgRequests).then((images) => {
      Promise.all(likRequests).then((likes) => {
        setShowPost(() => [
          posts.map((res, index) => {
            let image = "";
            let num_likes = 0;

            if (res.id.includes("packet-pirates")) {
              image = images[index]["data"];
              num_likes = likes[index]["data"]["length"];
            } else if (res.id.includes("super-coding")) {
              image = images[index]["data"]["image"];
              num_likes = likes[index]["data"]["length"];
            } else if (res.id.includes("web-weavers")) {
              // Change this to the post data here
              if (res.contentType.includes("im")) {
                image = "data:" + res.contentType + "," + res.content;
              } else {
                image = "";
              }

              num_likes = likes[index]["data"]["items"]["length"];
            } else if (res.id.includes("node-net")) {
              image = "https://picsum.photos/200/300";
              num_likes = likes[index]["data"]["length"];
            }

            return (
              <RemotePost
                key={index}
                user={user}
                post_author={res.author}
                title={res.title}
                description={res.description}
                content={res.content}
                img={image}
                likes={num_likes}
                post_id={res.id}
                categories={res.categories}
                contentType={res.contentType}
                count={res.count}
                origin={res.origin}
                published={res.published}
                source={res.source}
                unlisted={res.unlisted}
                visibility={res.visibility}
              />
            );
          }),
        ]);
      });
    });
  };

  useEffect(() => {
    getInbox();
  }, [user_inbox]);

  const getInbox = async () => {
    await axios
      .get(
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" +
          user.user.user_id +
          "/inbox/local",
        token
      )
      .then((inboxRes) => {
        fetchPostData(inboxRes.data);
        // fetchCommentData(inboxRes.data)
        setInbox(inboxRes.data);
      })
      .catch((err) => {
        console.log("error getting inbox", err);
      });
  };

  const handleClear = async () => {
    
    var deleteUrl = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + user.user.user_id + "/inbox/local";

    const deleteNotifs = await axios.delete(deleteUrl, config).then(() => {
        console.log("Cleared");
        window.location.reload(false)
    })
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
      <div className="flex flex-col justify-center items-center">
        <div className="inbox text-5xl font-mono mt-5 font-bold underline">
          Inbox
        </div>
        <div className="sections flex flex-row justify-between mt-5">
          <div className="posts">
            <div className="fixed-button">
              <button
                style={{ display: "block", height: "2.5rem" }}
                className="border-gray-700 border rounded-full p-2 text-white bg-gray-700 mb-1"
                onClick={handleClear}
              >
                Clear Inbox
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "2.5rem",
                }}
                className="border-gray-700 border rounded-full p-2 text-white bg-gray-700"
                onClick={() => {
                  navigate("/");
                }}
              >
                <span>Home</span>
                <img
                  src="/home-button.png"
                  alt="Home"
                  className="Home-button-img ml-3 h-7 w-7"
                />
              </button>
            </div>
            {showPost}
          </div>
        </div>
      </div>
    </>
  );
}
