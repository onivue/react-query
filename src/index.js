/* eslint-disable jsx-a11y/anchor-is-valid */
import "./styles.css";
import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";

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
  ////////////
  const [value, setValue] = React.useState("");

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  ////////////
  return (
    <div className="wrapper">
      <Todos onChange={handleChange} />
      <ReactQueryDevtools initialIsOpen={false} />

      <p>{}</p>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
