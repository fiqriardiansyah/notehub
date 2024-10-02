"use client";

import { Todo } from "@/app/write/mode/todolist";
import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";

type TodoListViewProps = {
    todos: Todo[]
}

export default function TodoListView({ todos }: TodoListViewProps) {
    return (
        <div className="w-full flex flex-col gap-3">
            {todos?.map((item) => (
                <div key={item.id} className="flex items-start overflow-hidden justify-between">
                    <label htmlFor={item.id} className="flex items-center gap-3 p-1">
                        <Checkbox id={item.id} disabled checked={item.isCheck} className="w-7 h-7 !cursor-pointer" />
                        <div className="flex flex-col">
                            <span className="text-lg font-medium">{item.content}</span>
                            {item.checkedAt && <span className="text-sm font-medium text-gray-400 capitalize">done at {dayjs(item.checkedAt).format("DD MMM, HH:mm")}</span>}
                        </div>
                    </label>
                </div>
            ))}
        </div>
    )
}