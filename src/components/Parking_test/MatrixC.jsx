import React, { Component } from 'react';

import Calendar from 'react-calendar';

class MatrixC extends Component {
  state = {
    showCalendar: false,
    selectedDate: new Date(),
    minDate: new Date(),
    selectedIndex: null,
    userId: null,
    busyDates: [],
  }

  handlePiazzolaClick = (index) => {
    this.setState({
      showCalendar: true,
      selectedIndex: index,
    });
  }

  handleCalendarChange = (date) => {
    this.setState({
      selectedDate: date
    });
  }

  handleCalendarClose = () => {
    this.setState({
      showCalendar: false
    });
  }

  handleUserId = (id) => {
    this.setState({
      userId: id
    });
  }

  handleSubmit = async () => {
    const data = {
      selectedIndex: this.state.selectedIndex,
      selectedDate: this.state.selectedDate,
      userId: this.state.userId,
    }
    try {
      const response = await fetch('your-backend-url', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      // update state with busy date
      this.setState(prevState => ({
        busyDates: [...prevState.busyDates, data.selectedDate]
      }));
      console.log('Data sent successfully')
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { selectedDate, busyDates } = this.state;

    return (
      <div className="matrix">
        {[...Array(5)].map((x, i) =>
          <div key={i}>
            {[...Array(5)].map((y, j) =>
              <button key={j} name="piazzola" onClick={() => this.handlePiazzolaClick(i*5+j)}>Piazzola</button>
            )}
          </div>
        )}
        {this.state.showCalendar &&
          <div>
            <Calendar
              onChange={this.handleCalendarChange}
              value={this.state.selectedDate}
              minDate={this.state.minDate}
            />
            <button onClick={this.handleCalendarClose}>Close</button>
            {busyDates.includes(selectedDate) && <div>This date is busy</div>}
          </div>
        }
        <div>
          <input type="text" placeholder="User ID" onChange={(e) => this.handleUserId(e.target.value)} />
          <button onClick={this.handleSubmit}>Send Data</button>
        </div>
      </div>
    );
  }
}

export default MatrixC;

