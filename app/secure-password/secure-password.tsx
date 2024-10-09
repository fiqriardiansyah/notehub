"use client";

import StateRender from "@/components/state-render";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import noteService from "@/service/note";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type SecurePasswordProps = {
  onFinish?: () => void;
};

const SecurePassword = ({ onFinish }: SecurePasswordProps) => {
  const checkHasPassNote = useQuery(
    ["has-password"],
    async () => (await noteService.hasPasswordNote()).data.data
  );
  const setPasswordMutate = useMutation(
    ["set-password"],
    async (password: string) =>
      (await noteService.setPasswordNote(password)).data.data
  );
  const changePassswordMutate = useMutation(
    ["change-password"],
    async (data: { password: string; newPassword: string }) =>
      (
        await noteService.changePasswordNote({
          password: data.password,
          newPassword: data.newPassword,
        })
      ).data.data
  );

  const { toast } = useToast();

  const formSchema = z.object({
    password: z.string().min(5, {
      message: "Password must be at least 5 characters.",
    }),
    "password-repeat": z.string().min(5, {
      message: "Password repeat must be at least 5 characters.",
    }),
    ...{
      ...(checkHasPassNote.data
        ? {
          "old-password": z.string().min(5, {
            message: "Password must be at least 5 characters.",
          }),
        }
        : {}),
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password !== values["password-repeat"]) {
      form.setError(
        "password-repeat",
        { message: "Password not the same" },
        { shouldFocus: true }
      );
      return;
    }
    if (checkHasPassNote.data) {
      // change password
      if (values.password === values["old-password"]) {
        form.setError(
          "old-password",
          { message: "New Password can't be the same as old password" },
          { shouldFocus: true }
        );
        return;
      }
      changePassswordMutate
        .mutateAsync({
          password: values.password,
          newPassword: values["old-password"] as string,
        })
        .then(async () => {
          toast({
            title: "Success",
            description: (
              <p className="text-green-400">Password has been changed!</p>
            ),
          });
          if (onFinish) onFinish();
        });
      return;
    }
    setPasswordMutate.mutateAsync(values.password).then(async () => {
      toast({
        title: "Success",
        description: (
          <p className="text-green-400">Password has been created!</p>
        ),
      });
      if (onFinish) onFinish();
    });
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h2 className="font-semibold text-sm">
        {checkHasPassNote.data
          ? "Change Secure Password Note"
          : null}
      </h2>
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
                  {checkHasPassNote.data ? "New Password" : "Password"}
                </FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password-repeat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Repeat</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="type your password again"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <StateRender
            data={checkHasPassNote.data}
            isLoading={checkHasPassNote.isLoading}
          >
            <StateRender.Data>
              <FormField
                control={form.control}
                name="old-password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="your old password"
                        {...(field as any)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </StateRender.Data>
            <StateRender.Loading>
              <Skeleton className="w-[200px] h-[10px] rounded" />
              <Skeleton className="w-full h-[40px] rounded mt-3" />
            </StateRender.Loading>
          </StateRender>
          <Button
            loading={
              checkHasPassNote.isLoading ||
              setPasswordMutate.isLoading ||
              changePassswordMutate.isLoading
            }
            type="submit"
          >
            {checkHasPassNote.data ? "Change Password" : "Create Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SecurePassword;
