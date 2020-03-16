const keys = require("../keys");

module.exports = function(email, from) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Аккаунт создан",
    html: `
        <h1>Вы успешно создали аккаунт c email - ${email}</h1>
        <hr/>
        <a href="${keys.BASE_URL}">Магазин курсов</a>
    `
  };
};
