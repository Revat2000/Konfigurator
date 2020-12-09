'use strict';

let repType = '';
let repTypePreassure = '';
let repCase = '';
let repEx = '';
let repDiap = '';
let repAccuracy = '';
let repTkompVal = '';
let repMinTK = '';
let repMaxTK = '';
let repThread = '';
let repConnection = '';
let repCurKVV = '';
let repGosPoverka = '';
let repFlanInfoForEmail = '';
let repFirstKvvChar = '';
let repSecondKvvChar = '';
let repIP = '';
let repHART = '';
let repInterface = '';
let repCurDiapMax = 0.0;



// Кнопка отображения характеристик ИД
const btnInfo = document.getElementById('btnInfo');
btnInfo.addEventListener('click', (evt) => {
  evt.preventDefault();

  repType = '';
  repTypePreassure = '';
  repCase = '';
  repEx = '';
  repDiap = '';
  repAccuracy = '';
  repTkompVal = '';
  repMinTK = '';
  repMaxTK = '';
  repThread = '';
  repConnection = '';
  repCurKVV = '';
  repGosPoverka = '';
  repFlanInfoForEmail = '';
  repFirstKvvChar = '';
  repSecondKvvChar = '';
  repIP = '';
  repHART = '';
  repInterface = '';
  repCurDiapMax = 0.0;

  repType = sessionStorage['curType'];
  repTypePreassure = sessionStorage['curTypePreassure'];
  if (repType == 'ИД-S') {
    repCase = 'ИД-S';
  } else {
    repCase = sessionStorage['curCase'];
  };
  repEx = sessionStorage['curEx'];
  repDiap = sessionStorage['curDiap'];
  repAccuracy = sessionStorage['curAccuracy'];
  repTkompVal = sessionStorage['tkompVal'];
  repMinTK = sessionStorage['minTK'];
  repMaxTK = sessionStorage['maxTK'];
  repConnection = sessionStorage['connection'];
  repThread = sessionStorage['curThread'];
  repCurKVV = sessionStorage['curKVV'];
  repGosPoverka = sessionStorage['gosPoverka'];
  repFlanInfoForEmail = sessionStorage['flanInfoForEmail'];
  repFirstKvvChar = sessionStorage['firstKVVChar'];
  repSecondKvvChar = sessionStorage['secondKVVChar'];
  repIP = sessionStorage['curIP'];
  repHART = sessionStorage['hart']; 
  repInterface = sessionStorage['curInterface'];
  repCurDiapMax = parseFloat(sessionStorage['curDiapMax'], 10);

  // расчет дополнительной погрешности
  if (repMinTK == undefined || repMaxTK == undefined || repMinTK == '' || repMaxTK == '') {
    additionAccuracy()
  };

  // createArray();
  const curType = sessionStorage['curType']
  createArray(curType);

  // отображение блока описания ИД
  showReport();

});



// класс объекта отчета
class ReportInfo {
  constructor(curType, curTypePreassure, curCase,
    curEx, curInterface, hart, curDiap, curAccuracy, tkompVal,
    connection, curThread, curKVV, curIP, gosPoverka, otherInf) {
    this.curType = curType;
    this.curTypePreassure = curTypePreassure;
    this.curCase = curCase;
    this.curEx = curEx;
    this.curInterface = curInterface;
    this.hart = hart;
    this.curDiap = curDiap;
    this.curAccuracy = curAccuracy;
    this.tkompVal = tkompVal;
    this.connection = connection;
    this.curThread = curThread;
    this.curKVV = curKVV;
    this.curIP = curIP;
    this.gosPoverka = gosPoverka;
    this.otherInf = otherInf;
  }
};

let infoReportArr = [];
// Активация требуемого массива для конкретного вида ИД
function createArray(curType) {
  if (curType == 'ИД-S') {
    // БД для ИД-S
    infoReportArr =[];
    infoReportArr = {
      'curType' : {
        'name' : 'Датчик избыточного давления ',
        'unit' : '',
        'varVal' : repType + '\nМодель корпуса: штепсельный разъем DIN 43650 form A под кабель (6÷9) мм'
      },
      'curDiap' : {
        'name' : 'Верхний предел измерения: ',
        'unit' : 'МПа',
        'varVal' : repDiap
      },
      'curAccuracy' : {
        'name' : 'Предел основной приведенной погрешности: ',
        'unit' : '%',
        'varVal' : repAccuracy
      },
      'curThread' : {
        'name' : 'Присоединение к процессу: ',
        'unit' : '',
        'varVal' : repThread
      },
      'gosPoverka' : {
        'name' : 'Государственная поверка: ',
        'unit' : 'да'
      },
      'otherInf' : {
        'varVal' : repThread
      }
    };
   } else if (curType == 'ИД-Qк' || curType == 'ИД-Qм' || curType == 'ИД-F') {
    // БД для ИД-Q
    infoReportArr =[];
    infoReportArr = {
      'curType' : {
        'name' : 'Датчик избыточного давления стандартного исполнения ',
        'unit' : '',
        'varVal' : repType
      },
      'curTypePreassure' : {
        'name' : '',
        'unit' : ''
      },
      'curCase' : {
        'name' : 'Модель корпуса: ',
        'unit' : '',
        'varVal' : '',
        'caseInfo' : {
          'Ти': 'тип "' + repCase + '" из алюминиевого сплава с окном индикации\nИндикатор жидкокристаллический цифровой без подсветки',
          'Тр': 'тип "' + repCase + '" трубного исполнения из нержавеющей стали',
          'Т': 'тип "' + repCase + '" из алюминиевого сплава',
          'Н1': 'тип "' + repCase + '" из нержавеющей стали'
        }
      },
      'curEx' : {
        'name' : 'Вид взрывозащиты: ',
        'unit' : '',
        'varVal' : '',
        'ExInfo' : {
          'ExdbIICT6': '1ExdIICT6X «взрывонепроницаемая оболочка»',
          'ExiaIICT6': '0ExiaIICT6X «искробезопасная электрическая цепь»'
        }
      },
      'curInterface' : {
        'name' : 'Выходной сигнал: '
      }, 
      'hart' : {
        'name' : 'Hаличие HART-протокола: '
      },      
      'curDiap' : {
        'name' : 'Диапазон измерения: ',
        'unit' : 'МПа',
        'varVal' : repDiap
      },
      'curAccuracy' : {
        'name' : 'Предел основной приведенной погрешности: ',
        'unit' : '%',
        'varVal' : repAccuracy
      },
      'connection' : {
        'name' : 'Тип присоединения к процессу: ',
        'unit' : '',
        'varVal' : repConnection,
        'connectionInfo' : {
          'И': 'с центрирующей цапфой',
          'И1': 'с центрирующей цапфой',
          'И2': 'с центрирующей цапфой',
          'Е': 'с эластомерным уплотнением (Тип Е)',
          'К': 'c самоуплотняющейся конической резьбой',
          'ВР': 'c внутренней резьбой',
          'ВР1': 'c внутренней резьбой',
          'ВР2': 'c внутренней резьбой',
          'ВМ': 'c защитной мембраной',
          'Д': 'с дросселем',
          'D9': 'c входным отверстием не более 9 мм',
          'П': 'штуцерное присоединение',
          'С': 'фланцевое присоединение',
          'Сн': 'фланцы, повернутые на 90˚',
          'Clamp': 'Tri-Clamp соединение',
          'Ф': 'с фланцем'
        }
      },
      'curThread' : {
        'name' : 'Присоединение к процессу: ',
        'unit' : '',
        'varVal' : repThread
      },
      'curKVV' : {
        'name' : 'Тип кабельного ввода: ',
        'unit' : '',
        'varVal' : repCurKVV,
        'curKVVInfo' : {
          'DIN A': 'Штепсельный разъем DIN43650 form A под обжимаемый кабель диаметром 6-9 мм',
          'DIN C': 'Штепсельный разъем DIN43650 form С под обжимаемый кабель диаметром 4.5-6 мм',
          'ПГ': 'пластиковый под обжимаемый кабель диаметром 6-12 мм',
          'ЛГ': 'латунный для небронированного кабеля диаметром 6-12 мм',
          'МГ': 'металлический под небронированный кабель диаметром ' + repFirstKvvChar + ' мм',
          'МГБ': 'металлический под бронированный кабель диаметром ' + repFirstKvvChar + ' мм без брони, внешний диаметр ' + repSecondKvvChar + ' мм.',
          'МГМ': 'металлический под кабель диаметром ' + repFirstKvvChar + ' мм, с присоединительной внутренней резьбой' + repSecondKvvChar + ' с переходной муфтой',
          'МГБ-М': 'металлический под обжимаемый кабель диаметром ' + repFirstKvvChar + ' мм для крепления металлорукава ' + repSecondKvvChar,
          'МГБ-П': 'металлический под обжимаемый кабель диаметром ' + repFirstKvvChar + ' мм для крепления пластикового рукава ' + repSecondKvvChar,
          'МГТ': 'металлический под кабель диаметром ' + repFirstKvvChar + ' мм, с присоединительной резьбой' + repSecondKvvChar,
          'МГФ': 'металлический для небронированного кабеля ' + repFirstKvvChar + ' мм с последующей фиксацией кабеля'
        }
      },
      'curIP' : {
        'name' : 'Степень защиты: ',
        'varVal' : repIP
      },
      'gosPoverka' : {
        'name' : 'Государственная поверка: '
      },
      'otherInf' : {
        'varVal' : repCase
      }
    }
  }
  // заполнение отчета
  createInstance();
};

let reportText = '';
// заполнение отчета
function createInstance() {
  reportText = '';
  const newInfo = new ReportInfo(
      sessionStorage['curType'],
      sessionStorage['curTypePreassure'],
      sessionStorage['curCase'],
      sessionStorage['curEx'],
      sessionStorage['curInterface'],
      sessionStorage['hart'],
      sessionStorage['curDiap'],
      sessionStorage['curAccuracy'],
      sessionStorage['tkompVal'],
      sessionStorage['connection'],
      sessionStorage['curThread'],
      sessionStorage['curKVV'],
      sessionStorage['curIP'],
      sessionStorage['gosPoverka'],
      repCase
        
  );
  
  let key = '';
  let caseInfo = '';
  let exInfo = '';
  let connectionInfo = '';
  let curKVVInfo = '';
  
  for (key in newInfo) {
    // console.log(key);
    let val = newInfo[key]; // значения переменных
    // если значенеи переменной не пусто
    if (val != undefined) {
      // обходим массив БД в поисках совпадений по ключам (именам переменных)
      Object.keys(infoReportArr).forEach(key2 => {
        // когда совпадение найдено
        if (key2 == key) {

           // для типа ИД
           if (key == 'curType') {
             if (curType == 'ИД-Qк') {
              switch (repTypePreassure) {
                case 'И':
                  reportText = reportText + 'Датчик избыточного давления стандартного исполнения ' + infoReportArr[key2].varVal + '\n' + 
                              'Материал деталей, контактирующих с измеряемой средой: нержавеющая сталь 12Х18Н10Т\nМатериал мембраны сенсора: керамика\n';
                  break;
                case 'А':
                  reportText = reportText + 'Датчик абсолютного давления стандартного исполнения ' + infoReportArr[key2].varVal + '\n' + 
                              'Материал деталей, контактирующих с измеряемой средой: нержавеющая сталь 12Х18Н10Т\nМатериал мембраны сенсора: керамика\n';
                  break;
                default:
                  break;
              }
             } else if (curType == 'ИД-Qм') { 
              switch (repTypePreassure) {
                case 'И':
                  reportText = reportText + 'Датчик избыточного давления стандартного исполнения ' + infoReportArr[key2].varVal + '\n' + 
                              'Материал деталей, контактирующих с измеряемой средой: нержавеющая сталь 12Х18Н10Т\nМатериал мембраны сенсора: сталь AISI 316L\nЗаполнение мембраны: силиконовое масло\n';
                  break;
                case 'А':
                  reportText = reportText + 'Датчик абсолютного давления стандартного исполнения ' + infoReportArr[key2].varVal + '\n' + 
                              'Материал деталей, контактирующих с измеряемой средой: нержавеющая сталь 12Х18Н10Т\nМатериал мембраны сенсора: сталь AISI 316L\nЗаполнение мембраны: силиконовое масло\n';
                  break;
                case 'Р':
                  reportText = reportText + 'Датчик разности давлений стандартного исполнения ' + infoReportArr[key2].varVal + '\n' + 
                              'Материал деталей, контактирующих с измеряемой средой: нержавеющая сталь AISI 316L\nМатериал мембраны сенсора: сталь AISI 316L\nЗаполнение мембраны: силиконовое масло\n';
                  break;
                default:
                  break;
              }
             } else if (curType == 'ИД-F') {
              switch (repTypePreassure) {
                case 'И':
                  reportText = reportText + 'Датчик избыточного давления интеллектуальный ' + infoReportArr[key2].varVal + '\n' + 
                              'Материал деталей, контактирующих с измеряемой средой: нержавеющая сталь 12Х18Н10Т\nМатериал мембраны сенсора: сталь AISI 316L\nЗаполнение мембраны: силиконовое масло\n';
                  break;
                case 'А':
                  reportText = reportText + 'Датчик абсолютного давления интеллектуальный ' + infoReportArr[key2].varVal + '\n' + 
                              'Материал деталей, контактирующих с измеряемой средой: нержавеющая сталь 12Х18Н10Т\nМатериал мембраны сенсора: сталь AISI 316L\nЗаполнение мембраны: силиконовое масло\n';
                  break;
                case 'Р':
                  reportText = reportText + 'Датчик разности давлений интеллектуальный ' + infoReportArr[key2].varVal + '\n' + 
                              'Материал деталей, контактирующих с измеряемой средой: нержавеющая сталь AISI 316L\nМатериал мембраны сенсора: сталь AISI 316L\nЗаполнение мембраны: силиконовое масло\n';
                  break;
                default:
                  break;
              }
             } else {
                  reportText = reportText + infoReportArr[key2].name + infoReportArr[key2].varVal + '\n' + 
                              'Материал деталей, контактирующих с измеряемой средой: нержавеющая сталь 12Х18Н10Т\nМатериал мембраны сенсора: керамика\n';
             }

            // для типа корпуса
          } else if (key == 'curCase') {
                let caseInfoArr = infoReportArr[key2].caseInfo;
                Object.keys(caseInfoArr).forEach(key3 => {
                  if (key3 == val) {
                    caseInfo = caseInfoArr[key3]
                  }
                });
                if (caseInfo != '') {
                  reportText = reportText + infoReportArr[key2].name + infoReportArr[key2].varVal + infoReportArr[key2].unit + caseInfo + '\n';
                };

            // для вида взрывозащиты
          } else if (key == 'curEx') {
                let ExInfoArr = infoReportArr[key2].ExInfo;
                Object.keys(ExInfoArr).forEach(key4 => {
                  if (key4 == val) {
                    exInfo = ExInfoArr[key4];
                  }
                });
                if (exInfo != '') {
                  reportText = reportText + infoReportArr[key2].name + exInfo + '\n';
                };
                if (repEx  == 'ExiaIICT6') {
                  reportText = reportText + 'Напряжение питания: 12-30 В\n';
                } else  {
                  reportText = reportText + 'Напряжение питания: 12-36 В\n';
                };
          
           // для выходного сигнала
          } else if (key == 'curInterface') {
              if (repInterface != '' && repInterface != undefined) {
                reportText = reportText + infoReportArr[key2].name + repInterface + '\n';
              }
          
            // для HART
          } else if (key == 'hart') {
              if (repHART == 'HART') {
                reportText = reportText + infoReportArr[key2].name + 'да\n';
              }
          
            // для диапазона измерения
          } else if (key == 'curDiap') {
              if (repTypePreassure == 'И' || repTypePreassure == 'А') {
                reportText = reportText + infoReportArr[key2].name + infoReportArr[key2].varVal + infoReportArr[key2].unit + '\n';
              } else if (repTypePreassure == 'Р') {
                  if (repCurDiapMax <= 0.01) {
                    reportText = reportText + infoReportArr[key2].name + infoReportArr[key2].varVal + infoReportArr[key2].unit + '\n' +
                                  'Статическое давление: 20МПа\n';
                  } else if (repCurDiapMax > 0.01) {
                    reportText = reportText + infoReportArr[key2].name + infoReportArr[key2].varVal + infoReportArr[key2].unit + '\n' +
                                  'Статическое давление: 32МПа\n';
                  }
              } else {
                reportText = reportText + infoReportArr[key2].name + infoReportArr[key2].varVal + infoReportArr[key2].unit + '\n';
              }
          
            // для погрешности и доп/погрешности
          } else if (key == 'curAccuracy') {
              if ((repMinTK == undefined || repMinTK == '') && (repMaxTK == undefined || repMaxTK == '') && curType != 'ИД-S') {
                reportText = reportText + infoReportArr[key2].name + infoReportArr[key2].varVal + ' ' + infoReportArr[key2].unit + '\n' + 
                            'Предел дополнительной погрешности, вызванной изменением температуры окружающего воздуха на каждые 10°С, не превышает ' + 
                            addAccuracy + ' предела основной приведенной погрешности\n';
              } else if (repCase == 'Ти' && (repMinTK != '' || repMaxTK != '')) {
                reportText = reportText + infoReportArr[key2].name + infoReportArr[key2].varVal + ' ' + infoReportArr[key2].unit + '\n' + 
                            'Диапазон температурной компенсации: от ' + repMinTK + '˚С до ' + repMaxTK + '˚С, для ИЖЦ температура окружающего воздуха: от -40˚С до +70˚С\n';
              } else if (repCase != 'Ти' && curType != 'ИД-S' && (repMinTK != '' || repMaxTK != '')) {
                reportText = reportText + infoReportArr[key2].name + infoReportArr[key2].varVal + ' ' + infoReportArr[key2].unit + '\n' + 
                            'Диапазон температурной компенсации: от ' + repMinTK + '˚С до ' + repMaxTK + '˚С\n';
              }
          
            //  для типа присоединения
          } else if (key == 'connection') {
              let connectionInfoArr = infoReportArr[key2].connectionInfo;
              Object.keys(connectionInfoArr).forEach(key5 => {
                if (key5 == val) {
                  connectionInfo = connectionInfoArr[key5];
                }
              });
              if (connectionInfo != '') {
                reportText = reportText + infoReportArr[key2].name + '"' + infoReportArr[key2].varVal + '" ' + connectionInfo + '\n';
              };

            // для резьбы 
          } else if (key == 'curThread') {
              let threadVal = infoReportArr[key2].varVal;
              // стандартные фланцы
              if (threadVal == 'Ф1' || threadVal == 'Ф2' || threadVal == 'Ф3' || threadVal == 'Ф4') {
                reportText = reportText + infoReportArr[key2].name + 'фланцевое ' + infoReportArr[key2].varVal + '\n';
              // НЕстандартные фланцы
              } else if (threadVal == 'Ф5') {
                reportText = reportText + infoReportArr[key2].name + 'фланцевое Ф5\nИсполнение фланца: ' + repFlanInfoForEmail + '\n';
              // Tri-Clamp соединение
              } else if (connectionInfo  == 'Tri-Clamp соединение') {
                reportText = reportText + 'Диаметр ответной присоединительной части: ' + infoReportArr[key2].varVal + ' дюймов\n';
              // резьба 
              } else {
                reportText = reportText + infoReportArr[key2].name + 'резьба ' + infoReportArr[key2].varVal + '\n';
              }

            // для KVV
          } else if (key == 'curKVV') {
            let kvvVal = infoReportArr[key2].varVal;
            let curKVVInfoArr = infoReportArr[key2].curKVVInfo;
            Object.keys(curKVVInfoArr).forEach(key6 => {
              if (key6 == val) {
                curKVVInfo = curKVVInfoArr[key6];
              }
            });
            if (curKVVInfo != '') {
              if (kvvVal == 'DIN A') {
                reportText = reportText + 'Штепсельный разъем DIN43650 form A под обжимаемый кабель диаметром 6-9 мм\n';
              } else if (kvvVal == 'DIN C') { 
                reportText = reportText + 'Штепсельный разъем DIN43650 form С под обжимаемый кабель диаметром 4.5-6 мм\n';
              } else {
                reportText = reportText + infoReportArr[key2].name + '"' + infoReportArr[key2].varVal + '" ' + curKVVInfo + '\n';
              }
            };

            // для IP
          } else if (key == 'curIP') {
            if (infoReportArr[key2].varVal != undefined) {
              reportText = reportText + infoReportArr[key2].name +  infoReportArr[key2].varVal + '\n';
            }
            // для доп информации
          } else if (key == 'otherInf') {
            let text1 = 'Выходной сигнал: от 4 до 20 мА\n' + 'Тип выходного сигнала: с линейно возрастающей характеристикой выходного сигнала\n' + 
            'Подстройка "нуля" осуществляется подстроечным резистором\n';
            //  доп инф 1
                if (curType == 'ИД-Qк') {
                  switch (repTypePreassure) {
                    case 'И':
                      reportText = reportText + 'Выходной сигнал: от 4 до 20 мА\n' + 'Тип выходного сигнала: с линейно возрастающей характеристикой выходного сигнала\n' + 
                                  'Подстройка "нуля" осуществляется подстроечным резистором\n';
                      break;
                    case 'А':
                      reportText = reportText + text1;
                      break;
                    default:
                      break;
                  }
                } else if (curType == 'ИД-Qм') { 
                  switch (repTypePreassure) {
                    case 'И':
                      reportText = reportText + 'Выходной сигнал: от 4 до 20 мА\n' + 'Тип выходного сигнала: с линейно возрастающей характеристикой выходного сигнала\n' + 
                                  'Подстройка "нуля" осуществляется подстроечным резистором\n';
                      break;
                    case 'А':
                      reportText = reportText + text1;
                      break;
                    case 'Р':
                      reportText = reportText + text1;
                      break;
                    default:
                      break;
                  }
                } else if (curType == 'ИД-F') {
                  if (repCase != 'Т' && repCase != 'Ти') {
                        reportText = reportText + "При перенастройке погрешность изменяется по формуле: y'=y*(Pмах/Pн) , где\nγ' – погрешность датчика для перенастроенного диапазона;\nγ – погрешность датчика;\nРмах – верхний предел измерения датчика;\nРн – настроенный диапазон датчика\n";
                  }

                  if (repHART == 'HART') {
                    if (repCase == 'Ти') {
                      reportText = reportText + 'Наличие функции калибровки нуля, сброса в заводские установки, а также настройки начала и конца диапазона заданным давлением с помощью кнопок на панели индикатора\n';
                    } else {
                      reportText = reportText + 'Перенастройка осуществляется HART модемом, поставляемым отдельно\n';
                    }
                    // switch (repCase) {
                    //   case 'Ти':
                    //     reportText = reportText + 'Наличие функции калибровки нуля, сброса в заводские установки, а также настройки начала и конца диапазона заданным давлением с помощью кнопок на панели индикатора\n';
                    //     break;
                    //   default:
                    //     reportText = reportText + 'Перенастройка осуществляется HART модемом, поставляемым отдельно\n';
                    //     break;
                    // }
                  } else if (repHART != 'HART') {
                    switch (repCase) {
                      case 'Тр':
                        reportText = reportText + 'Подстройка "нуля" осуществляется подстроечным резистором\n';
                        break;
                      case 'Н1':
                        reportText = reportText + 'Подстройка "нуля" осуществляется подстроечным резистором\n';
                        break;
                      default:
                        break;
                    }
                  }
                } else if (curType == 'ИД-S') {
                    reportText = reportText + 'Выходной сигнал: от 4 до 20 мА\n' + 'Напряжение питания: 12-36 В\n' + 
                                'Без температурной компенсации. Без подстройки «нуля»\n' + 'Степень защиты датчиков от воздействия воды и пыли IP65\n';
                } else {
                    reportText = reportText + 'Выходной сигнал: от 4 до 20 мА\n' + 'Напряжение питания: 12-36 В\n' + 'Без температурной компенсации. Без подстройки «нуля»\n';
                }

            // //  доп инф 2
            // let otherInfoArr = infoReportArr[key2].otherInfo;
            // Object.keys(otherInfoArr).forEach(key7 => {
            //   if (key7 == repCase) {
            //     reportText  = reportText + otherInfoArr[key7];
            //   }
            // })
          
            // для госповерки
          } else if (key == 'gosPoverka') {
            if (repGosPoverka == '-ГП') {
              reportText = reportText + 'Государственная поверка: да\n';
            }
          
            // для всех остальных
          } 
          // else {
          //     if (infoReportArr[key2].varVal != undefined) {
          //       reportText = reportText + infoReportArr[key2].name + infoReportArr[key2].varVal + infoReportArr[key2].unit + '\n';
          //     }
          // };
        }     
      });
    };
  };
  // console.log(reportText);
};

// расчет дополнительной погрешности
let addAccuracy = '';
function additionAccuracy() {
  addAccuracy = '';
  switch (repAccuracy) {
    case '±0.075':
      addAccuracy = '±0.075 %';
      break;
    case '±0.1':
      addAccuracy = '±0.1 %';
      break;
    case '±0.15':
      addAccuracy = '±0.15 %';
      break;
    case '±0.2':
      addAccuracy = '±0.2 %';
      break;
    case '±0.25':
      addAccuracy = '±0.25 %';
      break;
    case '±0.5':
      addAccuracy = '±0.45 %';
      break;
    case '±1':
      addAccuracy = '±0.6 %';
      break;
    default:
      break;
  }
};



// отображение блока характеристик ИД
const reportBox = document.getElementById('reportBox');
const reportTextBlock = document.getElementById('reportText');
function showReport() {
  if (!chChangeMark) {
    alertMsgForMarking.classList.remove('active');
    // alertMsgForDiap.classList.remove('active');
    reportBox.classList.add('active');
    reportTextBlock.innerText = reportText;
  } else if (chChangeMark) {
    alertMsgForMarking.classList.add('active');
    alertMsgForMarking.innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Внимание!</strong> Нажмите "Сформировать маркировку"'
    // alertMsgForDiap.classList.add('active');
    // alertMsgForDiap.innerHTML = '<span class="closebtnAlert" onclick="this.parentElement.classList.remove(' + "'active'" + ');">&times;</span><strong>Внимание!</strong> Нажмите "Сформировать маркировку"'
  }

  
};

// Кнопка копирования характеристик ИД
const btnReport = document.getElementById("copyReportText");
btnReport.addEventListener('click', function () {
  let myTooltipReport = document.getElementById("myTooltipReport");
  navigator.clipboard.writeText(reportText)
    .then(() => {
      myTooltipReport.innerHTML = "Скопировано!";
    })
    .catch(err => {
      myTooltipReport.innerHTML = "НЕ скопировано!";
      alert('Не удалось скопировать характеристики', err);
    });
});