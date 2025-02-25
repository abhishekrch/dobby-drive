import React, { useState, useEffect } from "react";
import { getImagesByFolder, searchImages } from "../api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

function ImageList({ currentFolder }) {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchImages = async () => {
    try {
      let fetchedImages;
      if (searchQuery) {
        const response = await searchImages(searchQuery);
        fetchedImages = response.data;
      } else if (currentFolder) {
        const response = await getImagesByFolder(currentFolder);
        fetchedImages = response.data;
      } else {
        fetchedImages = [];
      }
      setImages(fetchedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [currentFolder, searchQuery]);

  const handleSearch = async () => {
    fetchImages();
  };
  return (
    <div className="my-4">
      <div className="flex items-center space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image._id}>
            <CardHeader>
              <CardTitle>{image.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={image.imageUrl}
                alt={image.name}
                className="w-full h-auto rounded-md"
              />
            </CardContent>
          </Card>
        ))}
      </div>
      {images.length === 0 && <p>No images found.</p>}
    </div>
  );
}

export default ImageList;
