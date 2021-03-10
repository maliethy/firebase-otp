const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function (req, res) {
  if (!req.body.phone) {
    return res.status(422).send({ error: '번호를 입력하세요!' });
  }

  const input = String(req.body.phone).replace(/[^\d]/g, '').substring(1);
  const phone = `+82${input}`;
  admin
    .auth()
    .getUser(phone)
    .then((userRecord) => {
      const code = Math.floor(Math.random() * 8999 + 1000);
      twilio.messages.create(
        {
          body: '확인 코드는' + code,
          to: phone,
          from: '+19143001731',
        },
        (err) => {
          if (err) {
            return res.status(422).send(err);
          }
          admin
            .database()
            .ref('users/' + phone)
            .update({ code: code, codeValid: true }, () => {
              res.send({ success: true });
            });
        },
      );
    })
    .catch((err) => {
      res.status(422).send({ error: '사용자를 찾을 수 없습니다.', err });
    });
};
