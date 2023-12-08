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
    let url =
      "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/author/search?q=" +
      value;

    axios.get(url, config).then((res) => {
      userIds = res.data.Users.map((user) => user.id);
      userNames = res.data.Users.map((user) => user.displayName);
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

  function handleFriendClick(friend) {
    const index = results.indexOf(friend);
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
