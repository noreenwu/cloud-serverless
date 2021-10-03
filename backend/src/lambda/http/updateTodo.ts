import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE


const updateTodo = async(todoId: string, userId: string, todo: UpdateTodoRequest) => {
  const updatedTodo = await docClient.update({
      TableName: todosTable,
      Key: { userId, todoId },
      ExpressionAttributeNames: {
        '#todo_name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done,
      },
      UpdateExpression: 'SET #todo_name = :name, dueDate = :dueDate, done = :done',
      ReturnValues: 'ALL_NEW',
  })
  .promise();
  return { Updated: updatedTodo };
}


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const todoRevision: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)


  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const ret = await updateTodo(todoId, userId, todoRevision)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(ret)
  };
}

