import { Kafka, Partitioners } from 'kafkajs';
import type { Producer as KafkaProducer, Message } from 'kafkajs';
import type { Config, ProducerInterface } from 'types';

/**
 * A producer class for producing events to a message broker.
 *
 * @example
 * const producer = new Producer(config);
 * const initProject = async () => {
 *  await producer.connect();
 *  await producer.produce(topic, message);
 *  await producer.disconnect();
 * }
 */
export class Producer implements ProducerInterface {
  private producer: KafkaProducer;

  constructor(config: Config) {
    const { brokers, clientId, logLevel, ssl, sasl } = config;
    const kafka = new Kafka({
      clientId,
      brokers,
      logLevel,
      ssl,
      sasl
    });
    this.producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner
    });
  }

  /**
   * Will produce an event of a specific topic.
   * TODO: convert event object to protobuf
   * @param topic
   * @param event
   */
  async produce(topic: string, messages: Message[]) {
    try {
      await this.producer.send({
        topic,
        messages
      });
      return true;
    } catch (e) {
      this.onError(e);
      return false;
    }
  }

  async connect() {
    try {
      await this.producer.connect();
      return true;
    } catch (e) {
      this.onError(e);
      return false;
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      return true;
    } catch (e) {
      this.onError(e);
      return false;
    }
  }

  // TODO: Add error handleing
  onError(error: unknown) {}
}
