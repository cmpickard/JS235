/* eslint-disable camelcase */
/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-unused-vars */

class ManageBooking {
  constructor() {
    this.openSlots = null;

    document.addEventListener('DOMContentLoaded', async () => {
      this.bookingForm = document.getElementById('book-schedule');
      this.bookingSequence = document.getElementById('new-student-booking');
      this.newStudentForm = document.getElementById('add-student');
      this.select = document.getElementById('schedule-list');
      await this.getSchedules();
      await this.getStaff();
      this.populateSelect();
      this.applyListeners();
    });
  }

  timeout(wait) {
    return new Promise(resolve => {
      setTimeout(resolve, wait, {});
    });
  }

  async getSchedules() {
    const PATH = '/api/schedules';
    try {
      let response = {};
      let retries = 3;
      while (response.constructor.name !== "Response" && retries > 0) {
        response = await Promise.race([fetch(PATH), this.timeout(1000)]);
        retries--;
      }

      if (response.ok) {
        let data = await response.json();
        this.openSlots = data.filter(schedule => !schedule.student_email);
      } else {
        let message = response.body ? await response.text() : "Timed out";
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async getStaff() {
    const PATH = '/api/staff_members';
    try {
      let response = await fetch(PATH);
      if (response.ok) {
        let data = await response.json();
        this.addStaffNamesToSlots(data);
      } else {
        let message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async addNewStudent() {
    const PATH = '/api/students';
    let formData = new FormData(this.newStudentForm);
    let options = {
      method: 'POST',
      body: formData,
    };

    try {
      let response = await fetch(PATH, options);
      if (response.ok) {
        alert('New student successfully added');
        return true;
      } else {
        let message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
      return false;
    }
  }

  async addBooking() {
    const PATH = '/api/bookings';
    let formData = new FormData(this.bookingForm);
    let options = {
      method: 'POST',
      body: formData,
    };

    try {
      let response = await fetch(PATH, options);
      if (response.ok) {
        alert('Booking successful!');
        return true;
      } else {
        let message = await response.text();
        this.bookingSequence.value = message.match(/\d+/)[0];
        alert(message);
        return false;
      }
    } catch (error) {
      alert(error.message);
      return false;
    }
  }

  addStaffNamesToSlots(data) {
    const ID_TO_NAME = data.reduce((obj, staff) => {
      obj[staff.id] = staff.name;
      return obj;
    }, {});

    this.openSlots.forEach(schedule => {
      schedule.staff_name = ID_TO_NAME[schedule.staff_id];
    });
  }

  populateSelect() {
    this.openSlots.forEach(slot => {
      let option = document.createElement('option');
      option.setAttribute('value', slot.staff_id);
      option.textContent = `${slot.staff_name}: Meeting on ${slot.date} at ${slot.time}`;
      option.value = slot.id;

      this.select.appendChild(option);
    });
  }

  applyListeners() {
    this.bookingForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      let result = await this.addBooking();
      if (!result) {
        this.newStudentForm.classList.remove('hidden');
        alert('Register new student!');
      }
    });

    this.newStudentForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      let result = await this.addNewStudent();
      if (result) {
        let submitEvent = new Event('submit');
        this.bookingForm.dispatchEvent(submitEvent);
      }
    });
  }
}

let manager = new ManageBooking();