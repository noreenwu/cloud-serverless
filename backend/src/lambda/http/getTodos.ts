
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient();
import { getUserId } from '../utils'
const todosTable = process.env.TODOS_TABLE


// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   // TODO: Get all TODO items for a current user
//   const response = {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*', // Required for CORS support to work
//     },
//     body: JSON.stringify({
//       message: 'Go Serverless v1.0! Your function executed successfully!',
//       input: event,
//     }),
//   };
//   return response;
// }
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // const result = await docClient.scan({
  //   TableName: todosTable
  // }).promise()
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
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(
      {
        message: "Hello: Your function executed successfully!",
        input: event,
        table: todosTable,
        items: result.Items
      },
    ),
  };
};