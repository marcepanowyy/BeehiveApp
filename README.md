## Beehive App

The Full-Stack Web Application for E-Commerce is a comprehensive solution developed using NestJS for the backend and Angular for the frontend. This platform allows users to register, log in, browse and filter through a variety of products, create their shopping carts, place orders, and complete secure online payments.

## Key Features:

### 1. Dockerized PostgreSQL Database

The application is backed by a PostgreSQL database, consisting of tables such as users, orders, order_details, products, reviews, and categories. This database foundation ensures efficient data management and retrieval for various aspects of the application's functionality.

[Database diagram](https://drive.google.com/file/d/1QBpfZZ9ZCTI820WZZJGRw-YkmYjs1JKj/view?usp=sharing)

### 2. OAuth 2.0

The application offers seamless integration with OAuth 2.0, allowing users to log in via their Google accounts, alongside the conventional username and password-based login and registration methods.

[OAuth 2.0 workflow](https://drive.google.com/file/d/1BvdASB2uph4KcX7912MTShKW02Il21SE/view?usp=sharing) <br>
[OAuth 2.0 UI interaction](https://drive.google.com/file/d/1_ympdVdz8MkxSy88E-yo-YT-YBcJibsw/view?usp=sharing)

### 3. Online Payments with Stripe

Integrated with Stripe, the platform enables secure online payments for orders. Customers can conveniently pay using a variety of payment methods.

[Stripe workflow](https://drive.google.com/file/d/1idpeoUMmSXgD6KeKY7JMy6_L2Z7QN4xc/view?usp=sharing) <br>
[Stripe UI interaction](https://drive.google.com/file/d/1yUNH9WBvGL6lCq0S4R5ElUIEs5Bnl2Tp/view?usp=sharing)

### 4. Email Notifications via SMTP with Dockerized RabbitMQ

RabbitMQ plays a crucial role in managing email notifications, providing an organized way to handle various messages. When users register, activate accounts, request password resets, or place orders, RabbitMQ efficiently queues these events.

[RabbitMQ workflow](https://drive.google.com/file/d/1TZZ2afcTJw62A1ixCCMo_RLFlYVvYMoh/view?usp=sharing)

### 5. Swagger Documentation

Comprehensive API documentation is provided through Swagger annotations. Developers have access to clear insights into available endpoints, request parameters, response formats, and more.

[Swagger UI interaction](https://drive.google.com/file/d/1XIVzmlWE3kTpOEtAGpAkCbnDTfHiuicH/view?usp=sharing)

### 6. Intuitive Angular-Powered GUI

The platform boasts an Angular-powered graphical user interface enhanced by the sleek and user-centric Material UI design framework.

[GUI interaction](https://drive.google.com/file/d/1rG9ZGC5bpMRvnovV8mSmDKk3se38fhGN/view?usp=sharing)

### Languages and Tools

#### Backend:

<p align="left">
  <a href="https://nestjs.com/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nestjs/nestjs-plain.svg" alt="nestjs" width="40" height="40"/>
  </a>

  <a href="https://www.rabbitmq.com" target="_blank" rel="noreferrer">
    <img src="https://www.vectorlogo.zone/logos/rabbitmq/rabbitmq-icon.svg" alt="rabbitMQ" width="40" height="40"/>
  </a>

  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/>
  </a>

  <a href="https://mochajs.org" target="_blank" rel="noreferrer">
    <img src="https://www.vectorlogo.zone/logos/mochajs/mochajs-icon.svg" alt="mocha" width="40" height="40"/>
  </a>

  <a href="https://nodejs.org" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/>
  </a>

</p>

#### Frontend:

<p align="left">
  <a href="https://angular.io" target="_blank" rel="noreferrer">
    <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="angular" width="40" height="40"/>
  </a>

  <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/>
  </a>

  <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/>
  </a>

  <a href="https://www.w3.org/html/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/>
  </a>

</p>

#### Databases and Containers:

<p align="left">
  <a href="https://www.postgresql.org" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/>
  </a>

  <a href="https://www.docker.com/" target="_blank" rel="noreferrer">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/>
  </a>

</p>


### Running the App:

Before you start running the different components of the app, make sure to set up the necessary environment variables for each part.

#### Backend:

1. Open a terminal window in the "backend" folder.
2. Install the required dependencies by running the following command:

```
npm install
```
3. Create a `.env` file in the "backend" folder and add the necessary environment variables.
4. To run the server in development mode, use the following command:

```
npm run start:dev
```

Remember to populate the `.env` file with the required environment variables before starting the backend server.

#### Frontend:

1. Open a terminal window in the "frontend" folder.
2. Install the required dependencies by running the following command:

```
npm install
```
3. Create an `environment.ts` file in the "frontend/src/environments" folder and add the necessary environment variables.
4. To run the app in development mode, use the following command:

```
ng serve
```

Make sure to set the environment variables in the `environment.ts` file before running the frontend app.

#### Message Handler:

1. Open a terminal window in the "messageHandler" folder.
2. Install the required dependencies by running the following command:

```
npm install
```
3. Create a `.env` file in the "messageHandler" folder and add the necessary environment variables.
4. To run the message handler app in development mode, use the following command:

```
npm run start:dev
```

Don't forget to set up the environment variables in the `.env` file before starting the message handler app.

By setting up the appropriate environment variables in each component's configuration file, you'll ensure that the app runs smoothly and communicates correctly between the backend, frontend, and message handler.

###### The PDF files depicting UI interactions and workflows, as well as the database diagram, are located in the "assets" folder.

