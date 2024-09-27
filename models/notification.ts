export type Notification<T = any> = {
    id: string
    userId: string
    content: T
    createdAt: Date
    isRead: boolean
    type: string
}