module.exports = async function (req, res) {
  // TODO: Payment request validation
  const paymentHash = req.body.paymentHash,
        room = 'invoice:' + paymentHash;

  if (req.isSocket) {
    setTimeout(() => {

      sails.sockets.broadcast(room, 'payment', {
        invoice: 13123,
        data: 234324234
      });
    }, 2000);
  }

  sails.sockets.join(req, room, function(err) {
    if (err) {
      return res.serverError(err);
    }

    res.json({'subscribed to': paymentHash});
  });



}
