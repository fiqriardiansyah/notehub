import { Todo } from "@/app/write/mode/todolist"

export type HabitHistory = {
    id: string
    userId: string
    habitId: string
    isCompleted: boolean
    todos: Todo[]
    completedTime: string
}

export type Timer = {
    id: string
    itemId?: string
    noteId?: string
    type?: "todo"
    startTime?: string | null
    endTime?: string | null
    isEnd?: boolean | null
    autoComplete?: boolean | null
}