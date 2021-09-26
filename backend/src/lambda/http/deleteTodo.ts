import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE

const deleteTodo = async(todoId: string, userId: string) => {
  console.log("deleteTodo todostable is ", todosTable)
  console.log("user id is ", userId)
  console.log("todo Id is ", todoId)
  const deleteTodo = await docClient.delete({
      TableName: todosTable,
      Key: { userId, todoId }
  })
  .promise();
  return { Deleted: deleteTodo };
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  console.log("delete todo id is ", todoId)

  const ret = await deleteTodo(todoId, "1")

  console.log("return value from deleteTodo was ", ret)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(ret)
  };
}
