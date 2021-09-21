import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  console.log("delete todo id is ", todoId)

  var params = {
    TableName: todosTable,
    Key: {
      "userId": 1,
      "todoId": todoId
    }
  }
  docClient.delete(params, function(err, data) {
    if (err) {
      console.error("unable to delete item", JSON.stringify(err, null, 2))      
    }
    else {
      console.log("DeleteItem succeeded", JSON.stringify(data, null, 2))
    }
  })

  // const result = await docClient.delete({
  //   TableName: todosTable,
  //   Keys: [{
  //     userId: 1,
  //     todoId: todoId
  //   }]
  // }).promise()


  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({"hello": "delete"})
  };
}
