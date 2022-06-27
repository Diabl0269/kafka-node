import dotenv from 'dotenv';
import { Event } from './src/schemas';
import { Consumer, Producer } from './src';
// TODO: resolve `.json` extension displaying in import path
import { clientId, topic } from './config.json';

const isRemote = process.env.MODE === 'REMOTE';

dotenv.config({ path: isRemote ? '.env.remote' : '.env' });

const brokers = JSON.parse(process.env.BROKERS || '');

const logLevel = 4;
// const logLevel = process.env.NODE_ENV === "PRODUCTION" ? 4 : 5;

const consumer = new Consumer({
  brokers,
  clientId,
  logLevel,
  ssl: isRemote,
  sasl: isRemote
    ? {
        mechanism: 'scram-sha-512',
        username: process.env.KAFKA_USERNAME || '',
        password: process.env.KAFKA_PASSWORD || ''
      }
    : undefined
});
const producer = new Producer({
  brokers,
  clientId,
  logLevel,
  ssl: isRemote,
  sasl: isRemote
    ? {
        mechanism: 'scram-sha-512',
        username: process.env.KAFKA_USERNAME || '',
        password: process.env.KAFKA_PASSWORD || ''
      }
    : undefined
});

const init = async () => {
  // Init Server and DB
  console.log('Initialize server and DB');

  try {
    await consumer.consume([topic], async (obj) => {
      if (obj.message.value) {
        console.log(
          `I AM A MESSAGE: ${Event.fromBinary(obj.message.value).username}`
        );
      }
    });
  } catch (e) {
    console.log(e);
  }

  await producer.connect();
  let i = 0;
  setInterval(async () => {
    const event = Event.toBinary({
      emailAddresses: ['test-mail'],
      username: `meuser_${i}`
    });
    await producer.produce(topic, [
      {
        key: i.toString(),
        value: Buffer.from(event)
      }
    ]);
    i++;
  }, 3000);
};

init();

process.on('SIGINT', async () => {
  let code;
  try {
    await producer.disconnect();
    console.log('Closed connection');
    code = 0;
  } catch (error) {
    console.error(
      `Couldn't close Kafka producer connection \n Error: ${error}`
    );
    code = 1;
  }
  process.exit(code);
});
