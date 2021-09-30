import 'source-map-support/register'
const uuid = require('uuid');

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE

const getDateTimeNow = () => {
  const d = new Date();
  return d.toString();
}

const createTodo = async(userId: string, newTodo: CreateTodoRequest) => {
  const newItem = {
    userId: userId,
    todoId : uuid.v4(),
    ...newTodo,
    done: false,
    createdAt: getDateTimeNow()
  }

  await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise();

  return { newItem }
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event)

  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const ret = await createTodo(userId, newTodo)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        ...ret
    })
  }
}
