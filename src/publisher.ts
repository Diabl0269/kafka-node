import { Kafka, Partitioners } from "kafkajs";
// TODO: resolve `.json` extension displaying in import path
import { brokers, clientId, topic } from "./config.json";
import type { EventSchema } from "./schema";

// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ clientId, brokers });
const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

const publishEvent = async (event: EventSchema) =>
  await producer.send({
    topic,
    messages: [event],
  });

// we define an async function that writes a new message each second
const publisher = async () => {
  await producer.connect();
  let i = 0;

  // after the produce has connected, we start an interval timer
  setInterval(async () => {
    try {
      // send a message to the configured topic with
      // the key and value formed from the current value of `i`
      await publishEvent({
        key: i.toString(),
        value: `test_value ${i}`,
      });

      // if the message is written successfully, log it and increment `i`
      console.log("writes: ", i);
      i++;
    } catch (err) {
      console.error("could not write message " + err);
    }
  }, 1000);
};

export { publisher };
