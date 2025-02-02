---
title: Task processing queue with RabbitMQ
author: Shashank Shekhar
date: 2025-02-02
---

![rabbitmq](/rabbitmq.png "rabbitmq")

Hi There!
This is going to be long article so I am not gonna waste much time and we will dive deep into it!.

## What are we buidling

We are building and simulating a task processing queue using message broker service called RabbitMQ. We will talk about Pub Sub architecture, message brokage and advance message protocol.

For the sake of simplicity have build a node monolith , but often the producer and consumers are build and deployed seperately as microservices.

## What are we using

- I decided to use my bread and butter tool - **Typescript** and **Node JS** for the project.
- The server is written in **Fastify** framework which is pretty similar to express with TS support out of the box.
- For out message broker service I decide to go with **RabbitMQ**, we will talk about RabbitMQ, message broker , queuing in a bit.
- I have used **PostgreDB** as our primary database with ORM called **Drizzle**.
- Both RabbitMQ and Postgres are hosted on **Docker** containers

## Code Repository

All the code required to run the simulation is provided at my [Github Repository](https://github.com/thatShashankGuy/task-processing-queue)

Before we proceed further lets talk about few important topics

## Message Broker

A message broker works by translating messages between formal messaging protocols, enabling interdependent services to communicate directly—even if they are written in different languages or implemented on different platforms

It validates, stores, routes, and delivers messages to the appropriate destinations by acting as an intermediary that allows senders to issue messages without knowing where the receivers are, whether they are active, or how many there are, thereby decoupling processes and services within systems.

To ensure reliable message storage and guaranteed delivery, it often relies on a substructure called a message queue that stores and orders messages in the exact sequence they were transmitted until receipt is confirmed

## AMQP

AMQP (Advanced Message Queuing Protocol) is an open standard for messaging middleware that enables reliable, secure, and interoperable communication between disparate systems. It defines both the network protocol and the messaging model, which includes features like message routing, queuing, and delivery guarantees. By decoupling the producer and consumer of messages, AMQP allows applications to communicate asynchronously, ensuring that messages are delivered once and in order, even in complex, distributed environments.

## RabbitMQ

RabbitMQ is an open-source message broker that implements the Advanced Message Queuing Protocol (AMQP). It decouples producers and consumers by accepting, storing, and routing messages through queues until the consuming applications are ready to process them.

RabbitMQ supports features like persistence, acknowledgments, and dead-lettering and messaging patterns like publish/subscribe, work queues, and request/reply.

## Pub/Sub pattern

The publish/subscribe (pub-sub) pattern is a messaging architecture where producers (publishers) send messages to a central broker or exchange without needing to know which consumers (subscribers) will receive them.

Subscribers express interest in specific topics or types of messages, and the broker ensures that every published message matching those topics is delivered to all subscribed consumers.

This decoupling of publishers and subscribers enables scalable, asynchronous communication in distributed systems, allowing components to operate independently while facilitating dynamic and flexible message routing.

---

In this program RabbitMQ is using a publish/subscribe pattern implemented via a fanout exchange. In your update API, you publish the job message to a **fanout exchange**, and each consumer has its own dedicated queue (one for DB updates and one for CSV processing) that is bound to this exchange. This setup ensures that every published message is broadcast to all bound queues, so both consumers receive and process a copy of each job independently.

## Folder Structure and Organization

We have following services running in our program

1. Rest API Service: `npm run dev:api`
2. DB Consumer Service : `npm run dev:dbconsumer`
3. CSV Consumer Service : `npm run dev:fileconsumer`
4. Producer Service ; `npm run dev:producer`

Each service will be discussed in details
later.

Our code directory has been structured as a mono repo instead of commiting each service. In its own repository

```
task-processing-queue/
.
├── README.md
├── docker-compose.yml
├── drizzle
│   ├── 0000_sloppy_phil_sheldon.sql
│   └── meta
│       ├── 0000_snapshot.json
│       └── _journal.json
├── drizzle.config.ts
├── package-lock.json
├── package.json
├── src
│   ├── api
│   │   ├── controller
│   │   │   └── job.controller.ts
│   │   └── routes
│   │       └── job.routes.ts
│   ├── config
│   │   ├── db.ts
│   │   └── rabbitmq.ts
│   ├── constants
│   │   └── queues.ts
│   ├── consumers
│   │   ├── db.consumer.ts
│   │   └── file.consumer.ts
│   ├── migrations
│   │   └── schema.ts
│   ├── producer
│   │   └── producer.ts
│   ├── server.ts
│   ├── services
│   │   └── job.service.ts
│   ├── types
│   │   └── job.types.ts
│   └── utils
│       └── logger.ts
└── tsconfig.json
```

## Architecture

![Architecture Image](/tpq_diagram.svg "architecture")

## Establishing RabbitMQ and Database connections

We will use docker to setup a RabbitMQ message broker. With Broker ready to go we will create a connection with our fastify server.
We wil also spin our `Postgres` Database container with same `docker-compose.yml` file

```yml
version: "3.8"

services:
  postgres:
    image: postgres:14
    container_name: postgres_nopass
    restart: always
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypass
      POSTGRES_DB: mydb
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - "5672:5672" # AMQP port
      - "15672:15672" # Management UI

volumes:
  pgdata:
    name: pgdata
```

Run following command to spin both RabbitMQ and PostgreSQL

```bash
docker compose up -d
```

### Setting up Postgres DB

We will setup our Database and we will use Drizzle ORM to run our migrations. We will skip Drizzle and DB migrations for now as we are focussing on this app but you can generate and run DB migarations via following commands

```bash
    npm run db:generate
    npm run db:migrate
```

Note that in order to generate and run migrations you need to install `drizzle-kit` along with `drizzle-orm`.

```json
    "db:generate": "npx drizzle-kit generate",
    "db:migrate": "npx drizzle-kit migrate"
```

Below is the code to connect with postgres DB over docker

```
── config
│   │   ├── db.ts
│   │   └── rabbitmq.ts
```

```typescript
//db.ts
import "dotenv/config";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool });
```

### Setting up Rabbit MQ

RabbitMQ is langauge independent technology and can interface with languages like C#, Go, Java and ofcourse JS/TS. In order to connect to our Node JS application we need to use a npm library called `amqplib`.

Below is the code to connect to RabbitMQ Broker

```typescript
//rabbitmq.ts
import ampq, { Connection, Channel } from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "";

let connection: Connection;
let channel: Channel;

export async function get_channel() {
  if (!channel) {
    connection = await ampq.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
  }
  return channel;
}

export async function close_connection() {
  if (connection) await connection.close();
}
```

Above code uses the "amqplib" library to manage a connection and channel to a RabbitMQ server. The get_channel function asynchronously establishes a connection using the RabbitMQ URL from the environment, creates a channel, and caches it so that subsequent calls reuse the same channel instead of creating a new one. The close_connection function allows you to gracefully shut down the connection when needed, ensuring proper resource cleanup.

## API server

We set up a Fastify server that provides two HTTP endpoints for job management. The main server file (server.js) initializes Fastify, loads environment variables, and registers routes defined in job.routes.ts. In `job.routes.ts`, two routes are declared: a GET route ("/api/jobs") that triggers the jobs controller function and a POST route ("/api/jobs") that triggers the `update_jobs` controller function.

```
├── api
│   │   ├── controller
│   │   │   └── job.controller.ts
│   │   └── routes
│   │       └── job.routes.ts
|______________server.ts
```

```typescript
//server.js

import Fastify from "fastify";
import { job_routes } from "./api/routes/job.routes";
import logger from "./utils/logger";

require("dotenv").config();

const PORT = Number(process.env.PORT) || 8080;

const fastify = Fastify({
  logger: true,
});

fastify.register(job_routes);

const start_server = async () => {
  try {
    await fastify.listen({ port: PORT });
  } catch (error: unknown) {
    if (error instanceof Error)
      logger.error(`error starting server: ${error.message}`);
  }
};

start_server();

//job.routes.ts
import fastify, { FastifyInstance } from "fastify";
import { jobs, update_jobs } from "../controller/job.controller";

export const job_routes = async (fastify: FastifyInstance) => {
  fastify.get("/api/jobs", jobs);
  fastify.post("/api/jobs", update_jobs);
};

//job.controller.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { getAllJobs, createJob } from "../../services/job.service";
import { v4 as uuidv4 } from "uuid";
import { get_channel } from "../../config/rabbitmq";
import { NOTIFICATION_QUEUE, FAN_EXCHANGE } from "../../constants/queues";

export const jobs = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const channel = await get_channel();

    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

    channel.consume(NOTIFICATION_QUEUE, (msg) => {
      if (msg) {
        const content = msg.content.toString();
        reply.status(200).send(content);
        channel.ack(msg);
      }
    });

    return;
  } catch (error: unknown) {
    if (error instanceof Error) reply.code(500).send({ error: error });
    return;
  }
};

export const update_jobs = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const channel = await get_channel();

    await channel.assertExchange(FAN_EXCHANGE, "fanout", { durable: false });

    const { type, payload } = request.body as {
      type: string;
      payload: any;
    };
    const id = uuidv4();
    const status = "PENDING";
    await createJob({ id, type, payload, status });
    const message = JSON.stringify({ id, type, payload });
    channel.publish(FAN_EXCHANGE, "", Buffer.from(message), {
      persistent: true,
    });

    reply.code(201).send({ id, status });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) reply.code(500).send({ error: error });
    return;
  }
};
```

In job.controller.ts, the GET handler connects to RabbitMQ, asserts a durable notification queue, and consumes messages from it to return job details to the client, while the POST handler receives a job payload, creates a new job with a unique ID and a "PENDING" status, and publishes the job message to a fanout exchange in RabbitMQ. This design leverages RabbitMQ to decouple job creation from processing, allowing the job message to be broadcast asynchronously to any interested consumer

## Client/Producer Script

To provide data over a period of time , I have written a script defines a job producer that simulates creating and sending email jobs to an API endpoint. It starts by defining a payload interface and a function, `generate_random_job`, which generates a job with randomized email details. The send_job function then sends a POST request containing the generated job as JSON to server and logs the response or any errors encountered. Finally, using setInterval, the code schedules the job submission to occur every second until a predefined limit of `max_limit` jobs is reached, at which point it logs a warning and stops further job submissions

```
── producer
      └── producer.ts

```

```typescript
//producer.ts
import logger from "../utils/logger";

interface Playload {
  type: string;
  payload: {
    to: string;
    subject: string;
    body: string;
  };
}

function generate_random_job(): Playload {
  const random_number = Math.floor(Math.random() * 1000);
  return {
    type: "email",
    payload: {
      to: `user${random_number}@example.com`,
      subject: `Hello ${random_number}`,
      body: `Hi there! Your random number is ${random_number}.`,
    },
  };
}

async function send_job(): Promise<void> {
  const job = generate_random_job();

  try {
    const response = await fetch("http://localhost:8080/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[${new Date().toISOString()}] Job created:`, data);
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Error creating job:`,
      (error as Error).message
    );
  }
}

let job_count = 0;
const jobs_limit = 10;

const interval_id = setInterval(async () => {
  if (job_count >= jobs_limit) {
    logger.warn("Sent all jobs, stopping producer.");
    clearInterval(interval_id);
    return;
  }

  job_count++;
  logger.info(`Sending job ${job_count}...`);
  await send_job();
}, 1000);
```

## Consumers

After our server and producers are setup. We move to write consumer scripts. In this program we will have two consumers

1. db.consumer
2. file.consumer

### DB Consumer

The DB consumer script is designed to listen for incoming job messages that are published via a fanout exchange, specifically on a dedicated queue for database updates. When the consumer starts, it asserts and binds a queue named by JOB_DB_UPDATE_QUEUE to the fanout exchange, ensuring that it receives every job broadcasted by the publisher. Once a message arrives, the consumer logs the receipt, parses the job data, and begins processing it. After a simulated processing delay (implemented with a 30-second timeout), it calls a service function (update_job_status) to update the job status in the database. Upon successful processing, the consumer constructs an update message indicating the job’s completion and sends this message to NOTIFICATION_QUEUE so that other parts of the system (such as the UI or a job monitoring service) can be informed of the status change. Finally, the consumer acknowledges the message, ensuring that RabbitMQ removes it from the queue.

### File Consumer

The File consumer script functions similarly to the DB consumer but instead of updating database updates a CSV files. It starts by asserting a dedicated queue JOB_CSV_UPDATE_QUEUE and binding it to the same fanout exchange, ensuring it also receives every job message broadcast by the producer. When a message is consumed, the script logs the incoming data and parses it into a job object. After a delay to simulate processing time, it calls a service function (update_job_status_into_file) to update the job status. Once the file update operation completes successfully, the script constructs a completion update message and sends it to the notification queue NOTIFICATION_QUEUE so that the job’s progress can be tracked externally. The message is then acknowledged, allowing RabbitMQ to safely remove it from the queue.

This separation of consumers into distinct processing responsibilities (one for database updates and one for CSV updates) enables the system to scale and handle different processing requirements concurrently.

```
consumers
│ │ ├── db.consumer.ts
│ │ └── file.consumer.ts
```

```typescript
// db.consumer.js
import { get_channel } from "../config/rabbitmq";
import {
  NOTIFICATION_QUEUE,
  JOB_DB_UPDATE_QUEUE,
  FAN_EXCHANGE,
} from "../constants/queues";
import { Job } from "../types/job.types";
import { updateJobStatus } from "../services/job.service";
import logger from "../utils/logger";
require("dotenv").config();

async function start_worker() {
  const channel = await get_channel();

  await channel.assertExchange(FAN_EXCHANGE, "fanout", { durable: false });

  const DB_QUEUE = await channel.assertQueue(JOB_DB_UPDATE_QUEUE, {
    durable: true,
  });
  await channel.bindQueue(DB_QUEUE.queue, FAN_EXCHANGE, "");
  await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

  logger.info("DB Processing Consumer is waiting for message ⏳⏳⏳⏳");

  channel.consume(DB_QUEUE.queue, async (msg) => {
    let job_data: Job;
    if (msg) {
      const content = msg.content.toString();
      logger.info("Recieved job: " + content);
      try {
        job_data = JSON.parse(content);

        logger.info(`Processing job ${job_data.id}...`);

        setTimeout(() => {
          updateJobStatus(job_data.id!, "COMPLETED")
            .then(() => {
              const update_message = JSON.stringify({
                id: job_data.id,
                status: "COMPLETED",
              });
              channel.sendToQueue(
                NOTIFICATION_QUEUE,
                Buffer.from(update_message),
                {
                  persistent: true,
                }
              );

              logger.info(`Job ${job_data.id} processed , update published`);
              channel.ack(msg);
            })
            .catch((error: unknown) => {
              if (error instanceof Error)
                logger.info("Error while Processing the job", error);
            });
        }, 30000);
      } catch (error: unknown) {
        if (error instanceof Error)
          logger.error("Invalid job format", error.message);
      }
    }
  });
}

start_worker().catch((error: unknown) => {
  if (error instanceof Error)
    logger.error("Worker did not start", error.message);
  process.exit(-1);
});

//file.consumer.ts

import { get_channel } from "../config/rabbitmq";
import {
  FAN_EXCHANGE,
  JOB_CSV_UPDATE_QUEUE,
  NOTIFICATION_QUEUE,
} from "../constants/queues";
import { Job } from "../types/job.types";
import { update_job_status_into_file } from "../services/job.service";
import logger from "../utils/logger";
require("dotenv").config();

async function start_worker() {
  const channel = await get_channel();

  await channel.assertExchange(FAN_EXCHANGE, "fanout", { durable: false });

  const FILE_QUEUE = await channel.assertQueue(JOB_CSV_UPDATE_QUEUE, {
    durable: true,
  });
  await channel.bindQueue(FILE_QUEUE.queue, FAN_EXCHANGE, "");
  await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

  logger.info("CSV processing consumer is waiting for message ⏳⏳⏳⏳");

  channel.consume(FILE_QUEUE.queue, async (msg) => {
    let job_data: Job;
    if (msg) {
      const content = msg.content.toString();
      logger.info("Recieved job: " + content);
      try {
        job_data = JSON.parse(content);

        logger.info(`Processing job ${job_data.id}...`);

        setTimeout(() => {
          update_job_status_into_file(job_data.id!, "COMPLETED")
            .then(() => {
              const update_message = JSON.stringify({
                id: job_data.id,
                status: "COMPLETED",
              });
              channel.sendToQueue(
                NOTIFICATION_QUEUE,
                Buffer.from(update_message),
                {
                  persistent: true,
                }
              );

              logger.info(`Job ${job_data.id} processed , update published`);
              channel.ack(msg);
            })
            .catch((error: unknown) => {
              if (error instanceof Error)
                logger.info("Error while Processing the job", error);
            });
        }, 30000);
      } catch (error: unknown) {
        if (error instanceof Error)
          logger.error("Invalid job format", error.message);
      }
    }
  });
}

start_worker().catch((error: unknown) => {
  if (error instanceof Error)
    logger.error("Worker did not start", error.message);
  process.exit(-1);
});
```

Lastly we have a services to update and get data from DB as well as appending file to CSV. Code for that is fairly simple. We use Drizzle ORM to Query Postgres DB.

```
 services
│   │   └── job.service.ts
```

```typescript
// job.service.ts
import { db } from "../config/db";
import { Job_Table } from "../migrations/schema";
import { eq } from "drizzle-orm";
import { Job, Status } from "../types/job.types";
import fs from "fs";

export async function create_job(job: Job) {
  try {
    await db.insert(Job_Table).values(job);
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function update_job_status(id: string, status: Status) {
  try {
    await db
      .update(Job_Table)
      .set({ status, updatedAt: new Date() })
      .where(eq(Job_Table.id, id));
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function get_all_jobs() {
  try {
    return await db.select().from(Job_Table);
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
  }
}

export async function update_job_status_into_file(
  id: string,
  status: Status
): Promise<void> {
  try {
    const updated_at = new Date().toISOString();
    const csv_line = `${id},${status},${updated_at}\n`;
    fs.appendFile("out/job_status.csv", csv_line, (error) => {
      if (error instanceof Error) throw new Error(error.message);
    });
  } catch (error: unknown) {
    if (error instanceof Error) throw new Error(error.message);
  }
}
```

### Running the scripts and Result

After running server, run both consumers.Once the consumer are ready to consume messages. We start our producer. As you can see both consumer recieve same amout of requests and take 30000 seconds to process the records and send acknowledgement back.

Same result can be observed in visualize chart using Rabbit MQ user management UI. You can access the UI at http://localhost:15672/ while running RabbitMQ in docker container

![Result Console](/task_q_result_console.png "Result Console")

![Result UI](/task_q_result_ui.png "Result UI")

In summary, the two consumer scripts work in tandem to ensure that each job message is processed according to its specific requirements, while the notification mechanism keeps the rest of the system informed of progress. We achieve this by leveraging RabbitMQ’s fanout exchange, both consumers receive every job message independently—one updating the database and the other updating a CSV file—and then publish status updates to a dedicated notification queue.

This decoupled and scalable design allows the application to handle asynchronous processing reliably, ensuring robust and efficient communication across different components of the system

I hope you found this article interesting. We will discuss Asyncronous messaging details along with stream processing and other features. So stay tuned

Cheers and Happy coding!
