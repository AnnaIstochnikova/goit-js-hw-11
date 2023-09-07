'use strict';
import axios from 'axios';

//const options = {};
let requestedWord = '';
const gallery = document.querySelector('gallery');
const btn = document.querySelector('.button');
const input = document.querySelector('.searchQuery');

const API_KEY = '39259694-dab3c4ff3451cd0969a895f6a';
axios.defaults.headers.common['x-api-key'] = API_KEY;

input.addEventListener('change', function eventHandler(event) {
  event.preventDefault();
  requestedWord = event.target.value.toLowerCase().replace(/\s+/g, '+');
  console.log(requestedWord);
  const fetchData = async () => {
    const response = await axios.get(
      `https://pixabay.com/api/?key=39259694-dab3c4ff3451cd0969a895f6a&q=${requestedWord}`,
      {
        params: {
          //q: requestedWord,
          //image_type: 'photo',
        },
      }
    );
    const data = await response.json();
    return data;
  };

  btn.addEventListener('click', function runButton(event) {
    event.preventDefault();
    fetchData()
      .then(data => console.log(data))
      .catch(error => console.log(error.message));
  });
});

function renderPhotos(photos) {
  photos.forEach(photo => {
    const addPhotoToSelect = `<div class="photo-card">
      <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${photo.likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${photo.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${photo.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${photo.downloads}</b>
        </p>
      </div>
    </div>`;
    gallery.insertAdjacentHTML('afterbegin', addPhotoToSelect);
  });
}
