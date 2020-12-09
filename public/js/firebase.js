'use strict';

//grab a form
const form = document.querySelector('.form-inline');
const inputEmail = form.querySelector('#inputEmail');
const inputOrganization = form.querySelector('#org');
const inputContactName = form.querySelector('#cName');
const inputMarking = form.querySelector('#markIDS');
const testPhone = form.querySelector('#phone');
const inputphone = document.getElementById('phone');
const inputphoneOther = document.getElementById('phoneOther');
const inputSubject = form.querySelector('#subject');
const inputOtherCountry = document.getElementsByName('otherCountruBlock');


//config your firebase push
const config = {
  apiKey: "AIzaSyDsHCrGCL6-Y32d7XUutfxXEZlC0mi1D1Q",
  authDomain: "konfigurator-6ee0d.firebaseapp.com",
  databaseURL: "https://konfigurator-6ee0d.firebaseio.com",
  projectId: "konfigurator-6ee0d",
  storageBucket: "konfigurator-6ee0d.appspot.com",
  messagingSenderId: "141664495681",
  appId: "1:141664495681:web:4860bfcd0528d032877ec0"
};
let inputCurCountry = '';
let inputContactPhone = '';



// Определения выбранной страны
// Catch the name of country if Other Countru selected
inputOtherCountry.forEach((link) => {
    link.addEventListener('change', (text) => {
        inputCurCountry = text.target.value;
    })
});


// check seleting of a country
const alertMsgCountry = document.getElementById('alertMsgForDiap');
const selectCountry = document.getElementById('selCountry');
let country = '';
selectCountry.addEventListener('input', () =>{
    // reference to selected option
    const op = sel.options[sel.selectedIndex];
    country = op.text;
    if (country != 'Выберите страну:') {
        alertMsgCountry.classList.remove('active');
        // console.log('country 0 =>' + country);
        if (country != 'Другая страна...') {
            inputCurCountry = country;
        }
    }
});


// Телефон для стандартной страны
inputphone.addEventListener('input', () => {
    inputContactPhone = inputphone.value;
});

// Телефон для НЕстандартной страны
inputphoneOther.addEventListener('input', () => {
    inputContactPhone = inputphoneOther.value;
});


//create a functions to push
// function firebasePush(oranization, email) {
    function firebasePush(oranization, name, email, phone, marking, selCountry, info) {

        //prevents from braking
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
    
        //push itself
        var mailsRef = firebase.database().ref('emails').push().
        set({oranization: oranization.value, name: name.value, email: email.value, phone: phone, marking: marking.value, country: selCountry, info: info.value});
    };


//push on form submit
if (form) {
    
    form.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // check filling country block
        if (country === '' || country === 'Выберите страну:') {
            alertMsgCountry.classList.add('active');
            alertMsgCountry.innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Ошибка!</strong> Выберите Вашу страну.'
        } else {
            alertMsgCountry.classList.remove('active');
            firebasePush(inputOrganization, inputContactName, inputEmail, inputContactPhone, inputMarking, inputCurCountry, inputSubject);
            //shows Success message if everything went well.
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function(){ x.className = x.className.replace("show", ""); }, 9000);
        }
    })
};


