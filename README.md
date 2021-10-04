This is a basic "TODO" application using AWS Lambda functions, API Gateway, and the Serverless framework. Endpoints are protected using Auth0, with jwks verification of signature.

A React front-end will prompt a user to login; it is convenient to use a Google account to authenticate with Auth0. Once authenticated, a user may add new todo
items with a default due date one week ahead of the current date.

An image may be added to a todo item by clicking the Edit button. All attached images are stored in an S3 bucket in the cloud. The todo information, including a reference
to a todo's associated image, is stored as items in an AWS DynamoDB database.

A todo item may be deleted with the delete button, or marked complete with a checkbox. 

The user only sees and makes changes to his/her own todo items.

These front-end functions make use of these backend serverless endpoints:
   - GetTodos (list a user's todos)
   - CreateTodo (create a new todo)
   - DeleteTodo (delete a todo)
   - GenerateUploadUrl (get a pre-signed url allowing for image upload)
   - UpdateTodo (make changes to a user's existing todo)

The React front-end only allows a todo item's done status to change, but
the endpoint actually supports changing the due date and name of the todo; this can
be done from the Postman collection [found here](https://github.com/noreenwu/cloud-serverless/blob/main/ServerlessTodosApplication.postman_collection.json),
using PATCH updateTodo.

To run the front-end, checkout this repository, cd into the client directory, run ```npm install``` and then ```npm start.```

The backend is already deployed to the cloud and the client is configured
(client/src/config.ts) to point to the latest version of the API.

The backend has been configured with Serverless framework. That is,
all of the following were defined in the config file serverless.yml
and deployed to AWS using ```sls deploy -v```

- the lambda endpoints as described above
- the S3 bucket
- locations of json-defined validators for CreateTodo and UpdateTodo request objects
- cors
- DynamoDB database table for ToDos
- DynamoDB privileges per endpoint
- the DynamoDB keys and billing mode
- environment variables




