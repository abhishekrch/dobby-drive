const express = require("express");
const router = express.Router();
const Folder = require("../models/Folder");
const { authenticateToken } = require("./userRoutes");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { name, parentFolder } = req.body;
    const folder = new Folder({
      name,
      parentFolder: parentFolder || null,
      user: req.user.userId,
    });
    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.userId });
    res.status(200).json(folders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.status(200).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
