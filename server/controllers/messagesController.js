const Messages = require('../model/messageModel');

module.exports.addMessage = async (req, res, next) => {
  console.log('controller addMessage', req.body);
  try {
    const {
      from,
      to,
      message } = req.body;
    const data = await Messages.create({
      message: {
        text: message,
      },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.status(201).json({ status: true, msg: 'Mensaje enviado' });
    }
    else {
      return res, json({ status: false, msg: 'Error al enviar mensaje' });
    }

  } catch (err) {
    return res.status(500).json({
      message: 'error registrando mensaje',
      error: err,
    });
  }
}

module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;//from y to son los usuarios que estan en la sesion
    console.log('controller getAllMessages', req.body);

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });//sort by date
    console.log('messages', messages);

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,//si el mensaje es del usuario que esta en la sesion
        message: msg.message.text,//message text
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    console.log(err, 'error');
    next(ex);
  }
}