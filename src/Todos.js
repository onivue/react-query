//import React from "react";
import React, { useState, useEffect, useRef, useReducer } from "react";
import moment from "moment";
import xtype from "xtypejs";
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
      tags: []
    };
  }
  if (event.name === "tags") {
    return {
      ...state,
      [event.name]: event.value.split(" ")
    };
  }
  return {
    ...state,
    [event.name]: event.value
  };
};

const getTodos = () =>
  fetch(
    "https://onivue-json-fake-server.herokuapp.com/todos"
    //"https://api.github.com/repos/tannerlinsley/react-query"
  ).then((res) => res.json());

const addTodo = (item) =>
  fetch("https://onivue-json-fake-server.herokuapp.com/todos", {
    method: "POST",
    body: JSON.stringify(item),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((data) => {
    console.log(data);
  });

function Todos({ title, ...props }) {
  const dueDate = moment().add(7, "days").format("YYYY-MM-DD");
  const [formData, setFormData] = useReducer(formReducer, {
    dueDate: dueDate,
    tags: []
  });
  const [alert, setAlert] = useState(false);
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const { isLoading, error, data: todos, isFetching } = useQuery(
    "todos",
    getTodos
  );
  // Mutations
  const mutation = useMutation(addTodo, {
    onSuccess: () => {
      setFormData({
        reset: true
      });
      // Invalidate and refetch
      queryClient.invalidateQueries("todos");
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
  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="wrapper">
      <div className="actualState">
        <h4>Actual State</h4>
        <ul>
          {Object.entries(formData).map(([name, value]) => (
            <div key={name}>
              <strong>{name}</strong>: {value.toString()}
              <br />
              <sup style={{ color: "gray" }}>
                [{xtype.type(value)} ({xtype(value)})]
              </sup>
            </div>
          ))}
        </ul>
      </div>

      <h1>{title ?? "Todo's"}</h1>

      <form onSubmit={handleSubmit}>
        <label>
          <p>Title</p>
          <input
            className="input"
            name="title"
            onChange={handleChange}
            value={formData.title || ""}
          />
        </label>
        <label>
          <p>Description</p>
          <textarea
            className="input"
            name="description"
            onChange={handleChange}
            value={formData.description || ""}
          />
        </label>
        <label>
          <p>Tags</p>
          <input
            className="input"
            name="tags"
            onChange={handleChange}
            value={formData.tags.join(" ") || ""}
          />
        </label>
        <label>
          <p>isComplete</p>

          <input
            type="checkbox"
            name="isComplete"
            onChange={handleChange}
            checked={formData.isComplete ?? false}
          />
        </label>
        <label>
          <p>dueDate</p>
          <input
            className="input"
            type="date"
            name="dueDate"
            onChange={handleChange}
            value={formData.dueDate}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
        <br />
        {alert && <span> ✔️ </span>}
      </form>

      {console.log(todos)}
      {todos.map((todo) => (
        <fieldset key={`id-${todo.id}`}>
          <span className="rightActionButton">❌</span>
          <span className="rightActionButton">📝</span>
          <div>
            <b>Title:</b> {todo.title}
          </div>
          <div>
            <b>Description:</b> {todo.description}
          </div>
          <div>
            <b>Tags:</b> {todo.tags}
          </div>
          <div>
            <b>isComplete:</b> {todo.isComplete}
          </div>
          <div>
            <b>Due Date:</b> {todo.dueDate}
          </div>
          <div>
            <b>createdAt:</b> {todo.createdAt}
          </div>
          <div>
            <b>createdBy:</b> {todo.createdAt}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
export default Todos;
