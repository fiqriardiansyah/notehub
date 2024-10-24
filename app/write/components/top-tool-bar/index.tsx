import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import FileAttach from "./file-attach";
import ImageAttach from "./image-attach";

export default function TopToolBar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <FileAttach>
            {({ onClick }) => (
              <MenubarItem onSelect={onClick}>Attach File</MenubarItem>
            )}
          </FileAttach>
          <ImageAttach>
            {({ onClick }) => (
              <MenubarItem onSelect={onClick}>Attach Image</MenubarItem>
            )}
          </ImageAttach>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
