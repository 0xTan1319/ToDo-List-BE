import { NextFunction, Request, Response } from "express";
import Task from "../models/Task";
import { logger } from "../config";

export const getList = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const tasks = await Task.find();
    return res.status(200).json(tasks);
  } catch (error) {
    logger.error("Error fetching tasks: %o", error);
    next(error);
  }
};

export const getPartList = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { id } = req.params;
  try {
    let tasks;
    if (id === "all") {
      tasks = await Task.find();
      return res.status(200).json(tasks);
    } else if (id === "active") {
      tasks = await Task.find({ isCompleted: false });
    } else if (id === "completed") {
      tasks = await Task.find({ isCompleted: true });
    } else {
      const error: any = new Error("Invalid ID provided");
      error.status(400);
      return next(error);
    }

    return res.status(200).json(tasks);
  } catch (error) {
    logger.error("Error fetching tasks: %o", error);
    next(error);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { name, isCompleted } = req.body;

  try {
    if (!name) {
      const error = new Error(`Name is required.`);
      res.status(400);
      return next(error);
    }

    const newTask = new Task({ name, isCompleted });
    await newTask.save();

    logger.info(`Created new task: ${name}`);
    return res.status(201).json(newTask);
  } catch (error) {
    logger.error("Error creating task: %o", error);
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { id } = req.params;
  const { name, isCompleted } = req.body;

  console.log("id", id);

  try {
    const task = await Task.findById(id);
    if (!task) {
      const error = new Error(`Task not found`);
      res.status(404);
      return next(error);
    }

    task.name = name ?? task.name;
    task.isCompleted = isCompleted ?? task.isCompleted;

    await task.save();
    logger.info(`Updated task: ${task.name}`);
    return res.status(200).json(task);
  } catch (error) {
    logger.error("Error updating task: %o", error);
    next(error);
  }
};

export const del = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      const error = new Error(`Task not found`);
      res.status(404);
      return next(error);
    }

    logger.info(`Deleted task: ${task.name}`);
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    logger.error("Error deleting task: %o", error);
    next(error);
  }
};

export const clear = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { id } = req.params;

  try {
    if (id === "all") {
      await Task.deleteMany({});
      return res
        .status(200)
        .json({ message: "All tasks deleted successfully" });
    }

    if (id === "active") {
      await Task.deleteMany({ isCompleted: false });
      return res
        .status(200)
        .json({ message: "All active tasks deleted successfully" });
    }

    if (id === "completed") {
      await Task.deleteMany({ isCompleted: true });
      return res
        .status(200)
        .json({ message: "All completed tasks deleted successfully" });
    }

    const error: any = new Error("Invalid ID provided");
    error.status(400);
    next(error);
  } catch (error) {
    logger.error("Error deleting task: %o", error);
    next(error);
  }
};
