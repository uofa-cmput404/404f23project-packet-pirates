import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { config } from "../../config";
import axios from "axios";
import RemotePost from "../../remote/RemotePosts";

export default function Inbox({ user }) {
  //const [inbox, setInbox] = useState({});
  const [inboxPosts, setInboxPosts] = useState([]);
  const [showPost, setShowPost] = useState([]);
  const [postsFetched, setPostsFetched] = useState(false);

  const [inboxComments, setInboxComments] = useState([])

  const SC_auth = {
    auth: {
      username: 'packet_pirates',
      password: 'pass123$'
    }
  }

  const PP_auth = {
    auth: {
      username: 'packetpirates',
      password: 'cmput404'
    }
  }

  const WW_auth = {
    auth: {
      username: "packet-pirates",
      password: "12345",
    },
  };

  const token = {
    headers: {'Authorization': 'Token ' + localStorage.getItem('access_token')}
  };

  console.log(user);

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

    let posts = inbox.posts

    const postUrls = []

    //Create array of url-auth pairs
    for (let post in posts) {

      //Post url
      let url = posts[post]['API']

      //Corresponding authorization
      let auth = ''
      if (url.includes('packet-pirates')) {
        auth = PP_auth
      } else if (url.includes("super-coding")) {
        auth = SC_auth
      } else if (url.includes("web-weavers")) {
        auth = WW_auth;
        url = url + "/";
      }

      postUrls.push([url, auth])

    }


    //Send request for each url-auth
    const requests = postUrls.map(([url, auth]) =>
      axios.get(url, auth)
      .then(response => response)
      .catch (error => console.error('Error', error))
    );

    Promise.all(requests)
    .then(responses => {
      console.log(responses)
      //Get profile images
      const imageUrls = []

      //Create array of url-auth pairs again :(
      for (let res in responses) {

        //Post url
        let url = responses[res]['data']['id'] + '/image'

        //Corresponding authorization
        let auth = ''
        if (url.includes('packet-pirates')) {
          auth = PP_auth
        } else if (url.includes("super-coding")) {
          auth = SC_auth
        } else if (url.includes("web-weavers")) {
          auth = WW_auth;
          url = url + "/";
        }

        imageUrls.push([url, auth])

      }

      //Send request for each url-auth
      const imgRequests = imageUrls.map(([url, auth]) =>
        axios.get(url, auth)
        .then(response => response)
        .catch (error => console.error('Error', error))
      );

      Promise.all(imgRequests)
      .then(images => {
        
        setShowPost(() => [
          responses.map((res, index) => {

            let image = ''

            if (res.data.id.includes("packet-pirates")){

              image = images[index]['data']

            } else if (res.data.id.includes("super-coding")){

              image = images[index]['data']['image']

            } else if (res.data.id.includes("web-weavers")) {
              image = "https://picsum.photos/200/300";
            }

            return (
              <RemotePost
                key={index}
                user={user}
                post_author={res.data.author}
                title={res.data.title}
                description={res.data.description}
                content={res.data.content}
                img={image}
                likes={res.data.likes_count}  
                post_id = {res.data.id}
                categories = {res.data.categories}
                contentType = {res.data.contentType}
                count = {res.data.count}
                origin = {res.data.origin}
                published = {res.data.published}
                source = {res.data.source}
                unlisted = {res.data.unlisted}
                visibility = {res.data.visibility}
              />
            );
          }),
        ]);

      })

    })

  };

  useEffect(() => {
    getInbox();
  }, []);

  const getInbox = async () => {

    await axios
      .get(
        config.API_ENDPOINT + "author/" + user.user.user_id + "/inbox/local", token
      )
      .then((inboxRes) => {

        fetchPostData(inboxRes.data)
        // fetchCommentData(inboxRes.data)

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
