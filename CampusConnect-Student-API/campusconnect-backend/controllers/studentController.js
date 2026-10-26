import mongoose from 'mongoose';
import Student from '../models/Student.js';

const allowedFields = ['name', 'email', 'phone', 'city', 'category'];
function cleanStudentInput(body) {
  const clean = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) clean[field] = body[field];
  }
  return clean;
}

// GET /api/students?search=&city=&category=&sort=asc&page=1&limit=5
export async function getStudents(req, res, next) {
  try {
    const { search = '', city = '', category = '', sort = 'asc' } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const requestedLimit = parseInt(req.query.limit, 10) || 5;
    const limit = [5, 10].includes(requestedLimit) ? requestedLimit : 5;
    const filter = {};

    if (search.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } }
      ];
    }
    if (city.trim()) filter.city = { $regex: `^${city.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' };
    if (category.trim()) filter.category = { $regex: `^${category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' };

    const sortOrder = sort.toLowerCase() === 'desc' ? -1 : 1;
    const [students, total] = await Promise.all([
      Student.find(filter).sort({ name: sortOrder, _id: 1 }).skip((page - 1) * limit).limit(limit),
      Student.countDocuments(filter)
    ]);
    res.status(200).json({
      success: true,
      message: 'Student records fetched successfully.',
      data: students,
      pagination: { totalRecords: total, currentPage: page, pageSize: limit, totalPages: Math.ceil(total / limit), hasNextPage: page * limit < total, hasPreviousPage: page > 1 }
    });
  } catch (error) { next(error); }
}

export async function getStudentById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid student ID format.' });
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.status(200).json({ success: true, data: student });
  } catch (error) { next(error); }
}

export async function createStudent(req, res, next) {
  try {
    if (!req.body || Array.isArray(req.body) || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, message: 'Send one student object as JSON.' });
    }
    const student = await Student.create(cleanStudentInput(req.body));
    res.status(201).json({ success: true, message: 'Student added successfully.', data: student });
  } catch (error) { next(error); }
}

export async function updateStudent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid student ID format.' });
    const updates = cleanStudentInput(req.body || {});
    if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: 'Provide at least one valid field to update.' });
    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.status(200).json({ success: true, message: 'Student updated successfully.', data: student });
  } catch (error) { next(error); }
}

export async function deleteStudent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid student ID format.' });
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    res.status(200).json({ success: true, message: 'Student deleted successfully.', data: { id: student._id, name: student.name } });
  } catch (error) { next(error); }
}

export async function getStudentStats(req, res, next) {
  try {
    const [totalStudents, cities, categories] = await Promise.all([
      Student.countDocuments(),
      Student.distinct('city'),
      Student.distinct('category')
    ]);
    res.status(200).json({ success: true, data: { totalStudents, totalCities: cities.length, totalCategories: categories.length, cities: cities.sort(), categories: categories.sort() } });
  } catch (error) { next(error); }
}
