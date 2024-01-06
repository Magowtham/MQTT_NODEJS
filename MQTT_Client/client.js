const mqtt = require("mqtt");

const brokerUrl = "mqtt://127.0.0.1:1883";

const client = mqtt.connect(brokerUrl,{username:"etspp2023",password:"Aietspp@3330"});

client.on("connect", function () {
  console.log("connected to MQTT broker");
  client.subscribe("2");
  setTimeout(() => {
    client.publish(
      "2",
      JSON.stringify({ rid: "123", st: "0", bl: 100 ,TM:"10"})
      // JSON.stringify({ rid: "test", nm:"gowtham",rn:"123"})
      // JSON.stringify({rid:"1234",amt:100})
    );
  }, 1000);
});

client.on("message", (topic, message) => {
  console.log(message.toString());
});
client.on("error", function (error) {
  console.log(error);
});

client.on("close", function () {
  console.log("connection closed");
});
