const { parsePhoneNumber } = require('libphonenumber-js');

const stringifyPhoneNumber = (number) => {
  try {
    const phoneNumber = parsePhoneNumber(number);
    return phoneNumber;
  } catch (error) {
    return null;
  }
};

module.exports = { stringifyPhoneNumber };
