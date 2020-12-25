
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
  1. Get current date and day of the week and display them on page
  2. Check if any previously stored data exists (stored AppointmentInfo). If it does load it into memory (local AppointmentInfo)
  3. Get user gps location. If it's available, find the closest clinic, save it to local appointmentInfo and update stored appointmentInfo
  4. Render local appointmentInfo
  5. Populate select fields with options from hardcoded data
  
* When any changes to local appointmentInfo are made, render them and save to LocalStorage

To decide:
* Show stored OR current time on page on load. Subsequently - store time in localStorage or not (for now the time is stored, current time shown in the input field)

TO DO:
done - Single edit forms for each field. The edit form is called when the user clicks on the respective fields on the page.
Fix the closest clinic not displaying after page reload if a different clinic is saved to LocalStorage.


------------------------*/


import { clinics } from './clinics.js';
import { specialities } from './specialities.js';

//page elements
let inputForm = document.querySelector('form[name=appointmentInfoFrom]'),
  speciality = document.querySelector('.appointment-details__doc-speciality'),
  doctor = document.querySelector('.appointment-details__doc-name'),
  time = document.querySelector('.appointment-details__time'),
  date = document.querySelector('.appointment-details__date'),
  room = document.querySelector('.appointment-details__room'),
  clinicName = document.querySelector('.appointment-details__clinic-name'),
  clinicType = document.querySelector('.appointment-details__clinic-type');
let editableFields = document.querySelectorAll('[data-fields]');


//modal elements
let modal = document.querySelector('.modal'),
  closeBtn = document.querySelector('.modal__close-btn'),
  inputClinic = document.querySelector('.modal__input_field_clinic'),
  inputDoctor = document.querySelector('.modal__input_field_doctor'),
  inputSpeciality = document.querySelector('.modal__input_field_speciality'),
  inputRoom = document.querySelector('.modal__input_field_room'),
  inputTime = document.querySelector('.modal__input_field_time');
let allInputFields = modal.querySelectorAll('[for],[for]+*'); //labels + fields

//appointment info
let appointmentInfo = {
  specialityID: '1',
  doctor: 'Иванов Иван Иванович',
  room: '216',
  clinicID: '1',
  time: ''
}

// 1 Get current date and day of the week and display them on page
setDate();

// 2. Check if any previously stored data exists (stored AppointmentInfo). If it does load it into memory (local AppointmentInfo)
if(localStorage.getItem('appointmentInfo')){
  appointmentInfo = JSON.parse(localStorage.getItem('appointmentInfo'));
}

// 3. Get user gps location. If it's available, find the closest clinic, save it to local appointmentInfo and update stored appointmentInfo
getClosestClinic();

// 4. Render local appointmentInfo
renderInfo();

// 5. Populate select fields with options from hardcoded data
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


// Event Listeners

editableFields.forEach(el => {
  el.addEventListener('click', showModal); //showBtn.addEventListener('click', showModal);
})
closeBtn.addEventListener('click', hideModal);
inputForm.addEventListener('submit', updateInfo);
document.addEventListener('DOMContentLoaded', hideSpinner, false);

// Functions 
function getClosestClinic() {
  if (!navigator.geolocation) {
    return
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function success(position) {
    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;
    let minDistance = 99999;
    let closestClinicID;
    clinics.forEach((el, i) => {
      let clinicLatitude = clinics[i].latitude,
        clinicLongitute = clinics[i].longitude;
      let distance = getDistanceBetween(userLatitude, userLongitude, clinicLatitude, clinicLongitute);
      if (minDistance > distance) {
        minDistance = distance;
        closestClinicID = i;
      }
    });
    appointmentInfo.clinicID = closestClinicID.toString();
    setLocalStorage();

  }

  function error() {
  }

  function getDistanceBetween(lat1, lon1, lat2, lon2) {
    lat1 = deg2Rad(lat1);
    lat2 = deg2Rad(lat2);
    lon1 = deg2Rad(lon1);
    lon2 = deg2Rad(lon2);
    let R = 6371,
      x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2),
      y = (lat2 - lat1),
      d = Math.sqrt(x * x + y * y) * R;
    return d;
  }

  function deg2Rad(deg) {
    return deg * Math.PI / 180;
  }
}

function setLocalStorage(){
  localStorage.setItem('appointmentInfo', JSON.stringify(appointmentInfo));
}

function setDate() {
  const currentTime = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  let currentDate = currentTime.toLocaleDateString('ru-RU', options);
  date.textContent = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);
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

function renderInfo() {
  doctor.textContent = appointmentInfo.doctor;
  speciality.textContent = specialities[appointmentInfo.specialityID];
  room.textContent = appointmentInfo.room;
  clinicName.textContent = clinics[appointmentInfo.clinicID].name;
  clinicType.textContent = clinics[appointmentInfo.clinicID].type;
  time.textContent = appointmentInfo.time;
}

function showModal(event) {
  let eventTarget = this || event.target;
  let chosenFields = eventTarget.dataset.fields.split(',');
  chosenFields.forEach(el => {

  })
  // choose fields to show
  // ["clinic", "doctor", "speciality", "room", "time"]
  allInputFields.forEach(node => {
    if (node.hasAttribute('for')) {
      if (!chosenFields.includes(node.attributes.for.value)) {
        node.style.display = 'none';
      }
    } else {
      if (!chosenFields.includes(node.attributes.name.value)) {
        node.style.display = 'none';
      }
    }

  })
  
  //label.attributes.for.value
  modal.classList.add('modal_open');

  inputClinic.value = appointmentInfo.clinicID;
  inputDoctor.value = appointmentInfo.doctor;
  inputRoom.value = appointmentInfo.room;
  inputSpeciality.value = appointmentInfo.specialityID;
  inputTime.value = getCurrentTime();

  function getCurrentTime() {
    // in 00:00 format
    let currentTime = new Date();
    let currentHour = currentTime.getHours().toString().length > 1
      ? currentTime.getHours()
      : '0' + currentTime.getHours();
    let currentMinute = currentTime.getMinutes().toString().length > 1
      ? currentTime.getMinutes()
      : '0' + currentTime.getMinutes();
    return currentHour + ':' + currentMinute;
  }
}

function hideModal() {
  modal.classList.remove('modal_open');
  allInputFields.forEach(node => {
    node.removeAttribute('style');
  })
}

function hideSpinner(){
  document.querySelector('.loading-screen').classList.add('loading-screen_hidden');
}


