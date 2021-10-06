
const AWS = require('aws-sdk')
import { TodoItem } from '../models/TodoItem'
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

export class TodoAccess {

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

        async createTodo(newTodo: TodoItem): Promise<TodoItem> {
            await this.docClient.put({
                TableName: this.todosTable,
                Item: newTodo
              }).promise();
              
              
              return newTodo;
        }

        async deleteTodo(userId: string, todoId: string): Promise<string> {
            const deletedTodo = await this.docClient.delete({
                TableName: this.todosTable,
                Key: { userId, todoId }
            })
            .promise();

            console.log("deleted todo ", todoId)
            console.log("deleteTodo docClient returned ", deletedTodo)
            return  todoId;

        }

        async updateTodo(userId: string, todoId: string, todo: UpdateTodoRequest): Promise<any> {
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
            
            console.log("updated todo", updatedTodo.Attributes)
            const retTodo = { ...updatedTodo.Attributes }
            return retTodo
        }

        // async generateUploadUrl(userId: string, todoId: string): Promise<any> {

        // }
}


