"use client";

import SearchBar from "@/app/components/search-bar";
import { X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import useSkipFirstRender from "@/hooks/use-skip-first-render";
import searchService from "@/service/search";
import StateRender from "../state-render";
import { Skeleton } from "../ui/skeleton";
import Item from "./item";
import OtherItem from "./other-item";
import Lottie from "react-lottie";
import personSeatAnim from "@/asset/animation/person-seat.json";
import { pause } from "@/lib/utils";

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

    const searchMutate = useMutation(async (query?: string) => {
        await pause(0.3);
        return (await searchService.search(query)).data.data;
    });

    useSkipFirstRender(() => {
        const update = setTimeout(() => {
            if (!search.query.trim()) return;
            searchMutate.mutate(search.query);
        }, 300);

        return () => clearTimeout(update);
    }, [search.query]);

    const onChangeInputSearch = (e: any) => {
        const val = e.target.value;
        setSearch((prev) => ({ open: true, query: val }));
    }

    const onClose = () => {
        setSearch({ open: false, query: "" });
    }

    return (
        <>
            <SearchBar
                value={search.query}
                onChange={onChangeInputSearch}
                ref={inputSearchRef}
                placeholder="Find anything"
                containerProps={{ style: { zIndex: 51 } }}
            />
            {(search.open && search.query.trim()) && (
                <div tabIndex={0} className="w-screen h-screen fixed z-10 top-0 left-0 bg-white container-custom py-3">
                    <div className="w-full flex justify-end mb-6">
                        <Button onClick={onClose} size="icon-small" variant="ghost" title="close">
                            <X size={20} />
                        </Button>
                    </div>
                    <StateRender data={searchMutate.data} isLoading={searchMutate.isLoading} isError={searchMutate.isError}>
                        <StateRender.Data>
                            {(!searchMutate.data?.length && !searchMutate.isLoading) ?
                                <div className="w-full h-[40vh] flex items-center justify-center flex-col">
                                    <Lottie style={{ pointerEvents: 'none' }} options={defaultOptions} width={250} height={250} />
                                    <p className="text-xs text-center">Hmmm, there is nothing with {`"${search.query}"`}</p>
                                </div> :
                                <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-1 gap-2">
                                    {searchMutate.data?.map((item) => <Item key={item.id} item={item} />)}
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
                </div>
            )}
        </>
    )
}