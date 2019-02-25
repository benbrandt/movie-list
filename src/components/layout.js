// @flow
import React, { type Node } from "react";
import styled from "react-emotion";
import Helmet from "react-helmet";
import Header from "./Header";

const Wrapper = styled("div")`
  background-color: #333;
  color: #f4f4f4;
  font-family: "Courier Next", courier, monospace;
  margin: 0;
`;

const Child = styled("div")`
  align-items: stretch;
  display: flex;
  flex-direction: row;
  min-height: 95vh;
`;

export default ({ children }: { children: Node }) => (
  <Wrapper>
    <Helmet
      titleTemplate="%s | Movie List"
      meta={[
        { name: "description", content: "Sample" },
        { name: "keywords", content: "sample, something" }
      ]}
    >
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css"
      />
    </Helmet>
    <Header />
    <Child>{children}</Child>
  </Wrapper>
);
