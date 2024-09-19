"use client"

import StateRender from "@/components/state-render";
import collabService from "@/service/collab";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function Validate() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const status = searchParams.get("status");

    const validateMutate = useQuery([collabService.inviteValidate.name, token, status], async () => {
        return (await (collabService.inviteValidate(token!, status!))).data.data;
    }, {
        enabled: !!token && !!status,
        retry: false,
        refetchInterval: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    if (!token || !status) {
        return <div className="">
            Not found 404
        </div>
    }

    if (status !== "accepted" && status !== "rejected") {
        return <div className="">
            Not found 404
        </div>
    }

    return <div className="container-custom">
        <StateRender data={validateMutate.data} isLoading={validateMutate.isLoading} isError={validateMutate.isError}>
            <StateRender.Data>
                {validateMutate.data?.status === "accepted" ?
                    <h1 className="text-green-400">Wellcome to the project!</h1> :
                    <h1>Reject Invitation Collab</h1>}
            </StateRender.Data>
            <StateRender.Loading>
                <h1>Validating...</h1>
            </StateRender.Loading>
            <StateRender.Error>
                <h1 className="text-red-500">{(validateMutate.error as any)?.message}</h1>
            </StateRender.Error>
        </StateRender>
    </div>

}