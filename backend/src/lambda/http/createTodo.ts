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

const createTodo = async(newTodo: CreateTodoRequest) => {
  const newItem = {
    userId: "1",
    todoId : uuid.v4(),
    ...newTodo,
    done: false,
    createdAt: getDateTimeNow()
  }

  const createTodo = await docClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise();

  console.log("createTodo Put completed", createTodo)

  return { newItem }
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // const authorization = event.headers.Authorization
  // const split = authorization.split(' ')
  // const jwtToken = split[1]

  // console.log("createTodo jwtToken: ", jwtToken)

  const userId = getUserId(event)
  console.log("userId: ", userId)

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  console.log("newTodo: ", newTodo)

  const ret = await createTodo(newTodo)

  console.log("created the todo...", ret)

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
