import { createConsumer, Consumer } from "./consumer";
import { publisher } from "./publisher";
import { brokers, clientId, topic } from "./config.json";

// call the `produce` function and log an error if it occurs
publisher().catch((err) => {
  console.error("error in producer: ", err);
});

// const consumer = new Consumer({ brokers, clientId, topic });
createConsumer({ brokers, clientId, topic }).then((consumer) => {
  consumer.on("message", (obj) => {
    console.log(`received message: ${obj.message.value}`);
  });
});

// consumer.on("message", (obj) => {
//   console.log(`received message: ${obj.message.value}`);
// });

// start the consumer, and log any errors
// consume({ topic: "topic" }).catch((err) => {
//   console.error("error in consumer: ", err);
// });
// consume({ topic: "topic2" }).catch((err) => {
//   console.error("error in consumer: ", err);
// });

// const onMessage
/**
 * topic
 *
 *
 * Emit node event from kafka counsmer
 */
