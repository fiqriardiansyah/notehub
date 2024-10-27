import CheckboxCustom from "../ui/checkbox-custom";
import { useSelectToolBar } from "./provider";
import AddFolder from "./tools/add-folder";
import Delete from "./tools/delete";
import RemoveFolder from "./tools/remove-folder";

export type SelectToolbarProps = {
  tools: ("deleted" | "add_folder" | "remove_folder")[];
};

export default function SelectToolbar({ tools }: SelectToolbarProps) {
  const { toggleAllNote, isAllSelected, selectToolbar } = useSelectToolBar();

  return (
    <div className="w-full py-2 bg-white flex items-center justify-between gap-4">
      <div className="w-fit">
        <CheckboxCustom
          checked={isAllSelected}
          onChecked={toggleAllNote}
          label={
            <p className="">
              Select All ({selectToolbar?.selectedNotes?.length})
            </p>
          }
        />
      </div>
      <div className="flex gap-2 items-center">
        {tools.find((t) => t === "deleted") && <Delete />}
        {tools.find((t) => t === "add_folder") && <AddFolder />}
        {tools.find((t) => t === "remove_folder") && <RemoveFolder />}
      </div>
    </div>
  );
}
