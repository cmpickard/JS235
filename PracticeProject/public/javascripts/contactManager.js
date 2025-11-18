/* eslint-disable camelcase */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-statements */
/* eslint-disable no-unused-vars */

class ContactManager {
  constructor() {
    this.contacts = null;

    document.addEventListener('DOMContentLoaded', async() => {
      this.contactList = document.getElementById('contacts');
      this.addButton = document.getElementById('add-button');
      this.search = document.getElementById('search-text');
      this.addContactForm = document.getElementById('add-contact');
      this.cancelAdd = document.getElementById('cancel');
      this.nameInput = document.getElementById('name');
      this.emailInput = document.getElementById('email');
      this.phoneInput = document.getElementById('phone');
      this.idInput = document.getElementById('hidden-id');
      this.errorBox = document.getElementById('errors');
      this.workCheck = document.getElementById('work');
      this.friendCheck = document.getElementById('friend');
      this.submit = document.getElementById('submit');

      await this.getContacts();
      this.renderContacts();
      this.createListeners();
    });
  }

  async getContacts() {
    const PATH = '/api/contacts';

    try {
      let response = await fetch(PATH);
      if (response.ok) {
        this.contacts = await response.json();
      } else {
        let message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  renderContacts(omissions = []) {
    this.contactList.textContent = '';

    this.contacts.forEach(contact => {
      if (omissions.includes(contact.id)) return;

      let li = document.createElement('li');
      li.id = `contact-${contact.id}`;
      li.classList.add('contact');
      this.contactList.appendChild(li);

      let innerUl = document.createElement('ul');
      li.appendChild(innerUl);

      let name = document.createElement('li');
      name.textContent = contact.full_name;
      innerUl.appendChild(name);

      let email = document.createElement('li');
      email.textContent = contact.email;
      innerUl.appendChild(email);

      let phone = document.createElement('li');
      phone.textContent = contact.phone_number;
      innerUl.appendChild(phone);

      let tags = document.createElement('li');
      if (contact.tags) {
        contact.tags.split(',').forEach(tag => {
          let link = document.createElement('a');
          link.setAttribute('href', tag);
          link.textContent = tag;
          tags.appendChild(link);
        });
      } else {
        tags.textContent = '<no assigned tags>';
      }

      innerUl.appendChild(tags);

      let editButton = document.createElement('button');
      editButton.id = `edit-${contact.id}`;
      editButton.classList.add('edit');
      editButton.textContent = 'Edit';
      li.appendChild(editButton);

      let deleteButton = document.createElement('button');
      deleteButton.id = `delete-${contact.id}`;
      deleteButton.classList.add('delete-contact');
      deleteButton.textContent = 'Delete';
      li.appendChild(deleteButton);
    });
  }

  validateForm() {
    let messages = [];
    messages = messages.concat(this.validateName());
    messages = messages.concat(this.validateEmail());
    messages = messages.concat(this.validatePhone());

    return messages;
  }

  validateName() {
    let messages = [];
    let validity = this.nameInput.validity;

    if (validity.valueMissing) {
      messages.push('Name field is required');
    } else if (validity.patternMismatch) {
      messages.push('Name may have only letters, dashes, spaces & apostrophes');
    }

    return messages;
  }

  validateEmail() {
    let messages = [];
    let validity = this.emailInput.validity;

    if (validity.patternMismatch) {
      messages.push('Email must contain an @ symbol');
    } else if (validity.valueMissing) {
      messages.push('Email field is required');
    }

    return messages;
  }

  validatePhone() {
    let messages = [];
    let validity = this.phoneInput.validity;

    if (validity.valueMissing) {
      messages.push('Phone field is required');
    } else if (validity.tooLong || validity.tooShort) {
      messages.push('Phone number must be exactly 11 digits long');
    }

    if (validity.patternMismatch) {
      messages.push('Phone field may only contain digits');
    }

    return messages;
  }

  getTags() {
    let tagCheckboxes = [this.workCheck, this.friendCheck];
    let checked = tagCheckboxes.filter(box => box.checked);
    return checked.map(box => box.name).join(',');
  }

  resetAddContactForm() {
    this.addContactForm.reset();
    this.addContactForm.classList.add('hidden');
    this.errorBox.textContent = '';
    this.errorBox.classList.add('hidden');
  }

  addContactOptions() {
    let body = {
      full_name: this.nameInput.value,
      email: this.emailInput.value,
      phone_number: this.phoneInput.value,
      tags: this.getTags(),
    };
    let jsonBody = JSON.stringify(body);
    let options = {
      method: 'POST',
      body: jsonBody,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    };

    return options;
  }


  async addContact() {
    const PATH = 'http://localhost:3000/api/contacts/';
    let options = this.addContactOptions();

    try {
      let response = await fetch(PATH, options);
      if (!response.ok) {
        let message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteContact(id) {
    const PATH = `/api/contacts/${id}`;
    let options = {
      method: 'DELETE',
    };

    try {
      let response = await fetch(PATH, options);
      if (!response.ok) {
        let message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  editContactOptions() {
    let id = this.idInput.value;
    let body = {
      id: id,
      full_name: this.nameInput.value,
      email: this.emailInput.value,
      phone_number: this.phoneInput.value,
      tags: this.getTags(),
    };

    let jsonBody = JSON.stringify(body);

    let options = {
      method: 'PUT',
      body: jsonBody,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    };

    return options;
  }

  async editContact() {
    let id = this.idInput.value;
    const PATH = `/api/contacts/${id}`;
    let options = this.editContactOptions();

    try {
      let response = await fetch(PATH, options);
      if (!response.ok) {
        let message = await response.text();
        throw new Error(message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  prepEditForm(target) {
    this.submit.value = 'Edit';

    let contactId = Number(target.id.match(/\d+/)[0]);
    let contact = this.contacts.filter(contact => {
      return contact.id === contactId;
    })[0];

    this.addContactForm.classList.remove('hidden');
    this.nameInput.value = contact.full_name;
    this.emailInput.value = contact.email;
    this.phoneInput.value = contact.phone_number;
    this.idInput.value = contactId;

    let tags = contact.tags;
    if (tags.match(/work/)) {
      this.workCheck.checked = true;
    }

    if (tags.match(/friend/)) {
      this.friendCheck.checked = true;
    }
  }

  async submitContact() {
    this.errorBox.textContent = '';
    let messages = this.validateForm();
    if (messages.length > 0) {
      this.errorBox.classList.remove('hidden');
      messages.forEach(message => {
        let messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        this.errorBox.appendChild(messageDiv);
      });

      return;
    } else if (this.submit.value === 'Edit') {
      await this.editContact();
      this.submit.value = 'Add';
    } else {
      await this.addContact();
    }

    this.errorBox.classList.add('hidden');
    this.resetAddContactForm();
    await this.getContacts();
    this.renderContacts();
    this.search.value = '';
  }

  createListeners() {
    // call up Add Contact form
    this.addButton.addEventListener('click', () => {
      this.addContactForm.classList.remove('hidden');
    });

    // input into search bar
    this.search.addEventListener('input', (event) => {
      let query = event.target.value;
      let excluded = this.contacts.filter(contact => {
        let pattern = new RegExp(query, 'i');
        return !contact.full_name.match(pattern);
      });

      this.renderContacts(excluded.map(contact => contact.id));
    });

    // cancels add contact form
    this.cancelAdd.addEventListener('click', (event) => {
      event.preventDefault();
      this.resetAddContactForm();
    });

    // search by tag
    this.contactList.addEventListener('click', (event) => {
      let target = event.target;

      if (target.tagName === 'A') {
        event.preventDefault();
        let tag = target.getAttribute('href');
        let excluded = this.contacts.filter(contact => {
          let pattern = new RegExp(tag);
          let tags = contact.tags || '';
          return !tags.match(pattern);
        });

        this.renderContacts(excluded.map(contact => contact.id));
        this.search.value = `tag search:<${tag}>`;
      }
    });

    // submit Add Contact form
    this.addContactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await this.submitContact();
    });

    // edit contact
    this.contactList.addEventListener('click', (event) => {
      let target = event.target;
      if (target.classList.contains('edit')) this.prepEditForm(target);
    });

    //delete contact
    this.contactList.addEventListener('click', async (event) => {
      let target = event.target;
      if (target.classList.contains('delete-contact')) {
        let id = target.id.match(/\d+/)[0];
        await this.deleteContact(id);
        await this.getContacts();
        this.renderContacts();
        this.search.value = '';
      }
    });
  }
}

let manager = new ContactManager();