"use client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Folder } from "@/models/note";
import noteService from "@/service/note";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type FormTitleProps = {
    onDiscard: () => void;
    title: string;
    setEdit: React.Dispatch<React.SetStateAction<{
        isEdit: boolean;
        tempTitle: string;
    }>>;
    refetch: () => void;
}

export default function FormTitle({ onDiscard, title, setEdit, refetch }: FormTitleProps) {
    const { id } = useParams();

    const updateFolderMutate = useMutation(
        [noteService.updateFolder.name],
        async (data: Partial<Folder>) => {
            return (await noteService.updateFolder(id as string, data)).data.data;
        }
    );

    const formSchema = z.object({
        title: z.string().min(5, {
            message: "Title folder must be at least 5 characters.",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title,
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setEdit({ isEdit: false, tempTitle: values.title });
        updateFolderMutate.mutateAsync({ title: values.title }).then(() => {
            refetch();
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex items-start gap-5"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="text" placeholder="Folder name" {...field} className="focus-visible:ring-0 focus:ring-0 focus:outline-none active:ring-0 ring-transparent text-sm border-none bg-transparent" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-1 m-0">
                    <button type="submit" title="Save" className="bg-none cursor-pointer p-2 text-lg">
                        <Check size={20} strokeWidth={1.5} />
                    </button>
                    <button type="button" onClick={onDiscard} title="Discard" className="bg-none cursor-pointer p-2 text-lg text-red-400">
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>
            </form>
        </Form>
    )
}