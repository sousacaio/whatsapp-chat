const Redis = require("ioredis");
const subscriber = new Redis();
const redis = new Redis();
const microserviceName = 'wp-channel'
setInterval(() => {
    const message = {
        channel: 'whatsapp',
        message: 'Ola',
        environment: 'dev',
        senderId:'meu_id',
        conversationId:'conversationId',
        date: Date.now()
    };

    const canal = message.channel
    const env = message.environment   
    const senderId = message.senderId   
    
    const channel = `projeto:${env}:${canal}:${senderId}`;
    
    redis.publish(channel, JSON.stringify(message));

    console.log(`${microserviceName}[1] ${message.message} enviado`)
}, 5000);

subscriber.psubscribe("whatsapp-queue:*", (err, count) => {
    if (err) console.error("Failed to subscribe: %s", err.message);
    console.log(`Subscribed successfully!`);
});

subscriber.on("pmessage", (channelPattern, pattern, message) => {
    const [, , senderId] = pattern.split(':')
    
    const processedMessage = JSON.parse(message)

    console.log(`${microserviceName}[2] ${processedMessage.message} recebido`)
    console.log('-------------------------------------')
});