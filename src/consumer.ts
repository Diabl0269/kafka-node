import { Kafka } from "kafkajs";
import type { Consumer as KafkaConsumer } from "kafkajs";
import EventEmitter from "events";

// TODO: resolve `.json` extension displaying in import path
// import { brokers, clientId, topic } from "./config.json";

interface Config {
  clientId: string;
  topic: string;
  brokers: string[];
}

export class Consumer extends EventEmitter {
  consumer: KafkaConsumer;
  topic: string;

  constructor(config: Config) {
    super();
    const { clientId, brokers, topic } = config;
    this.topic = topic;
    const kafka = new Kafka({
      clientId: clientId,
      brokers: brokers,
      logLevel: process.env.NODE_ENV === "PRODUCTION" ? 4 : 5,
    });
    this.consumer = kafka.consumer({ groupId: clientId });
  }

  async consume() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic });
    await this.consumer.run({
      // @ts-ignore
      eachMessage: (obj) => this.emit("message", obj),
    });
  }
}

// const cons = new Consumer({ brokers, clientId });

// cons.on("message", (obj) => {
//   console.log(`received message: ${obj.message.value}`);
// });

// // initialize a new kafka client
// const kafka = new Kafka({
//   clientId,
//   brokers,
//   logLevel: process.env.NODE_ENV === "PRODUCTION" ? 4 : 5,
// });

// // create a new consumer from the kafka client, and set its group ID
// // the group ID helps Kafka keep track of the messages that this client
// // is yet to receive
// const consumer = kafka.consumer({ groupId: clientId });

// const consume = async (
//   {
//     // onMessage
//   }
// ) => {
//   // first, we wait for the client to connect and subscribe to the given topic
//   await consumer.connect();
//   await consumer.subscribe({ topic });
//   await consumer.run({
//     // this function is called every time the consumer gets a new message
//     // @ts-ignore
//     eachMessage: (obj) => {
//       // here, we just log the message to the standard output
//       console.log(`received message: ${obj.message.value}`);
//     },
//   });
// };

// export { consume };

export const createConsumer = async (config: Config) => {
  const { brokers, clientId, topic } = config;

  const em = new EventEmitter();
  const kafka = new Kafka({
    clientId: clientId,
    brokers: brokers,
    logLevel: process.env.NODE_ENV === "PRODUCTION" ? 4 : 5,
  });
  const consumer = kafka.consumer({ groupId: clientId });
  await consumer.connect();
  await consumer.subscribe({ topic: topic });
  await consumer.run({
    // @ts-ignore
    eachMessage: (obj) => em.emit("message", obj),
  });

  return em;
};
