/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-unused-vars */

class ScheduleCanceller {
  constructor () {
    this.canCancels = null;

    document.addEventListener('DOMContentLoaded', async () => {
      this.form = document.getElementById('cancel-form');
      this.select = document.getElementById('schedule-id');
      await this.getSchedules();
      this.populateOptions();
      this.setListener();
    });
  }

  async getSchedules() {
    const PATH = '/api/schedules';

    try {
      let response = await fetch(PATH);
      if (response.ok) {
        let schedules = await response.json();
        this.canCancels = schedules.filter(schedule => !schedule.student_email);
      } else {
        let message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  populateOptions() {
    this.canCancels.forEach(sched => {
      let option = document.createElement('option');
      option.value = sched.id;
      option.id = `schedule-${sched.id}`;
      option.textContent = `Staff #${sched.staff_id}: ${sched.date} @ ${sched.time}`;
      this.select.appendChild(option);
    });
  }

  setListener() {
    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();
      let scheduleId = this.select.value;
      console.log(this.canCancels);
      console.log(scheduleId);
      const PATH = `api/schedules/${scheduleId}`;
      let options = {
        method: 'DELETE',
      };

      try {
        let response = await fetch(PATH, options);
        if (response.ok) {
          alert('Schedule successfully cancelled');
          let option = document.getElementById(`schedule-${scheduleId}`);
          option.remove();
        } else {
          let message = await response.text();
          console.log(message);
          throw new Error(message);
        }
      } catch (error) {
        alert(error.message);
      }
    });
  }
}

let canceller = new ScheduleCanceller();