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
import Todos from "./Todos";
import Users from "./Users";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  return (
    <div className="wrapper">
      <Todos />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
