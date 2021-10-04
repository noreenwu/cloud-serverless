
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient();
import { getUserId } from '../utils'
const todosTable = process.env.TODOS_TABLE
const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event)

  const result = await docClient
    .query({
      TableName: todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
  
  logger.info(`Pulled todo items for user ${userId}`, {
    userId
  });
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(
      {
        message: "Hello: the getTodos() function executed successfully!",
        input: event,
        table: todosTable,
        items: result.Items
      },
    ),
  };
};