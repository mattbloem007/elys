import React, { Component } from 'react';
import Main from './pages/main'

window.v='0.1'

class App extends Component {
  render = () => {
    return (
      <div style={{display: 'block', height: '100%', width: '100%'}}>
        <Main />
      </div>
    )
  }
}

export default App;
