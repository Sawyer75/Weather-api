import conditions from './conditions.js';
console.log(conditions);
// Получили apiKey после регистрации на сайте  https://www.weatherapi.com
const apiKey ='3b114311419d4503bc381516232601';


// Элементы на странице: 
const header = document.querySelector('.header'); 
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');


//Функия удаляющая карточку: 
function removeCard(errorMessage){
// Удаляем предыдущую карточку:
const prevCard = document.querySelector('.card');
if (prevCard) prevCard.remove();
}

// Функция отображающая ошибку:
function showError(errorMessage) {
   // Отображаем карточку с ошибкой:
const html =`<div class="card">${errorMessage}</div>`;
// Отображаем карточку на странице:
header.insertAdjacentHTML('afterend', html);

}

// Функция разметки карточки:
function showCard ({name,country,temp,condition,imgPath}) {
   // Разметка для карточки:
const html =`<div class="card">
<h2 class="card-city">${name}<span>${country}</span></h2>
   <div class="card-weather">
   <div class="card-value">${temp}<sup>°c</sup></div>
   <img class="card-img" src="${imgPath}" alt="Weather">
</div>
   <div class="card-description">${condition}</div>
</div>`;

// Отображаем карточку на странице:
header.insertAdjacentHTML('afterend', html);
}

// Асинхронная функция:
async function getWeather(city){
   // Делаем запрос на сервер по адресу и подставляем переменную city:
   const url =`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

// Делаем fetch запрос по url и записываем результат в response:
   const response = await fetch(url);

   // Получаем данные и записываем их в data: 
   const data = await response.json();
console.log(data);
return data;
}

// Слушаем отправку формы:
form.onsubmit = async function (event) {
// Обьявляем обьект event который отвечает за произошедшее событие и вызываем у него preventDefault() чтобы отменить отправку формы:
   event.preventDefault();
   // Далее берем значение из input,обрезаем пробелы и табы при помощи trim()
let city = input.value.trim();

// Получаем данные с сервера:
const data = await getWeather(city);

  // Проверка на ошибку:
   if (data.error) {
   removeCard();
   // Если есть ошибка выводим ее:
   showError(data.error.message);
   
   } else {
   // Если ошибки нет выиодим карточку:
   // Отображаем полученные данные в карточке:
   // Удаляем предыдущую карточку:
   removeCard();
console.log(data.current.condition.code);

const info = conditions.find(function(obj){
if(obj.code === data.current.condition.code){
return true;
}
})
console.log(info);
console.log(info.languages[23]['day_text']);

const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/';

const fileName = (data.current.is_day ? info.day : info.night) + '.png';

const imgPath = filePath + fileName;

console.log('filePath', fileName + fileName);


   // Показать карточку на странице:
const weatherData = {
   name:data.location.name,
   country:data.location.country,
   temp:data.current.temp_c,
   condition:data.current.is_day
   ?info.languages[23]['day_text']
   :info.languages[23]['night_text'], 
   imgPath:imgPath,
}

showCard(weatherData)

   };
}

