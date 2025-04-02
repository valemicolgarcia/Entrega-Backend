// Middleware para verificar que sea admin
export function soloAdmin(req, res, next) {
  if (!req.user) {
    return res
      .status(401)
      .send("No estás logueado. Iniciá sesión para continuar.");
  }

  if (req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .send("Acceso denegado. Esta sección es solo para administradores.");
  }
}

// Middleware para verificar que sea user
export function soloUser(req, res, next) {
  if (!req.user) {
    return res
      .status(401)
      .send("No estás logueado. Iniciá sesión para continuar.");
  }

  if (req.user.role === "usuario" || req.user.role === "user") {
    next();
  } else {
    res
      .status(403)
      .send("Acceso denegado. Esta sección es solo para usuarios comunes.");
  }
}

//verificamos que seas admin
/*
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
*/
