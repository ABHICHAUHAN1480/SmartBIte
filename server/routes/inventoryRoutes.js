const express = require("express");
const {
  getItems,
  createItem,
  deleteItem,
  updateItem,
  updateItemsDate,
} = require("../controllers/inventoryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/items").get(protect, getItems).post(protect, createItem).delete(protect, deleteItem).put(protect, updateItem);
router.put("/update-items", protect, updateItemsDate);

module.exports = router;
