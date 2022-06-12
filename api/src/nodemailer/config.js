require("dotenv").config();
const configutation = {
  host: process.env.HOST_EMAIL,
  port: process.env.PORT_EMAIL,
  secure: process.env.SECURE_EMAIL,
  auth: {
    user: process.env.AUTH_USER_EMAIL,
    pass: process.env.AUTH_PASSWORD_EMAIL, // Password hecho en la configuracion app de gmail
  },
};

module.exports = configutation;
