
const AWS = require('aws-sdk')
import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
const logger = createLogger('datalayer')

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
        }

        async getAllTodos(userId: string): Promise<TodoItem[]> {
            logger.info('getting all Todos for user', {
                userId
            }); 
            const result = await this.docClient
                .query({
                    TableName: this.todosTable,
                    KeyConditionExpression: 'userId = :userId',
                    ExpressionAttributeValues: {
                        ':userId': userId
                },
                ScanIndexForward: false
            }).promise()

            const items = result.Items

            return items as TodoItem[]
        }

        async createTodo(newTodo: TodoItem): Promise<TodoItem> {
            logger.info('creating a new Todo', {
                newTodo
            });              
            await this.docClient.put({
                TableName: this.todosTable,
                Item: newTodo
              }).promise();
                            
              return newTodo;
        }

        async deleteTodo(userId: string, todoId: string): Promise<string> {
            logger.info('deleting specified Todo', {
                userId,
                todoId
            });             
            await this.docClient.delete({
                TableName: this.todosTable,
                Key: { userId, todoId }
            })
            .promise();

            return  todoId;
        }

        async updateTodo(userId: string, todoId: string, todo: UpdateTodoRequest): Promise<any> {
            logger.info('updating specified Todo with new values', {
                userId,
                todoId,
                todo
            });            
            const updatedTodo = await this.docClient.update({
                TableName: this.todosTable,
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
            
            const retTodo = { ...updatedTodo.Attributes }
            return retTodo
        }

        async getUploadUrl(todoId: string): Promise<string> {
            const bucketName = process.env.IMAGES_S3_BUCKET
            const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

            logger.info('Generating an uploadURL', {
                todoId
            });

            const s3 = new AWS.S3({
                signatureVersion: 'v4'
            })

            return s3.getSignedUrl('putObject', {
                Bucket: bucketName,
                Key: todoId,
                Expires: urlExpiration
            })
         }

         async updateTodoUploadUrl(userId: string, todoId: string, url: string): Promise<any> {
            logger.info('Saving uploadURL to TodosTable specified item', {
                userId,
                todoId,
                url
            });             
            const updated = await this.docClient.update({
                TableName: this.todosTable,
                Key: { userId, todoId },
                UpdateExpression: "set attachmentUrl=:URL",
                ExpressionAttributeValues: {
                ":URL": url.split("?")[0]
                },
                ReturnValues: "UPDATED_NEW"
            })
            .promise();

            return updated
        } 
}


