import { model, Schema } from "mongoose";
import { ITask } from "../types";

const taskSchema = new Schema<ITask>({
  name: { type: String, require: true },
  isCompleted: { type: Boolean, default: false },
});

const Task = model<ITask>("task", taskSchema);

export default Task;
