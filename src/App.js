import React, { PureComponent } from 'react';

import DateTime from './components/DateTime'

class App extends PureComponent {
  render() {
    return (
      <div className="wallpaper">
        <DateTime />
      </div>
    );
  }
}

export default App;
