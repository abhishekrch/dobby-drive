import React, { useState } from "react";
import { createFolder } from "../api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";

function Folder({ folders, currentFolder, onFolderCreated, setCurrentFolder }) {
  const [newFolderName, setNewFolderName] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreateFolder = async () => {
    try {
      const folderData = {
        name: newFolderName,
        parentFolder: currentFolder,
      };
      const response = await createFolder(folderData);
      onFolderCreated(response.data);
      setNewFolderName("");
      setOpen(false);
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const displayedFolders = folders.filter(
    (folder) => folder.parentFolder === currentFolder
  );

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(true);
            }}
          >
            + New Folder
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogDescription>Enter the folder name.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateFolder}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-4 flex flex-wrap">
        {displayedFolders.map((folder) => (
          <div
            key={folder._id}
            className="p-2 m-2 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => setCurrentFolder(folder._id)}
          >
            📁 {folder.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Folder;
