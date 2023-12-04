import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import SearchBar from "../main-feed/Search";

// make use of this prob https://reactrouter.com/en/main/hooks/use-params
export default function SinglePost({ user }) {
  const { postID } = useParams();
  const [post, setPost] = useState(null);
  const [friends, setFriends] = useState(null);
  const [notifications, setNotifications] = useState(null);

  const config = {
    headers: {Authorization: 'Token ' + localStorage.getItem('access_token')}
  };

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
  
  useEffect(() => {

    const getConnections = async () => {
    // let connectionsUrl =
    //   "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" + user.user.user_id + "/truefriends";

    // const connectionsRes = await axios
    //   .get(connectionsUrl, config)
    //   .then((connectionsRes) => {
    //     console.log("CONNECTSRES", connectionsRes.data.Friends);
    //     setFriends(
    //       <Profile friends={connectionsRes.data.Friends} user={user} />
    //     );
    //   })
    //   .catch((error) => {
    //     console.error("Error getting friends:", error);
    //   });

    var url  = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/authors/" + user.user.user_id + "/followers";
    const connectionTest = await axios
    .get(url, PP_auth)
    .then((connectionRes) => {
      console.log('connectionTestRes', connectionRes.data);
      const followers = [];
      
      for (let i = 0; i < connectionRes.data.items.length; i++) { // Make foreign id the user thats logged in (packet pirates)
        // console.log("FOLOWER TESTTTT",  connectionTestRes.data.items[i]['url'] + "/followers/" + user.user.user_id)
        followers.push(connectionRes.data.items[i]['url'] + "/followers/" + user.user.user_id)
      }

      console.log(followers)
      var auth = ''
      const requests = followers.map((url) => {
        
        if (url.includes("packet-pirates")) {
          console.log("PIRATE!");
          auth = PP_auth;
        } else if (url.includes("super-coding")) {
          auth = SC_auth;
        } else if (url.includes("web-weavers")) {
          auth = WW_auth;
          url = url + "/";
        } else if (url.includes("node-net")) {
          auth = NN_auth;
        }

        return axios
          .get(url, auth)
          .then((response) => response)
          .catch((error) => console.error("Error", error))
      }
    );

      Promise.all(requests).then((responses) => {
        console.log("RESPONSES", responses)
        console.log(responses.length)
        const Friends = []
        
        for (let i = 0; i < responses.length; i++) {

          if (responses[i].data['is_follower']) { // For Web Weavers
            if (responses[i].data['is_follower'] == true) {
              let userProfile = {
                friend_username: connectionRes.data.items[i].displayName,
                friend_pfp: connectionRes.data.items[i].profileImage
              }
                console.log("friend_username", connectionRes.data.items[i].displayName)
                console.log("friend_pfp", connectionRes.data.items[i].profileImage)
              Friends.push(userProfile)
            }
          }

          if (responses[i].data == true) {
            let userProfile = {
              friend_username: connectionRes.data.items[i].displayName,
              friend_pfp: connectionRes.data.items[i].profileImage
            }
              console.log("friend_username", connectionRes.data.items[i].displayName)
              console.log("friend_pfp", connectionRes.data.items[i].profileImage)
            Friends.push(userProfile)
          }  

          console.log("FRIENDS", Friends)
          setFriends(
            <Profile friends={Friends} user={user} />
          );
        } // end for
      }); // end Promise

    }); // end Then
}; // end async

    const getNotifications = async () => {
      let notificationsUrl =
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/" +
        user.user.user_id +
        "/authornotifications";

      const notifsRes = await axios
        .get(notificationsUrl, config)
        .then((notifsRes) => {
          console.log("NOTIFSRES", notifsRes.data.Notifications);
          setNotifications(
            <Notifications notifications={notifsRes.data.Notifications} user = {user} />
          );
        })
        .catch((error) => {
          console.error("Error getting notifications:", error);
        });
    };

    const fetchPost = async () => {
      let postUrl =
        "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/" + postID + "/viewpost";

      const postRes = await axios
        .get(postUrl, config)
        .then((postRes) => {
            console.log("post data", postRes.data.post);
            console.log("postRes", postRes);

            let singlePost = postRes.data.post;
            const image_conditions = singlePost.image_url === '' && singlePost.image_file != ''
            const image = image_conditions ? 'https://packet-pirates-backend-d3f5451fdee4.herokuapp.com' + singlePost.image_file : singlePost.image_url

            setPost(
                <Post
                user={user}
                post_author={singlePost.author}
                title={singlePost.title}
                description={singlePost.content}
                img={image}
                img_url={singlePost.image_url}
                likes={singlePost.likes_count}
                id={singlePost.post_id}
                is_private={singlePost.is_private}
                unlisted={singlePost.unlisted}/>
            );
        })
        .catch((error) => {
          console.error("Error getting posts:", error);
          setPost(
            <div className="flex justify-center items-center">
              Wasn't able to find the correct post. Is the postID correct?
            </div>
          );
        });
    };

    fetchPost(); // Call the fetchPost function
    getConnections();
    getNotifications();
  }, [postID]);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      await axios.get("/logout", config);
      window.location.reload(false);
      console.log("logged out");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen">
        <div className="main w-full max-w-[70rem] flex flex-col justify-center items-center m-7">

          <div>
            <div className="flex flex-row w-full mx-auto">
              <div
                className="profile h-fit mx-auto"
                style={{ position: "sticky", top: "20px" }}
              >
                {friends}
              </div>
              <div className="feed flex flex-col ml-5 w-full min-w-[325px] mx-auto">
                <div className="feed_content">
                  <div>{post}</div>
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
