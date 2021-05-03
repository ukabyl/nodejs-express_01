const keys = require('../keys');

module.exports = (mail) => {
  return {
    to: mail,
    from: 'umkabylbekov@gmail.com',
    subject: 'Successfull registration',
    html: `
      <h1>Congratulations</h1>
      <h2>You've successfully registered in <a href="${keys.BASE_URL}">${keys.BASE_URL}</a></h2>

      <hr />
      Best regards, <br /> <a href="https://github.com/ukabyl">Umirzak Kabylbekov</a>
    `
  }
}