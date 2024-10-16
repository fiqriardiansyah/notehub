"use client";

import { Todo } from "@/app/write/mode/todolist";
import CheckboxCustom from "@/components/ui/checkbox-custom";
import dayjs from "dayjs";

type TodoListViewProps = {
    todos: Todo[]
}

export default function TodoListView({ todos }: TodoListViewProps) {
    return (
        <div className="w-full flex flex-col gap-3">
            {todos?.map((item) => (
                <CheckboxCustom key={item.id} disabled checked={item.isCheck} label={<div className="flex flex-col">
                    <span className="text-sm font-medium">{item.content}</span>
                    {item.checkedAt && <span className="text-xs font-medium text-gray-400 capitalize">done at {dayjs(item.checkedAt).format("DD MMM, HH:mm")}</span>}
                </div>} />
            ))}
        </div>
    )
}