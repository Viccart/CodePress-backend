# Back End News API

## Description

This project is a RESTful API built with Node.js, Express.js, and PostgreSQL. The API enables CRUD operations by providing endpoints for GET, POST, PATCH, and DELETE requests. The PostgreSQL database is used to store the data, and test data has been seeded for convenience. Jest and Supertest are utilized for testing the API endpoints. Ticket tracking is managed through Kanban Trello boards. The API is hosted using ElephantSQL and Render.

## Kanban

https://trello.com/b/12CekBgN/be-project

## Tech Stack:
`Node.js`
`Express`
`PostgreSQL`

## Initial Setup

Clone the repository.
Run `npm install`

Create a **.env.development** file and add the following:
`PGDATABASE=nc_news`

Also create a **.env.test** file and add the following:
`PGDATABASE=nc_news_test`

DATABASE_URL=https://nc-news-nt85.onrender.com

Run the following commands:

`npm run setup-dbs`
`npm run seed`

Start the server by running `npm run start`

## Usage

To use the API, send HTTP requests to the appropriate endpoints. The following endpoints are available:

GET /api/articles : Retrieves a list of all the articles.
GET /api/articles/:article_id : Retrieves an article by the article ID.
GET /api/topics : Retrieves a list of all the topics.
GET /api/articles/:article_id/comments : Retrieves a list of all the comments on an articles by the article ID.
GET /api/users : Retrieves a list of all the Users.
POST /api/articles/:article_id/comments : Posts a new comment to an article by the article ID.
PATCH /api/articles/:article_id : Updates an existing articles.
DELETE /api/comments/:comment_id: Deletes an existing comment.

For more information on the available, refer to the endpoints.json file.

## Testing

Jest and Supertest are used for testing the API and its endpoints. To run the tests, execute the command `npm test`.
