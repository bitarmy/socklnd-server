module.exports = {
  loginWithToken: async function (accessToken) {
    return await ApiKey.get(accessToken);
  },

  parseTokenFromCookie: function (cookie) {
    const regex = /Bearer (\w{2,8}_[0-f]{32})/;
    let m;
    if (typeof cookie === 'string' && (m = regex.exec(cookie))) {
      return m[1];
    }
    return null;
  }
};
