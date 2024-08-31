import { Todo } from "@/app/write/mode/todolist"

export type HabitHistory = {
    id: string
    userId: string
    habitId: string
    isCompleted: boolean
    todos: Todo[]
    completedTime: string
}