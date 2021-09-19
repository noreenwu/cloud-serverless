
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
// import * as AWS from 'aws-sdk'

// const docClient = new AWS.DynamoDB.DocumentClient();
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
  console.log("processing event ", event)

  // const result = await docClient.scan({
  //   TableName: todosTable
  // }).promise()

  // var params = {
  //   TableName : 'Todos'
  // };

  // const result = await docClient.scan(params, function(err, data) {
  //   if (err) console.log(err);
  //   else console.log(data);
  // });
  // console.log("and the result was: ", result);
  
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
      },
    ),
  };
};