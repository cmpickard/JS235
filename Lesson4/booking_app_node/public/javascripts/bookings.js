/* eslint-disable no-unused-vars */
class DisplayBookings {
  constructor() {
    this.bookingDates = null;
    this.currentBookings = null;
    this.currentLiNode = null;

    document.addEventListener('DOMContentLoaded', async () => {
      this.dateList = document.getElementById('date-list');
      await this.getBookingDates();
      console.log(this.bookingDates);
      this.populateList();
      this.addListeners();
    });
  }

  async getBookingDates() {
    const PATH = '/api/bookings';
    try {
      let response = await fetch(PATH);

      if (response.ok) {
        let data = await response.json();
        this.bookingDates = data;
      } else {
        let message = await response.json();
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async getBookingsForDate(date) {
    let PATH = `/api/bookings/${date}`;
    try {
      let response = await fetch(PATH);
      if (response.ok) {
        this.currentBookings = await response.json();
        this.displayBookings();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  populateList() {
    this.bookingDates.forEach(dateString => {
      let li = document.createElement('li');
      li.textContent = dateString;
      this.dateList.appendChild(li);
    });
  }

  addListeners() {
    this.dateList.addEventListener('click', (event) => {
      let target = event.target;
      if (target.tagName === 'LI') {
        this.currentLiNode = target;
        this.getBookingsForDate(target.textContent);
      }
    });
  }

  displayBookings() {
    console.log(this.currentBookings);
    this.currentBookings.forEach(booking => {
      let ul = document.createElement('ul');
      let li = document.createElement('li');
      li.textContent = booking.join(' | ');

      ul.appendChild(li);
      this.currentLiNode.appendChild(ul);
    });
  }
}

let displayer = new DisplayBookings();