/* eslint-disable no-unused-vars */
/* eslint-disable max-statements */
/* eslint-disable camelcase */
/* eslint-disable max-lines-per-function */
import templates from "./templates.js";

class PhotoGalleryManager {
  constructor() {
    this.photos = null;
    this.leadPhoto = null;
    this.commentData = null;
    this.visibleIdx = 0;
    this.figures = [];

    document.addEventListener('DOMContentLoaded', async () => {
      this.slides = document.getElementById('slides');
      this.commentList = document.querySelector('#comments ul');
      this.navigation = document.getElementById('slideshow-buttons');
      this.info = document.getElementById('information');
      this.form = document.querySelector('#comments form');
      this.commentName = document.getElementById('name');
      this.commentEmail = document.getElementById('email');
      this.commentBody = document.getElementById('body');

      await this.initialPageLoad();

      this.addListeners();
    });
  }

  async initialPageLoad() {
    await this.getPhotos();
    this.renderPhotos();
    this.figures = [...document.querySelectorAll('#slides figure')];
    this.updateFigureVisibility();
    this.renderLeadPhotoInfo();
    await this.getComments();
    this.renderComments();
  }

  addListeners() {
    this.addSlideShowFunctionality();
    this.activateLikeFavButtons();
    this.activateCommentSubmission();
  }

  async getPhotos() {
    try {
      let response = await fetch('/photos');
      if (response.ok) {
        this.photos = await response.json();
        this.leadPhoto = this.photos[this.visibleIdx];
      } else {
        throw new Error(`${response.statusText}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  renderPhotos() {
    this.resetPhotos();
    let photosHTML = templates.photos(this.photos);
    this.slides.innerHTML = photosHTML;
  }

  updateFigureVisibility() {
    this.figures.forEach((figure, idx) => {
      if (idx === this.visibleIdx) {
        figure.classList.remove('hidden');
        figure.classList.add('visible');
      } else {
        figure.classList.remove('visible');
        figure.classList.add('hidden');
      }
    });
  }

  resetPhotos() {
    this.slides.innerHTML = '';
  }

  renderLeadPhotoInfo() {
    this.info.innerHTML = '';
    let leadPhotoInfo = templates.photoInformation(this.leadPhoto);
    this.info.innerHTML = leadPhotoInfo;
  }

  async getComments() {
    let photoId = this.leadPhoto.id;
    let path = `comments?photo_id=${photoId}`;

    try {
      let response = await fetch(path);
      if (response.ok) {
        this.comments = await response.json();
      } else {
        throw new Error(`${response.statusText}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  renderComments() {
    this.resetComments();
    let commentsHTML = templates.comments(this.comments);
    this.commentList.innerHTML = commentsHTML;
  }

  resetComments() {
    this.commentList.innerHTML = '';
  }

  addSlideShowFunctionality() {
    this.navigation.addEventListener('click', async (event) => {
      let target = event.target;
      let imgCount = this.figures.length;

      if (target === document.querySelector('.next')) {
        this.visibleIdx = (this.visibleIdx + 1) % imgCount;
      } else if (target === document.querySelector('.prev')) {
        this.visibleIdx = (this.visibleIdx + (imgCount - 1)) % imgCount;
      } else {
        return;
      }

      this.updateFigureVisibility();

      this.leadPhoto = this.photos[this.visibleIdx];
      this.renderLeadPhotoInfo();
      await this.getComments();
      this.renderComments();
    });
  }

  activateLikeFavButtons() {
    const LIKE_DETAILS = {
      path: '/photos/like',
      symbol: '♡',
      type: 'Likes',
    };

    const FAV_DETAILS = {
      path: '/photos/favorite',
      symbol: '☆',
      type: 'Favorites',
    };

    this.info.addEventListener('click', async (event) => {
      let target = event.target;
      if (target.tagName !== 'A') return;

      let likeButton = document.querySelector('#information .like');
      let faveButton = document.querySelector('#information .favorite');
      if (target === likeButton) {
        event.preventDefault();
        let node = document.querySelector('.like');
        await this.incrementCount(LIKE_DETAILS, node);
      } else if (target === faveButton) {
        event.preventDefault();
        let node = document.querySelector('.favorite');
        await this.incrementLikeFaveCount(FAV_DETAILS, node);
      }
    });
  }

  async incrementLikeFaveCount(details, node) {
    let body = JSON.stringify({ photo_id: this.leadPhoto.id });
    let options = {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    };

    try {
      let response = await fetch(details.path, options);
      if (response.ok) {
        let count = await response.json();
        let total = count.total;
        node.textContent = `${details.symbol} ${total} ${details.type}`;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  activateCommentSubmission() {
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      let name = "&name=" + encodeURIComponent(this.commentName.value);
      let email = "&email=" + encodeURIComponent(this.commentEmail.value);
      let text = "&body=" + encodeURIComponent(this.commentBody.value);
      let body = "photo_id=1" + [name, email, text].join('');

      this.submitComment(body);
    }, true);
  }

  async submitComment(body) {
    let path = '/comments/new';
    let options = {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
    };

    try {
      let response = await fetch(path, options);
      if (response.ok) {
        let newComment = await response.json();
        this.addNewComment(newComment);
        this.resetCommentForm();
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  addNewComment(comment) {
    let html = templates.comment(comment);
    this.commentList.innerHTML += html;
  }

  resetCommentForm() {
    this.commentName.value = '';
    this.commentEmail.value = '';
    this.commentBody.value = '';
  }
}

let manager = new PhotoGalleryManager();