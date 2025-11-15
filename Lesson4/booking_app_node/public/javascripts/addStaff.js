/* eslint-disable no-unused-vars */

class StaffManager {
  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.form = document.querySelector('form');

      this.form.addEventListener('submit', (event) => {
        event.preventDefault();

        let options = {
          method: 'POST',
          body: new FormData(this.form),
        };

        this.submitForm(options);
      });
    });
  }

  async submitForm(options) {
    const PATH = '/api/staff_members';
    try {
      let response = await fetch(PATH, options);
      if (response.ok) {
        this.displayResult('Staff member successfully created.');
      } else {
        let message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      this.displayResult(error.message);
    }
  }

  displayResult(result) {
    let messageBox = document.getElementById('result');
    messageBox.classList.remove('hidden');
    messageBox.textContent = result;
  }
}

let manager = new StaffManager();