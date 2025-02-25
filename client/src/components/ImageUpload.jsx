import React, { useState } from "react";
import { uploadImage } from "../api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

function ImageUpload({ currentFolder, onImageUploaded }) {
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !imageName || currentFolder === null) {
      alert(
        "Please select an image, provide a name, and ensure you are in a folder (not the root)."
      );
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("name", imageName);
    formData.append("folderId", currentFolder);

    try {
      const response = await uploadImage(formData);
      onImageUploaded(response.data);
      setImageFile(null);
      setImageName("");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4 space-y-4">
      <div>
        <Label htmlFor="name">Image Name</Label>
        <Input
          type="text"
          id="name"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          required
          className="w-full"
        />
      </div>
      <div>
        <Label htmlFor="file">Image File</Label>
        <Input
          type="file"
          id="file"
          onChange={handleFileChange}
          required
          className="w-full"
        />
      </div>
      <Button type="submit" disabled={uploading} variant="outline">
        {uploading ? "Uploading..." : "Upload Image"}
      </Button>
    </form>
  );
}

export default ImageUpload;
