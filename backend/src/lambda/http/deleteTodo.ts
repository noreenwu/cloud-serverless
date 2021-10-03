import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as AWS from 'aws-sdk'
import { getUserId } from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE
const logger = createLogger('deleteTodo')

const deleteTodo = async(todoId: string, userId: string) => {
  const deleteTodo = await docClient.delete({
      TableName: todosTable,
      Key: { userId, todoId }
  })
  .promise();
  return { Deleted: deleteTodo };
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const userId = getUserId(event)
  const ret = await deleteTodo(todoId, userId)

  logger.info('Todo was deleted', {
    userId,
    todoId
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(ret)
  };
}
