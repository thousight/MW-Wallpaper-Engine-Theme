import React, { PureComponent } from 'react';
import moment from 'moment';

const timeFormat = 'h:mm:ss a'
const dateFormat = 'ddd MM/DD/YYYY'

class DateTime extends PureComponent {
  timeInterval = null

  state = {
    time: moment()
  }

  componentDidMount() {
    this.timeInterval = setInterval(() => this.setState({ time : moment() }),1000)
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval)
  }

  render() {
    const { time } = this.state

    return (
      <div className="wallpaper">
        <div className="datetime">
          <h1>{time.format(dateFormat)}</h1>
          <h1>{time.format(timeFormat)}</h1>
        </div>
      </div>
    );
  }
}

export default DateTime;
