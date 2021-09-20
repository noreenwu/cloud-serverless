import 'source-map-support/register'
const uuid = require('uuid');

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE

const getDateTimeNow = () => {
  const d = new Date();
  return d.toString();
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  console.log("newTodo: ", newTodo)
  const itemId = uuid.v4();

  const newItem = {
    todoId: itemId,
    ...newTodo,
    done: false,
    createdAt: getDateTimeNow()
  }

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        newItem
    })
  }
}
