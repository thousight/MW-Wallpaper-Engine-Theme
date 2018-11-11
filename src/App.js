import React, { PureComponent } from 'react';

import DateTime from './components/DateTime'
import StarryLines from './components/StarryLines'

class App extends PureComponent {
  render() {
    return (
      <div className="wallpaper">
        <DateTime />
        <StarryLines />
        </div>
    );
  }
}

export default App;
