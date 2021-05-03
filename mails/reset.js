const keys = require('../keys');

module.exports = (mail, token) => {
  return {
    to: mail,
    from: 'umkabylbekov@gmail.com',
    subject: 'Forget password',
    html: `
      <h1>Reset password</h1>
      <p>If you don't forget your password, ignore this message</p>
      <p>Otherwise:</p>
      <p>Follow the following link <a href="${keys.BASE_URL}/auth/password/${token}">Update password</a></p>

      <hr />
      Best regards, <br /> <a href="https://github.com/ukabyl">Umirzak Kabylbekov</a>
    `
  }
}