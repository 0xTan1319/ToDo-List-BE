import { Router } from "express";
import {
  clear,
  create,
  del,
  getList,
  getPartList,
  update,
} from "../controllers/taskController";
import { authMiddleware } from "../middlewares";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Task
 *   description: Task management API
 */

/**
 * @swagger
 * /api/v1/task:
 *   get:
 *     summary: Get all tasks
 *     tags: [Task]
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get("/", getList);

/**
 * @swagger
 * /api/v1/task/{id}:
 *   get:
 *     summary: Get a list of tasks based on status
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID for fetching tasks (all, active, completed)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Error occurred while fetching tasks
 */
router.get("/:id", getPartList);

/**
 * @swagger
 * /api/v1/task/new:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      description: Name of the task
 *                  isCompleted:
 *                      type: boolean
 *                      description: Task completion status
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request. Name is required.
 */
router.post("/new", authMiddleware, create);

/**
 * @swagger
 * /api/v1/task/update/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the task
 *               isCompleted:
 *                 type: boolean
 *                 description: Task completion status
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.put("/update/:id", authMiddleware, update);

/**
 * @swagger
 * /api/v1/task/delete/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 */
router.delete("/delete/:id", authMiddleware, del);

/**
 * @swagger
 * /api/v1/task/clear/{id}:
 *   delete:
 *     summary: Clear tasks based on status
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID for clearing tasks (all, active, completed)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully cleared tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Error occurred while clearing tasks
 */
router.delete("/clear/:id", authMiddleware, clear);

export default router;
