import refs from './refs';
import tempTable from '../templates/table.hbs';
import Handlebars from 'handlebars/runtime';

Handlebars.registerHelper('add', function (a, b) {
  return a + b;
});

const {
  count,
  errorText,
  tableWrappler,
  searchInput,
  buttonClear,
  formSearch,
} = refs;

let inputValue = '';
let tableData = [];
let total = 0;

formSearch.addEventListener('submit', onSearch);
buttonClear.addEventListener('click', onClear);

function onSearch(e) {
  e.preventDefault();
  errorText.textContent = '';
  inputValue = e.currentTarget.searchInput.value;
  // if (inputValue.trim().length === 0) {
  //   return errorContent();
  // }
  onFetch(inputValue);
}

function onClear() {
  searchInput.value = '';
  tableWrappler.innerHTML = '';
  errorText.textContent = '';
}

function onFetch(value) {
  fetch(`http://universities.hipolabs.com/search?country=${value}`, {
    referrerPolicy: 'unsafe-url',
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      tableData = data;
      tableData.forEach(el => {
        el.check = false;
      });
      localStorage.setItem('tabs', JSON.stringify(tableData));
      tableWrappler.innerHTML = '';
      if (data.length === 0) {
        return errorContent();
      }

      let listTable = tempTable(tableData);
      tableWrappler.insertAdjacentHTML('afterbegin', listTable);

      let table = document.getElementById('table');
      table.addEventListener('change', onChecked);

      // let checkbox = document.querySelectorAll('.checkbox');
      // let arrayCheckbox = Array.from(checkbox);
      // console.log(arrayCheckbox);
      // arrayCheckbox.map(elem => {
      //   elem.addEventListener('change', () => {
      //     let numberCount = arrayCheckbox.reduce((acc, el) => {
      //       return (acc += el.checked);
      //     }, 0);
      //     cout.textContent = numberCount;
      //   });
      // });
    })
    .catch(() => {
      errorContent();
    });
}

console.log(tableData);
function onChecked(e) {
  tableData[Number(e.target.id)].check = e.target.checked;
  localStorage.setItem('tabs', JSON.stringify(tableData));
  if (e.target.checked) {
    total += 1;
  } else {
    total -= 1;
  }
  count.textContent = total;
}

function errorContent() {
  errorText.textContent = 'Уточните название страны или попробуйте позже';
}

tableData = JSON.parse(localStorage.getItem('tabs'));

renderStorage(tableData);

function renderStorage(data) {
  if (!data) {
    return;
  }
  tableWrappler.innerHTML = '';
  if (data.length === 0) {
    return errorContent();
  }

  let listTable = tempTable(data);
  tableWrappler.insertAdjacentHTML('afterbegin', listTable);

  total = data.reduce((acc, el) => {
    return (acc += el.check);
  }, 0);

  count.textContent = total;
  let table = document.getElementById('table');
  table.addEventListener('change', onChecked);
}
