/* eslint-disable max-lines-per-function */
/* eslint-disable no-unused-vars */

class BookingCanceller {
  constructor () {
    this.bookings = null;

    document.addEventListener('DOMContentLoaded', async () => {
      this.form = document.getElementById('cancel-form');
      this.select = document.getElementById('booking-id');
      await this.getBookings();
      this.populateOptions();
      this.setListener();
    });
  }

  async getBookings() {
    const PATH = '/api/schedules';

    try {
      let response = await fetch(PATH);
      if (response.ok) {
        let schedules = await response.json();
        this.bookings = schedules.filter(schedule => schedule.student_email);
      } else {
        let message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  populateOptions() {
    this.bookings.forEach(book => {
      let option = document.createElement('option');
      option.value = book.id;
      option.id = `booking-${book.id}`;
      option.textContent = `${book.student_email}: ${book.date} @ ${book.time}`;
      this.select.appendChild(option);
    });
  }

  setListener() {
    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      let bookingId = this.select.value;
      const PATH = `api/bookings/${bookingId}`;
      let options = {
        method: 'PUT',
      };

      try {
        let response = await fetch(PATH, options);
        if (response.ok) {
          alert('Booking successfully cancelled');
          let option = document.getElementById(`booking-${bookingId}`);
          option.remove();
        } else {
          let message = await response.text();
          throw new Error(message);
        }
      } catch (error) {
        alert(error.message);
      }
    });
  }
}

let canceller = new BookingCanceller();