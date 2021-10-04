import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess();

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId)
}

export async function createGroup(newTodo: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
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
