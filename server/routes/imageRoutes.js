const express = require("express");
const router = express.Router();
const Image = require("../models/Image");
const { authenticateToken } = require("./userRoutes");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, folderId } = req.body;

      const result = await cloudinary.uploader
        .upload_stream({ resource_type: "image" }, async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res
              .status(500)
              .json({ message: "Failed to upload image to Cloudinary" });
          }
          const image = new Image({
            name,
            imageUrl: result.secure_url,
            folder: folderId,
            user: req.user.userId,
          });
          await image.save();
          res.status(201).json(image);
        })
        .end(req.file.buffer);
    } catch (error) {
      console.error("Route handler error:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/", authenticateToken, async (req, res) => {
  try {
    const images = await Image.find({ user: req.user.userId }).populate(
      "folder"
    );
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/search", authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const images = await Image.find({
      user: req.user.userId,
      name: { $regex: query, $options: "i" },
    }).populate("folder");
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/folder/:folderId", authenticateToken, async (req, res) => {
  try {
    const images = await Image.find({
      user: req.user.userId,
      folder: req.params.folderId,
    });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
