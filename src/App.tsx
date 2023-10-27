import { useState } from "react"
import styled, { createGlobalStyle } from "styled-components";
import { Menu } from "./Menu";
import { Content } from "./Content";
import React from "react";

const AppContainer = styled.div`
  background-color: #353b48;
  width: 1900px;
  height: 900px;
  display: flex;
  flex-direction: row;
`;

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    display: none;
  }

  * {
    font-family: "Satoshi", sans-serif
  }
`;

function App() {

  const [selectedGenre, setSelectedGenre] = useState("All Genres");

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
  };

  return (
    <AppContainer>
      <GlobalStyle />
      <Menu focusKey="MENU" onGenreSelect={handleGenreSelect} />
      <Content selectedGenre={selectedGenre}/>
    </AppContainer>
  );
}

export default App;
