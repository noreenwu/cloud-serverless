import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess();

// get all Todos for specified user
export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {

    const userId = parseUserId(jwtToken)
    return todoAccess.getAllTodos(userId)
}

// create a Todo for specified user
export async function createTodo(newTodo: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const todoId = uuid.v4()
    const userId = parseUserId(jwtToken)

    const todoAccess = new TodoAccess();

    return await todoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: Date.now().toString(),
        name: newTodo.name,
        dueDate: newTodo.dueDate,
        done: false
    })
}

// delete specified Todo for specified user
export async function deleteTodo(todoId: string, jwtToken: string): Promise<string> {

    const userId = parseUserId(jwtToken)

    return todoAccess.deleteTodo(userId, todoId)

}

// update specified Todo for specified user
export async function updateTodo(todoId: string, revisedTodo: UpdateTodoRequest, jwtToken: string): Promise<TodoItem> {

    const userId = parseUserId(jwtToken)

    return todoAccess.updateTodo(userId, todoId, revisedTodo)
}

// get upload Url
export async function getUploadUrl(todoId: string): Promise<string> {

    return await todoAccess.getUploadUrl(todoId)
}

export async function saveUploadUrl(todoId: string, jwtToken: string, url: string): Promise<string> {
    const userId = parseUserId(jwtToken)

    return await todoAccess.updateTodoUploadUrl(userId, todoId, url)
}