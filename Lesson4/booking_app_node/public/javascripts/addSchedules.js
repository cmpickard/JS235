/* eslint-disable camelcase */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable no-unused-vars */

// NEED:
// finish writing event listener for submit button

// what i'm actually submitting to the API server is the staff_id, not the name
// so i need to
// (i) also retrieve the staff ids when I getStaffNames
// (ii) change all the <option> elements to have the staff-id as their value
// while keeping the staff name as the textContent

/*
POST
/api/schedules
body should be in this format:
{
    "schedules": [
        {
            "staff_id": 1,
            "date": "10-10-10",
            "time": "12:12"
        }
    ]
}

let formObj = {schedules: []};

*/

class Scheduler {
  constructor() {
    this.staff = null;
    this.subForms = 0;

    document.addEventListener('DOMContentLoaded', async () => {
      this.form = document.querySelector('form');
      this.subFormBox = document.getElementById('schedules');
      this.addButton = document.getElementById('btnAdd');
      await this.getStaffNames();
      this.addScheduleForm();
      this.addListeners();
    });
  }

  async getStaffNames() {
    try {
      let response = await fetch('/api/staff_members');
      if (response.ok) {
        this.staff = await response.json();
      } else {
        let errorMsg = await response.text();
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  addScheduleForm() {
    this.subForms++;
    let field = document.createElement('fieldset');
    field.id = `subform-${this.subForms}`;
    let fieldLabel = document.createElement('label');
    fieldLabel.setAttribute('for', `subform-${this.subForms}`);
    fieldLabel.textContent = `Schedule ${this.subForms}`;
    this.subFormBox.appendChild(fieldLabel);
    this.subFormBox.appendChild(field);

    let nameDropdown = document.createElement('select');
    nameDropdown.setAttribute('name', 'staff-id');
    nameDropdown.id = `name-${this.subForms}`;
    nameDropdown.classList.add('input');
    this.addOptions(nameDropdown);

    let nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', `name-${this.subForms}`);
    nameLabel.textContent = 'Staff name:';
    field.appendChild(nameLabel);
    field.appendChild(nameDropdown);

    let date = document.createElement('input');
    date.setAttribute('type', 'date');
    date.id = `date-${this.subForms}`;
    date.classList.add('input');
    date.setAttribute('name', `date-${this.subForms}`);

    let dateLabel = document.createElement('label');
    dateLabel.setAttribute('for', `date-${this.subForms}`);
    dateLabel.textContent = 'Date:';
    field.appendChild(dateLabel);
    field.appendChild(date);

    let time = document.createElement('input');
    time.setAttribute('type', 'time');
    time.id = `time-${this.subForms}`;
    time.classList.add('input');
    time.setAttribute('step', '60');
    time.setAttribute('name', `time-${this.subForms}`);

    let timeLabel = document.createElement('label');
    timeLabel.setAttribute('for', `time-${this.subForms}`);
    timeLabel.textContent = 'Time:';
    field.appendChild(timeLabel);
    field.appendChild(time);
  }

  addOptions(dropdown) {
    for (let staff of this.staff) {
      let option = document.createElement('option');
      option.value = staff.id;
      option.textContent = staff.name;
      dropdown.appendChild(option);
    }
  }

  async addSchedules(body) {
    const PATH = '/api/schedules';
    let options = {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    };

    try {
      let response = await fetch(PATH, options);
      let message = await response.text();
      if (response.ok) {
        alert(message);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  addListeners() {
    this.addButton.addEventListener('click', () => {
      this.addScheduleForm();
    });

    this.form.addEventListener('submit', async (event) => {
      event.preventDefault();

      let schedules = [...document.querySelectorAll('fieldset')];
      let formVals = schedules.map((schedule, idx) => {
        return {
          staff_id: document.getElementById(`name-${idx + 1}`).value,
          date: document.getElementById(`date-${idx + 1}`).value,
          time: document.getElementById(`time-${idx + 1}`).value,
        };
      });

      let body = JSON.stringify({schedules: formVals});

      await this.addSchedules(body);
    });
  }
}

let scheduler = new Scheduler();