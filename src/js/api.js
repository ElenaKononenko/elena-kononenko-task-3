import refs from './refs';
import tempTable from '../templates/table.hbs';
const { table, searchInput, buttonClear, formSearch } = refs;
import Handlebars from 'handlebars/runtime';

let inputValue = '';

formSearch.addEventListener('submit', onSearch);
buttonClear.addEventListener('click', onClear);

function onSearch(e) {
  e.preventDefault();
  inputValue = e.currentTarget.searchInput.value;
  console.log(e.currentTarget.searchInput.value);
  console.log(inputValue);
  onFetch(inputValue);
}

function onClear() {
  searchInput.value = '';
  table.innerHTML = '';
}

function onFetch(value) {
  fetch(`http://universities.hipolabs.com/search?country=${value}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.dir(data);
      table.innerHTML = '';
      let el = tempTable(data);
      table.insertAdjacentHTML('afterbegin', el);
    });
}

//
Handlebars.registerHelper('add', function (a, b) {
  return a + b;
});
