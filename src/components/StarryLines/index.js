import React, { PureComponent } from "react";

import { attachListeners, detachListeners } from "./events";

const CANVAS = "CANVAS";

class StarryLines extends PureComponent {
  canvas = null;

  componentDidMount() {
    this.canvas = document.getElementById(CANVAS);
    attachListeners(this.canvas);
  }

  componentWillUnmount() {
    detachListeners();
  }

  render() {
    return (
      <div className="starrynight">
        <div className="container demo-1">
          <div className="content">
            <div id="large-header" className="large-header">
              <canvas id={CANVAS} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StarryLines;
