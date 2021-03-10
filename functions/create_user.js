const admin = require('firebase-admin');

module.exports = function (req, res) {
  //verify the user provided a phone
  if (!req.body.phone) {
    return res.status(422).send({ error: '번호를 입력해주세요.' });
  }
  //format the phone to remove dashes and parens

  const input = String(req.body.phone).replace(/[^\d]/g, '').substring(1);
  const phone = `+82${input}`;

  if (admin.auth().getUser(phone)) {
    return res.status(422).send({ error: '이미 등록된 번호입니다.' });
  }
  //create a new user account using that phone number
  admin
    .auth()
    .createUser({ uid: phone })
    .then((user) => res.send(user))
    .catch((err) => res.status(422).send({ error: err }));
  //respond to the user request, saying the account was made
};
