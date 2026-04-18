const User = require("../models/User");
const Item = require("../models/Item");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/ApiError");
const { calculateDaysLeft } = require("../utils/dateUtils");

const getItems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).populate("items");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(user);
});

const createItem = asyncHandler(async (req, res) => {
  const { item, quantity, expire, id, unit } = req.body;

  const newItem = new Item({
    item,
    quantity,
    expire,
    unit,
    id,
    dayLeft: calculateDaysLeft(expire),
  });

  const user = await User.findById(req.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.items.push(newItem);
  await user.save();

  res.status(201).json(newItem);
});

const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.body;

  await User.findByIdAndUpdate(
    req.userId,
    { $pull: { items: { id } } },
    { new: true }
  );

  res.status(200).json({ message: "Item deleted successfully" });
});

const updateItem = asyncHandler(async (req, res) => {
  const { id, item, quantity, expire } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: req.userId, "items.id": id },
    {
      $set: {
        "items.$.item": item,
        "items.$.quantity": quantity,
        "items.$.expire": expire,
        "items.$.dayLeft": calculateDaysLeft(expire),
      },
    },
    { new: true }
  ).populate("items");

  if (!user) {
    throw new ApiError(404, "Item not found or unauthorized");
  }

  res.status(200).json({ message: "Item updated successfully", items: user.items });
});

const updateItemsDate = asyncHandler(async (req, res) => {
  const { previousdate } = req.body;

  const user = await User.findOneAndUpdate(
    { _id: req.userId },
    { $set: { previousdate } },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found or unauthorized");
  }

  res.status(200).json({
    message: "Date updated successfully",
    previousdate: user.previousdate,
  });
});

module.exports = { getItems, createItem, deleteItem, updateItem, updateItemsDate };
