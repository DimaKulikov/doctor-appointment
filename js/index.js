
/*------------------------

Functionality:
* Let the user enter custom data to these fields:
  - Speciality
  - Doctor name
  - Time of appointment
  - Room
  - Clinic

* Entered data is saved to LocalStorage to be kept between page reloads

* On page load:
  - Get current date and day of the week and display them on page
  - Check if any previously stored data exists (stored AppointmentInfo). If it does load it into memory (local AppointmentInfo)
  - Get user gps location. If it's available, find the closest clinic, save it to local appointmentInfo and update stored appointmentInfo
  - Render local appointmentInfo
  - When any changes to local appointmentInfo are made, render them and save to LocalStorage

To decide:
* Show stored OR current time on page on load. Subsequently - store time in localStorage or not (for now the time is stored, current time shown in the input field)

------------------------*/


import { clinics } from './clinics.js';
import { specialities } from './specialities.js';

//page elements
let showBtn = document.querySelector('.burger-btn'),
  form = document.forms[0],
  speciality = document.querySelector('.appointment-details__doc-speciality'),
  doctor = document.querySelector('.appointment-details__doc-name'),
  time = document.querySelector('.appointment-details__time'),
  date = document.querySelector('.appointment-details__date'),
  room = document.querySelector('.appointment-details__room'),
  clinicName = document.querySelector('.appointment-details__clinic-name'),
  clinicType = document.querySelector('.appointment-details__clinic-type');

//modal elements
let modal = document.querySelector('.modal'),
  closeBtn = document.querySelector('.modal__close-btn'),
  inputClinic = document.querySelector('.modal__input_field_clinic'),
  inputDoctor = document.querySelector('.modal__input_field_doctor'),
  inputSpeciality = document.querySelector('.modal__input_field_speciality'),
  inputRoom = document.querySelector('.modal__input_field_room'),
  inputTime = document.querySelector('.modal__input_field_time');



//appointment info
let appointmentInfo = {
  specialityID: '1',
  doctor: 'Иванов Иван Иванович',
  room: '216',
  clinicID: '1',
  time: ''
}

//get appointment info from local storage on load
if(localStorage.getItem('appointmentInfo')){
  appointmentInfo = JSON.parse(localStorage.getItem('appointmentInfo'));
}

// 
getClosestClinic();

function getClosestClinic() {

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    let minDistance = 99999;
    let closestClinicID;

    clinics.forEach((el, i) => {
      let distance = PythagorasEquirectangular(latitude, longitude, clinics[i].latitude, clinics[i].longitude);
      if (minDistance > distance) {
        minDistance = distance;
        closestClinicID = i;
      }
    });
    appointmentInfo.clinicID = closestClinicID;
    renderInfo();
  }

  function error() {
    alert('error');
  }

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function Deg2Rad(deg) {
  return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);
  lon1 = Deg2Rad(lon1);
  lon2 = Deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = (lat2 - lat1);
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}

function setLocalStorage(){
  localStorage.setItem('appointmentInfo', JSON.stringify(appointmentInfo));
}

function updateInfo(event) {
  event.preventDefault();
  appointmentInfo.specialityID = inputSpeciality.value;
  appointmentInfo.doctor = inputDoctor.value;
  appointmentInfo.time = inputTime.value.charAt(0) === '0' ? inputTime.value.substring(1) : inputTime.value;
  appointmentInfo.room = inputRoom.value;
  appointmentInfo.clinicID = inputClinic.value;
  renderInfo();  
  hideModal();
  setLocalStorage();
}

function renderInfo(){
  doctor.textContent = appointmentInfo.doctor;
  speciality.textContent = specialities[appointmentInfo.specialityID];
  room.textContent = appointmentInfo.room;
  clinicName.textContent = clinics[appointmentInfo.clinicID].name;
  clinicType.textContent = clinics[appointmentInfo.clinicID].type;
  time.textContent = appointmentInfo.time;
}



// populate select fields
clinics.forEach((el, index) => {
  let newOption = document.createElement('option');
  newOption.text = el.shortName;
  newOption.value = index;
  inputClinic.appendChild(newOption);
})
specialities.forEach((el, index) => {
  let newOption = document.createElement('option');
  newOption.text = el;
  newOption.value = index;
  inputSpeciality.appendChild(newOption);
})

//load last date from local storage
if (localStorage.getItem('clinic')) {
  clinicName.textContent = clinics[localStorage.getItem('clinic')].name;
  clinicType.textContent = clinics[localStorage.getItem('clinic')].type;
}
if (localStorage.getItem('doctor')) {
  doctor.textContent = localStorage.getItem('doctor');
}

// set current date and weekday
function updateDate() {
  const currentTime = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  let currentDate = currentTime.toLocaleDateString('ru-RU', options);
  date.textContent = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);  
}

function showModal() {
  let currentTime = new Date();  
  let currentHour = currentTime.getHours().toString().length > 1 ? currentTime.getHours() : '0' + currentTime.getHours(),
      currentMinute = currentTime.getMinutes().toString().length > 1 ? currentTime.getMinutes() : '0' + currentTime.getMinutes();
  modal.classList.add('modal_open');
  inputClinic.value = appointmentInfo.clinicID;
  inputDoctor.value = appointmentInfo.doctor;
  inputRoom.value = appointmentInfo.room;
  inputSpeciality.value = appointmentInfo.specialityID;
  inputTime.value = currentHour + ':' + currentMinute;
}

function hideModal() {
  modal.classList.remove('modal_open');
}

showBtn.addEventListener('click', showModal);
closeBtn.addEventListener('click', hideModal);
form.addEventListener('submit', updateInfo);
updateDate();
renderInfo();

function hideSpinner(){
  document.querySelector('.loading-screen').classList.add('loading-screen_hidden');
}

document.addEventListener('DOMContentLoaded', hideSpinner, false);

