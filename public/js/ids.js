'use strict';
// const markingBlock = document.querySelector('.marking_block');
const markingInput = document.getElementById('inputText');
const thread = document.getElementsByName('thread');
const accuracy = document.getElementsByName('accuracy');
const diapasone = document.getElementsByName('diapasone');
const type = document.getElementsByName('sensorType');
const markingBTN = document.getElementById('showMarkingBTN');
const text = document.getElementById("inputText");
const btnEmail = document.getElementById("btnEmail");
const sendForm = document.getElementById("sendForm");
const minDiapasone = document.getElementById('minDiapasone');
const maxDiapasone = document.getElementById('maxDiapasone');
const alertMsgForDiap = document.getElementById('alertMsgForDiap'); 
const alertMsgForMarking = document.getElementById('alertMsgForMarking');

var finaleMarking = ''; // финальная маркировка
let curType = 'ИД-S'; // модификация ИД
let curDiapasone = ''; // диапазона измерения ИД
let curAccuracy = ''; // погрешность
let curThread = ''; // резьба
let gosPoverka = ''; // госповерка


// // Определение выбранного типа ИД и отражение изображения
// type.forEach(link =>{
//   link.addEventListener('click', (e) => {
//     curType = e.target.value;

//     const imglS = document.getElementById('imglS');
//     const imglSt = document.getElementById('imglSt');
//     const labelImglS = document.getElementById('labelImglS');
//     const labelImglSt = document.getElementById('labelImglSt');

//     switch (curType) {
//       case 'ИД-S':
//         imglS.classList.add('show');
//         imglSt.classList.remove('show');
//         labelImglS.classList.add('show');
//         labelImglSt.classList.remove('show');
//         break;
//       case 'ИД-St':
//         imglSt.classList.add('show');
//         imglS.classList.remove('show');
//         labelImglSt.classList.add('show');
//         labelImglS.classList.remove('show');
//         break;
//       default:
//           alert( "Нет таких значений" );
//     };
//     // // запуск функции определения диапазона измерения
//     // properDiap();
//     // проверка и подсветка изменения маркировки
//     chChangeMark = true; // флаг изменнения маркировки
//     BGcolorMarkingBlock();
//   });
// });



/////////////////////////////////////  Диапазона измерения   /////////////////////////////
let curDiapMax = ''; // диапазона измерения ИД "до"
let chChangeMark = false; // проверка изменения конфигурации после формирования маркировки

// //  Определениме возможного диапазона измерения
// function properDiap () {
//   titleAttributeMax = "Значение от 0,6 до 2,5 МПа";
//   // всплывающие подсказки для ячеек диапазона
//   maxDiapasone.setAttribute("title", titleAttributeMax);
//   document.getElementById('hide2').innerHTML = titleAttributeMax;
// };


let curDiapMaxFloat = 0.0;
let tmpDiapMax = '';
let chDiap = true;
// Определение максимальной границы диапазона измерения
  maxDiapasone.addEventListener('input', (e) => {
    // ограничение ввода символов в числовой интпут
    chInput(maxDiapasone);
    tmpDiapMax = e.target.value;
    // проверка ввода значений диапазона
    chDiapasone();
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  });

// проверка ввода значений диапазона
function chDiapasone() {
  // преобразование значений переменных в float для сравнения
  curDiapMaxFloat =  parseFloat(tmpDiapMax, 10);
  if (tmpDiapMax != undefined && ( curDiapMaxFloat < 0.6 || curDiapMaxFloat > 2.5 )) {
    maxDiapasone.style.background = '#ff7b7b';
    alertMsgForDiap.classList.add('active');
    alertMsgForDiap.innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Ошибка!</strong> Значения диапазона измерения давления введены неверно.'
    chDiap = false;
  } else {
    alertMsgForDiap.classList.remove('active');
    maxDiapasone.style.background = '#ffffff';
    chDiap = true;
  };
  // обновление значения переменных диапазона измерения
  if (chDiap === true) {
    curDiapMax = tmpDiapMax;
  } else {
    curDiapMax = '';
  };
};



maxDiapasone.onkeydown = function (e) {
  if (e.currentTarget.value.indexOf(".") != '-1' || e.currentTarget.value.indexOf(",") != '-1') { 
    return !(/[.,]/.test(e.key));
  }
};
////////////////////////////////////   Конец Диапазон измерения   /////////////////////////////////




// Определение выбранной погрешности
accuracy.forEach((link) => {
  link.addEventListener('click', (e) => {
    curAccuracy = e.target.value
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  })
});

// Определение выбранной резьбы
const handleThread = document.getElementById('handleThread');
thread.forEach((link) => {
  link.addEventListener('click', (e) => {
    const eVal = e.target.value;
    if (eVal === 'Другая резьба') {
      handleThread.classList.add('active');
      curThread = '';
    } else {
      handleThread.classList.remove('active');
      curThread = eVal;
      // очистка блока ввода нестандартной резьбы
      inputThread.value = '';
    };
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  })
});

// Слушатель для ввода нестандартной резьбы
const inputThread = document.getElementById('inputThread');
inputThread.addEventListener('focusout', () => {
  curThread = inputThread.value;
  // проверка и подсветка изменения маркировки
  chChangeMark = true; // флаг изменнения маркировки
  BGcolorMarkingBlock();
});


////////////////////////////////////     Госповерка      /////////////////////////////////
const checkBoxPoverka = document.getElementById('checkBoxPoverka');
// слушатель на госповерку
checkBoxPoverka.addEventListener('click', () => {
  if (checkBoxPoverka.checked) {
    gosPoverka = '-ГП';
  } else if (!checkBoxPoverka.checked) {
    gosPoverka = '';
  };
 // проверка и подсветка изменения маркировки
 chChangeMark = true; // флаг изменнения маркировки
 BGcolorMarkingBlock();
})
////////////////////////////////////    Конец Госповерка   /////////////////////////////////


// Кнопка отображения итоговой маркировки
const markingBlock = document.getElementById('markingBlock');
markingBTN.addEventListener('click', () =>{
  checkRequiredValues();
  finaleMarking = curType + '-' + curDiapMax + '-(' + curAccuracy + ')-' + curThread + '-Д' + gosPoverka;
  markingInput.value = finaleMarking;

  
  markingBlock.classList.add('active');
  chChangeMark = false;
  BGcolorMarkingBlock();

  // Сохранение ключевых переменных в хранилище
  storeVariables()
});


// Сохранение ключевых переменных в хранилище
function storeVariables() {
  if (typeof(Storage) !== "undefined") {
    sessionStorage.clear();
    sessionStorage['curType'] = curType;
    sessionStorage['curDiap'] = curDiapMax;
    sessionStorage['curAccuracy'] = curAccuracy;
    sessionStorage['curThread'] = curThread;
    sessionStorage['gosPoverka'] = gosPoverka;
  } else {
    console.log('Sorry! No Web Storage support..');
  };
};

// Кнопка копирования маркировки
const btn = document.getElementById("copyText");
btn.addEventListener('click', function () {
    text.select();    

    //пытаемся скопировать текст в буфер обмена
    try { 
      document.execCommand("copy");
    } catch(err) { 
      console.log('Не удалось скопировать маркировку!'); 
    } 
  
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Скопировано: " + markingInput.value;
  });

// обработка события ухода мышки с кнопки "Копировать"
btn.addEventListener('mouseout', function () {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Копировать в буфер";
});



// Кнопка вызова формы отправки на Емайл
btnEmail.addEventListener('click', () => {
  if (!chChangeMark) {
    alertMsgForMarking.classList.remove('active');
    // alertMsgForDiap.classList.remove('active');
    sendForm.classList.add('show');
    document.getElementById('markIDS').value = finaleMarking;
  } else if (chChangeMark) {
    alertMsgForMarking.classList.add('active');
    alertMsgForMarking.innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Внимание!</strong> Нажмите "Сформировать маркировку"'
    // alertMsgForDiap.classList.add('active');
    // alertMsgForDiap.innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Внимание!</strong> Нажмите "Сформировать маркировку"'
  }
});






////////////////////////////////////   Общие функции   /////////////////////////////////
// подсветка фона маркировки в случае изменения характеристик датчика после формирования маркировки
function BGcolorMarkingBlock() {
  const markingBlock = document.getElementById('inputText');
  if (chChangeMark) {
    markingBlock.classList.add('BGcolor');
    sendForm.classList.remove('show');
    reportBox.classList.remove('active');
  } else {
    markingBlock.classList.remove('BGcolor');
    alertMsgForMarking.classList.remove('active');
  }
}; 

// ограничение ввода символов в числовой интпут
function chInput(e) {
  if (e.value.indexOf(".") != '-1') {
    e.value=e.value.substring(0, e.value.indexOf(".") + 4);
  };
};


// проверка заполненности всех обязательных характеристик
function checkRequiredValues() {
  const varNamesArr = {
    'curType' : {
      'varValue' : curType,
      'alertText' : 'Модификация датчика',
      'anchorHref' : '#typeAnchor'
    },
    // 'curDiapMin' : {
    //   'varValue' : curDiapMin,
    //   'alertText' : 'Нижняя граница измерения',
    //   'anchorHref' : '#diapAnchor'
    // },
    'curDiapMax' : {
      'varValue' : curDiapMax,
      'alertText' : 'Верхняя граница измерения',
      'anchorHref' : '#diapAnchor'
    },
    'curAccuracy' : {
      'varValue' : curAccuracy,
      'alertText' : 'Предел основной приведенной погрешности',
      'anchorHref' : '#accuracyAnchor'
    },
    'curThread' : {
      'varValue' : curThread,
      'alertText' : 'Присоединение к процессу',
      'anchorHref' : '#threadAnchor'
    }
  };

  let alertTextFinale = ''; // общий текст с ошибками
  Object.keys(varNamesArr).forEach((key) => {
    const varValue = varNamesArr[key].varValue;

    const alertText = '<a href="'+ varNamesArr[key].anchorHref + '"><li>' + varNamesArr[key].alertText + '</li></a>';
    if (varValue === '') {
      alertTextFinale += alertText ;
    };
  });

  // отображение Алерт-блока
  if (alertTextFinale != '') {
    showAlert(alertTextFinale, 'add');
    btnEmail.style.display = 'none'; // скрытие кнопки отправить на Email
    sendForm.classList.remove('show'); // скрытие формы отправить на Email
    btnInfo.style.display = 'none'; // скрытие кнопки Характеристики ИД
  } else  if (alertTextFinale === '') {
    showAlert(alertTextFinale, 'remove');
    btnEmail.style.display = 'inline-block';
    markingBlock.classList.add('active')
    btnInfo.style.display = 'inline-block';
  };
};


// отображение Алерт-блока
function showAlert(alertList = '', action = '') {
  const alertText = document.getElementById('alertText');
  const alertBox =document.getElementById('alertBox');
  
  if (action === 'remove') {
    alertBox.classList.remove('active');
  } else if (action === 'add') {
    alertBox.classList.add('active');
  };

  alertText.innerHTML = '<ul>' + alertList + '</ul>';
};


