import CreatePost from "../main-feed/CreatePost";
import GitHubTracking from "../main-feed/GitHubTracking";
import Post from "../main-feed/Posts";
import Profile from "../main-feed/Profile";
import Notifications from "../main-feed/Notifications";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from 'universal-cookie'
import SearchBar from "../main-feed/Search";

export default function MainPage({ user }) {
  const [posts, setPosts] = useState(null)
  const cookies = new Cookies();
  const [friends, setFriends] = useState()
  const [notifications, setNotifications] = useState()

  const config = {
    headers: {'Authorization': 'Token ' + localStorage.getItem('access_token')}
  };

  const getPosts = async () => {
    let postsUrl =
      "http://127.0.0.1:8000/author/" + user.user.user_id + "/feedposts";

    const postsRes = await axios
      .get(postsUrl, config)
      .then((postsRes) => {
        console.log("POSTS RES DATA POST", postsRes.data.Posts);
        setPosts(
          postsRes.data.Posts.filter((post) => !post.is_private).map((post, index) => {
              const image_conditions = post.image_url === '' && post.image_file != ''
              const image = image_conditions ? 'http://127.0.0.1:8000' + post.image_file : post.image_url

              return (
                <Post
                  key={index}
                  user={user}
                  post_author={post.author}
                  title={post.title}
                  content_type={post.content_type}
                  description={post.content}
                  img={image}
                  img_url={post.image_url}
                  likes={post.likes_count}
                  id={post.post_id}
                  is_private={post.is_private}
                  unlisted={post.unlisted}
                />
              );
            })
          );

      })
      .then(() => {})
      .catch((error) => {
        console.error("Error getting posts:", error);
      });
  };

  const getConnections = async () => {
    let connectionsUrl =
      "http://127.0.0.1:8000/author/" + user.user.user_id + "/truefriends";

    const connectionsRes = await axios
      .get(connectionsUrl, config)
      .then((connectionsRes) => {
        console.log("CONNECTSRES", connectionsRes.data);
        setFriends(
          <Profile friends={connectionsRes.data.Friends} user={user} />
        );
      })
      .catch((error) => {
        console.error("Error getting friends:", error);
      });
  };

  const getNotifications = async () => {
    let notificationsUrl =
      "http://127.0.0.1:8000/author/" +
      user.user.user_id +
      "/authornotifications";

    const notifsRes = await axios
      .get(notificationsUrl, config)
      .then((notifsRes) => {
        console.log("NOTIFSRES", notifsRes.data.Notifications);
        setNotifications(
          <Notifications notifications={notifsRes.data.Notifications} user = {user}/>
        );
      })
      .catch((error) => {
        console.error("Error getting notifications:", error);
      });
  };

  useEffect(() => {
    var token = cookies.get('access_token')
    console.log(token)

    const config = {
      headers: {Authorization: 'Token ' + localStorage.getItem('access_token')}
    };
    console.log(config)

    //Get data on homepage load
    console.log("user", user);

    getPosts();
    getConnections();
    getNotifications();
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();

    try {
      await axios.get("http://127.0.0.1:8000/logout", config);
      window.location.reload(false);
      console.log("logged out");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen">
        <div className="main w-full max-w-[70rem] flex flex-row justify-center m-7">
          <div className="left-feed-container w-[250px] block top-[20px] h-min sticky">
            <div className="profile h-fit mx-auto sticky top-[20px]">
              {friends}
            </div>
            <GitHubTracking user={user} />
          </div>
          <div className="feed flex flex-col ml-5 w-full mx-auto">
            <div className="">
              <CreatePost user={user} />
            </div>
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
    </>
  );
}
