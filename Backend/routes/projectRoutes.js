import express from 'express';
import {
        fetchProjects,
        fetchProject,
        createNewProject,
        editProject,
        deleteProject,
        addCollaborator,
        deleteCollaborator,
        searchCollaborator,
    } from '../controllers/projectsController.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router()

router.route('/').get(checkAuth, fetchProjects).post(checkAuth, createNewProject)
router.route('/:id').get(checkAuth, fetchProject).put(checkAuth, editProject).delete(checkAuth, deleteProject)
router.post('/collaborators/:id', checkAuth, addCollaborator)
router.post('/collaborators', checkAuth, searchCollaborator)
router.post('/delete-collaborators/:id', checkAuth, deleteCollaborator)

export default router;