'use strict';
const type = document.getElementsByName('sensorType');
const typePreassure = document.getElementsByName('preassureType');
const fieldsetСase = document.getElementsByName('caseType');
const Ex = document.getElementsByName('ExType');
const minDiapasone = document.getElementById('minDiapasone');
const maxDipasone = document.getElementById('maxDiapasone');
const accuracyQm = document.getElementsByName('accuracyQm');
const accuracyQk = document.getElementsByName('accuracyQk');
const alertMsgForMarkingIDQ = document.getElementById('alertMsgForMarking');


let finaleMarking = ''; // финальная маркировка
let curType = ''; // модификация ИД
let curTypePreassure = ''; // вид измеряемого давления
let curCase = ''; // тип корпуса ИД
let curEx = ''; // тип взрывозащиты
let curDiapMin = ''; // диапазона измерения ИД "от"
let curDiapMax = ''; // диапазона измерения ИД "до"
let minDiap1 = 0.0; // минимальная граница диап измерения давления "от"
let maxDiap1 = 0.0; // максимальная граница диап измерения давления "от"
let minDiap2 = 0.0; // минимальная граница диап измерения давления "до"
let maxDiap2 = 0.0; // максимальная граница диап измерения давления "до"
let curAccuracy = ''; // погрешность
let curConnectType = ''; // тип присоединенния
let curKVV = ''; // тип КВВ
let firstKVVChar = ''; // первая доп хар-ка КВВ
let secondKVVChar = ''; // вторая доп хар-ка КВВ
let curThread = ''; // резьба
let curIP = ''; // степень IP
let chChangeMark = false; // проверка изменения конфигурации после формирования маркировки
// let flanInfo = ''; // описание нестандартного фланца Ф5
let flanInfoForEmail = ''; // описание нестандартного фланца Ф5(для отправки по Email)
let threadLinkArr = []; // массив id резьб из выбранного блока для подключения слушателя
let gosPoverka = ''; // госповерка


window.onload = function() {DisplayConnectionBox()};

// запрет нажатия Enter
window.onkeydown = function (evt) {
  if (evt.which === 13) {
      evt.preventDefault();
      evt.stopPropagation();
      return false;
  }
};

// Определение выбранного типа ИД
type.forEach(link =>{
  link.addEventListener('click', (e) => {
    curType = e.target.value;
    switch (curType) {
      case 'ИД-Qк':
        // document.getElementById('diffPress').checked = false
        NodeVisualise(['overpresslabel', 'absPresslabel'],'block');
        NodeVisualise(['modelTlabel'],'none', ['overpress', 'absPress', 'diffPress', 'modelTr', 'modelT', 'modelN1'], false);
        // document.getElementById('overpresslabel').style.display = 'block';
        // document.getElementById('absPresslabel').style.display = 'block';
        document.getElementById('diffPresslabel').style.display = 'none';
        NodeChangeClass(['imgT', 'labelImgT', 'imgTr', 'labelImgTr', 'imgN1', 'labelImgN1'], 'remove', 'show')
        break;
      case 'ИД-Qм':
        // document.getElementById('diffPress').checked = false
        NodeVisualise(['modelTlabel'],'block', ['overpress', 'absPress', 'diffPress', 'modelTr', 'modelT', 'modelN1'], false);
        NodeVisualise(['overpresslabel', 'absPresslabel', 'diffPresslabel'],'block');
        NodeChangeClass(['imgT', 'labelImgT', 'imgTr', 'labelImgTr', 'imgN1', 'labelImgN1'], 'remove', 'show')
        // document.getElementById('overpresslabel').style.display = 'block';
        // document.getElementById('absPresslabel').style.display = 'block';
        // document.getElementById('diffPresslabel').style.display = 'block';
        break;
      default:
        alert( "Не выбрвнв модификация датчика" );
    };
    // очистка ранее выбранного типа соединения с процессом и введенной резьбы 
    curConnectType = '';
    curThread = '';
    // очистка диапазона измерения
    clearPreasureDiap() 
    // Очистка блока 'threadForConnect' с резьбой
    clearThreadBox('threadForConnect');
    // комплексная очистка ранее введенных значений
    clearValues();
    // запуск функции определения диапазона измерения
    properDiap();
    // отражение вариантов выбора погрешности
    accuracyRules();
    // запуск функции отображения возможных типов подсоединения к процессу
    DisplayConnectionBox();
    // отображение КВВ
    checkShowKVV();
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  })
})


// Определение выбранного вида измеряемого давления
typePreassure.forEach(link =>{
  link.addEventListener('click', (e) => {
    curTypePreassure = e.target.value;
    // очистка ранее выбранного типа соединения с процессом и введенной резьбы 
    curConnectType = '';
    curThread = '';
    // очистка диапазона измерения
    clearPreasureDiap() 
    // Очистка блока 'threadForConnect' с резьбой
    clearThreadBox('threadForConnect');
    // комплексная очистка ранее введенных щначений
    clearValues();
    // запуск функции определения диапазона измерения
    properDiap();
    // запуск функции отображения возможных типов подсоединения к процессу
    DisplayConnectionBox();
    // отображение КВВ
    checkShowKVV()
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  })
})


// Определение выбранного типа корпуса и отражение изображения
fieldsetСase.forEach(link =>{
  link.addEventListener('click', (e) => {
    curCase = e.target.value;

    switch (curCase) {
      case 'Тр':
        NodeChangeClass(['imgTr', 'labelImgTr'], 'add', 'show')
        NodeChangeClass(['imgN1', 'labelImgN1', 'imgT', 'labelImgT'], 'remove', 'show')
        NodeVisualise(['exdblabel'], 'none', ['exdb', 'exia'], false);
        break;
      case 'Т':
        NodeChangeClass(['imgN1', 'labelImgN1', 'imgTr', 'labelImgTr'], 'remove', 'show')
        NodeChangeClass(['imgT', 'labelImgT'], 'add', 'show')
        NodeVisualise(['exdblabel'],'block', ['exdb', 'exia'], false);
        break;
      case 'Н1':
        NodeChangeClass(['imgN1', 'labelImgN1'], 'add', 'show')
        NodeChangeClass(['imgT', 'labelImgT', 'imgTr', 'labelImgTr'], 'remove', 'show')
        NodeVisualise(['exdblabel'], 'none', ['exdb', 'exia'], false);
        break;
      default:
        alert( "Нет таких значений" );
        NodeVisualise(null,null, ['exdb', 'exia'], false);
    };
    // обнуление вида взрывозащиты при изменнении типа корпуса
    curEx = '';
    // // комплексная очистка ранее введенных щначений
    // clearValues();
    // очистка ранее введенных значений для КВВ 
    clearKVVValues()
    // отображение КВВ
    checkShowKVV()
    // формирование и отрисовкка массива доступных к 
    // выбору типов IP
    ipDegree()
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  });
});


// Определение вида взрывозащиты
Ex.forEach(link =>{
  link.addEventListener('click', (e) => {
    curEx = e.target.value;
    // комплексная очистка ранее введенных щначений
    clearValues();
    // отображение КВВ
    checkShowKVV()
    // формирование и отрисовкка массива доступных к 
    // выбору типов IP
    ipDegree()
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  });
});



////////////////////////////////////   Диапазон измерения   /////////////////////////////////
const hide1 = document.getElementById('hide1');
const hide2 = document.getElementById('hide2');
let titleAttributeMin = '';
let titleAttributeMax = '';
//  Определениме возможного диапазона измерения
function properDiap () {
  if (curType != '' && curTypePreassure != '') {

    switch (curType) {
      case 'ИД-Qк':
        switch (curTypePreassure) {
          case 'И':
            minDiap1 = 0;
            maxDiap1 = 50;
            minDiap2 = 0.6;
            maxDiap2 = 50;
            titleAttributeMin = "Значение от 0 до 50 МПа";
            titleAttributeMax = "Значение от 0,6 до 50 МПа";
            break;
          case 'А':
            minDiap1 = 0;
            maxDiap1 = 3.5;
            minDiap2 = 0.6;
            maxDiap2 = 3.5;
            titleAttributeMin = "Значение от 0 до 3,5 МПа";
            titleAttributeMax = "Значение от 0,6 до 3,5 МПа";
            break;
          default:
            minDiap1 = 0;
            maxDiap1 = 0;
            minDiap2 = 0;
            maxDiap2 = 0;
            titleAttributeMin = '';
            titleAttributeMax = '';
            break;
        }
        break;
      case 'ИД-Qм':
        switch (curTypePreassure) {
          case 'И':
            minDiap1 = -0.1;
            maxDiap1 = 100;
            minDiap2 = 0.01;
            maxDiap2 = 100;
            titleAttributeMin = '(значение от минус 0,1 до 100 МПа)';
            titleAttributeMax = "(значение от 0,01 до 100 МПа)";
            break;
          case 'А':
            minDiap1 = 0;
            maxDiap1 = 3.5;
            minDiap2 = 0.01;
            maxDiap2 = 3.5;
            titleAttributeMin = "(значение от 0 до 3,5 МПа)";
            titleAttributeMax = "(значение от 0,01 до 3,5 МПа)";
            break;
          case 'Р':
            minDiap1 = 0;
            maxDiap1 = 3.5;
            minDiap2 = 0.004;
            maxDiap2 = 3.5;
            titleAttributeMin = "(значение от 0 до 3,5 МПа)";
            titleAttributeMax = "(значение от 0,004 до 3,5 МПа)";
            break;
          default:
            break;
        }
        break;
      default:
        alert( "Не выбрвнв модификация датчика" );
    }
    // // всплывающие подсказки для ячеек диапазона
    // document.getElementById('minDiapasone').setAttribute("title", titleAttributeMin);
    // document.getElementById('maxDiapasone').setAttribute("title", titleAttributeMax);
    hide1.innerHTML = titleAttributeMin;
    hide2.innerHTML = titleAttributeMax;
  }
};

// преобразование значений переменных в float для сравнения
let curDiapMinFloat = 0.0;
let curDiapMaxFloat = 0.0;
let tmpDiapMin = '';
let tmpDiapMax = '';
let chDiap = true;
// Определение минимальной границы диапазона измерения
minDiapasone.addEventListener('change', (e) => {
  // ограничение ввода символов в числовой интпут
  chInput(minDiapasone);
  tmpDiapMin = e.target.value;
  // проверка ввода значений диапазона
  chDiapasone();
  // проверка и подсветка изменения маркировки
  chChangeMark = true; // флаг изменнения маркировки
  BGcolorMarkingBlock();
});

// проверка вводо значения "-0" или "0,0"
minDiapasone.addEventListener('focusout', (e) => {
  const findMinus = e.target.value;
  const findMinusFloat = parseFloat(findMinus, 10);
  if (((findMinus.indexOf("-") != '-1') || (findMinus.indexOf(",") != '-1') || (findMinus.indexOf(".") != '-1')) && (findMinusFloat == 0)) {
    tmpDiapMin = findMinusFloat;
    minDiapasone.value = 0;
    // проверка ввода значений диапазона
    chDiapasone();
  }
});

// Определение максимальной границы диапазона измерения
maxDipasone.addEventListener('change', (e) => {
  // ограничение ввода символов в числовой интпут
  chInput(maxDipasone);
  tmpDiapMax = e.target.value;
  // проверка ввода значений диапазона
  chDiapasone();
  // проверка и подсветка изменения маркировки
  chChangeMark = true; // флаг изменнения маркировки
  BGcolorMarkingBlock();
});

// проверка ввода значений диапазона
function chDiapasone() {

  curDiapMinFloat = parseFloat(tmpDiapMin, 10);
  curDiapMaxFloat = parseFloat(tmpDiapMax, 10);

  // проверка начального диапазона на ввод отрицательного значения
  switch (curType) {
    case 'ИД-Qк':
      switch (curTypePreassure) {
        case 'И':
          minDiap1 = 0;
          maxDiap1 = 50;
          minDiap2 = 0.6;
          maxDiap2 = 50;
          titleAttributeMin = "Значение от 0 до 50 МПа";
          titleAttributeMax = "Значение от 0,6 до 50 МПа";
          break;
        case 'А':
          minDiap1 = 0;
          maxDiap1 = 3.5;
          minDiap2 = 0.6;
          maxDiap2 = 3.5;
          titleAttributeMin = "Значение от 0 до 3,5 МПа";
          titleAttributeMax = "Значение от 0,6 до 3,5 МПа";
          break;
        default:
          minDiap1 = 0;
          maxDiap1 = 0;
          minDiap2 = 0;
          maxDiap2 = 0;
          titleAttributeMin = '';
          titleAttributeMax = '';
          break;
      }
      break;
    case 'ИД-Qм':
      switch (curTypePreassure) {
        case 'И':
          if (curDiapMinFloat > -0.01 && curDiapMinFloat < 0 ) {
                titleAttributeMin = '(значение от минус 0,1 до минус 0,01 МПа)';
                hide1.innerHTML = titleAttributeMin;
          } else {
                if (curDiapMinFloat < 0) {
                  // minDiap2 = 0.01;
                  minDiap2 = 0;
                  maxDiap2 = 3.5;
                  titleAttributeMin = '(значение от минус 0,1 до минус 0,01 МПа)';
                  // titleAttributeMax = '(значение от 0,01 до 3,5 МПа)';
                  titleAttributeMax = '(значения: 0 (вакуум) или от 0,01 до 3,5 МПа (вакуум-избыточное))';
                  hide1.innerHTML = titleAttributeMin;
                  hide2.innerHTML = titleAttributeMax;
                } else if (curDiapMinFloat >= 0) {
                  minDiap2 = 0.01;
                  maxDiap2 = 100;
                  titleAttributeMin = '(значение от 0 до 100 МПа)';
                  titleAttributeMax = '(значение от 0,01 до 100 МПа)';
                  hide1.innerHTML = titleAttributeMin;
                  hide2.innerHTML = titleAttributeMax;
                } else {
                  titleAttributeMin = '(значение от минус 0,1 до 100 МПа)';
                  hide1.innerHTML = titleAttributeMin;
                }
          }
          break;
        case 'А':
          minDiap1 = 0;
          maxDiap1 = 3.5;
          minDiap2 = 0.01;
          maxDiap2 = 3.5;
          titleAttributeMin = "(значение от 0 до 3,5 МПа)";
          titleAttributeMax = "(значение от 0,01 до 3,5 МПа)";
          break;
        case 'Р':
          minDiap1 = 0;
          maxDiap1 = 3.5;
          minDiap2 = 0.004;
          maxDiap2 = 3.5;
          titleAttributeMin = "(значение от 0 до 3,5 МПа)";
          titleAttributeMax = "(значение от 0,004 до 3,5 МПа)";
          break;
        default:
          break;
      }
      break;
    default:
      alert( "Не выбрвнв модификация датчика" );
  };

  if (tmpDiapMin != undefined && tmpDiapMax != undefined && 
     (curDiapMinFloat < minDiap1 || curDiapMinFloat > maxDiap1 || 
      curDiapMaxFloat < minDiap2 || curDiapMaxFloat > maxDiap2 || 
      curDiapMaxFloat < curDiapMinFloat || (curDiapMinFloat > -0.01 && curDiapMinFloat < 0 ))) {

    document.getElementById('minDiapasone').style.background = '#ff7b7b';
    document.getElementById('maxDiapasone').style.background = '#ff7b7b';
    NodeChangeClass(['alertMsgForDiap'], 'add', 'active');
    document.getElementById('alertMsgForDiap').innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Ошибка!</strong> Значения диапазона измерения давления введены неверно.'
    chDiap = false;

// обработка ошибки ввода значений для ИД-Qm ИВ
  } else  if (tmpDiapMin != undefined && tmpDiapMax != undefined && (curDiapMinFloat < 0 && curDiapMaxFloat > 0 && curDiapMaxFloat < 0.01)) {

    document.getElementById('minDiapasone').style.background = '#ff7b7b';
    document.getElementById('maxDiapasone').style.background = '#ff7b7b';
    NodeChangeClass(['alertMsgForDiap'], 'add', 'active');
    document.getElementById('alertMsgForDiap').innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Ошибка!</strong> Значения диапазона измерения давления введены неверно.'
    chDiap = false;

  } else {
    NodeChangeClass(['alertMsgForDiap'], 'remove', 'active');
    document.getElementById('minDiapasone').style.background = '#ffffff';
    document.getElementById('maxDiapasone').style.background = '#ffffff';
    chDiap = true;
  };
  // обновление значения переменных диапазона измерения
  if (chDiap === true) {
    curDiapMax = tmpDiapMax;
    curDiapMin = tmpDiapMin;
  } else {
    curDiapMax = '';
    curDiapMin = '';
  };
};

// запрет ввода нескольких запятай/точек в числовом инпуте
minDiapasone.onkeydown = function (e) {
  if (e.currentTarget.value.indexOf(".") != '-1' || e.currentTarget.value.indexOf(",") != '-1') { 
    return !(/[.,]/.test(e.key));
  }
};
maxDipasone.onkeydown = function (e) {
  if (e.currentTarget.value.indexOf(".") != '-1' || e.currentTarget.value.indexOf(",") != '-1') { 
    return !(/[.,]/.test(e.key));
  }
};
////////////////////////////////////   Конец Диапазон измерения   /////////////////////////////////





////////////////////////////////////  Погрешность измерения   /////////////////////////////////
// Отражение вариантов выбора погрешности
function accuracyRules () {

  switch (curType) {
    case 'ИД-Qк':
      NodeVisualise(['accuracyQk'],'block', ['accuracy1', 'accuracy2', 'accuracy3', 'accuracy4', 'accuracy5', 'accuracy6'], false);
      NodeVisualise(['accuracyQm'],'none');
      break;
    case 'ИД-Qм':
      NodeVisualise(['accuracyQk'],'none', ['accuracy1', 'accuracy2', 'accuracy3', 'accuracy4', 'accuracy5', 'accuracy6'], false);
      NodeVisualise(['accuracyQm'],'block');
      break;
    default:
      console.log("ошибка определения выбранной погрешности");
  };
};

// Определение выбранной погрешности accuracyQm
accuracyQm.forEach((link) => {
  link.addEventListener('click', (e) => {
    curAccuracy = e.target.value
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  })
});

// Определение выбранной погрешности accuracyQk
accuracyQk.forEach((link) => {
  link.addEventListener('click', (e) => {
    curAccuracy = e.target.value
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  })
});
////////////////////////////////////  Конец Погрешность измерения   /////////////////////////////////




////////////////////////////////////  Модальное отображение   /////////////////////////////////
//  Открытие изображений типов присоединения в модальном окне
const modal = document.getElementById("myModal");
const modalImg = document.getElementById("img01");
const captionText = document.getElementById("caption");
const col_container = document.querySelector('.col-container');
const imagesInCards = col_container.querySelectorAll('img');
const kvv_container = document.querySelector('.kvv-container');
const imagesOfKVV = kvv_container.querySelectorAll('img');

// изображения типов присоединения
imagesInCards.forEach((link) => {
  link.addEventListener('click', (evt) => {
    modal.style.display = "block";
    modalImg.src = link.src;
    captionText.innerHTML = link.alt;
  })
});

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}
//////////////////////////////////// Конец  Модальное отображение   /////////////////////////////////




////////////////////////////////////  Типы присоединения   /////////////////////////////////
// Отображение типов присоединения в зависимости от
// типа измеряемого давления и модификации ИД
function DisplayConnectionBox () {
  // Отображение типов присоединения в зависимости от
  // типа измеряемого давления и модификации ИД
  const arr1 = ['i_box', 'i1_box', 'i2_box', 'e_box', 'k_box', 'bp_box',
  'bp1_box', 'bp2_box', 'bpConus_box',  'd_box', 'd1_box',
  'd9-1_box', 'd9-2_box', 'f_box'];
  const arr4 = ['i_box', 'i1_box', 'i2_box', 'e_box', 'k_box', 'bp_box',
  'bp1_box', 'bp2_box', 'bpConus_box','bm_box', 'd_box', 'd1_box',
  'd9-1_box', 'd9-2_box', 'clamp_box', 'f_box'];
  const arr2 = ['p_box', 'c_box', 'cn_box', 'clamp_box','bm_box'];
  const arr5 = ['p_box', 'c_box', 'cn_box'];
  const arr3 = ['i_box', 'i1_box', 'i2_box', 'e_box', 'k_box', 'bp_box',
  'bp1_box', 'bp2_box', 'bpConus_box', 'bm_box', 'd_box', 'd1_box',
  'd9-1_box', 'd9-2_box', 'p_box', 'c_box', 'cn_box', 'clamp_box', 'f_box'];

  // отображение кнопок Выбрать при изменении ранее выбранных параметров ИД
    if (idCurChooBtn != '') {
      // скрываем кнопку "Показать все варианты"
      const allVarBtn = document.getElementById(idCurChooBtn + '_showAllBtns');
      allVarBtn.style.display = 'none';
      // показываем кнопку "Выбрать"
      const chooseBtn = document.getElementById(idCurChooBtn);
      chooseBtn.style.display = 'block';
      // удаление id кнопки выбранного типа соединения
      idCurChooBtn = '';
    }

  if (curType === 'ИД-Qк' && (curTypePreassure === 'И' || curTypePreassure === 'А')) {
    arr1.forEach((elmt1) => {
      const tmpEl = document.getElementById(elmt1)
      tmpEl.removeAttribute('style');
    });
    arr2.forEach((elmt2) => {
      const tmpEl = document.getElementById(elmt2)
      tmpEl.style.display = 'none';
    })
  } else if (curType === 'ИД-Qм' && (curTypePreassure === 'И' || curTypePreassure === 'А')) {
    arr4.forEach((elmt1) => {
      const tmpEl = document.getElementById(elmt1)
      tmpEl.removeAttribute('style');
    });
    arr5.forEach((elmt2) => {
      const tmpEl = document.getElementById(elmt2)
      tmpEl.style.display = 'none';
    })
  } else if (curTypePreassure === 'Р') {
    arr4.forEach((elmt1) => {
      const tmpEl = document.getElementById(elmt1)
      tmpEl.style.display = 'none';
    });
    arr5.forEach((elmt2) => {
      const tmpEl = document.getElementById(elmt2)
      tmpEl.removeAttribute('style');
    })
  } else {
    arr3.forEach((elmt3) => {
      const tmpEl = document.getElementById(elmt3)
      tmpEl.style.display = 'none';
    });
  }
  // очистка значения характеристики фланца Ф5
  clearFlanF5();
}

// массив всех id кнопок "Выбрать" боксов типов присоединения
const btnIdArr = ['i', 'i1', 'i2', 'e', 'k', 'bp', 'bp1', 'bp2', 'bpConus', 'bm', 'd', 'd1', 'd9-1', 'd9-2', 'p', 'c', 'cn', 'clamp', 'f'];
let idCurChooBtn = '';
//  Вешаем слушателя на каждую кнопку "Выбрать" и скрываем 
//  невыбранные боксы присоединения к процессу
btnIdArr.forEach((link) => {
  const curChooBtn = document.getElementById(link);
  curChooBtn.addEventListener('click',  (evt) => {
      evt.preventDefault();
      // id кнопки выбранного типа соединения
      idCurChooBtn = curChooBtn.id;
      // поиск нажатой кнопки и скрытие всех остальных боксов
      btnIdArr.forEach((idlink) => {
        if (curChooBtn.id != idlink) {
          const hideElmt = document.getElementById(idlink + '_box');
          hideElmt.style.display = 'none';
        } else if (curChooBtn.id === idlink) {
          // показываем кнопку "Показать все варианты"
          const allVarBtn = document.getElementById(idlink + '_showAllBtns');
          allVarBtn.style.display = 'block';
          // скрываем кнопку "Выбрать"
          const thisBtn = document.getElementById(curChooBtn.id);
          thisBtn.style.display = 'none';
          // присвоение выбранного типа присоединения к переменной
          curConnectType = thisBtn.value;
          // запуск функции отражения выбора резьбы
          showThreadBox();
        }
      });
      // проверка и подсветка изменения маркировки
      chChangeMark = true; // флаг изменнения маркировки
      BGcolorMarkingBlock();
      // очистка ранее введенной резьбы соединения с процессом
      curThread = '';
    })
});

// Кнопка "Показать все варианты" присоединения к процессу
btnIdArr.forEach((elmt) => {
  const tmpButton = document.getElementById(elmt + '_showAllBtns');
  tmpButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      // удаление id кнопки выбранного типа соединения
      idCurChooBtn = '';
      if (checkClearThreadBox === false) {
        // Очистка блока 'threadForConnect' с резьбой (1 раз)
        clearThreadBox('threadForConnect');

        // скрытие вариантов ручного ввода резьбы и др подсоединений
        NodeChangeClass(['handleThread', 'flanetzTable', 'handleClamp'], 'remove', 'active');
        // очистка введенной информации ручного ввода резьбы и др подсоединений
        NodeVisualise(0, null, ['f1','f2','f3','f4','f5'], false);
        handleThreadBlock.value = '';
        handleClampBlock.value = '';
        // // комплексная очистка ранее введенных значений
        // clearValues();
      };
      // сброс значения переменной
      curConnectType = '';
      // скрытие кнопки 'Показать все варианты'
      tmpButton.style.display = 'none';
      // отражение всех скрытых боксов
      btnIdArr.forEach((idlink) => {
      // показать скрытые боксы
      DisplayConnectionBox();
      // показать скрытую кнопку "Выбрать"
      const thisBtn = document.getElementById(idlink);
      thisBtn.removeAttribute('style');
      })
      // проверка и подсветка изменения маркировки
      chChangeMark = true; // флаг изменнения маркировки
      BGcolorMarkingBlock();
      // очистка ранее введенной резьбы соединения с процессом
      curThread = '';
      // очистка значения характеристики фланца Ф5
      clearFlanF5();
    })
})

// Массив вариантов резьбы для типов присоединения к процессу
const threadArr = {
  'И' : ['G1/8"', 'G1/4"', 'G3/8"', 'G1/2"', 'Другая резьба по EN837'],
  'И1' : ['М10х1', 'М12х1,5', 'М16х1,5', 'М20х1,5', 'Другая резьба по ГОСТ 25164 (ISO2186)'],
  'И2' : ['М10х1', 'М12х1,5', 'М16х1,5', 'М20х1,5', 'Другая резьба по ГОСТ 25164 (ISO2186)'],
  'Е' : ['G1/2"', 'М20х1,5', 'Другая резьба по DIN 3852-E'],
  'К' : ['1/4"NPT', '1/2"NPT', 'К1/4"', 'К1/2"', 'Другая резьба<br>«NPT» по ANSI/ASME B1.20.1<br>«К» по ГОСТ 6111'],
  'ВР' : ['G1/8"', 'G1/4"', 'G3/8"', 'G1/2"', 'Другая резьба по EN837'],
  'ВР1' : ['М10х1', 'М12х1,5', 'М16х1,5', 'М20х1,5', 'Другая резьба по ГОСТ 25164 (ISO2186)'],
  'ВР2' : ['М10х1', 'М12х1,5', 'М16х1,5', 'М20х1,5', 'Другая резьба по ГОСТ 25164 (ISO2186)'],
  'ВРConus' : ['1/4"NPT', '1/2"NPT', 'К1/4"', 'К1/2"', 'Другая резьба<br>«NPT» по ANSI/ASME B1.20.1<br>«К» по ГОСТ 6111'],
  'ВМ' : ['G3/4"','G1"', 'G1-1/2"', 'G1/2"*', 'М30х2', 'М24х1,5', 'М20х1,5*', 'Другая резьба по EN837'],
  'Д' : ['G1/4"', 'G1/2"', 'М20х1,5', 'М24х1,5', 'Другая резьба'],
  'Д1' : ['G3/4"', 'G1"', 'G1-1/2"', 'М30х2', 'Другая резьба'],
  'D9-1' : ['G1/2"', 'G1/4"', 'М20х1,5', 'М24х1,5', 'Другая резьба'],
  'D9-2' : ['G3/4"', 'G1"', 'G1-1/2"', 'М30х2', 'Другая резьба'],
  'П' : ['G1/2"','М20х1,5', 'Другая резьба'],
  'С' : ['1/4"NPT', 'Другая резьба'],
  'Сн' : ['1/4"NPT', 'Другая резьба'],
  'Clamp' : ['Диаметр Вашей ответной (присоединительной) части, мм'],
  'Ф' : ['Выбрать вариант исполнения фланца']
}

const placeDiv = document.getElementById('threadForConnect'); // ссылка на блок с вариантами резьбы
// Отображение вариантов резьбы в зависимости от выбранного типа присоединения
function showThreadBox() {
  threadLinkArr = [];
  checkClearThreadBox = false;
  Object.keys(threadArr).forEach(key => {
    if (curConnectType === key) {
      const curThreadArr = threadArr[key];
      curThreadArr.forEach((val) => {
      
        // создание элемента Label
        const labelElmt = document.createElement('label');
        labelElmt.innerHTML = val;
        labelElmt.classList.add('container');
        labelElmt.htmlFor = val;
        labelElmt.id = val + '_label'
        placeDiv.appendChild(labelElmt);
        // ссылка на созданный элемент label
        const placeLabel = document.getElementById(val + '_label');

        // создание элемента input
        const inputElmt = document.createElement('input');
        inputElmt.type = 'radio';
        inputElmt.id = val;
        inputElmt.name = 'thread';
        inputElmt.value = val;
        placeLabel.appendChild(inputElmt);
        // заполнение массива id резьб для будущих инпутов
        threadLinkArr.push(val);

        // создание элемента span
        const spanlElmt = document.createElement('span');
        spanlElmt.classList.add('checkmark');
        placeLabel.appendChild(spanlElmt);
      })
    }
  })
  // добавляем слушателей на выбор резьбы
  addLictnerThread();
  // console.log(threadLinkArr);
}

// ссылки на блоки ручного ввода резьбы
let handleThreadBlock = document.getElementById('inputThread');
let handleClampBlock = document.getElementById('inputClamp');

// вешаем слушателей на все виды резьбы для выбранного бокса
function addLictnerThread () {
  threadLinkArr.forEach((link) => {
   
    // автовыбор для Кламп и Фланец
    if (link === 'Диаметр Вашей ответной (присоединительной) части, мм') {
      NodeChangeClass(['flanetzTable', 'handleThread'], 'remove', 'active');
      NodeChangeClass(['handleClamp'], 'add', 'active');
      // очистка ранее введенной резьбы соединения с процессом
      curThread = '';
      NodeVisualise(0, null, [link], true);
      // слушатель для бокса ручного ввода диаметра Clamp
      onClampDiamEnter();
    }  else if (link === 'Выбрать вариант исполнения фланца') {
      NodeChangeClass(['handleThread', 'handleClamp'], 'remove', 'active');
      NodeChangeClass(['flanetzTable'], 'add', 'active');
      // очистка ранее введенной резьбы соединения с процессом
      curThread = '';
      NodeVisualise(0, null, [link], true);
      // слушатель для выбора вариантов исполнения фланца
      flanetzListner();
    } 
      else {
      NodeChangeClass(['handleThread', 'flanetzTable', 'handleClamp'], 'remove', 'active');
      NodeVisualise(0, null, ['f1','f2','f3','f4','f5'], false);
      curThread = '';
    }

    const threadLinkElnt = document.getElementById(link);
    threadLinkElnt.addEventListener('click', (evt) => {
    
      if (link === 'Другая резьба по EN837' || link === 'Другая резьба' || 
          link === 'Другая резьба по ГОСТ 25164 (ISO2186)' || link === 'Другая резьба по DIN 3852-E' ||
          link === 'Другая резьба<br>«NPT» по ANSI/ASME B1.20.1<br>«К» по ГОСТ 6111') {
        NodeChangeClass(['flanetzTable', 'handleClamp'], 'remove', 'active');
        NodeChangeClass(['handleThread'], 'add', 'active');
        // очистка ранее введенной резьбы соединения с процессом
        handleThreadBlock.value = '';
        curThread = '';
        // слушатель для бокса ручного ввода резьбы
        onThreadEnter();
      }
      // else if (link === 'Диаметр Вашей ответной (присоединительной) части, мм') {
      //   NodeChangeClass(['flanetzTable', 'handleThread'], 'remove', 'active');
      //   NodeChangeClass(['handleClamp'], 'add', 'active');
      //   // очистка ранее введенной резьбы соединения с процессом
      //   curThread = '';
      //   // слушатель для бокса ручного ввода диаметра Clamp
      //   onClampDiamEnter();
      // } 
      // else if (link === 'Выбрать вариант исполнения фланца') {
      //   NodeChangeClass(['handleThread', 'handleClamp'], 'remove', 'active');
      //   NodeChangeClass(['flanetzTable'], 'add', 'active');
      //   // очистка ранее введенной резьбы соединения с процессом
      //   curThread = '';
      //   // слушатель для выбора вариантов исполнения фланца
      //   flanetzListner();
      // } 
      else if (link != 'Выбрать вариант исполнения фланца' && link != 'Диаметр Вашей ответной (присоединительной) части, мм') {
        NodeChangeClass(['handleThread', 'flanetzTable', 'handleClamp'], 'remove', 'active');
        NodeVisualise(0, null, ['f1','f2','f3','f4','f5'], false);
        handleThreadBlock.value = '';
        curThread = link
      }

      // проверка и подсветка изменения маркировки
      chChangeMark = true; // флаг изменнения маркировки
      BGcolorMarkingBlock();
    })
  })
}

// слушатель для выбора вариантов исполнения фланца
const otherFlanetz = document.getElementById('otherFlanetz');
let inputFlanEl = undefined;
function flanetzListner() {
  const flanetz = document.getElementsByName('flanetz');
    flanetz.forEach((link) => {
      link.addEventListener('click', (e) => {
        curThread = e.target.value;
        if (curThread === 'Ф5') {
          inputFlanEl =  document.createElement('textarea');
          inputFlanEl.rows = 1;
          inputFlanEl.id = 'inputFlanetzID';
          inputFlanEl.placeholder = 'Укажите тип фланца по стандарту...';
          otherFlanetz.innerText = '';
          otherFlanetz.appendChild(inputFlanEl);
          inputFlanEl.addEventListener('input', () => {
            // flanInfo = '(' + inputFlanEl.value + ')';
            flanInfoForEmail = inputFlanEl.value;
            // проверка и подсветка изменения маркировки
            chChangeMark = true; // флаг изменнения маркировки
            BGcolorMarkingBlock();
          })
        } else {
          // flanInfo = '';
          flanInfoForEmail = '';
          otherFlanetz.innerText = 'Другие параметры, отличные от вышеизложенных';
          // очистка значения характеристики фланца Ф5
          if (inputFlanEl) {
            inputFlanEl.value = '';
          };
        };
        // проверка и подсветка изменения маркировки
        chChangeMark = true; // флаг изменнения маркировки
        BGcolorMarkingBlock();
      })
    });
}

// очистка значения характеристики фланца Ф5
function clearFlanF5() {
  if (inputFlanEl) {
    flanInfoForEmail = '';
    inputFlanEl.value = '';
    otherFlanetz.innerText = 'Другие параметры, отличные от вышеизложенных';
  };  
};
  
// слушатель для бокса ручного ввода диаметра Clamp
function onClampDiamEnter() {
  handleClampBlock.addEventListener('input', (evnt) => {
    curThread =  handleClampBlock.value;
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  })
}

// слушатель для бокса ручного ввода резьбы
function onThreadEnter() {
  handleThreadBlock.addEventListener('input', (evnt) => {
    curThread =  handleThreadBlock.value;
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  })
};
////////////////////////////////////  Конец Типы присоединения   /////////////////////////////////




////////////////////////////////////   КВВ   /////////////////////////////////
// показать/скрыть боксы КВВ
let chVal = false;
const checkBoxKVV = document.getElementById('checkBoxKVV');
checkBoxKVV.addEventListener('click', () => {
  if (checkBoxKVV.checked) {
    chVal = true;
    curKvvArrFunc();
    NodeChangeClass(['fieldset_KVV_info'], 'add', 'active');
  } else if (checkBoxKVV.checked === false) {
    chVal = false;
    // очистка ранее введенных значений для КВВ
    clearKVVValues();
    deleteAllChilds('kvvContainer');
    // формирование и отрисовкка массива доступных к 
    // выбору типов IP
    ipDegree();
  }
  // проверка и подсветка изменения маркировки
  chChangeMark = true; // флаг изменнения маркировки
  BGcolorMarkingBlock();
});

//проверка значения chVal чтобы показать/скрыть боксы КВВ
function checkShowKVV() {
  if (chVal) {
    curKvvArrFunc();
  } 
}

// Общий Массив характеристик по кабельным вводам
const kvvInfoArr = {
  'DIN C' : {
    'exType' : ['Exe', 'Exdia'],
    'ipLevel' : ['IP65'],
    'descript' : 'штепсельный разъем DIN EN 175301-803 «С»',
    'img1' : './images/kabVvod/din-C1.png',
    'img2' : './images/kabVvod/din-C2.png',
    'id' : 'din-C',
    'name' : 'DIN C'
  },
  'DIN A' : {
    'exType' : ['Exe'],
    'ipLevel' : ['IP65'],
    'descript' : 'штепсельный разъем DIN EN 175301-803 «А»',
    'img1' : './images/kabVvod/din-A1.png',
    'img2' : './images/kabVvod/din-A2.png',
    'id' : 'din-A',
    'name' : 'DIN A'
  },
  // '4P' : {
  //   'exType' : ['Exe'],
  //   'ipLevel' : ['IP65'],
  //   'descript' : 'четырехпиновый разъем',
  //   'img1' : './images/kabVvod/4P.png',
  //   'id' : '4P',
  //   'name' : '4P'
  // },
  // '6P' : {
  //   'exType' : ['Exe'],
  //   'ipLevel' : ['IP65'],
  //   'descript' : 'шестипиновый разъем',
  //   'img1' : './images/kabVvod/6P.png',
  //   'id' : '6P',
  //   'name' : '6P'
  
  // },
  'ПГ' : {
    // 'diamCable' : ['7-13'],
    'diamCable' : ['6-12'],
    'exType' : ['Exe'],
    'ipLevel' : ['IP66'],
    'descript' : 'пластиковый кабельный ввод',
    'img1' : './images/kabVvod/pg1.png',
    'img2' : './images/kabVvod/pg2.png',
    'id' : 'pg',
    'name' : 'ПГ'
  },
  'ЛГ' : {
    // 'diamCable' : ['7-13'],
    'diamCable' : ['6-12'],
    'exType' : ['Exe'],
    'ipLevel' : ['IP66'],
    'descript' : 'латунный кабельный ввод',
    'img1' : './images/kabVvod/lg1.png',
    'img2' : './images/kabVvod/lg2.png',
    'id' : 'lg',
    'name' : 'ЛГ'
  },
  'МГ' : {
    'cableType' : ['неброниро<br>ванный'],
    'diamCable' : ['3-7', '7-13', '13-17', '17-22', '22-26'],
    'exType' : ['Exe', 'Exdb'],
    'ipLevel' : ['IP66/68'],
    'descript' : 'металлический кабельный ввод',
    'img1' : './images/kabVvod/mg1.png',
    'img2' : './images/kabVvod/mg2.png',
    'id' : 'mg',
    'name' : 'МГ'
  },
  'МГБ' : {
    'cableType' : ['брониро<br>ванный'],
    'diamCabMGB' : ['3-7', '7-13', '13-17', '17-22'],
    'innerDCab' : ['7-13', '13-17', '17-22', '22-26'],
    'exType' : ['Exe', 'Exdb'],
    'ipLevel' : ['IP66/68'],
    'descript' : 'металлический кабельный ввод',
    'img1' : './images/kabVvod/mgb1.png',
    'img2' : './images/kabVvod/mgb2.png',
    'id' : 'mgb',
    'name' : 'МГБ'
  },
  'МГБ-М' : {
    'cableType' : ['неброниро<br>ванный'],
    'diamCable' : ['3-7', '7-13', '13-17', '17-22', '22-26'],
    'typeDY' : ['Ду15', 'Ду16', 'Ду18', 'Ду20', 'Ду22', 'Ду25', 'Ду32'],
    'exType' : ['Exe', 'Exdb'],
    'ipLevel' : ['IP66/68'],
    'descript' : 'металлический кабельный ввод для крепления металлорукава',
    'img1' : './images/kabVvod/mgb-m1.png',
    'img2' : './images/kabVvod/mgb-m2.png',
    'id' : 'mgb-m',
    'name' : 'МГБ-М'
  },
  'МГМ' : {
    'cableType' : ['неброниро<br>ванный'],
    'diamCable' : ['3-7', '7-13', '13-17', '17-22'],
    'threadType' : ['М16х1,5', 'М20х1,5', '1/2"NPT', 'G1/2"', 'К1/2"', 'Rc1/2"', 'М25х1,5', 'G3/4"', 'М32х1,5', 'Другая резьба'],
    'exType' : ['Exe', 'Exdb'],
    'ipLevel' : ['IP66/68'],
    'descript' : 'металлический кабельный ввод для крепления кабеля с переходной муфтой',
    'img1' : './images/kabVvod/mgm1.png',
    'img2' : './images/kabVvod/mgm2.png',
    'id' : 'mgm',
    'name' : 'МГМ'
  },
  'МГБ-П' : {
    'cableType' : ['неброниро<br>ванный'],
    'diamCable' : ['3-7', '7-13', '13-17', '17-22', '22-26'],
    'typeDY' : ['Ду15', 'Ду16', 'Ду18', 'Ду20', 'Ду22', 'Ду25', 'Ду32'],
    'exType' : ['Exe', 'Exdb'],
    'ipLevel' : ['IP66/68'],
    'descript' : 'металлический кабельный ввод для крепления пластикового рукава',
    'img1' : './images/kabVvod/mgb-p1.png',
    'img2' : './images/kabVvod/mgb-p2.png',
    'id' : 'mgb-p',
    'name' : 'МГБ-П'
  },
  'МГТ' : {
    'cableType' : ['проложенный<br>в трубе'],
    'diamCable' : ['3-7', '7-13', '13-17', '17-22'],
    'threadType' : ['М16х1,5', 'М20х1,5', '1/2"NPT', 'G1/2"', 'К1/2"', 'Rc1/2"', 'М25х1,5', 'G3/4"', 'М32х1,5', 'Другая резьба'],
    'exType' : ['Exe', 'Exdb'],
    'ipLevel' : ['IP66/68'],
    'descript' : 'металлический кабельный ввод',
    'img1' : './images/kabVvod/mgt1.png',
    'img2' : './images/kabVvod/mgt2.png',
    'id' : 'mgt',
    'name' : 'МГТ'
  },
  'МГФ' : {
    'cableType' : ['неброниро<br>ванный'],
    'diamCable' : ['3-7', '7-13', '13-17', '17-22', '22-26'],
    'exType' : ['Exe', 'Exdb'],
    'ipLevel' : ['IP66/68'],
    'descript' : 'металлический кабельный ввод',
    'img1' : './images/kabVvod/mgf1.png',
    'img2' : './images/kabVvod/mgf2.png',
    'id' : 'mgf',
    'name' : 'МГФ'
  }
  
}
// Массив КВ для головы Тр
const kvvForTr = ['DIN C', 'DIN A'];
// Массив КВ для головы Т и Н1 с Exdb
const kvvForTExd = ['МГ', 'МГБ', 'МГБ-М', 'МГМ', 'МГБ-П', 'МГТ', 'МГФ'];
// Массив КВ для головы Т и Н1 с Exia
const kvvForTExia = ['DIN A', 'ПГ', 'ЛГ', 'МГ', 'МГБ', 'МГБ-М', 'МГМ', 'МГБ-П', 'МГТ', 'МГФ'];

// Определение текущего диапазона отображаемых КВВ
function curKvvArrFunc() {
  let curKvvArr = [];
  if (curCase === 'Тр' &&  (curEx === 'ExiaIICT6' || curEx === '')) {
    // console.log('000');
    kvvForTr.forEach((el) =>{
      curKvvArr.push(kvvInfoArr[el]); 
    })
  } else if (curEx === 'ExdbIICT6' && (curCase === 'Т' || curCase === 'Н1')) {
    // console.log('111');
    kvvForTExd.forEach((el) =>{
      curKvvArr.push(kvvInfoArr[el]);
    })
  } else if ((curEx === 'ExiaIICT6'  || curEx === '') && (curCase === 'Т' || curCase === 'Н1')) {
    // console.log('222');
    kvvForTExia.forEach((el) =>{
      curKvvArr.push(kvvInfoArr[el]); 
    })
  } else {
    curKvvArr = [];
  }
  // запуск функции отображения
  if (curKvvArr.length > 0) {
    // Удалить все боксы с КВВ
    deleteAllChilds('kvvContainer');
    // Отображаем все доступные виды КВВ 
    kvvShowBox(curKvvArr);
    // вешаем слушателей на текущий массив боксов КВВ 
    // на кнопку "Выбрать"
    KVVSelectListner(curKvvArr)
    // вешаем слушателей на текущий массив боксов КВВ   
    // на кнопку "Показать все варианты"
    ShowAllKVVBtn(curKvvArr)
  }
};

let strEl = '' // элементы массива значений для вывода в таблицу КВВ
const kvvContainer = document.getElementById('kvvContainer'); // ссылка на блок с КВВ
// Отображаем все виды КВВ 
function kvvShowBox (curArr = []) {
    Object.keys(curArr).forEach(key1 => {
        const img1 = curArr[key1].img1;
        const img2 = curArr[key1].img2;
        const descript = curArr[key1].descript;
        const exType = curArr[key1].exType;
        const ipLevel = curArr[key1].ipLevel;
        const id = curArr[key1].id; 
        const diamCable = curArr[key1].diamCable; 
        const cableType = curArr[key1].cableType;
        const diamCabMGB = curArr[key1].diamCabMGB;
        const innerDCab = curArr[key1].innerDCab;
        const typeDY = curArr[key1].typeDY;
        const threadType = curArr[key1].threadType;
        const name = curArr[key1].name;

        // создание элемента Span
        const spanElmt = document.createElement('span');
        spanElmt.id = id + '_box';
        kvvContainer.appendChild(spanElmt);
        // ссылка на элемент Span
        const placeSpan = document.getElementById(id + '_box');

        // console.log(kvvContainer);

          // создание элемента Div
          const divElmt = document.createElement('div');
          divElmt.classList.add('kvv_card');
          divElmt.id = id + '_div';
          placeSpan.appendChild(divElmt);
          // ссылка на элемент Div
          const placeDiv = document.getElementById(id + '_div');
          
            // создание элемента h2
            const h2Elmt = document.createElement('h2');
            h2Elmt.innerText = name;
            placeDiv.appendChild(h2Elmt);

            // создание элемента Span для img
            const spanImgElmt = document.createElement('span');
            spanImgElmt.id = id + '_img_span';
            spanImgElmt.classList.add('kvv_img');
            placeDiv.appendChild(spanImgElmt);
            // ссылка на элемент Span
            const placeSpanImg = document.getElementById(id + '_img_span');

              // создание элементов img
              const img1Elmt = document.createElement('img');
              img1Elmt.classList.add('myImg');
              img1Elmt.src = img1;
              img1Elmt.style.width = '100%';
              img1Elmt.style.height = 'auto';
              img1Elmt.alt = 'Кабельный ввод тип: ' + name + ' - ' + descript;
              // слушатель для модального вида
              img1Elmt.addEventListener('click', () => {
                modal.style.display = "block";
                modalImg.src = img1Elmt.src;
                captionText.innerHTML = img1Elmt.alt;
              });
              placeSpanImg.appendChild(img1Elmt);

              if (img2 != undefined) {
                const img2Elmt = document.createElement('img');
                img2Elmt.classList.add('myImg');
                img2Elmt.src = img2;
                img2Elmt.style.width = '100%';
                img2Elmt.style.height = 'auto';
                img2Elmt.alt = 'Кабельный ввод тип: ' + name + ' - ' + descript;
                // слушатель для модального вида
                img2Elmt.addEventListener('click', () => {
                  modal.style.display = "block";
                  modalImg.src = img2Elmt.src;
                  captionText.innerHTML = img2Elmt.alt;
                });
                placeSpanImg.appendChild(img2Elmt);
              }
            
            // создание элемента h4
            const h4Elmt = document.createElement('h4');
            h4Elmt.innerText = descript;
            placeDiv.appendChild(h4Elmt);

            // создание элемента table
            const tableElmt = document.createElement('table');
            tableElmt.id = id + '_table';
            tableElmt.classList.add('my-table-kvv');
            tableElmt.classList.add('w3-card-4');
            placeDiv.appendChild(tableElmt);
            // ссылка на элемент table
            const placeTable = document.getElementById(id + '_table');

            // проверка заполненности массива cableType и заполнение таблицы
            fillTableFromArr(cableType, 'Тип кабеля', placeTable);

            // проверка заполненности массива exType и заполнение таблицы
            fillTableFromArr(exType, 'Вид взрывозащиты', placeTable);

            // проверка заполненности массива ipLevel и заполнение таблицы
            fillTableFromArr(ipLevel, 'Степень защиты', placeTable);

            // проверка заполненности массива diamCable и заполнение таблицы
            fillTableFromArr(diamCable, 'Диаметр кабеля d, мм', placeTable);

            // проверка заполненности массива diamCabMGB и заполнение таблицы
            fillTableFromArr(diamCabMGB, 'Диаметр кабеля без брони d, мм', placeTable);

            // проверка заполненности массива innerDCab и заполнение таблицы
            fillTableFromArr(innerDCab, 'Внешний диаметр кабеля D, мм', placeTable);

            // проверка заполненности массива typeDY и заполнение таблицы
            fillTableFromArr(typeDY, 'Металлорукав', placeTable);

            // проверка заполненности массива threadType и заполнение таблицы
            fillTableFromArr(threadType, 'Присоединительная резьба, С', placeTable);
            
            // создание элемента button Показать все варианты
            const btn1Elmt = document.createElement('button');
            btn1Elmt.id = id + '_box_showAllBtns';
            btn1Elmt.style.display = 'none';
            btn1Elmt.innerText = 'Показать все варианты';
            placeDiv.appendChild(btn1Elmt);

            const btn2Elmt = document.createElement('button');
            btn2Elmt.id = id + '_box_chooBtn';
            btn2Elmt.value = name;
            btn2Elmt.innerText = 'Выбрать';
            placeDiv.appendChild(btn2Elmt);
    })

};

// проверка заполненности массива и заполнение таблицы для КВВ
function fillTableFromArr(curArr = [], thString, place) {
  // проверка заполненности массива diamCable
  if (curArr != undefined && curArr.length > 0) {
    // создание элемента tr
    const trElmt = document.createElement('tr');
    // создание элемента th
    const thElmt = document.createElement('th');
    thElmt.innerText = thString;
    trElmt.appendChild(thElmt);
    // вставка всех элементов текущего массива в таблицу
    curArr.forEach((el) =>{
      // перебираем значения из массива и пишим в строку
      strEl =  strEl + el + '<br>';
    })
    // создание элемента td
    const tdElmt = document.createElement('td');
    tdElmt.innerHTML = strEl;
    strEl = '';
     trElmt.appendChild(tdElmt);
     place.appendChild(trElmt);
  }
}

//  Вешаем слушателя на каждую кнопку "Выбрать" и скрываем 
//  невыбранные боксы КВВ
function KVVSelectListner(showKVVArr = []) {
  Object.keys(showKVVArr).forEach((key) => {
    const curKVVid = showKVVArr[key].id;
    const curChooKVVBtn = document.getElementById(curKVVid + '_box_chooBtn');
    curChooKVVBtn.addEventListener('click', (evnt) => {
      evnt.preventDefault();
      // const curKVVid = showKVVArr[key].id;
      Object.keys(showKVVArr).forEach((key2) => {
        const compareKVVid = showKVVArr[key2].id;
        if (curKVVid != compareKVVid){
          // console.log('1');
          const hideElmtKVV = document.getElementById(compareKVVid + '_box');
          hideElmtKVV.style.display = 'none';
        }  else if (curKVVid === compareKVVid) {
          const showElmtKVV = document.getElementById(curKVVid + '_box');
          showElmtKVV.removeAttribute('style');
          // console.log('2');
          const allVarKVVBtn = document.getElementById(curKVVid + '_box_showAllBtns');
          // console.log(allVarKVVBtn);
          allVarKVVBtn.removeAttribute('style');
          // скрываем кнопку "Выбрать"
          const thisBtn = document.getElementById(curKVVid + '_box_chooBtn');
          thisBtn.style.display = 'none';
          // присвоение выбранного типа КВВ к переменной
          curKVV = thisBtn.value;
          // Отображение вариантов характеристик выбранного КВВ
          KVV_info(curKVV);
        }
      });
      // очистка значений переменных блоков характеристик КВВ и IP
      firstKVVChar = '';
      secondKVVChar = '';
      // curIP = '';
      // формирование и отрисовкка массива доступных к выбору типов IP
      ipDegree()
      // проверка и подсветка изменения маркировки
      chChangeMark = true; // флаг изменнения маркировки
      BGcolorMarkingBlock();
    })
  })
}

// Кнопка "Показать все варианты" КВВ
function ShowAllKVVBtn(showKVVArr = []) {
  Object.keys(showKVVArr).forEach((key) => {
    // id текущей кнопки "Показать все варианты" из текущего массива
    const curKVVid = showKVVArr[key].id;
    const allVarKVVBtn = document.getElementById(curKVVid + '_box_showAllBtns');
    // слушатель для текущей кнопки из определенного массива
    allVarKVVBtn.addEventListener('click', (evnt) => {
      evnt.preventDefault();
      // перебор всех элементов текущего массива
      Object.keys(showKVVArr).forEach((key2) => {
        // показать все доступные боксы КВВ
        const curKVVid2 = showKVVArr[key2].id;
        const showElmtKVV = document.getElementById(curKVVid2 + '_box');
        showElmtKVV.removeAttribute('style');
        // скрытие текущей кнопки 'Показать все варианты'
        allVarKVVBtn.style.display = 'none';
        // показать скрытую кнопку "Выбрать"
        const chooBtnKVV = document.getElementById(curKVVid2 + '_box_chooBtn');
        chooBtnKVV.removeAttribute('style');
      })
      curKVV = '';
      // удаление выбора характеристик КВВ
      deleteAllChilds('infoKVV')
      chKVVinputName = false;
      // очистка массиов id для 2-х диапазонов input-ов характеристик 
      // КВВ для подключ. слушателей
      kvvFirstInputArr = [];
      kvvSecondInputArr = [];
      // формирование и отрисовкка массива доступных к 
      // выбору типов IP
      ipDegree()
      // проверка и подсветка изменения маркировки
      chChangeMark = true; // флаг изменнения маркировки
      BGcolorMarkingBlock();
      // скрытие поля ручного ввода резьбы во 2-ом блоке
      NodeChangeClass(['handleThreadKVV'], 'remove', 'active');
      // очистка значений в блоке ручного ввода резьбы
      handleThreadKVV.value = '';
    })
})
};

// Отображение вариантов характеристик выбранного КВВ
const placeDivInfoKVV = document.getElementById('infoKVV'); // ссылка на блок с вариантами резьбы
let chKVVinputName = false; // контроль количества созданных input для характеристик КВВ
function KVV_info(KVVname) {

  let diamCableArr = undefined; // ПГ, ЛГ, МГ, МГБ-М, МГМ, МГБ-П, МГТ, МГФ
  let diamCabMGBArr = undefined; // МГБ
  let innerDCabArr = undefined; // МГБ
  let typeDYArr = undefined; // МГБ-М, МГБ-П
  let threadTypeArr = undefined; // МГМ, МГТ

// считывание массивов значений из общего массива характеристик КВВ
// для отражения в элементах input
  if (diamCableArr = kvvInfoArr[KVVname].diamCable) {
    KVV_info_create(diamCableArr, 'Диаметр кабеля d, мм');
  };
  if (diamCabMGBArr = kvvInfoArr[KVVname].diamCabMGB) {
    KVV_info_create(diamCabMGBArr, 'Диаметр кабеля без брони d, мм');
  };
  if (innerDCabArr = kvvInfoArr[KVVname].innerDCab) {
    KVV_info_create(innerDCabArr, 'Внешний диаметр кабеля D, мм');
  };
  if (typeDYArr = kvvInfoArr[KVVname].typeDY) {
    KVV_info_create(typeDYArr, 'Металлорукав');
  };
  if (threadTypeArr = kvvInfoArr[KVVname].threadType) {
    KVV_info_create(threadTypeArr, 'Присоединительная резьба, С');
  };

  // вешаем слушателей на выбор характеристик КВВ
  if (kvvFirstInputArr.length > 0) {
    kvvInputListnerFirst(kvvFirstInputArr);
    // console.log('kvvFirstInputArr =>' + kvvFirstInputArr);
    // console.log('kvvFirstInputArr length =>' + kvvFirstInputArr.length);
    NodeChangeClass(['fieldset_KVV_info'], 'add', 'active');
  } else {
    NodeChangeClass(['fieldset_KVV_info'], 'remove', 'active');
  };
  if (kvvSecondInputArr.length > 0) {
    kvvInputListnerSecond(kvvSecondInputArr);
  }
};

// массивы id для 2-х диапазонов input-ов характеристик КВВ
let kvvFirstInputArr = [];
let kvvSecondInputArr = [];
// непосредственно создание блоков с выбором характеристик КВВ
function KVV_info_create(inputEl, labelText) {
  // создание элемента span
  const spanElmt = document.createElement('span');
  spanElmt.innerText = labelText;
  placeDivInfoKVV.appendChild(spanElmt);

  inputEl.forEach((val) => {
    let inputElId = '';
    let inputElname = '';
    let labelElId = '';
    if (chKVVinputName === false) {
      inputElId = 'kvv_first_';
      inputElname = 'kvvFirstInput';
      labelElId = '_kvv_first_label';
      // заполнение массива id первого блока инпутов для подключ. слушателей
      kvvFirstInputArr.push(inputElId + val);
    } else if (chKVVinputName === true) {
      inputElId = 'kvv_second_';
      inputElname = 'kvvSecondInput';
      labelElId = '_kvv_second_label';
      // заполнение массива id второго блока инпутов для подключ. слушателей
      kvvSecondInputArr.push(inputElId + val);
    }
    // создание элемента Label
    const labelElmt = document.createElement('label');
    labelElmt.innerHTML = val;
    labelElmt.classList.add('container');
    labelElmt.htmlFor = inputElId + val;
    labelElmt.id = val + labelElId;
    placeDivInfoKVV.appendChild(labelElmt);
    // ссылка на созданный элемент label
    const placeLabel = document.getElementById(val + labelElId);

    // создание элемента input
    const inputElmt = document.createElement('input');
    inputElmt.type = 'radio';
    inputElmt.id = inputElId + val;
    // автовыбор характеристики для КВВ ПГ и ЛГ
    if (inputElmt.id == 'kvv_first_6-12') {
      inputElmt.checked = true;
    };
    inputElmt.name = inputElname;
    inputElmt.value = val;
    placeLabel.appendChild(inputElmt);

    // создание элемента span
    const spanlElmt = document.createElement('span');
    spanlElmt.classList.add('checkmark');
    placeLabel.appendChild(spanlElmt);
  })
  chKVVinputName = true;
}

// подключение слушателей для первого блока инпутов
function kvvInputListnerFirst(arrKVVChar = []) {
  arrKVVChar.forEach((link) => {
    const kvvLinckElmt = document.getElementById(link);
    kvvLinckElmt.addEventListener('click', (elmt) => {
      firstKVVChar = kvvLinckElmt.value;
      // сбрасываем значение переменной 2-го блока
      secondKVVChar = '';
      // если есть второй блок инпутов запуск правила выбора 
      // во 2-ом блоке в зависимости от выбора в первом блоке 
      if (kvvSecondInputArr != []) {
        // скрытие поля ручного ввода резьбы во 2-ом блоке
        NodeChangeClass(['handleThreadKVV'], 'remove', 'active');
        // очистка значений в блоке ручного ввода резьбы
        handleThreadKVV.value = '';
        selectInputRules(firstKVVChar);
      };
      // проверка и подсветка изменения маркировки
      chChangeMark = true; // флаг изменнения маркировки
      BGcolorMarkingBlock();
    })
  })
}

// подключение слушателей для второго блока инпутов
function kvvInputListnerSecond(arrKVVChar = []) {
  arrKVVChar.forEach((link) => {
    const kvvLinckElmt = document.getElementById(link);
    kvvLinckElmt.addEventListener('click', (elmt) => {
      if (kvvLinckElmt.value === 'Другая резьба') {
        secondKVVChar = '';
        NodeChangeClass(['handleThreadKVV'], 'add', 'active');
        // подключаем слушателя на ручной ввод резьбы КВВ
        onThreadEnterKVV();
      } else if (kvvLinckElmt.value != 'Другая резьба') {
        NodeChangeClass(['handleThreadKVV'], 'remove', 'active');
        secondKVVChar = kvvLinckElmt.value;
        // очистка значений в блоке ручного ввода резьбы
        handleThreadKVV.value = '';
      }
      // проверка и подсветка изменения маркировки
      chChangeMark = true; // флаг изменнения маркировки
      BGcolorMarkingBlock();
    })
  })
}

// ссылки на блоки ручного ввода резьбы КВВ
let handleThreadKVV = document.getElementById('inputThreadKVV');

// слушатель для бокса ручного ввода резьбы КВВ
function onThreadEnterKVV() {
  handleThreadKVV.addEventListener('focusout', (evnt) => {
    secondKVVChar =  handleThreadKVV.value;
    // проверка и подсветка изменения маркировки
    chChangeMark = true; // флаг изменнения маркировки
    BGcolorMarkingBlock();
  })
}

// правила выбора во 2-ом блоке в зависимости от выбора в первом блоке 
function selectInputRules(firstInput) {
  let disabledIdArr = []; // массив id НЕдоступных импутов из 2-го блока хар-к. КВВ 

  if (curKVV === 'МГБ') {
      switch (firstInput) {
        case '7-13':
          disabledIdArr = ['kvv_second_7-13'];
          break;
        case '13-17':
          disabledIdArr = ['kvv_second_7-13', 'kvv_second_13-17'];
          break;
        case '17-22':
          disabledIdArr = ['kvv_second_7-13', 'kvv_second_13-17', 'kvv_second_17-22'];
          break;
        default:
          disabledIdArr = [];
          break;
      }
  } else if (curKVV === 'МГБ-П') {
    switch (firstInput) {
      case '3-7':
        disabledIdArr = ['kvv_second_Ду16', 'kvv_second_Ду18', 'kvv_second_Ду20', 'kvv_second_Ду22', 'kvv_second_Ду25', 'kvv_second_Ду32'];
        break;
      case '7-13':
        disabledIdArr = ['kvv_second_Ду22', 'kvv_second_Ду25', 'kvv_second_Ду32'];
        break;
      case '13-17':
        disabledIdArr = ['kvv_second_Ду15', 'kvv_second_Ду16', 'kvv_second_Ду18'];
        break;
      case '22-26':
        disabledIdArr = ['kvv_second_Ду15', 'kvv_second_Ду16', 'kvv_second_Ду18', 'kvv_second_Ду20', 'kvv_second_Ду22', 'kvv_second_Ду25'];
        break;
      case '17-22':
        disabledIdArr = ['kvv_second_Ду15', 'kvv_second_Ду16', 'kvv_second_Ду18', 'kvv_second_Ду20', 'kvv_second_Ду22'];
        break;
      case '22-26':
        disabledIdArr = ['kvv_second_Ду15', 'kvv_second_Ду16', 'kvv_second_Ду18', 'kvv_second_Ду20', 'kvv_second_Ду22', 'kvv_second_Ду25'];
        break;
      default:
        disabledIdArr = [];
        break;
    } 
  } else if (curKVV === 'МГБ-М') {
    switch (firstInput) {
      case '3-7':
        disabledIdArr = ['kvv_second_Ду16', 'kvv_second_Ду18', 'kvv_second_Ду20', 'kvv_second_Ду22', 'kvv_second_Ду25', 'kvv_second_Ду32'];
        break;
      case '7-13':
        disabledIdArr = ['kvv_second_Ду22', 'kvv_second_Ду25', 'kvv_second_Ду32'];
        break;
      case '13-17':
        disabledIdArr = ['kvv_second_Ду15', 'kvv_second_Ду16', 'kvv_second_Ду18'];
        break;
      case '17-22':
        disabledIdArr = ['kvv_second_Ду15', 'kvv_second_Ду16', 'kvv_second_Ду18', 'kvv_second_Ду20', 'kvv_second_Ду22'];
        break;
      case '22-26':
        disabledIdArr = ['kvv_second_Ду15', 'kvv_second_Ду16', 'kvv_second_Ду18', 'kvv_second_Ду20', 'kvv_second_Ду22', 'kvv_second_Ду25'];
        break;
      default:
        disabledIdArr = [];
        break;
    } 
  } else if (curKVV === 'МГМ' || curKVV === 'МГТ') {
    switch (firstInput) {
      case '3-7':
        disabledIdArr = ['kvv_second_М25х1,5', 'kvv_second_G3/4"', 'kvv_second_М32х1,5'];
        break;
      case '13-17':
        disabledIdArr = ['kvv_second_М16х1,5'];
        break;
      case '17-22':
        disabledIdArr = ['kvv_second_М16х1,5', 'kvv_second_М20х1,5','kvv_second_1/2"NPT', 'kvv_second_G1/2"', 'kvv_second_К1/2"', 'kvv_second_Rc1/2"'];
        break;
      default:
        disabledIdArr = [];
        break;
    } 
  }  
  // else if (curKVV === 'МГТ') {
  //   switch (firstInput) {
  //     case '3-7':
  //       disabledIdArr = ['kvv_second_М25х1,5', 'kvv_second_G3/4"', 'kvv_second_М32х1,5'];
  //       break;
  //     case '13-17':
  //       disabledIdArr = ['kvv_second_М16х1,5'];
  //       break;
  //     case '17-22':
  //       disabledIdArr = ['kvv_second_М16х1,5', 'kvv_second_М20х1,5','kvv_second_1/2"NPT', 'kvv_second_G1/2"', 'kvv_second_К1/2"', 'kvv_second_Rc1/2"'];
  //       break;
  //     default:
  //       disabledIdArr = [];
  //       break;
  //   } 
  // }
  // запуск отображения / скрытия инпутов блока №2
  hideSecondInputKVV(disabledIdArr);
}

// отображение / скрытие элементов input во 2-ом блоке 
// характеристик КВВ в зависимости от выбора в 1-ом блоке
function hideSecondInputKVV(hidenArr = []) {
  // console.log('kvvSecondInputArr: ' + kvvSecondInputArr);
  kvvSecondInputArr.forEach((link) => {
    const kvvLinckElmt = document.getElementById(link);
    const kvvLinckElmtId = kvvLinckElmt.id;
    // ссылка на Label текущего imput для прозрачности недоступных
    const kvvLabelElmt = document.getElementById(kvvLinckElmt.value + '_kvv_second_label')

    // проверка состоит ли в массиве недоступных элементов
    const isInTheArr = hidenArr.includes(kvvLinckElmtId);
    if (isInTheArr) {
      kvvLinckElmt.setAttribute("disabled", "");
      kvvLabelElmt.style.opacity = '50%';
      kvvLinckElmt.checked = false;
    } else {
      kvvLinckElmt.removeAttribute("disabled");
      kvvLabelElmt.removeAttribute('style');
      kvvLinckElmt.checked = false;
    }
  })
}
////////////////////////////////////  Конец КВВ  /////////////////////////////////




////////////////////////////////////  Степень IP  /////////////////////////////////
// правила формирования массива доступных к выбору типов IP
let curIpArr = []; // текущий массива доступных к выбору типов IP
function ipDegree() {

  // щчистка ранее отрисованных инпутов IP
  deleteAllChilds('typeIp');
  // щчистка значения переменной IP
  curIP = '';

  // правила формирования массива доступных IP
  if (curCase === 'Т') {

    switch (curEx) {
      case 'ExdbIICT6':
        if (curKVV === '' || curKVV === 'МГ' || curKVV === 'МГБ' ||
            curKVV === 'МГБ-М' || curKVV === 'МГМ' || curKVV === 'МГБ-П' || 
            curKVV === 'МГТ' || curKVV === 'МГФ') {
          curIpArr = ['IP65', 'IP66', 'IP68'];
        } else {
          curIpArr = [];
        };
        break;
      // case 'ExiaIICT6':
      //   if (curKVV === '' || curKVV === 'МГ' || curKVV === 'МГБ' ||
      //       curKVV === 'МГБ-М' || curKVV === 'МГМ' || curKVV === 'МГБ-П' || 
      //       curKVV === 'МГТ' || curKVV === 'МГФ') {
      //     // curIpArr = ['IP54','IP65', 'IP66', 'IP68'];
      //     curIpArr = ['IP65', 'IP66', 'IP68'];
      //   } else if (curKVV === 'ПГ' || curKVV === 'ЛГ') {
      //     // curIpArr = ['IP54','IP65', 'IP66'];
      //     curIpArr = ['IP65', 'IP66'];
      //   } else if (curKVV === 'DIN C' || curKVV === 'DIN A') {
      //     // curIpArr = ['IP54','IP65'];
      //     curIpArr = ['IP65'];
      //   } else {
      //     curIpArr = [];
      //   };
      //   break;
      default:
        if (curKVV === '' || curKVV === 'МГ' || curKVV === 'МГБ' ||
            curKVV === 'МГБ-М' || curKVV === 'МГМ' || curKVV === 'МГБ-П' || 
            curKVV === 'МГТ' || curKVV === 'МГФ') {
          // curIpArr = ['IP20', 'IP45', 'IP54', 'IP65', 'IP66', 'IP68'];
          curIpArr = ['IP65', 'IP66', 'IP68'];
        } else if (curKVV === 'ПГ' || curKVV === 'ЛГ') {
          // curIpArr = ['IP20', 'IP45', 'IP54','IP65', 'IP66'];
          curIpArr = ['IP65', 'IP66'];
        } else if (curKVV === 'DIN C' || curKVV === 'DIN A') {
          // curIpArr = ['IP20', 'IP45', 'IP54','IP65'];
          curIpArr = ['IP65'];
        } else {
          curIpArr = [];
        };
        break;
    }

  } else if (curCase === 'Тр' || curCase === 'Н1') {
    curIpArr = ['IP65'];
    // switch (curEx) {
    //   case 'ExiaIICT6':
    //     // curIpArr = ['IP54','IP65'];
    //     curIpArr = ['IP65'];
    //     break;
    //   default:
    //     // curIpArr = ['IP20', 'IP45', 'IP54','IP65'];
    //     curIpArr = ['IP65'];
    //     break;
    // }

  }
  // отрисовка блоков инпута для IP
  ipInputs();
  // слушатель для инпутов из массива доступных IP
  if (curIpArr.length > 0) {
    ipListner(curIpArr);
  }
};

// отрисовка блоков инпута для IP
function ipInputs() {
  const placeDivIp = document.getElementById('typeIp'); // ссылка на блок с вариантами IP
  curIpArr.forEach((elmtIP) => {

     // создание элемента Label
     const labelElmt = document.createElement('label');
     labelElmt.innerHTML = elmtIP;
     labelElmt.classList.add('container');
     labelElmt.htmlFor = 'ipID_' + elmtIP;
    //  labelElmt.id = elmtIP + labelId;
     placeDivIp.appendChild(labelElmt);
     // ссылка на созданный элемент label
    //  const placeLabel = document.getElementById(velmtIPal + labelId);
 
     // создание элемента input
     const inputElmt = document.createElement('input');
     inputElmt.type = 'radio';
     inputElmt.id = 'ipID_' + elmtIP;
     inputElmt.name = 'ipVariants';
     inputElmt.value = elmtIP;
     inputElmt.setAttribute("required", "");
     labelElmt.appendChild(inputElmt);
 
     // создание элемента span
     const spanlElmt = document.createElement('span');
     spanlElmt.classList.add('checkmark');
     labelElmt.appendChild(spanlElmt);
  })
}

// слушатель для инпутов из массива доступных IP
function ipListner(arr = []) {
  arr.forEach((elmt) => {
    const curInput = document.getElementById('ipID_' + elmt);
    curInput.addEventListener('click', () => {
      curIP = curInput.value;
      // console.log(curIP);
      // проверка и подсветка изменения маркировки
      chChangeMark = true; // флаг изменнения маркировки
      BGcolorMarkingBlock();
    })
  })
 
}
////////////////////////////////////  Конец Степень IP  /////////////////////////////////




////////////////////////////////////     Госповерка      /////////////////////////////////
const checkBoxPoverka = document.getElementById('checkBoxPoverka');
// слушатель на госповерку
checkBoxPoverka.addEventListener('click', () => {
  if (checkBoxPoverka.checked) {
    gosPoverka = '-ГП';
  } else if (!checkBoxPoverka.checked) {
    gosPoverka = '';
  }
 // проверка и подсветка изменения маркировки
 chChangeMark = true; // флаг изменнения маркировки
 BGcolorMarkingBlock();
})
////////////////////////////////////    Конец Госповерка   /////////////////////////////////





////////////////////////////////////  Финальная маркировка  /////////////////////////////////
const markingBTN = document.getElementById('showMarkingBTN');
const markingInput = document.getElementById('inputText');
let curDiap = ''; // диапазон измерений
let kvvMarking = ''; // маркировка КВВ
let connection = ''; // тип присоединения 
// Кнопка отображения итоговой маркировки
markingBTN.addEventListener('click', () =>{
  // проверка заполненности всех данных
  checkRequiredValues();
  let hyp = '-'; // дефис
  // маркировка КВВ
  kvvMarking = '';
  if (chVal === true && curKVV != '') {
    if (firstKVVChar != '' && secondKVVChar != '') {
      kvvMarking = hyp + curKVV + '(' + firstKVVChar + ')' +  '(' + secondKVVChar + ')' + hyp + curIP;
    } else if (firstKVVChar != '' && secondKVVChar === '') {
      kvvMarking = hyp + curKVV + '(' + firstKVVChar + ')' + hyp + curIP;
    } else if (firstKVVChar === '') {
      kvvMarking = hyp + curKVV + hyp + curIP;
    }
  } else if ((chVal === false) || (chVal === true && curKVV === '')) {
    kvvMarking = hyp + curIP;
  }

  // если нет взрывозащиты убираем дефис
  if (curEx === '') {
    hyp = '';    
  }

  // преобразование некоторых типов присоединения к процессу
  if (curConnectType === 'ВРConus' ) {
    curConnectType = 'ВР';
  } else if (curConnectType === 'D9-1' || curConnectType === 'D9-2' ) {
    curConnectType = 'D9';
  } else if (curConnectType === 'Д1' ) {
    curConnectType = 'Д';
  }

  let hyp2 = '-';
  connection = curConnectType
  // скрыть тип присоединения Ф
  if (curConnectType === 'Ф') {
    connection = '';
    hyp2 = '';
  }

  curDiap = '(' + curDiapMin + '...' + curDiapMax + ')';

  finaleMarking = curType + '-' + curTypePreassure + '-' + curCase + hyp + curEx +
                  '-' + curDiap + '-('  + curAccuracy + ')-' + curThread + hyp2 + connection + 
                  kvvMarking + gosPoverka;


  // finaleMarking = curType + '-' + curTypePreassure + '-' + curCase + hyp + curEx +
  //                 '-(' + curDiapMin + '...' + curDiapMax + ')-('  + curAccuracy + ')-' + 
  //                 curThread + connection + kvvMarking + gosPoverka;

  markingInput.value = finaleMarking;
  NodeChangeClass(['markingBlock'], 'add', 'active');
  chChangeMark = false;
  BGcolorMarkingBlock();
  // console.log('firstKVVChar => ' + firstKVVChar);
  // console.log('secondKVVChar => ' + secondKVVChar);
  // console.log('curIP => ' + curIP);
  // Сохранение ключевых переменных в хранилище
  storeVariables()
});

// Сохранение ключевых переменных в хранилище
function storeVariables() {
  if (typeof(Storage) !== "undefined") {
    sessionStorage.clear();
    sessionStorage['curType'] = curType;
    sessionStorage['curTypePreassure'] = curTypePreassure;
    sessionStorage['curCase'] = curCase;
    sessionStorage['curEx'] = curEx;
    sessionStorage['curDiap'] = curDiap;
    sessionStorage['curAccuracy'] = curAccuracy;
    sessionStorage['curThread'] = curThread;
    sessionStorage['connection'] = connection;
    sessionStorage['curKVV'] = curKVV;
    sessionStorage['gosPoverka'] = gosPoverka;
    sessionStorage['flanInfoForEmail'] = flanInfoForEmail;
    sessionStorage['firstKVVChar'] = firstKVVChar;
    sessionStorage['secondKVVChar'] = secondKVVChar; 
    sessionStorage['curIP'] = curIP;
    sessionStorage['curDiapMax'] = curDiapMax;


  } else {
    console.log('Sorry! No Web Storage support..');
  };
};

 
// Кнопка копирования маркировки
const text = document.getElementById("inputText");
const btn = document.getElementById("copyText");
btn.addEventListener('click', function () {
  if (!chChangeMark) {
    NodeChangeClass(['alertMsgForMarking'], 'remove', 'active');
    // NodeChangeClass(['alertMsgForDiap'], 'remove', 'active');
    text.select();
      //пытаемся скопировать текст в буфер обмена
      try {
        document.execCommand("copy");
      } catch(err) {
        console.log('Не удалось скопировать маркировку!');
      }
      var tooltip = document.getElementById("myTooltip");
      tooltip.innerHTML = "Скопировано: " + markingInput.value;
  }  else if (chChangeMark) {
    NodeChangeClass(['alertMsgForMarking'], 'add', 'active');
    document.getElementById('alertMsgForMarking').innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Внимание!</strong> Нажмите  "Сформировать маркировку"'
    // NodeChangeClass(['alertMsgForDiap'], 'add', 'active');
    // document.getElementById('alertMsgForDiap').innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Внимание!</strong> Нажмите  "Сформировать маркировку"'
  }
});

// обработка события ухода мышки с кнопки "Копировать"
btn.addEventListener('mouseout', function () {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Копировать в буфер";
});


// Кнопка вызова формы отправки на Емайл
const btnEmail = document.getElementById("btnEmail");
btnEmail.addEventListener('click', () => {
  if (!chChangeMark) {
    NodeChangeClass(['alertMsgForMarking'], 'remove', 'active');

    // NodeChangeClass(['alertMsgForDiap'], 'remove', 'active');
    NodeChangeClass(['sendForm'], 'add', 'show');
    document.getElementById('markIDS').value = finaleMarking;
    // описание нестандартного фланца переносим в форму для отправки письма
    if (flanInfoForEmail != '') {
      document.getElementById('subject').value = 'Фланец для присоединения к процессу: ' + flanInfoForEmail;
    } else {
      document.getElementById('subject').value = '';
    };
  } else if (chChangeMark) {
    NodeChangeClass(['alertMsgForMarking'], 'add', 'active');
    document.getElementById('alertMsgForMarking').innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Внимание!</strong> Нажмите "Сформировать маркировку"'

    // NodeChangeClass(['alertMsgForDiap'], 'add', 'active');
    // document.getElementById('alertMsgForDiap').innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Внимание!</strong> Нажмите "Сформировать маркировку"'
  }
});
 ////////////////////////////////////  Конец финальная маркировка  /////////////////////////////////




////////////////////////////////////   Общие функции   /////////////////////////////////
// ограничение ввода символов в числовой интпут
function chInput(e) {
  if (e.value.indexOf(".") != '-1') {
    e.value=e.value.substring(0, e.value.indexOf(".") + 4);
  };
};

// чек контроля заполненности блока с вариантами резьбы
let checkClearThreadBox = true; 
// Очистка блока 'threadForConnect' с резьбой 
function clearThreadBox(containerId) {
  // containerId - id блока где надо убрать дочерние элементы
  const containerElmt = document.getElementById(containerId);
  checkClearThreadBox = true; 
  // количество элементов резьбы в блоке DIV
  let kol = containerElmt.childElementCount;
  while (kol != 0) {
    containerElmt.removeChild(containerElmt.childNodes[0]);
    kol--;
  }
};

//  комплексная очистка ранее введенных значений
function clearValues() {
  // скрытие вариантов ручного ввода резьбы и др подсоединений
  NodeChangeClass(['handleThread', 'flanetzTable', 'handleClamp'], 'remove', 'active');
  // очистка введенной информации ручного ввода резьбы и др подсоединений
  NodeVisualise(0, null, ['f1','f2','f3','f4','f5'], false);
  handleThreadBlock.value = '';
  handleClampBlock.value = '';
  // очистка ранее введенных значений для КВВ 
  clearKVVValues()
};

// очистка ранее введенных значений для КВВ
function clearKVVValues() {
  curKVV = '';
  // удаление выбора характеристик КВВ
  deleteAllChilds('infoKVV')
  chKVVinputName = false;
  // очистка массиов id для 2-х диапазонов input-ов характеристик 
  // КВВ для подключ. слушателей
  kvvFirstInputArr = [];
  kvvSecondInputArr = [];
  // checkBoxKVV.checked = false;
  // console.log(chVal);
  // // удаление выбора характеристик КВВ
  NodeChangeClass(['handleThreadKVV', 'fieldset_KVV_info'], 'remove', 'active');
  handleThreadKVV.value = '';
  firstKVVChar = '';
  secondKVVChar = '';
};

 // Удалить все дочерние элементы из контейнера
 function deleteAllChilds(containerID = '') {
  // Удалить все дочерние элементы из контейнера
  const elmtContainer = document.getElementById(containerID);
  elmtContainer.querySelectorAll('*').forEach(n => n.remove());
};

//  Функция скрытия / отображения элементов DOM и снятия / установки выделения
function NodeVisualise (curNode = [], dispVal, checkNode = [], chVal) {
  //  Функция скрытия / отображения элементов DOM
  // curNode - массив 'id' DOM объектов;
  // dispVal - значение свойства style.display: 'none' or 'block';
  // chNode - 'name' of input radio объектов, которые можно выделить или снять выделение;
  // chVal - значение свойства checked: 'true' or 'false';
  try {
    if (curNode.length > 0) {
      curNode.forEach((link) => { 
        const temp = document.getElementById(link);
        temp.style.display = dispVal;
      })
    };
    if (checkNode) {
      checkNode.forEach((link) => {
        const temp = document.getElementById(link);
        temp.checked = chVal;
      })
    };
  } catch (err) {
    console.log(err);
  }
};

//  Функция добавления / удаления класса в элемент DOM
function NodeChangeClass (curNode = [], action, className) {
  //  Функция добавления / удаления класса в элемент DOM
  // curNode - массив 'id' DOM объектов;
  // action - значение требуемой задачи: "add" or "remove";
  // className - название класса;
  try { 
    curNode.forEach(link => {
      const temp = document.getElementById(link)
      if (action  === 'add') {
        temp.classList.add(className);
      }
      else if (action === 'remove') {
        temp.classList.remove(className);
      } else {
        console.log('В функции NodeClass введен параметр отличный от "add" or "remove"');
      }
    })
  } catch (err) {
    console.log(err);
  }
}

// // функция прокрутки экрана
// function AutoScroll () {
//   window.scrollTo({
//     top: 10000,
//     left: 0,
//     behavior: 'smooth'
//   });
// }

// подсветка фона маркировки в случае изменения характеристик датчика после формирования маркировки
function BGcolorMarkingBlock() {
  const markingBlock = document.getElementById('inputText');
  if (chChangeMark) {
    markingBlock.classList.add('BGcolor');
    NodeChangeClass(['sendForm'], 'remove', 'show');
    NodeChangeClass(['reportBox'], 'remove', 'active');
  } else {
    markingBlock.classList.remove('BGcolor');
    alertMsgForMarkingIDQ.classList.remove('active');
  }
}; 


// проверка заполненности всех обязательных характеристик
function checkRequiredValues() {
  const varNamesArr = {
    'curTypePreassure' : {
      'varValue' : curTypePreassure,
      'alertText' : 'Модификация датчика',
      'anchorHref' : '#typePreassAnchor'
    },
    'curType' : {
      'varValue' : curType,
      'alertText' : 'Вид измеряемого давления',
      'anchorHref' : '#typeAnchor'
    },
    'curCase' : {
      'varValue' : curCase,
      'alertText' : 'Исполнение корпуса',
      'anchorHref' : '#caseAnchor'
    },
    'curDiapMin' : {
      'varValue' : curDiapMin,
      'alertText' : 'Нижняя граница измерения',
      'anchorHref' : '#diapAnchor'
    },
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
    'curConnectType' : {
      'varValue' : curConnectType,
      'alertText' : 'Варианты присоединения к процессу',
      'anchorHref' : '#connectTypeAnchor'
    },
    'curThread' : {
      'varValue' : curThread,
      'alertText' : 'Присоединение к процессу',
      'anchorHref' : '#threadAnchor'
    },
    'curIP' : {
      'varValue' : curIP,
      'alertText' : 'Степень защиты оболочки',
      'anchorHref' : '#IPAnchor'
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
  
  // Проверка заполненности типа КВВ для типов корпуса
  if ((curCase === 'Тр' || curCase === 'Н1') && (curKVV === '')) {
    alertTextFinale = alertTextFinale + '<a href="#typeKvvAnchor"><li>Тип кабельного ввода</li></a>';
  } else if ((curCase === 'Т' && curKVV === '') && (curEx === 'ExdbIICT6' || curIP === 'IP66' || curIP === 'IP68')) {
    alertTextFinale = alertTextFinale + '<a href="#typeKvvAnchor"><li>Тип кабельного ввода</li></a>';
  };
  // Проверка заполненности характеристик КВВ 
  if (chVal === true && kvvFirstInputArr.length > 0 && kvvSecondInputArr.length === 0) {
    const firstKVVforPGAndLG = document.getElementById('kvv_first_6-12');
    if (firstKVVChar === '' && firstKVVforPGAndLG == undefined) {
      alertTextFinale = alertTextFinale + '<a href="#kvvInfoAnchor"><li>Характеристики кабельного ввода</li></a>';
    }
  } else if (chVal === true && kvvFirstInputArr.length > 0 && kvvSecondInputArr.length > 0) {
    if ((firstKVVChar === '' && secondKVVChar === '') || (firstKVVChar === '' || secondKVVChar === '')) {
      alertTextFinale = alertTextFinale + '<a href="#kvvInfoAnchor"><li>Характеристики кабельного ввода</li></a>';
    }
  }

  // Проверка заполнения характеристик нестандартного фланца Ф5
  if (curThread === 'Ф5' && flanInfoForEmail === '') {
    alertTextFinale = alertTextFinale + '<a href="#threadAnchor"><li>Характеристики фланцевого присоединения</li></a>';
  };
  // console.log(curKVV);
  // console.log(curCase);
  // console.log(alertTextFinale);
  // отображение Алерт-блока
  if (alertTextFinale != '') {
    showAlert(alertTextFinale, 'add');
    btnEmail.style.display = 'none'; // скрытие кнопки отправить на Email
    NodeChangeClass(['sendForm'], 'remove', 'show'); // скрытие формы отправить на Email
    // sendForm.classList.remove('show'); // скрытие формы отправить на Email
    btnInfo.style.display = 'none'; // скрытие кнопки Характеристики ИД
  } else  if (alertTextFinale === '') {
    showAlert(alertTextFinale, 'remove');
    btnEmail.style.display = 'inline-block';
    btnInfo.style.display = 'inline-block';
  }
};


// отображение Алерт-блока
function showAlert(alertList = '', action = '') {
 
  const alertText = document.getElementById('alertText');
  NodeChangeClass(['alertBox'], action, 'active');
  alertText.innerHTML = '<ul>' + alertList + '</ul>';
  
};


// очистка диапазона
function clearPreasureDiap() {
  minDiapasone.value = '';
  maxDiapasone.value = '';
  tmpDiapMin = '';
  tmpDiapMax = '';
  curDiapMax = '';
  curDiapMin = '';
// убираем сообщение об ошибке
  NodeChangeClass(['alertMsgForDiap'], 'remove', 'active');
  document.getElementById('minDiapasone').style.background = '#ffffff';
  document.getElementById('maxDiapasone').style.background = '#ffffff';
  chDiap = true;
};

////////////////////////////////////  Конец общие функции  /////////////////////////////////