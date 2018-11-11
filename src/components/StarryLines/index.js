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
    return <canvas id={CANVAS} />;
  }
}

export default StarryLines;
