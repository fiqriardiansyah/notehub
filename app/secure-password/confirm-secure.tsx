"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import noteService from "@/service/note";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type ConfirmSecureType = {
    onFinish?: (res: boolean) => void;
}

export default function ConfirmSecure({ onFinish }: ConfirmSecureType) {

    const checkMutate = useMutation(async (password: string) => {
        return (await noteService.isPasswordNoteCorrect(password)).data.data
    })

    const formSchema = z.object({
        password: z.string().min(5, {
            message: "Password must be at least 5 characters.",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        checkMutate.mutateAsync(values.password).then((result) => {
            if (onFinish) {
                onFinish(result);
            }
            if (!result) {
                form.setError("password", { message: "Password wrong!" });
            }
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 w-full"
            >
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Enter your note secure password
                            </FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    loading={checkMutate.isLoading}
                    type="submit"
                >
                    Apply
                </Button>
                <p className="mt-4 text-sm">Forgot your password? <Link href="/secure-password" className="text-red-400">Forgot password</Link></p>
            </form>
        </Form>
    )
}