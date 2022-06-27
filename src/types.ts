import type {
  KafkaConfig,
  ConsumerSubscribeTopics,
  ConsumerRunConfig
} from 'kafkajs';

export interface Config extends Pick<KafkaConfig, 'logLevel' | 'ssl' | 'sasl'> {
  /**
   * To be able to track the source of requests beyond just ip/port.
   */
  clientId: string;
  /**
   * Array of the broker's urls.
   */
  brokers: string[];
}

// TODO: Should work according to protobuf.
export interface EventSchema {
  key: string;
  value: string;
}

// Message broker interfaces
type OnError = (error: unknown) => void;
interface BaseInterafe {
  /**
   * Will initialize a consumer for specific topics.
   */
  connect: () => Promise<boolean>;
  /**
   * This function should be called at the end of the task (end of message\ server failures, etc…).
   */
  disconnect: () => Promise<boolean>;
  /**
   * Internal error handleing.
   */
  onError: OnError;
}

export interface ConsumerInterface extends BaseInterafe {
  /**
   * Starts consuming messages according to specefied topics.
   * @param {string} topics  - The topic to consume messages from.
   * @param onMessage - Callback which will be called with the incoming message.
   */
  consume: (
    topics: ConsumerSubscribeTopics['topics'],
    onMessage: ConsumerRunConfig['eachMessage']
  ) => Promise<boolean>;
}

export interface ProducerInterface extends BaseInterafe {
  /**
   * Produces new messages.
   * @param  topic - The topic to produce the message to.
   * @param message - The message to produce.
   */
  produce: (topic: string, message: EventSchema) => Promise<boolean>;
}
