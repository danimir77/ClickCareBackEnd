const { body, validationResult } = require("express-validator");

//RECORDAR EXPORTARLO ABAJO!!
const userValidationRules = () => {
  return [
    body("name")
      .isLength({ min: 3 }, { max: 20 })
      .withMessage("Should be Between 3 and 20 characters")
      .isAlpha("es-ES", { ignore: " " })
      .withMessage("Should be alphanumerico")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("surname")
      .isLength({ min: 3 }, { max: 20 })
      .withMessage("Should be Between 3 and 20 characters")
      .isAlpha("es-ES", { ignore: " " })
      .withMessage("Should be alphanumeric")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("password")
      .isString()
      .withMessage("Should be string")
      .isLength({ min: 4 })
      .withMessage("Should be at least 8 characters")
      .not()
      .isLowercase()
      .withMessage("Should contain at least one uppercase letter")
      .not()
      .isUppercase()
      .withMessage("Should contain at least one lowercase letter")
      .not()
      .isNumeric()
      .withMessage("Should contain at least one number")
      .not()
      .isAlpha()
      .withMessage("Should contain at least one alphanumeric character")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("phone")
      .isLength({ min: 3 }, { max: 20 })
      .withMessage("Should be Between 3 and 20 characters")
      .isNumeric("en-US")
      .withMessage("Should be numeric")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("address")
      .isLength({ min: 5 }, { max: 100 })
      .withMessage("Should be Between 5 and 100 characters")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("age")
      //.isNumeric("en-US")
      //.withMessage("Should be numeric")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("document")
      .isLength({ min: 5 }, { max: 20 })
      .withMessage("Should be Between 5 and 20 characters")
      .isNumeric("en-US")
      .withMessage("Should be numeric")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("email")
      .isEmail()
      .withMessage("Should be email")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("phone2")
      .isLength({ min: 5 }, { max: 20 })
      .withMessage("Should be Between 5 and 20 characters")
      .isNumeric("en-US")
      .withMessage("Should be numeric"),
    // .notEmpty()
    // .withMessage("Should not be empty"),
  ];
};
//RECORDAR EXPORTARLO ABAJO!!
const profValidationRules = () => {
  return [
    body("tuition")
      .isLength({ max: 255 })
      .withMessage("Should be less than 255 characters")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("trainings")
      .isLength({ max: 255 })
      .withMessage("Should be less than 255 characters")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("photo")
      .isLength({ max: 50 })
      .withMessage("Should be less than 50 characters")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("cvu")
      .isLength({ min: 0 }, { max: 22 })
      .withMessage("Should be less than 22 characters")
      .isNumeric()
      .withMessage("Should be numeric.")
      .notEmpty()
      .withMessage("Should not be empty"),
  ];
};
//RECORDAR EXPORTARLO ABAJO!!
const userValidShortReg = () => {
  return [
    body("password")
      .isString()
      .withMessage("Should be string")
      .isLength({ min: 4 })
      .withMessage("Should be at least 8 characters")
      .not()
      .isLowercase()
      .withMessage("Should contain at least one lowercase letter")
      .not()
      .isUppercase()
      .withMessage("Should contain at least one uppercase letter")
      .not()
      .isNumeric()
      .withMessage("Should contain at least one number")
      .not()
      .isAlpha()
      .withMessage("Should contain at least one alphanumeric character")
      .notEmpty()
      .withMessage("Should not be empty"),
    body("email")
      .isEmail()
      .withMessage("Should be email")
      .notEmpty()
      .withMessage("Should not be empty"),
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

module.exports = {
  userValidationRules,
  userValidShortReg,
  profValidationRules,
  validate,
};
