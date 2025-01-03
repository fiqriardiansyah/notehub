"use client";

import animationData from "@/asset/animation/convetti.json";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { defaultIcons, pause } from "@/lib/utils";
import { Tag } from "@/models/note";
import noteService from "@/service/note";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { icons } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import Lottie from "react-lottie";
import { z } from "zod";

const defaultOptions = {
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export type CreateTagProps = {};

export default function CreateTag({}: CreateTagProps) {
  const [icon, setIcon] = React.useState<string>();
  const [isSuccessCreate, setIsSuccessCreate] = React.useState(false);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    name: z
      .string()
      .min(3, {
        message: "Tag name must be at least 3 characters.",
      })
      .max(15, {
        message: "Maximal 15 characters",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const createTagMutate = useMutation(
    async (data: Partial<Tag>) => {
      return (await noteService.createTag(data)).data.data;
    },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: [noteService.getTag.name] });
        setIcon(undefined);
        form.reset();
        form.setValue("name", "");
        setIsSuccessCreate(true);
        await pause(5);
        setIsSuccessCreate(false);
      },
    }
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!icon) {
      form.setError("name", { message: "Icon required" });
      return;
    }
    const dataTag: Partial<Tag> = {
      flag: values.name.split(" ").join("-"),
      icon,
      text: values.name,
    };
    createTagMutate.mutate(dataTag);
  }

  const clickSubmit = () => {
    const fm = document.querySelector("#btn-form-submit") as HTMLButtonElement;
    if (fm) {
      fm?.click();
    }
  };

  const onClickIcon = (icon?: string) => {
    return () => {
      if (icon) {
        form.clearErrors("name");
      }
      setIcon(icon);
    };
  };

  const Icon = icons[icon as keyof typeof icons];

  return (
    <div className="h-full flex flex-col justify-between relative overflow-hidden">
      {isSuccessCreate && (
        <div className="absolute top-0 left-0 bottom-0 right-0 pointer-events-none">
          <Lottie options={defaultOptions} style={{ margin: 0 }} />
        </div>
      )}
      <div className="w-full overflow-x-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem autoFocus>
                  <FormControl autoFocus>
                    <div className="flex items-center gap-2">
                      <AnimatePresence>
                        {icon && (
                          <motion.div exit={{ scale: 0, width: 0 }} animate={{ scale: 1 }} initial={{ scale: 0 }} key={icon}>
                            <Button title={icon} size="icon">
                              <Icon />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <input
                        type="text"
                        placeholder="Tag Name"
                        {...field}
                        className="focus:outline-none capitalize max-w-[250px] focus:border-b focus:border-gray-400 border-none text-xl outline-none font-semibold"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button id="btn-form-submit" className="hidden">
              submit
            </button>
          </form>
        </Form>
        <div className="flex gap-2" style={{ flexWrap: "wrap", marginTop: "30px" }}>
          {defaultIcons.map((ic) => {
            const Icon = icons[ic as keyof typeof icons];
            if (ic === icon) return null;
            return (
              <Button onClick={onClickIcon(ic)} title={icon} variant="outline" size="icon-small" key={ic}>
                <Icon size={16} />
              </Button>
            );
          })}
        </div>
      </div>
      <div className="w-full flex items-center gap-2 mt-7 overflow-hidden overflow-y-hidden h-[40px]">
        <AnimatePresence mode="popLayout">
          {isSuccessCreate ? (
            <motion.div key="success" exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }} className="flex-1">
              <p className="text-lg font-semibold">Created tag 🔥🔥</p>
            </motion.div>
          ) : (
            <motion.div key="button" exit={{ opacity: 0 }} animate={{ opacity: 1 }} initial={{ opacity: 0 }} className="flex-1">
              <Button loading={createTagMutate.isLoading} onClick={clickSubmit} className="w-full">
                Create
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
