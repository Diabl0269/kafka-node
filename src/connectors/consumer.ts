import { Kafka } from 'kafkajs';
import type {
  ConsumerSubscribeTopics,
  ConsumerRunConfig,
  Consumer as KafkaConsumer
} from 'kafkajs';
import type { Config, ConsumerInterface } from 'types';

/**
 * A consumer class for consumeing events to from a message broker.
 *
 * @example
 * const consumer = new Consumer(config);
 * const initProject = async () => {
 *  await consumer.connect();
 *  await consumer.consume([topics], callback);
 *  await consumer.disconnect();
 * }
 */
export class Consumer implements ConsumerInterface {
  private consumer: KafkaConsumer;

  constructor(config: Config) {
    const { clientId, brokers, logLevel, sasl, ssl } = config;
    const kafka = new Kafka({
      clientId,
      brokers,
      logLevel,
      sasl,
      ssl
    });
    this.consumer = kafka.consumer({ groupId: clientId });
  }

  async disconnect() {
    try {
      await this.consumer.disconnect();
      return true;
    } catch (e) {
      this.onError(e);
      return false;
    }
  }

  async connect() {
    try {
      await this.consumer.connect();
      return true;
    } catch (e) {
      this.onError(e);
      return false;
    }
  }

  async consume(
    topics: ConsumerSubscribeTopics['topics'],
    eachMessage: ConsumerRunConfig['eachMessage']
  ) {
    try {
      await this.consumer.subscribe({ topics });
      await this.consumer.run({ eachMessage });
      return true;
    } catch (e) {
      this.onError(e);
      return false;
    }
  }

  // TODO: Add error handleing
  onError(e: unknown) {}
}
