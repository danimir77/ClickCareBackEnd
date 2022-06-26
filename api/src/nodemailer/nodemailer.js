const nodemailer = require("nodemailer");
const { host, port, secure, auth } = require("./config");

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: secure,
  auth: {
    user: auth.user,
    pass: auth.pass,
  },
  //debug: true, // show debug output
  //logger: true, // log information in console
  //method: "PUT",
});

function sendEmailToValidate(emailTo, userId, name, surname) {
  // let hashId = bcrypt.hashSync(String(userId), 10);
  // hashId.replaceAll('/', "SLASH");
  if (userId) {
    const mailOptions = {
      from: auth.user,
      to: emailTo,
      subject: "ClickCare - Validación de email",
      html: `<p>Bienvenida/o ${name} ${surname},
      ClickCare es una plataforma que le permitirá acceder a una importante red de profesionales de la salud.</p>
      
      <p>A fin de validar su email, por favor haga click en el link siguiente. Si Usted tiene alguna consulta o sugerencia no dude en contactarnos.</p>
      <p>Gracias por utilizar ClickCare.</p><a href="${process.env.URL_CLIENT}/welcome/${userId}">Presione aquí para validar su email</a><br>
      `,
    }; //userValidationProcess

    console.log("mailOptions", mailOptions);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } else {
    console.log("Id de Usuario no existe");
  }
}

function sendSimpleEmail(emailTo, subject, text, name, surname) {
  const mailOptions = {
    from: auth.user,
    to: emailTo,
    subject: subject,
    html: `<p>Bienvenida/o ${name} ${surname}.</p><p>${text}</p><a href="${process.env.URL_MAIL}/">Acceda a ClickCare!</a>`,
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
