const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const mealPlanRoutes = require("./routes/mealPlanRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const env = require("./config/env");

const app = express();

if (env.nodeEnv === "production") {
	app.use(
		cors({
			origin: env.corsOrigin,
			methods: ["GET", "POST", "PUT", "DELETE"],
		})
	);
} else {
	app.use(cors());
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use(userRoutes);
app.use(inventoryRoutes);
app.use(recipeRoutes);
app.use(mealPlanRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
