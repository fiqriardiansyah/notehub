import ListFile from "@/components/file/list-file";
import ListImage from "@/components/file/list-image";
import { AnimatedTooltip, AnimatedTooltipItem } from "@/components/ui/animated-tooltip";
import { formatDate } from "@/lib/utils";
import noteService from "@/service/note";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { v4 as uuid } from "uuid";
import EditButton from "./components/edit-button";
import FreetextView from "./components/freetext";
import TodoListView from "./components/todo-list";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const id = params.id;

  const content = (await noteService.getNoteFromShareLink(id)).data.data;

  const previousImages = (await parent)?.openGraph?.images || [];

  return {
    title: content.title,
    openGraph: {
      images: [...previousImages],
    },
    description: `${content.title} projects by ${content.name}`,
  };
}

export default async function SharePage({ params }: Props) {
  const content = (await noteService.getNoteFromShareLink(params.id)).data.data;

  const collaborators =
    content?.collaborators?.map((c) => ({
      id: uuid(),
      name: c.name!,
      image: c.image!,
      designation: "collaborator",
    })) || [];

  return (
    <div className="container-read text-justify mt-[10vh]">
      <div className="mih-h-[80vh] w-full">
        <h1 className="text-2xl font-medium">{content.title}</h1>
        <EditButton note={content} />
        <div className="h-5"></div>
        {content.type === "freetext" && <FreetextView data={content?.note} />}
        {content.type === "todolist" && <TodoListView todos={content?.todos || []} />}
        {content?.imagesUrl?.length ? (
          <>
            <div className="h-6"></div>
            <ListImage defaultList={content?.imagesUrl} />
          </>
        ) : null}
        {content?.filesUrl?.length ? (
          <>
            <div className="h-6"></div>
            <ListFile defaultList={content?.filesUrl} />
          </>
        ) : null}
      </div>
      <div className="flex items-center gap-3 mt-10">
        <Image src={content.image || ""} alt={content.name!} width={40} height={40} className="rounded-full object-cover bg-gray-400" />
        <div className="flex flex-col gap-2">
          <p className="m-0 leading-none">{content.name}</p>
          <p className="m-0 leading-none text-xs text-gray-500">{`Last update ${formatDate(content.updatedAt)} ${
            content.updatedBy ? `By ${content.updatedBy}` : ""
          }`}</p>
        </div>
      </div>
      {collaborators?.length ? (
        <div className="mt-5">
          <h2>Collaborators</h2>
          <div className="flex items-center">
            <AnimatedTooltip size={40} items={collaborators as AnimatedTooltipItem[]} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
