const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'chiaveSegreta', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
function verifyAdminToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'chiaveSegreta', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    if(user.role === "amministratore")
      next();
    else
      return res.sendStatus(401);
  });
}

module.exports = {
  verifyToken,
  verifyAdminToken
};
