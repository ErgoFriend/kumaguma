import React from 'react';
import logo from './logo.svg';

import Styled from 'styled-components';

const App: React.FC = () => {
  return (
    <AppStyle>
      <HeaderStyle>
        <LogoStyle src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <LinkStyle
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </LinkStyle>
      </HeaderStyle>
    </AppStyle>
  );
}

export default App;

const AppStyle = Styled.div`
  text-align: center;
`;

const HeaderStyle = Styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const LogoStyle = Styled.img`
  height: 40vmin;
`;

const LinkStyle = Styled.a`
  color: #09d3ac;
`;
