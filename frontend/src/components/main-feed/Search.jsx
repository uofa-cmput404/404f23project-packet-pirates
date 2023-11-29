import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  var userNames = [];
  var userIds = [];

  const [resultIDs, setResultIDs] = useState([]);

  const config = {
    headers: { Authorization: "Token " + localStorage.getItem("access_token") },
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    let url = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/search?q=" + value;

    axios.get(url, config).then((res) => {
      //   console.log("res", res);
      // console.log("res.data", res.data);
      // const users = res.data.Users;
      userIds = res.data.Users.map((user) => user.id);
      userNames = res.data.Users.map((user) => user.displayName);
      //   setResults(res.data.Users);
      setResults(userNames);
      setResultIDs(userIds);
    });
    setShowResults(true);
  };

  const handleInputBlur = () => {
    // Hide the results dropdown when the input loses focus.
    setTimeout(() => {
      setShowResults(false);
    }, 2000);
  };

  //   const handleSearchLinkClick = async (event) => {
  //     // navigate("/user/" + friend.friend_username);
  //     console.log("shit");
  //     console.log("event.target", event.target);
  //     console.log("event.target.innerText", event.target.innerText);
  //   };
  //

  // test function for handlesearchlinkclick

  //   const handleSearchLinkClick = (event, result) => {
  //     console.log("Search link clicked:", result);
  //   };
  function handleFriendClick(friend) {
    // console.log(friend);
    // const userId = user.id;
    // console.log(userId + "AUISDHIAUSHDIUASHDIUASHDIUAHSUIDHAIUSD");
    // console.log("HANDLE FRIEND CLICK" + friend);
    // get the index of friend in userNames

    const index = results.indexOf(friend);
    console.log(index);
    console.log(friend);
    console.log(userNames);
    console.log(results);
    console.log("USER ID OF THIS " + resultIDs[index]);
    console.log("USER ID OF THIS " + resultIDs[index].split("/").pop());

    navigate("/user/" + friend, { state: { api: resultIDs[index] } });
    window.location.reload(false);
  }

  return (
    <>
      <div className="mb-5 flex flex-col relative">
        <input
          type="text"
          placeholder="Search"
          className="border border-gray-300 rounded-lg p-2"
          value={searchTerm}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        {showResults && results.length > 0 && (
          <div className="results absolute bg-white border border-gray-300 rounded-lg p-2 mt-12 w-full z-50">
            {/* Render the search results here */}
            {results.slice(0, 8).map((result, index) => (
              <button
                key={index}
                className="block w-full text-left m-2"
                onClick={() => handleFriendClick(result)}
              >
                {result}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
