import express from 'express';
import {
    createNewTask,
    getTask,
    updateTask,
    deleteTask,
    changeTaskStatus
} from '../controllers/tasksController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router()

router.post('/', checkAuth, createNewTask)
router.route('/:id').get(checkAuth, getTask).put(checkAuth, updateTask).delete(checkAuth, deleteTask)
router.post('/status/:id', checkAuth, changeTaskStatus)

export default router;