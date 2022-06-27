# Node.js - Kafka - Protobuf

This is a POC for working with Kafka and Protobuf (TBD).  
All the main code will be inserted inside the `src` directory.  
Checkout `demo.ts` for the actual usage.

> Written by Tal Efronny

## How to run the project:

There are 2 ways to run this project, Both run with hot relod on the whole project.

### 1. Local:

1. Run `docker-compose up` to run [zookeeper](https://zookeeper.apache.org/) and [Kafka](https://kafka.apache.org/) docker images by [bitnami](https://bitnami.com/).
2. Run `npm run dev` to initiate local development process.  
   This will automatically start sending messages to Kafka which can be editted in `demo.ts`.

### 2. Remote:

1. Make sure you have a `.env.remote` file with the following variables:
   1. BROKERS - An array of the remote Kafka brokers\
      example: ["sub.broker.com:9092", "sub2.broker.com:9092"]
   2. KAFKA_USERNAME - The username to connect with.
   3. KAFKA_PASSWORD - The password to connect with.
2. Run `npm run dev-remote`. (The rest is the same as section 1).
