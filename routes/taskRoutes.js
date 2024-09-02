const router = require("express").Router();
const Task = require("../models/taskModels");
const User = require("../models/userModels");
const { authentication } = require("./authRoutes");

//Create Task
router.post("/create-task", authentication, async (req, res) => {
  try {
    const { title, desc } = req.body;

    const { id } = req.headers;
    if (!title) {
      return res.status(400).json({ message: "Title is required!" });
    }
    if (!desc) {
      return res.status(400).json({ message: "Desc is required!" });
    }

    if (!id) {
      return res.status(400).json({ message: "ID is required!" });
    }
    const data = await Task.findOne(req.body);
    if (data) {
      return res.status(400).json({ message: "Already inserted" });
    }
    const newTask = new Task(req.body);
    const taskNew = await newTask.save();
    if (taskNew) {
      await User.findByIdAndUpdate(id, { $push: { tasks: taskNew._id } });
      return res.status(200).json({ message: "Create a new task" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error." });
  }
});

//Get all task
router.get("/get-all-task", authentication, async (req, res) => {
  try {
    const { id } = req.headers;

    const user = await User.findById(id).populate({
      path: "tasks",
      options: { sort: { createdAt: -1 } },
    });

    if (user) {
      return res.status(200).json({ message: "show all data", data: user });
    }
    return res.status(400).json({ message: "Not found." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error." });
  }
});

//delete Task
router.delete("/delete-task/:id", authentication, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.headers.id;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    // Check if the task was found and deleted
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    await User.findByIdAndUpdate(userId, { $pull: { tasks: taskId } });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error." });
  }
});

//update Task
router.put("/update-task/:id", authentication, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, desc } = req.body;
    await Task.findByIdAndUpdate(taskId, { title: title, desc: desc });
    return res.status(200).json({ message: "Task update successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error." });
  }
});

//Important Task
router.put("/important-task/:id", authentication, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    const taskData = task.important;
    await Task.findByIdAndUpdate(taskId, { important: !taskData });
    return res
      .status(200)
      .json({ message: "Important Task update successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error." });
  }
});

//Complete Task
router.put("/complete-task/:id", authentication, async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    const taskData = task.complete;

    await Task.findByIdAndUpdate(taskId, { complete: !taskData });
    return res
      .status(200)
      .json({ message: "Complete Task update successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error." });
  }
});

//Get inportant task
router.get("/get-imp-task", authentication, async (req, res) => {
  try {
    const { id } = req.headers;

    const user = await User.findById(id).populate({
      path: "tasks",
      match: { important: true },
      options: { sort: { createdAt: -1 } },
    });

    if (user) {
      const userData = user.tasks;
      return res.status(200).json({ message: "show all data", data: userData });
    }
    return res.status(400).json({ message: "Not found." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error." });
  }
});

//Get complete task
router.get("/get-complete-task", authentication, async (req, res) => {
  try {
    const { id } = req.headers;

    const user = await User.findById(id).populate({
      path: "tasks",
      match: { complete: true },
      options: { sort: { createdAt: -1 } },
    });

    if (user) {
      const userData = user.tasks;
      return res.status(200).json({ message: "show all data", data: userData });
    }
    return res.status(400).json({ message: "Not found." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error." });
  }
});

//Get in complete task
router.get("/get-incomplete-task", authentication, async (req, res) => {
  try {
    const { id } = req.headers;

    const user = await User.findById(id).populate({
      path: "tasks",
      match: { complete: false },
      options: { sort: { createdAt: -1 } },
    });

    if (user) {
      const userData = user.tasks;
      return res.status(200).json({ message: "show all data", data: userData });
    }
    return res.status(400).json({ message: "Not found." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Internal server error." });
  }
});

module.exports = router;
