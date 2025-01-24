async function isLoggedIn(req) {
  // verify client is logged in
  const { access_token = null } = req.cookies;
  return access_token !== null;
}

async function isLoggedOut(req) {
  // verify client is logged out
  const { access_token = null } = req.cookies;
  return access_token === null;
}

const verifiers = {
  isLoggedIn,
  isLoggedOut,
}

export default verifiers;
