# Rate My Surf
## A fully functional EXAMPLE Node.js project for reviewing surf locations
Rate My Surf is an online platform where surfers in Santa Cruz, Orange, and Monterey Counties can discover beaches, leave reviews, and view pertinent weather and tide information.

## Installation
With Node.js and npm installed, clone the repo and run 'npm install' to install the necessary dependencies.
Be sure to setup a local mysql login and then create a .env file in the root directory of the project with the following information:
```
DB_NAME='rms_db'
DB_USER='your-mysql-username'
DB_PW='your-mysql-password'
```
Then, run the schema.sql file from the 'db' folder in the root directory of the project to intialize the rms_db database:
```
mysql> source db/schema.sql;
```
Then do `npm start` to run the server. This will initialize the tables in the database.
Close the server and run the seeds.sql file from the 'db' folder to populate the tables with data:
```
mysql> source db/seeds.sql;
```
Then run the server again with `npm start` and visit 'localhost:3001' in a browser to view the site.

## Technologies used
This project was built using the following technologies:
- **Node.js & npm**
- **MySQL & Sequelize** for data storage
- **Express** for routing
- **Bcrypt** for encrypting sensitive user data
- **Handlebars.js** for templating