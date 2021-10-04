import 'source-map-support/register'
import { getUserId } from '../utils'
const AWS = require('aws-sdk')
import { createLogger } from '../../utils/logger'
const todosTable = process.env.TODOS_TABLE
const logger = createLogger('generateUploadUrl')

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const userId = getUserId(event)
  const url = getUploadUrl(todoId)

  // update the DynamoDB entry for this todo, with the URL of the image being uploaded
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

  logger.info('Generated an uploadURL', {
    userId,
    todoId,
    url
  });

  // Return a presigned URL to upload a file for a TODO item with the provided id
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