import { Router } from 'express';
import { createStudent, deleteStudent, getStudentById, getStudents, getStudentStats, updateStudent } from '../controllers/studentController.js';

const router = Router();
router.get('/stats', getStudentStats);
router.route('/').get(getStudents).post(createStudent);
router.route('/:id').get(getStudentById).put(updateStudent).delete(deleteStudent);
export default router;
