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
    itemId: string
    type: string | null
    endTime: Date | null
    isEnd: boolean | null
    autoComplete: boolean | null
}