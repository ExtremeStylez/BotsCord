function authWanted(request, response, next) {
  if (!request.isAuthenticated()) return response.redirect('/login');
  else next();
}
function authUnwanted(request, response, next) {
  if (request.isAuthenticated()) return response.redirect('/dashboard');
  else next();
}

module.exports = { authWanted, authUnwanted };
