//verificamos que seas admin

export function soloAdmin(req, res, next) {
  if (req.user.role === "Admin") {
    next();
  } else {
    res.status(403).send("Acceso denegado, este lugar es solo para admin");
  }
}

//verificamos que seas user

export function soloUser(req, res, next) {
  if (req.user.role === "user") {
    next();
  } else {
    res
      .status(403)
      .send("acceso denegado, este lugar es solo para users comunes");
  }
}
