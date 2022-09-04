import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('ul.country-list'),
  countryInfo: document.querySelector('div.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(searchCountry, DEBOUNCE_DELAY)
);

function searchCountry(event) {
  const searchValue = event.target.value;
  if (searchValue == '') {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }

  fetchCountries(searchValue)
    .then(countrys => {
      if (countrys.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = '';
        return;
      }

      if (countrys.length <= 10) {
        const listMarkup = countrys.map(country => countryList(country));
        refs.countryList.innerHTML = listMarkup.join('');
        refs.countryInfo.innerHTML = '';
      }

      if (countrys.length === 1) {
        const markup = countrys.map(country => countryСard(country));
        refs.countryInfo.innerHTML = markup.join('');
        refs.countryList.innerHTML = '';
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';
      return error;
    });
}

function countryСard({ flags, name, capital, population, languages }) {
  return `
    <div class="container">
      <div class="wrapper">
        <img src="${flags.svg}" alt="${name.official}" width="50" />
        <h2>${name.official}</h2>
      </div>

      <p><span>Capital:</span> ${capital}</p>
      <p><span>Population:</span> ${population}</p>
      <p><span>Languages:</span> ${Object.values(languages)}</p>
    </div>
  `;
}

function countryList({ flags, name }) {
  return `
  <li class="item">
    <img src="${flags.svg}" alt="${name.official}" width="25" />
    <h2>${name.official}</h2>
  </li>
  `;
}
