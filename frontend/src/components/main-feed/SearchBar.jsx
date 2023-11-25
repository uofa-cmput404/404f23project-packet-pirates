import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

export default function TESTINGONLY() {
  const [users, setUsers] = useState([]);
  const [debouncedInputValue, setDebouncedInputValue] = useState("");

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const getUsers = () => {
    let endpoint = "https://packet-pirates-backend-d3f5451fdee4.herokuapp.com/api/author/getall";
    axios.get(endpoint).then((res) => {
      console.log("res", res.data.Users);
      const userNames = res.data.Users.map((user) => user.username);
      setUsers(userNames);
      console.log("usernames", userNames);
    });
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="">
        <Select options={options} />
      </div>
    </>
  );
}
