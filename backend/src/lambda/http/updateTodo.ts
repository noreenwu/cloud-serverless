import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE
const logger = createLogger('updateTodos')


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

  logger.info('Updated specified todo', {
    userId,
    todoId,
    todo
  });

  return { Updated: updatedTodo };
}


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const todoRevision: UpdateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)


  // This updates a TODO item with the provided todoId using values in the "todoRevision" object
  const ret = await updateTodo(todoId, userId, todoRevision)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(ret)
  };
}

