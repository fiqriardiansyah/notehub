"use client";
import StateRender from '@/components/state-render';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WriteContext, WriteContextType } from '@/context/write';
import { Folder } from '@/models/note';
import noteService from '@/service/note';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, FolderCheck, FolderOpen, X } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const FOLDER_NOTE_GROUND = "folderNoteGround";
export const FOLDER_NOTE_SAVE = "folderNoteSave";

export default function FolderNoteGround() {
    const [showButton, setShowButton] = React.useState(false);
    const { setDataNote, dataNote } = React.useContext(WriteContext) as WriteContextType;

    const getFolderQuery = useQuery([noteService.getFolder.name], async () => {
        return (await noteService.getFolder()).data.data;
    });

    const formSchema = z.object({
        title: z.string().min(5, {
            message: "Title folder must be at least 5 characters.",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const folderTitle = form.watch("title");

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (getFolderQuery.data?.find((folder) => folder.title === values.title)) {
            form.setError("title", { message: "Folder already exists!" });
            return;
        }
        form.reset({ title: "" })
        setDataNote((prev) => ({
            ...prev,
            folder: {
                name: values.title,
            }
        }))
    }

    const onRemoveFolder = () => {
        setDataNote((prev) => ({
            ...prev,
            folder: undefined,
        }))
    }

    const onFolderClick = (folder: Folder) => {
        return () => {
            setDataNote((prev) => ({
                ...prev,
                folder: {
                    id: folder.id,
                    name: folder.title
                }
            }));
        }
    }

    const onClickSubmit = () => {
        setDataNote((prev) => ({
            ...prev,
            folder: {},
        }));
        window.dispatchEvent(new CustomEvent(FOLDER_NOTE_SAVE, { detail: { folder: dataNote.folder } }));
    }

    React.useEffect(() => {
        const handler = () => {
            setShowButton(true);
        }

        window.addEventListener(FOLDER_NOTE_GROUND, handler);
        return () => {
            window.removeEventListener(FOLDER_NOTE_GROUND, handler);
        }
    }, []);

    return (
        <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { delay: .3 } }}
            className="w-full h-full flex flex-col gap-6 p-5 md:p-0 md:w-[300px]">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full flex items-start gap-5"
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Folder name
                                </FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Search Or Create New" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>
                        Create
                    </Button>
                </form>
            </Form>
            <AnimatePresence>
                {dataNote?.folder?.name && (
                    <motion.div key={dataNote?.folder?.name} animate={{ scale: 1, height: 'auto' }} exit={{ scale: 0, height: 0 }} initial={{ scale: 0, height: 0 }} className="w-full">
                        <span className='text-xs text-gray-400'>Insert into folder</span>
                        <Button onClick={onRemoveFolder} variant="ghost" title={dataNote?.folder?.name} className="flex gap-3 items-center h-auto w-auto text-gray-700 bg-transparent border-none">
                            <FolderCheck size={40} />
                            <span className='line-clamp-1 text-sm'>{dataNote?.folder?.name}</span>
                            <X size={16} className="text-red-400" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
            <StateRender data={getFolderQuery.data} isLoading={getFolderQuery.isLoading} isError={getFolderQuery.isError}>
                <StateRender.Data>
                    <div className="flex flex-col gap-3 flex-1">
                        <p className='text-sm'>All folders</p>
                        <div className="grid grid-cols-3 gap-2">
                            {getFolderQuery.data?.map((folder) => {
                                if (folder?.id === dataNote?.folder?.id) return null;
                                if (!folder.title?.toLowerCase()?.includes(folderTitle?.toLowerCase() || "")) return null;
                                return (
                                    <Button onClick={onFolderClick(folder)} key={folder.id} variant="ghost" title={folder.title} className=" flex h-auto w-auto flex-col gap-1 items-center text-gray-400 bg-transparent border-none">
                                        <FolderOpen size={40} />
                                        <span className='line-clamp-1 text-xs w-full'>{folder.title}</span>
                                    </Button>
                                )
                            })}
                        </div>
                        {!getFolderQuery.data?.length && (
                            <div className="w-full flex items-center justify-center">
                                Make your first folder 😎
                            </div>
                        )}
                    </div>
                </StateRender.Data>
                <StateRender.Loading>
                    <p className='my-5'>Getting folder...</p>
                </StateRender.Loading>
                <StateRender.Error>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Something went wrong!</AlertTitle>
                        <AlertDescription>{(getFolderQuery.error as any)?.message}</AlertDescription>
                    </Alert>
                </StateRender.Error>
            </StateRender>
            {showButton && (
                <Button onClick={onClickSubmit} disabled={!dataNote?.folder?.name}>
                    Add to folder
                </Button>
            )}
        </motion.div>
    )
}
