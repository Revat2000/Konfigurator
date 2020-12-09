'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

// to make it work you need gmail account
const gmailEmail = functions.config().gmail.login;
const gmailPassword = functions.config().gmail.pass;


// selected country
var countryOfSender = '';
var adresToreply = '';
var sensorMark = '';
var companyPersone = '';
var phonePersone = '';
var contactPersone = '';
var contextPersone = '';


//creating function for sending emails
var goMail = function (message) {

//transporter is a way to send your emails
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailEmail,
            pass: gmailPassword
        }
    });


    // control the email adress of reciever
    let adressTo = ''; 
    if (countryOfSender === 'Россия') {
        adressTo = 'mail@termopoint.ru';
    } else {
        adressTo = 'mail@pointltd.by';
    }

    
    const mailOptions = {
        from: 'Конфигуратор маркировки' + gmailEmail, // sender address
        to: adressTo ,  // list of receivers
        cc: adresToreply, // copy of letter for sender
        subject: 'Запрос на датчик давления производства ООО "Поинт"', // Subject line
        text: message, // plain text body
        html: message,  // html body
        replyTo: adresToreply,
        disableUrlAccess: true,
        disableFileAccess: true
    };

    //this is callback function to return status to firebase console
    const getDeliveryStatus = function (error, info) {
        if (error) {
            return console.log(error);
        }
        return console.log('Message sent: %s', info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    };
    //call of this function send an email, and return status
    transporter.sendMail(mailOptions, getDeliveryStatus);
};

//.onDataAdded is watches for changes in database
exports.onDataAdded = functions.database.ref('/emails/{sessionId}').onCreate((snap, context) => {

    //here we catch a new data, added to firebase database, it stored in a snap variable
    const createdData = snap.val();

    countryOfSender = createdData.country; // страна отправителя
    adresToreply = createdData.email; // адрес отправителя 
    sensorMark = createdData.marking; // маркировка ИД
    companyPersone = createdData.oranization; // организация
    phonePersone = createdData.phone; // телефон
    contactPersone = createdData.name; // ФИО 
    contextPersone = createdData.info; // Доп. инфа 

    var text = '<h3>Запрос на датчик давления</h3><br><p>' + sensorMark +'</p><p>Страна: ' + countryOfSender + '</p><p>Организация: ' 
     + companyPersone + '</p><p>Контактное лицо: ' + contactPersone + '</p><p>E-mail отправителя: ' + adresToreply  
     + '</p><p>Контактный телефон: ' + phonePersone + '</p><p>Дополнительная информация: ' + contextPersone;
    //here we send new data using function for sending emails
    goMail(text);
});
