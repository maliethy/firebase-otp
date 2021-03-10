const admin = require('firebase-admin');
module.exports = function (req, res) {
  if (!req.body.phone || !req.body.code) {
    return res
      .status(422)
      .send({ error: '번호와 확인코드가 모두 필요합니다!' });
  }

  const input = String(req.body.phone).replace(/[^\d]/g, '').substring(1);
  const phone = `+82${input}`;
  const code = parseInt(req.body.code);

  admin
    .auth()
    .getUser(phone)
    .then(() => {
      const ref = admin.database().ref('users/' + phone);
      ref.on('value', (snapshot) => {
        ref.off();
        const user = snapshot.val();

        if (user.code != code || !user.codeValid) {
          return res
            .status(422)
            .send({ error: '확인코드가 유효하지 않습니다.' });
        }

        ref.update({ codeValid: false });
        admin
          .auth()
          .createCustomToken(phone)
          .then((token) => res.send({ token: token }));
      });
    })
    .catch((err) => res.status(422).send({ error: err }));
};
