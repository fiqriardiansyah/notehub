"use client";

import StateRender from "@/components/state-render";
import { Button } from "@/components/ui/button";
import collabService from "@/service/collab";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
import { useSearchParams } from "next/navigation";

export default function Validate() {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const status = searchParams.get("status");

  const validateMutate = useQuery(
    [collabService.inviteValidate.name, token, status],
    async () => {
      return (await collabService.inviteValidate(token!, status!)).data.data;
    },
    {
      enabled: !!token && !!status,
      retry: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  if (!token || !status || (status !== "accepted" && status !== "rejected")) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Not found 404
      </div>
    );
  }

  const onClickToProject = () => {
    router.replace(`/write/${validateMutate.data?.noteId}`);
  };

  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <StateRender
        data={validateMutate.data}
        isLoading={validateMutate.isLoading}
        isError={validateMutate.isError}
      >
        <StateRender.Data>
          {validateMutate.data?.status === "accepted" ? (
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold">
                Wellcome to the project!
              </h1>
              <p className="m-0">
                You now are the collaborators in {validateMutate.data.noteTitle}{" "}
                as {validateMutate.data.role}
              </p>
              {session?.data?.user && (
                <Button onClick={onClickToProject} className="mt-5 w-fit">
                  Open project
                </Button>
              )}
            </div>
          ) : (
            <h1>Invitation Collabs Rejected</h1>
          )}
        </StateRender.Data>
        <StateRender.Loading>
          <h1>Validating...</h1>
        </StateRender.Loading>
        <StateRender.Error>
          <h1 className="text-red-500">
            {(validateMutate.error as any)?.message}
          </h1>
        </StateRender.Error>
      </StateRender>
    </div>
  );
}
