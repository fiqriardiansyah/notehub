export interface Tag {
  id: string;
  text: string;
  flag: string;
  icon: string;
  isNew?: boolean;
  creatorId?: string;
}

export interface Note {
  id: string;
  title: string;
  note: {
    time: number;
    blocks: any[];
    version: string;
  };
  type: "freetext";
  createdAt: string;
  updatedAt: string;
  isSecure?: boolean;
  tags?: Tag[];
}

export interface CreateNote extends Omit<Note, "createdAt" | "updatedAt"> { }
