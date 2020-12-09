'use strict';
const selCountry = document.getElementsByName('selCountry');

window.onscroll = function() {myFunction(), scrollFunction()};

// Прокрутка цветной полосы
function scrollFunction() {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";

  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
};

// Фиксация верхнего меню при прокрутке вниз
let navbar = document.getElementById("navbar"); 
let sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
};


let countryCode = ''; // телефонный код страны
let curCountry = '' // переменная страны отправителя

const sel = document.getElementById('selCountry');
sel.addEventListener('change', () => {
  // reference to selected option
  const opt = sel.options[sel.selectedIndex];
  countryCode = opt.value;
  curCountry = opt.text;

  const otherCountru = document.getElementById('otherCountruBlock');
  const otherCountruText = document.getElementById('otherCountruText');

  if (countryCode === 'other_country') {
    otherCountru.classList.add('show');
    otherCountruText.setAttribute("required", "");
    otherCountruText.value = '';
    // console.log('done');
  } else {
    // скрытие ввода другой страны
    otherCountru.classList.remove('show');
    otherCountruText.removeAttribute("required");
  }
  // обработчик выбора стран
  selCountryFunc();
});





let indent = 0; // отступ для начала ввода номера
let placeholder = ''; 
let pattern = '';
 // обработчик выбора стран
function selCountryFunc(params) {
  // информация по странам
  const countryInfo =  {
    'Выберите страну:' : {
      'curIndent' : 0,
      'curPlaceholder' : 'номер в международном формате',
      'curPattern' : '.*'
    },
    'Азербайджан' : {
      'curIndent' : 5,
      'curPlaceholder' : "+994(__)___-__-__",
      'curPattern' : "\\+994\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Армения' : {
      'curIndent' : 5,
      'curPlaceholder' : "+374(__)__-__-__",
      'curPattern' : "\\+374\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{2}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Беларусь' : {
      'curIndent' : 5,
      'curPlaceholder' : "+375(__)___-__-__",
      'curPattern' : "\\+375\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Болгария' : {
      'curIndent' : 5,
      'curPlaceholder' : "+359(__)__-__-__",
      'curPattern' : "\\+359\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{2}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Грузия' : {
      'curIndent' : 5,
      'curPlaceholder' : "+995(__)___-__-__",
      'curPattern' : "\\+995\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Казахстан' : {
      'curIndent' : 3,
      'curPlaceholder' : "+7(___)___-__-__",
      'curPattern' : "\\+7\\s?[\\(]{0,1}[0-9]{3}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Кыргызстан' : {
      'curIndent' : 5,
      'curPlaceholder' : "+996(__)___-__-__",
      'curPattern' : "\\+996\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Латвия' : {
      'curIndent' : 5,
      'curPlaceholder' : "+371(__)__-__-__",
      'curPattern' : "\\+371\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{2}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Литва' : {
      'curIndent' : 5,
      'curPlaceholder' : "+370(__)__-__-__",
      'curPattern' : "\\+370\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{2}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Монголия' : {
      'curIndent' : 5,
      'curPlaceholder' : "+976(__)__-__-__",
      'curPattern' : "\\+976\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{2}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Польша' : {
      'curIndent' : 4,
      'curPlaceholder' : "+48(__)___-__-__",
      'curPattern' : "\\+48\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Россия' : {
      'curIndent' : 3,
      'curPlaceholder' : "+7(___)___-__-__",
      'curPattern' : "\\+7\\s?[\\(]{0,1}[0-9]{3}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Словакия' : {
      'curIndent' : 5,
      'curPlaceholder' : "+421(__)___-__-__",
      'curPattern' : "\\+421\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Словения' : {
      'curIndent' : 5,
      'curPlaceholder' : "+386(__)__-__-__",
      'curPattern' : "\\+386\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{2}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Таджикистан' : {
      'curIndent' : 5,
      'curPlaceholder' : "+992(__)___-__-__",
      'curPattern' : "\\+992\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Туркменистан' : {
      'curIndent' : 5,
      'curPlaceholder' : "+993(__)__-__-__",
      'curPattern' : "\\+993\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{2}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Узбекистан' : {
      'curIndent' : 5,
      'curPlaceholder' : "+998(__)___-__-__",
      'curPattern' : "\\+998\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Украина' : {
      'curIndent' : 5,
      'curPlaceholder' : "+380(__)___-__-__",
      'curPattern' : "\\+380\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Хорватия' : {
      'curIndent' : 5,
      'curPlaceholder' : "+385(__)__-__-__",
      'curPattern' : "\\+385\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{2}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Чехия' : {
      'curIndent' : 5,
      'curPlaceholder' : "+420(__)___-__-__",
      'curPattern' : "\\+420\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}[-]{0,1}\\d{2}"
    },
    'Эстония' : {
      'curIndent' : 5,
      'curPlaceholder' : "+372(__)___-__",
      'curPattern' : "\\+372\\s?[\\(]{0,1}[0-9]{2}[\\)]{0,1}\\s?\\d{3}[-]{0,1}\\d{2}"
    },
    'Другая страна...' : {
      'curIndent' : 0,
      'curPlaceholder' : "",
      'curPattern' : ""
    }
  };

// получение данных по выбранной стране
Object.keys(countryInfo).forEach((key) => {
  if (key === curCountry) {
    indent = countryInfo[key].curIndent;
    placeholder = countryInfo[key].curPlaceholder;
    pattern = countryInfo[key].curPattern;
  }
});
  
  // Ноложение паттерна на номер телефона
  phonePattern ()
}

const phone = document.getElementById('phone');
const labelPhone = document.getElementById('labelPhone');
const phoneOther = document.getElementById('phoneOther');
const labelPhoneOther = document.getElementById('labelPhoneOther');
// Ноложение паттерна  на номер телефона и подмена бокса ввода
// телефона для другой страны
function phonePattern () {
  if (curCountry != 'Другая страна...') {
    phone.value = '';
    phoneOther.value = '';
    phone.placeholder = placeholder;
    phone.pattern = pattern;
    phone.removeAttribute('style');
    labelPhone.removeAttribute('style');
    phoneOther.style.display = 'none';
    labelPhoneOther.style.display = 'none';
  } else if (curCountry === 'Другая страна...') {
    phone.value = '';
    phone.style.display = 'none';
    labelPhone.style.display = 'none';
    phoneOther.removeAttribute('style');
    labelPhoneOther.removeAttribute('style');
  }
};




// Проверка ввода номера телефона (источник кода: https://htmlweb.ru/html/form/form_input_pattern.php)
function setCursorPosition(pos, e) {
  e.focus();
  if (e.setSelectionRange) e.setSelectionRange(pos, pos);
  else if (e.createTextRange) {
    var range = e.createTextRange();
    range.collapse(true);
    range.moveEnd("character", pos);
    range.moveStart("character", pos);
    range.select()
  }
}

function mask(e) {
  //console.log('mask',e);
  var matrix = this.placeholder,// .defaultValue
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, "");
  def.length >= val.length && (val = def);
  matrix = matrix.replace(/[_\d]/g, function(a) {
    return val.charAt(i++) || "_"
  });
  this.value = matrix;
  i = matrix.lastIndexOf(val.substr(-1));
  i < matrix.length && matrix != this.placeholder ? i++ : i = matrix.indexOf("_");
  setCursorPosition(i, this)
};



window.addEventListener("DOMContentLoaded", function() {
  var input = document.querySelector("#phone");
  input.addEventListener("input", mask, true);
  input.focus();
  // console.log('indent =>' + indent);
  setCursorPosition(indent, input);
});


