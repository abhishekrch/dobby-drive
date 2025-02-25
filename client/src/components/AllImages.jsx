import React, { useState, useEffect } from "react";
import { getImages } from "../api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

function AllImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        const response = await getImages();
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching all images:", error);
      }
    };

    fetchAllImages();
  }, []);

  return (
    <div className="my-4">
      <h2 className="text-xl font-bold mb-4">All Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image._id}>
            <CardHeader>
              <CardTitle>{image.name}</CardTitle>
              <CardDescription>
                In folder: {image.folder ? image.folder.name : "Root"}
              </CardDescription>
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

export default AllImages;
