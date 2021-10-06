import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'

const logger = createLogger('businesslogic')
const todoAccess = new TodoAccess();

// get all Todos for logged in user
export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
    logger.info('getting all Todos for user', {
        jwtToken
    });     
    const userId = parseUserId(jwtToken)
    return todoAccess.getAllTodos(userId)
}

// create a Todo for logged in user
export async function createTodo(newTodo: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {    
    const todoId = uuid.v4()
    const userId = parseUserId(jwtToken)
    logger.info('createTodo', {
        newTodo,
        jwtToken
    });

    return await todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: Date.now().toString(),
        name: newTodo.name,
        dueDate: newTodo.dueDate,
        done: false
    })
}

// delete specified Todo for logged in user
export async function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken)
    logger.info('deleteTodo', {
        userId,
        todoId
    });

    return todoAccess.deleteTodo(userId, todoId)

}

// update specified Todo for logged in user
export async function updateTodo(todoId: string, revisedTodo: UpdateTodoRequest, jwtToken: string): Promise<TodoItem> {

    const userId = parseUserId(jwtToken)
    logger.info('updateTodo', {
        userId,
        todoId,
        revisedTodo
    });

    return todoAccess.updateTodo(userId, todoId, revisedTodo)
}

// get upload Url
export async function getUploadUrl(todoId: string): Promise<string> {
    logger.info('getUploadUrl', {
        todoId
    });    
    return await todoAccess.getUploadUrl(todoId)
}

// save the S3 url in the Todo item
export async function saveUploadUrl(todoId: string, jwtToken: string, url: string): Promise<string> {
    const userId = parseUserId(jwtToken)
    logger.info('saveUploadUrl', {
        todoId,
        jwtToken,
        url
    });
    return await todoAccess.updateTodoUploadUrl(userId, todoId, url)
}