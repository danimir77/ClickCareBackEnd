const nodemailer = require("nodemailer");
const { host, port, secure, auth } = require("./config");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: secure,
  auth: {
    user: auth.user,
    pass: auth.pass,
  },
});

function sendEmailToValidate(emailTo, userId, name, surname) {
  // let hashId = bcrypt.hashSync(String(userId), 10);
  // hashId.replaceAll('/', "SLASH");
  if (userId) {
    console.log("userId-->> ", userId);
    const mailOptions = {
      from: auth.user,
      to: emailTo,
      subject: "ClickCare - User Validation",
      html: `<p>Hello ${name} ${surname},
      ClickCare is a platform that allows you to manage your health and your life.</p>
      <p>To validate your account, please click on the link. If you have any questions, please contact us.</p>
      <p>Thank you for using ClickCare.</p><a href="${process.env.URL_MAIL}/api/userValidationProcess/${userId}">Click here</a><br>`,
    };

    console.log("mailOptions", mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } else {
    console.log("userId not found");
  }
}

function sendSimpleEmail(emailTo, subject, text, name, surname) {
  const mailOptions = {
    from: auth.user,
    to: emailTo,
    subject: subject,
    html: `<p>Hello ${name} ${surname}.</p><p>${text}</p><a href="${process.env.URL_MAIL}/">Welcom to ClickCare!</a>`,
  };

  console.log("mailOptions", mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// sendEmail("dlorko@gmail.com", "prueba", "prueba texto");

module.exports = { sendEmailToValidate, sendSimpleEmail };
