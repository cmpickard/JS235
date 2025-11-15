/* eslint-disable max-lines-per-function */
const Autocomplete = {
  wrapInput: function() {
    let wrapper = document.createElement('div');
    wrapper.classList.add('autocomplete-wrapper');
    this.input.parentNode.appendChild(wrapper);
    wrapper.appendChild(this.input);
  },

  createUI: function() {
    let listUI = document.createElement('ul');
    listUI.classList.add('autocomplete-ui');
    this.input.parentNode.appendChild(listUI);
    this.listUI = listUI;

    let overlay = document.createElement('div');
    overlay.classList.add('autocomplete-overlay');
    overlay.style.width = `${this.input.clientWidth}px`;

    this.input.parentNode.appendChild(overlay);
    this.overlay = overlay;
  },

  bindEvents: function() {
    this.input.addEventListener('input', this.valueChanged.bind(this));
    this.input.addEventListener('keydown', this.upDown.bind(this));
  },

  valueChanged: async function() {
    let value = this.input.value;
    this.selectedIndex = null;

    if (value.length > 0) {
      this.input.value = this.autoCapitalize(value);
      await this.fetchMatches(value);
      this.visible = true;
      this.bestMatchIndex = 0;
      this.draw();
    } else {
      this.reset();
    }
  },

  upDown: function(event) {
    let key = event.key;
    if (key === 'ArrowUp') {
      if (this.selectedIndex < 0) {
        this.selectedIndex = this.matches.length - 1;
      } else {
        this.selectedIndex -= 1;
      }
    } else if (key === 'ArrowDown') {
      if (this.selectedIndex >= this.matches.length) {
        this.selectedIndex = 0;
      } else {
        this.selectedIndex += 1;
      }
    }

    this.draw();
  },

  fetchMatches: async function(query) {
    try {
      let response = await fetch(`${this.url}${encodeURIComponent(query)}`);
      if (response.ok) {
        let data = await response.json();
        this.matches = [];
        for (let country of data) {
          this.matches.push(country.name);
        }
      } else {
        console.log(response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  },

  draw: function() {
    // reset List Elements from last draw
    let listElements = [...document.querySelectorAll('li')];
    listElements.forEach(li => li.remove());

    // determine which index is currently selected
    let selected;
    if (this.selectedIndex === null) {
      selected = this.bestMatchIndex;
    } else {
      selected = this.matchesselectedIndex;
    }

    // update list for current value of this.matches
    this.matches.forEach((country, idx) => {
      let li = document.createElement('li');
      li.textContent = country;
      this.listUI.appendChild(li);
      if (idx === selected) li.classList.add('selected');
    });

    // determine value of the autocomplete overlay
    if (this.matches[selected] !== undefined) {
      this.overlay.textContent = this.matches[selected];
    } else {
      this.overlay.textContent = '';
    }
  },

  reset: function() {
    this.visible = false;
    this.bestMatchIndex = null;
    this.selectedIndex = null;
    let listElements = [...document.querySelectorAll('li')];
    listElements.forEach(li => li.remove());
  },

  init: function() {
    this.input = document.querySelector('input');
    this.url = '/countries?matching=';
    this.listUI = null;
    this.overlay = null;
    this.visible = false;
    this.bestMatchIndex = null;
    this.selectedIndex = null;
    this.matches = [];

    this.wrapInput();
    this.createUI();

    this.bindEvents();
    this.reset();
  },

  autoCapitalize: function(value) {
    let capital = value[0].toUpperCase() + value.slice(1);
    console.log(capital);
    return capital;
  },
};

document.addEventListener('DOMContentLoaded', () => {
  Autocomplete.init();
});