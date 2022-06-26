const { body, validationResult } = require("express-validator");

//RECORDAR EXPORTARLO ABAJO!!
const userValidationRules = () => {
  return [
    body("name")
      .isLength({ min: 3 }, { max: 20 })
      .withMessage("Debe tener entre 3 y 20 caracteres")
      .isAlpha("es-ES", { ignore: " " })
      .withMessage("Debe ser alfanumérico")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("surname")
      .isLength({ min: 3 }, { max: 20 })
      .withMessage("Debe tener entre 3 y 20 caracteres")
      .isAlpha("es-ES", { ignore: " " })
      .withMessage("Debe ser alfanumérico")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Debe tener al menos 8 caracteres.")
      .not()
      .isLowercase()
      .withMessage("Debe contener al menos una letra mayúscula")
      .not()
      .isUppercase()
      .withMessage("Debe contener al menos una letra minúscula")
      .not()
      .isNumeric()
      .withMessage("Debe contener al menos un número")
      .not()
      .isAlpha()
      .withMessage("Debe contener al menos un carácter alfanumérico")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("phone")
      .isLength({ min: 3 }, { max: 20 })
      .withMessage("Debe tener entre 3 y 20 caracteres")
      .isNumeric("en-US")
      .withMessage("Debe ser numérico")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("address")
      .isLength({ min: 5 }, { max: 100 })
      .withMessage("Debe tener entre 5 y 100 caracteres")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("age")
      //.isNumeric("en-US")
      //.withMessage("Debe ser numérico")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("document")
      .isLength({ min: 5 }, { max: 20 })
      .withMessage("Debe tener entre 5 y 20 caracteres")
      .isNumeric("en-US")
      .withMessage("Debe ser numérico")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("email")
      .isEmail()
      .withMessage("Debe ser un correo electrónico")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("phone2")
      .isLength({ min: 5 }, { max: 20 })
      .withMessage("Debe tener entre 5 y 20 caracteres")
      .isNumeric("en-US")
      .withMessage("Debe ser numérico"),
    // .notEmpty()
    // .withMessage("No debe estar vacío"),
  ];
};
//RECORDAR EXPORTARLO ABAJO!!
const profValidationRules = () => {
  return [
    body("tuition")
      .isLength({ max: 255 })
      .withMessage("Debe tener menos de 255 caracteres.")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("trainings")
      .isLength({ max: 255 })
      .withMessage("Debe tener menos de 255 caracteres.")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("photo")
      .isLength({ max: 50 })
      .withMessage("Debe tener menos de 50 caracteres")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("cvu")
      .isLength({ min: 0 }, { max: 22 })
      .withMessage("Debe tener menos de 22 caracteres")
      .isNumeric()
      .withMessage("Debe ser numérico.")
      .notEmpty()
      .withMessage("No debe estar vacío"),
  ];
};
//RECORDAR EXPORTARLO ABAJO!!
const userValidShortReg = () => {
  return [
    body("password")
      .isString()
      .withMessage("Debe ser un texto")
      .isLength({ min: 4 })
      .withMessage("Debe tener al menos 8 caracteres.")
      .not()
      .isLowercase()
      .withMessage("Debe contener al menos una letra minúscula")
      .not()
      .isUppercase()
      .withMessage("Debe contener al menos una letra mayúscula")
      .not()
      .isNumeric()
      .withMessage("Debe contener al menos un número")
      .not()
      .isAlpha()
      .withMessage("Debe contener al menos un carácter alfanumérico")
      .notEmpty()
      .withMessage("No debe estar vacío"),
    body("email")
      .isEmail()
      .withMessage("Debe ser un correo electrónico")
      .notEmpty()
      .withMessage("No debe estar vacío"),
  ];
};
//RECORDAR EXPORTARLO ABAJO!!
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

const userValidGoogle = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Debe ser un correo electrónico")
      .notEmpty()
      .withMessage("No debe estar vacío"),
  ];
};

module.exports = {
  userValidationRules,
  userValidShortReg,
  profValidationRules,
  validate,
  userValidGoogle,
};
