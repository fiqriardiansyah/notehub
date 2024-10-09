"use client";

import personSeatAnim from "@/asset/animation/person-seat.json";
import SearchBar from "@/components/search-bar";
import { Command as CommandIcon } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut
} from "@/components/ui/command";
import { useMobileMediaQuery } from "@/hooks/responsive";
import useSkipFirstRender from "@/hooks/use-skip-first-render";
import { pause } from "@/lib/utils";
import searchService from "@/service/search";
import { useMutation } from "@tanstack/react-query";
import { CommandLoading } from "cmdk";
import { LoaderCircle, X } from "lucide-react";
import React from "react";
import Lottie from "react-lottie";
import StateRender from "../state-render";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import Item from "./item";
import OtherItem from "./other-item";
import { ShortCut } from "@/lib/shortcut";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: personSeatAnim,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

type SearchGlobalProps = {

}

export default function SearchGlobal({ }: SearchGlobalProps) {
    const [search, setSearch] = React.useState<{ open: boolean, query: string }>({ open: false, query: "" });
    const inputSearchRef = React.useRef<HTMLInputElement>(null);
    const isMobile = useMobileMediaQuery();

    const searchMutate = useMutation(async (query?: string) => {
        await pause(0.3);
        return (await searchService.search(query)).data.data;
    });

    useSkipFirstRender(() => {
        const update = setTimeout(() => {
            searchMutate.mutate(search.query?.trim() || "");
        }, 300);

        return () => clearTimeout(update);
    }, [search.query]);

    const onChangeInputSearch = (val: string) => {
        setSearch((prev) => ({ open: true, query: val }));
        if (inputSearchRef.current) {
            inputSearchRef?.current?.focus();
        }
    }

    const onClose = () => {
        setSearch({ open: false, query: "" });
    }

    const onShortcutFire = () => {
        setSearch((prev) => ({ open: !prev.open, query: "" }));
    }

    const searchResult = React.useMemo(() => (
        <>
            <StateRender data={searchMutate.data} isLoading={searchMutate.isLoading} isError={searchMutate.isError}>
                <StateRender.Data>
                    {(!searchMutate.data?.length && !searchMutate.isLoading) ?
                        <div className="w-full h-[40vh] flex items-center justify-center flex-col">
                            <Lottie style={{ pointerEvents: 'none' }} options={defaultOptions} width={250} height={250} />
                            <p className="text-xs text-center">Hmmm, there is nothing with {`"${search.query}"`}</p>
                        </div> :
                        <div className="w-full flex flex-col p-1 gap-2">
                            {searchMutate.data?.map((item) => <Item hasClicked={onClose} key={item.id} item={item} />)}
                        </div>}
                </StateRender.Data>
                <StateRender.Loading>
                    <div className="flex flex-col gap-2">
                        <Skeleton className="w-[270px] h-[20px]" />
                        <Skeleton className="w-[220px] h-[20px]" />
                        <Skeleton className="w-[250px] h-[20px]" />
                        <Skeleton className="w-[100px] h-[40px]" />
                        <Skeleton className="w-[200px] h-[20px]" />
                    </div>
                </StateRender.Loading>
                <StateRender.Error>
                    <p className="text-xs text-red-400">{(searchMutate.error as any)?.message}</p>
                </StateRender.Error>
            </StateRender>
            <OtherItem query={search.query} />
        </>
    ), [search, searchMutate]);

    return (
        <>
            <div className="flex items-center gap-3">
                <SearchBar
                    value={search.query}
                    onChange={(e) => onChangeInputSearch(e.target.value)}
                    placeholder="Find anything"
                    containerProps={{ style: { zIndex: 51 } }}
                />
                {!isMobile && (
                    <CommandShortcut shortcut={ShortCut.searchKey} onShortcutFire={onShortcutFire}>
                        <CommandIcon size={14} /> K
                    </CommandShortcut>
                )}
            </div>
            {(search.open && search.query.trim()) && isMobile && (
                <div tabIndex={0} className="w-screen h-screen fixed z-10 top-0 left-0 bg-white container-custom py-3">
                    <div className="w-full flex justify-end mb-6">
                        <Button onClick={onClose} size="icon-small" variant="ghost" title="close">
                            <X size={20} />
                        </Button>
                    </div>
                    {searchResult}
                </div>
            )}
            {!isMobile && (
                <Dialog open={search.open} onOpenChange={onClose}>
                    <DialogContent className="!p-0 !border-none">
                        <Command shouldFilter={false} filter={undefined} className="rounded-lg border shadow-md md:min-w-[450px]">
                            <CommandInput autoFocus value={search.query} onValueChange={onChangeInputSearch} placeholder="Find anything" />
                            <CommandList>
                                <StateRender data={searchMutate.data?.length} isLoading={searchMutate.isLoading} isError={searchMutate.isError} isEmpty={searchMutate.data?.length === 0}>
                                    <StateRender.Data>
                                        <CommandGroup heading="Suggestions">
                                            {searchMutate.data?.map((item) => <Item hasClicked={onClose} key={item.id} item={item} render={(item, onClick, Type) => {
                                                return (
                                                    <CommandItem key={item?.id} onSelect={onClick}>
                                                        <Type.icon size={20} strokeWidth={0.7} className="mr-2 h-4 w-4" />
                                                        <span>{item?.title}</span>
                                                    </CommandItem>
                                                )
                                            }} />)}
                                        </CommandGroup>
                                    </StateRender.Data>
                                    <StateRender.Loading>
                                        <CommandLoading>
                                            <CommandItem>
                                                <LoaderCircle className="mr-2 h-4 w-4" />
                                                <span>Getting result....</span>
                                            </CommandItem>
                                        </CommandLoading>
                                    </StateRender.Loading>
                                    <StateRender.Error>
                                        <CommandItem>
                                            <span className="text-red-500">{(searchMutate.error as Error)?.message}</span>
                                        </CommandItem>
                                    </StateRender.Error>
                                    <StateRender.Empty>
                                        <CommandEmpty>No results found.</CommandEmpty>
                                    </StateRender.Empty>
                                </StateRender>
                                <CommandSeparator />
                                <OtherItem query={search.query} render={(items) => (
                                    <CommandGroup heading="Other Suggestions">
                                        {items?.map((item) => {
                                            const Icon = item?.icon
                                            return (
                                                <Item hasClicked={onClose} key={item?.id} item={item} render={(it, onClick) => (
                                                    <CommandItem key={item?.id} onSelect={onClick}>
                                                        <Icon className="mr-2 h-4 w-4" />
                                                        <span>{item?.title}</span>
                                                    </CommandItem>
                                                )} />
                                            )
                                        })}
                                    </CommandGroup>
                                )} />
                            </CommandList>
                        </Command>
                    </DialogContent>
                </Dialog>
            )}
        </>
    )
}