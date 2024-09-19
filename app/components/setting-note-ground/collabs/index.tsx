"use client";
import StateRender from '@/components/state-render';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { CommonContext, CommonContextType } from '@/context/common';
import { InvitationData } from '@/models/collab';
import { Note } from '@/models/note';
import collabService from '@/service/collab';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ListAccountInvited from './list-account-invited';
import ListAccountCollab from './list-account-collab';

export const COLLABS_NOTE_GROUND = "collabsNoteGround";

export default function CollabsNoteGround() {
    const { common, callbackPayload } = React.useContext(CommonContext) as CommonContextType;
    const [payload, setPayload] = React.useState<Note>();

    const formSchema = z.object({
        email: z.string().email(),
        role: z.string(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const sendInviteMutate = useMutation(async (data: InvitationData) => {
        return (await collabService.invite(data)).data.data;
    });

    const getInvitationsQuery = useQuery([collabService.getInvitation.name, payload], async () => {
        return (await collabService.getInvitation(payload!.id, "pending")).data.data
    }, {
        enabled: !!payload?.id
    });

    const collabAcountQuery = useQuery([collabService.collabAccount.name, payload], async () => {
        return (await collabService.collabAccount(payload!.id)).data.data
    }, {
        enabled: !!payload?.id
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!payload?.id) return;
        sendInviteMutate.mutateAsync({
            email: values.email,
            role: values.role,
            noteId: payload!.id,
            noteTitle: payload!.title,
        }).then(() => {
            // [important] notif success
            form.reset();
            form.setValue("email", "");
            form.setValue("role", "viewer");
            getInvitationsQuery.refetch();
        }).catch((e: any) => {
            // [important] notif failed
        });
    }

    callbackPayload((nameground, pld: Note) => {
        if (nameground === COLLABS_NOTE_GROUND) {
            setPayload(pld);
        }
    });

    if (common?.groundOpen === COLLABS_NOTE_GROUND) {
        return (
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }}
                className="w-full h-full flex flex-col gap-6 p-5 md:p-0 md:w-[300px]">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 w-full flex-col flex"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Invite people
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Insert email user" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-start gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className='w-full'>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="editor">Editor</SelectItem>
                                                <SelectItem value="viewer">Viewer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button loading={sendInviteMutate.isLoading} type='submit'>
                                Invite
                            </Button>
                        </div>
                    </form>
                </Form>
                {sendInviteMutate.isError && <p className='text-red-400 text-xs my-4'>{(sendInviteMutate.error as any)?.message}</p>}
                <StateRender data={getInvitationsQuery.data} isLoading={getInvitationsQuery.isLoading}>
                    <StateRender.Data>
                        <ListAccountInvited refresh={getInvitationsQuery.refetch} invitations={getInvitationsQuery.data} />
                    </StateRender.Data>
                    <StateRender.Loading>
                        <div className="flex flex-col gap-4">
                            <Skeleton className="w-[240px] h-[40px]" />
                            <Skeleton className="w-[200px] h-[40px]" />
                        </div>
                    </StateRender.Loading>
                </StateRender>
                <StateRender data={collabAcountQuery.data} isLoading={collabAcountQuery.isLoading}>
                    <StateRender.Data>
                        <ListAccountCollab refresh={collabAcountQuery.refetch} collabAccount={collabAcountQuery.data} />
                    </StateRender.Data>
                    <StateRender.Loading>
                        <div className="flex flex-col gap-4">
                            <Skeleton className="w-[240px] h-[40px]" />
                            <Skeleton className="w-[200px] h-[40px]" />
                        </div>
                    </StateRender.Loading>
                </StateRender>
            </motion.div>
        )
    }

    return null;

}
