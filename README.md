# Doctor appointment demonstration

[Demo](https://dimakulikov.github.io/doctor-appointment/)

## Disclaimer
 The project was made for strictly educational purposes, I do not own any of the logos or pictures used on the page. All rights belong to [emias.info](emias.info)
 
## Why was this made
The project was made as a means of practicing HTML/CSS layout skills and JS skills and as a helpful service that my friend working as a pharmaceutical sales representative can use. 

## How was this made
The original web page was used as a layout prototype, but reworked internally to be in line with BEM design principles. JS was written from scratch (except for the haversine formula for caclucating the distance)

## How it works
* The "New appointment" button brings up a modal with input fields for all the editable fields on the page. On submitting the form the data is displayed on the page and also saved to LocalStorage of the browser to be kept between page reloads. All editable fields can be clicked individually on the page itself to also bring up a modal for editing that single field. 
* The list of clinics and the list of specialities to choose from are kept hardcoded (for now) as arrays.
* On page load user location is requested to determine which clinic from the list they are currently physically in (or just closest to). If successful, the closest clinic is displayed on the page as currently chosen clinic. 
* Current date and the day of the week are automatically filled in.
