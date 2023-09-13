'use strict';
import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notiflix.Notify.init({
  showOnlyTheLastOne: true,
  width: '400px',
  position: 'center-center',
  failure: {
    background: '#ff0000',
    textColor: '#fff',
  },
});

const gallery = document.querySelector('.gallery');
const btn = document.querySelector('.button');
const input = document.querySelector('.searchQuery');
const buttonLoadMore = `<button type="button" id="load-more" class="load-more">Load more</button>`;
let requestedWord = '';
let currentPage = 1;

gallery.insertAdjacentHTML('afterend', buttonLoadMore);
const btnLoadMore = document.querySelector('.load-more');
btnLoadMore.classList.add('hidden');

input.addEventListener('change', function eventHandler(event) {
  event.preventDefault();
  requestedWord = event.target.value.toLowerCase().replace(/\s+/g, '+');
});

const fetchData = async () => {
  const response = await axios.get(
    `https://pixabay.com/api/?key=39259694-dab3c4ff3451cd0969a895f6a&q=${requestedWord}`,
    {
      params: {
        safesearch: true,
        orientation: 'horizontal',
        image_type: 'photo',
        per_page: 40,
        page: currentPage,
      },
    }
  );
  return response.data;
};

btn.addEventListener('click', function runButton(event) {
  event.preventDefault();
  fetchData()
    .then(data => {
      gallery.innerHTML = '';
      renderPhotos(data.hits);
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        if (data.totalHits > 40) {
          btnLoadMore.classList.remove('hidden');
          btnLoadMore.addEventListener('click', function loadMoreHandler() {
            currentPage++;
            fetchData()
              .then(data => {
                renderPhotos(data.hits);
                if (gallery.children.length >= data.totalHits) {
                  btnLoadMore.classList.add('hidden');
                  Notiflix.Notify.failure(
                    "We're sorry, but you've reached the end of search results."
                  );
                }
              })
              .catch(error => console.log(error.message));
          });
        }
      }
    })
    .catch(error => console.log(error.message));
});

function renderPhotos(photos) {
  photos.forEach(photo => {
    const addPhotoToSelect = `<div class="photo-card">
    <a class="gallery__link" href="${photo.largeImageURL}">
      <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b> 
          <b>${photo.likes}</b>
        </p>
        <p class="info-item">
          <b>Views</b> 
          <b>${photo.views}</b>
        </p>
        <p class="info-item">
          <b>Comments</b> 
          <b>${photo.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <b>${photo.downloads}</b>
        </p>
      </div>
    </div>`;

    gallery.insertAdjacentHTML('beforeend', addPhotoToSelect);
  });
  simpleLightbox.refresh();
}

let simpleLightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
