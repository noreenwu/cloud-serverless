import 'source-map-support/register'
import { getUserId } from '../utils'

// const uuid = require('uuid');
const AWS = require('aws-sdk')
const todosTable = process.env.TODOS_TABLE

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const userId = getUserId(event)

  // const imageId = uuid.v4()
  const url = getUploadUrl(todoId)

  console.log("the signed url is: ", url)
  console.log("the userId is: ", userId)
  console.log("the todoId is: ", todoId)
  
  // update the DynamoDB entry for this todo
  await docClient.update({
      TableName: todosTable,
      Key: { userId, todoId },
      UpdateExpression: "set attachmentUrl=:URL",
      ExpressionAttributeValues: {
        ":URL": url.split("?")[0]
      },
      ReturnValues: "UPDATED_NEW"
    })
  .promise();  


  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        todoId,
        uploadUrl: url
    })
  }
}

function getUploadUrl(todoId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
  })
}