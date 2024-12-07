const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  
  if (!req.headers["authorization"]) {
    return res.status(401).json("Debes incluir la cabecera de autorización con el token");
  }
  const token = req.headers["authorization"]; // El token suele venir precedido por 'Bearer'
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // Almacenamos el payload en el objeto de solicitud para su uso posterior en el controlador
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
      if (roles.includes(req.user.role)) {
          next();
      } else {
          res.sendStatus(403);
      }
  };
};

module.exports = { checkToken, authorizeRole };
