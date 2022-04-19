const { send } = require("express/lib/response");
const Redis = require("ioredis");
const redis = new Redis();
const publisher = new Redis();
const discovery = require('../discovery')
const microserviceName = 'receiver'
redis.psubscribe("projeto:*", (err, count) => {
  if (err) console.error("Failed to subscribe: %s", err.message);
  console.log(`Subscribed successfully!`);
});

redis.on("pmessage", (channelPattern, pattern, message) => {
  const [, env, channel, senderId] = pattern.split(':')
  const sendTo = discovery.find(element => element.channel === channel)
  message = JSON.parse(message)
  console.log(`[${microserviceName}][1]${message.message} recebido`)

  let response = ''

  if (message.message === "Olá") {
    response = 'Como posso te ajudar?'
  } else {
    response = 'Desculpa, não entendi'
  }
  console.log(`[${microserviceName}][2]${message.message} processado`)
  Object.assign(message, { message: 'Como posso te ajudar?', messagesCount: 2 })  
  publisher.publish(`${sendTo.queuePath}:${env}:${senderId}`, JSON.stringify(message));
  console.log(`[${microserviceName}][3]${message.message} enviado`)  
});