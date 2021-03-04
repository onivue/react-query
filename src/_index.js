/* eslint-disable jsx-a11y/anchor-is-valid */
import "./styles.css";
import React from "react";
import ReactDOM from "react-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueries
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Form from "./Form";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  //Single Requests
  const { isLoading, error, data: list, isFetching } = useQuery("users", () =>
    fetch(
      "https://onivue-json-fake-server.herokuapp.com/users"
      //"https://api.github.com/repos/tannerlinsley/react-query"
    ).then((res) => res.json())
  );

  //Multiple Requests
  const userQueries = useQueries([
    {
      queryKey: ["repoDataReactQuery"],
      queryFn: () =>
        fetch(
          "https://api.github.com/repos/tannerlinsley/react-query"
        ).then((res) => res.json())
    },
    {
      queryKey: ["posts"],
      queryFn: () =>
        fetch(
          "https://onivue-json-fake-server.herokuapp.com/posts"
        ).then((res) => res.json())
    }
  ]);
  console.log(userQueries);

  const [{ data }, { data2 }] = userQueries;

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="wrapper">
      {
        console.log(data)

        /*
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
      */
      }
      {console.log(data2)}
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
      <hr />
      <ul>
        {list.map(
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
      <div>{isFetching ? "Updating..." : ""}</div>
      <hr />
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
