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

//clinics
const clinics = [
  {
    name: 'ГБУЗ г. Москвы "Городская поликлиника № 69 ДЗМ"',
    type: 'Городская поликлиника',
    shortName: 'ГП69 - 2-я Владимирская, 31А',
    latitude: '55.755068',
    longitude: '37.785052'
  },
  {
    name: 'ГБУЗ ГП № 69 ДЗМ Филиал № 1 (ГП № 30)',
    type: 'Городская поликлиника',
    shortName: 'ГП69Ф1 - Федеративный просп., 31',
    latitude: '55.754127',
    longitude: '37.823509'
  },
  {
    name: 'ГБУЗ ГП № 69 ДЗМ Филиал № 2 (ГП № 73)',
    type: 'Городская поликлиника',
    shortName: 'ГП69Ф2 - Плющева, 20',
    latitude: '55.740091',
    longitude: '37.760863'
  },
  {
    name: 'ГБУЗ г. Москвы "Городская поликлиника № 66 ДЗМ"',
    type: 'Городская поликлиника',
    shortName: 'ГП66 - Салтыковская, 11Б',
    latitude: '55.734765',
    longitude: '37.862408'
  },
  {
    name: 'ГБУЗ ГП 66 ДЗМ филиал 1',
    type: 'Городская поликлиника',
    shortName: 'ГП66Ф1 - Рудневка, 8',
    latitude: '55.715915',
    longitude: '37.889861'
  },
  {
    name: 'ГБУЗ ГП 66 ДЗМ филиал 2',
    type: 'Городская поликлиника',
    shortName: 'ГП66Ф2 - Молдагуловой, 10А',
    latitude: '55.725858',
    longitude: '37.806847'
  },
  {
    name: 'ГБУЗ ГП 66 ДЗМ филиал 4',
    type: 'Городская поликлиника',
    shortName: 'ГП66Ф4 - Новокосинская, 42',
    latitude: '55.742630',
    longitude: '37.874904'
  },
  {
    name: 'ГБУЗ ГП №175 ДЗМ',
    type: 'Городская поликлиника',
    shortName: 'ГП175 - Челябинская, 16',
    latitude: '55.776618',
    longitude: '37.828937'
  },
  {
    name: 'ГБУЗ ГП № 175 ДЗМ филиал № 1 (ГП № 16)',
    type: 'Городская поликлиника',
    shortName: 'ГП175Ф1 - Старый Гай, 5',
    latitude: '55.738617',
    longitude: '37.830195'
  },
  {
    name: 'ГБУЗ ГП № 175 ДЗМ филиал № 3 (ГП № 130)',
    type: 'Городская поликлиника',
    shortName: 'ГП175Ф3 - Молостовых, 7к2',
    latitude: '55.760282',
    longitude: '37.833006'
  }
]

//specialities
const specialities = ['Врач-терапевт участковый',
  'Врач общей практики',
  'Врач-оториноларинголог',
  'Врач-офтальмолог']

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

