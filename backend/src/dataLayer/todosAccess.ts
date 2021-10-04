
const AWS = require('aws-sdk')
import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
        }

        async getAllTodos(userId: string): Promise<TodoItem[]> {
            console.log("Getting all todos")

            const result = await this.docClient
                .query({
                TableName: this.todosTable,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                },
            ScanIndexForward: false
            }).promise()

            console.log(result)
            const items = result.Items

            return items as TodoItem[]
        }        
}


