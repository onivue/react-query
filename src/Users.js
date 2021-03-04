//import React from "react";
import React, { useState, useEffect, useRef, useReducer } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider
} from "react-query";

const formReducer = (state, event) => {
  if (event.reset) {
    return {
      first_name: "",
      last_name: "",
      email: ""
    };
  }
  return {
    ...state,
    [event.name]: event.value
  };
};

const getUsers = () =>
  fetch(
    "https://onivue-json-fake-server.herokuapp.com/users"
    //"https://api.github.com/repos/tannerlinsley/react-query"
  ).then((res) => res.json());

const addUser = (item) =>
  fetch("https://onivue-json-fake-server.herokuapp.com/users", {
    method: "POST",
    body: JSON.stringify(item),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((data) => {
    console.log(data);
  });

function Users({ title, ...props }) {
  const [formData, setFormData] = useReducer(formReducer, "");
  const [alert, setAlert] = useState(false);
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { isLoading, error, data: users, isFetching } = useQuery(
    "users",
    getUsers
  );
  // Mutations
  const mutation = useMutation(addUser, {
    onSuccess: () => {
      setFormData({
        reset: true
      });
      // Invalidate and refetch
      queryClient.invalidateQueries("users");
      console.log("Success!");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2000);
    }
  });

  const handleChange = (event) => {
    const isCheckbox = event.target.type === "checkbox";
    setFormData({
      name: event.target.name,
      value: isCheckbox ? event.target.checked : event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(formData);
  };

  // Wichtig sonst Problem mit 'map'
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred : " + error.message;
  return (
    <div className="wrapper">
      <div
        style={{
          border: "4px dotted magenta",
          width: "40%",
          margin: "15px",
          display: "flex",
          flexDirection: "column",
          textAlign: "center"
        }}
      >
        <h4>Actual State</h4>
        <ul>
          {Object.entries(formData).map(([name, value]) => (
            <li key={name}>
              <strong>{name}</strong>: {value.toString()}
            </li>
          ))}
        </ul>
      </div>

      <h1>{title ?? "Users"}</h1>

      <form onSubmit={handleSubmit}>
        <label>
          <p>First Name</p>
          <input
            name="first_name"
            onChange={handleChange}
            value={formData.first_name || ""}
          />
        </label>
        <label>
          <p>Last Name</p>
          <input
            name="last_name"
            onChange={handleChange}
            value={formData.last_name || ""}
          />
        </label>
        <label>
          <p>Email</p>
          <input
            name="email"
            onChange={handleChange}
            value={formData.email || ""}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
        <br />
        {alert && <span> ✔️ </span>}
      </form>
      <ul>
        {console.log(users)}
        {users.map(
          ({ id, email, userId, title, first_name, last_name, color }) => (
            <li key={`id-${id}`}>
              {email}
              <p style={{ color: color }}>
                {first_name} {last_name}
              </p>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
export default Users;
