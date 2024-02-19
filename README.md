# Backend Developer Technical Assessment

# User instructions

## Techs

-   [AWS Services](https://aws.amazon.com/pt/)
-   [NestJS](https://nestjs.com/)
-   [Docker](https://www.docker.com/)
-   [Serverless Framework](https://www.serverless.com/)
-   [Swagger](https://swagger.io/)
-   [Jest](https://jestjs.io/pt-BR/)
-   [PostgreSQL](https://www.postgresql.org/) + [TypeORM](https://typeorm.io/)

## Prerequisites

1. Docker and Docker Compose (Optional)
2. Serverless framework

Create a .env file on the project root folder following the .env.example file.

## Booting up the API

### With Docker

To start the API with Docker, run the following command:

```bash
docker compose up -d
```

With Docker, the database with the API is already configured with the ddl files (inital database configuration) already executed in the container initial startup.

### Without Docker

To start the API without docker, first configure a local database with PostgreSQL-16 and fill the .env with the credentials.

Next install the dependencies with the command on the project root:

```bash
yarn install
```

Then run the command to start up the API:

```bash
yarn start:dev
```

With or without docker the commands will start the API in development mode on `localhost:${PORT}` with PORT beeing the PORT setted on .env file or `3000` as a default value.

## Endpoints

The API endpoints were developed following exactly the [challenge description](#user-actions).

## Tests

The tests were developed using Jest. To run all tests with coverage information run the following command:

```bash
yarn test:cov
```

## Documentation

The API documentation was developed using Swagger. To see the documentation page go to:

```
http://localhost:${PORT}/api
```

## Logs

The logging system was made using the Logger built-in package of NestJS exported by `@nestjs/common`.

## Error Handling

The API error handling was made using NestJS global filter with a custom exception class: `HttpExceptionFilter`.

## Lambda Functions

The 2 lambda functions are located in the `lambda/` folder. They were also made with NestJS but with Serverless Framework.

The `check-harmful-content/` folder is responsible to handler the lambda that checks harmful content on description and title of a Job that was sent to be published. The function or publishes a Job that has no harmful content or rejects it and add the reason on notes column of the Job on database. The content is verified using OpenAI API.

The `save-job-file/` folder is responsible to handler the lambda that checks periodically for a Job that is published and adds it to a folder on S3 to be available to `GET /feed` endpoint. (AWS EventBridge needs to be configured).

### Deploy the Lambda

To deploy the lambda on AWS simple run the command:

```bash
serverless deploy
```

## Bonus Questions Answers

1. One of many solutions would be cache the results of most commom words and use the results as the OpenAI API response. And from times to times, updates the cache once with new API analytics responses. Other solution would be create a request limit per user and when the limit is reached, the request is redirected to a rejection queue to be processed later on. And finally, one other solution would be observe AWS CloudWatch to see the peak times on Lambda and schedule the AWS Auto Scaling to increase the provisioned concurrency of the Lambda on this times. The solutions could be used together or separately.

2. I would use the AWS CloudFront service since it gives points of presence (PoPs) around the world using the nearest servers to the user and serves the application lowing the latency and giving high availability and performance to the app. The simple use of the service attached to a Lambda through Lambda Function URL decreases the latency significantly because the request is routed to the server that provides the lowest latency to the user.

# Challenge Informations

## Welcome!

We're excited to have you participate in our Backend Developer technical assessment. This test is designed to gauge your expertise in backend development, with a focus on architectural and organizational skills. Below, you'll find comprehensive instructions to set up and complete the project. Remember, completing every step is not mandatory; some are optional but can enhance your application.

## Assessment Overview

Your task is to develop a NodeJS API for a job posting management application. Analyze the application details and use cases, and translate them into functional endpoints.

### Application Components

Your solution should incorporate the following components and libraries:

1. **Relational Database**: Utilize a SQL database (PostgreSQL 16) with two tables (`companies` and `jobs`). The DDL script in the `ddl` folder of this repository initializes these tables. The `companies` table is pre-populated with fictitious records, which you should not modify. Focus on managing records in the `jobs` table. You don't need to worry about setting up the database, consider the database is already running in the cloud. Your code only needs to handle database connections. To test your solution, use your own database running locally or in the server of your choice.

2. **REST API**: Develop using NodeJS (version 20) and ExpressJS. This API will manage the use cases described below.

3. **Serverless Environment**: Implement asynchronous, event-driven logic using AWS Lambda and AWS SQS for queue management.

4. **Job Feed Repository**: Integrate a job feed with AWS S3. This feed should periodically update a JSON file reflecting the latest job postings.

### User Actions

Convert the following use cases into API endpoints:

-   `GET /companies`: List existing companies.
-   `GET /companies/:company_id`: Fetch a specific company by ID.
-   `POST /job`: Create a job posting draft.
-   `PUT /job/:job_id/publish`: Publish a job posting draft.
-   `PUT /job/:job_id`: Edit a job posting draft (title, location, description).
-   `DELETE /job/:job_id`: Delete a job posting draft.
-   `PUT /job/:job_id/archive`: Archive an active job posting.

### Integration Features

-   Implement a `GET /feed` endpoint to serve a job feed in JSON format, containing published jobs (column `status = 'published'`). Use a caching mechanism to handle high traffic, fetching data from an S3 file updated periodically by an AWS Lambda function. The feed should return the job ID, title, description, company name and the date when the job was created. This endpoint should not query the database, the content must be fetched from S3.
-   This endpoint receives a massive number of requests every minute, so the strategy here is to implement a simple cache mechanism that will fetch a previously stored JSON file containing the published jobs and serve the content in the API. You need to implement a serverless component using AWS Lambda, that will periodically query the published jobs and store the content on S3. The `GET /feed` endpoint should fetch the S3 file and serve the content. You don't need to worry about implementing the schedule, assume it is already created using AWS EventBridge. You only need to create the Lambda component, using NodeJS 20 as a runtime.

### Extra Feature (Optional)

-   **Job Moderation**: using artificial intelligence, we need to moderate the job content before allowing it to be published, to check for potential harmful content.
    Every time a user requests a job publication (`PUT /job/:job_id/publish`), the API should reply with success to the user, but the job should not be immediately published. It should be queued using AWS SQS, feeding the job to a Lambda component.
    Using OpenAI's free moderation API, create a Lambda component that will evaluate the job title and description, and test for hamrful content. If the content passes the evaluation, the component should change the job status to `published`, otherwise change to `rejected` and add the response from OpenAI API to the `notes` column.

### Bonus Questions

1. Discuss scalability solutions for the job moderation feature under high load conditions. Consider that over time the system usage grows significantly, to the point where we will have thousands of jobs published every hour. Consider the API will be able to handle the requests, but the serverless component will be overwhelmed with requests to moderate the jobs. This will affect the database connections and calls to the OpenAI API. How would you handle those issues and what solutions would you implement to mitigate the issues?
2. Propose a strategy for delivering the job feed globally with sub-millisecond latency. Consider now that we need to provide a low latency endpoint that can serve the job feed content worldwide. Using AWS as a cloud provider, what technologies would you need to use to implement this feature and how would you do it?

## Instructions

1. Fork this repository and create a branch named after yourself.
2. Develop the solution in your branch.
3. Use your AWS account or other environment of your choice to test and validate your solution.
4. Update the README with setup and execution instructions.
5. Complete your test by sending a message through the Plooral platform with your repository link and branch name.

## Evaluation Criteria

We will assess:

-   Knowledge of JavaScript, Node.js, Express.js.
-   Proficiency with serverless components (Lambda, SQS).
-   Application structure and layering.
-   Effective use of environment variables.
-   Implementation of unit tests, logging, and error handling.
-   Documentation quality and code readability.
-   Commit history and overall code organization.

Good luck, and we're looking forward to seeing your innovative solutions!
Implementation of the user actions and integration features is considered mandatory for the assessment. The extra feature and the bonus questions are optional, but we encourage you to complete them as well, it will give you an additional edge over other candidates.

## A Note on the Use of AI Tools

In today's evolving tech landscape, AI tools such as ChatGPT and GitHub Copilot have become valuable resources for developers. We recognize the potential of these tools in aiding problem-solving and coding. While we do not prohibit the use of AI in this assessment, we encourage you to primarily showcase your own creativity and problem-solving skills. Your ability to think critically and design solutions is what we're most interested in.

That said, if you do choose to utilize AI tools, we would appreciate it if you could share details about this in your submission. Include the prompts you used, how you interacted with the AI, and how it influenced your development process. This will give us additional insight into your approach to leveraging such technologies effectively.

Remember, this assessment is not just about getting to the solution, but also about demonstrating your skills, creativity, and how you navigate and integrate the use of emerging technologies in your work.
