# CampusConnect — Student Records REST API

A student CRUD backend made with Node.js, Express.js and MongoDB. The required assignment features are included, with extra validation, useful error responses, a stats endpoint and pagination metadata.

## Features
- Add, list, view, edit and delete student records
- Search by student name or email (case-insensitive)
- Filter by city and category
- Sort names A–Z (`sort=asc`) or Z–A (`sort=desc`)
- Pagination limited to 5 or 10 records per page
- Unique email validation, input validation and consistent JSON responses
- Extra endpoint: database summary at `/api/students/stats`

## Folder structure
```text
campusconnect-backend/
├── config/db.js
├── controllers/studentController.js
├── middleware/errorHandler.js
├── models/Student.js
├── routes/studentRoutes.js
├── postman/CampusConnect.postman_collection.json
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Run locally
1. Install Node.js LTS and make sure MongoDB is running locally, or create a MongoDB Atlas database.
2. Open this folder in VS Code.
3. Run `npm install` in the terminal.
4. Copy `.env.example` to a new file named `.env`.
5. Set `MONGODB_URI` in `.env`. Local example: `mongodb://127.0.0.1:27017/campusconnect`.
6. Run `npm run dev`.
7. Visit `http://localhost:5000` to check the API status.

Do not upload your real `.env` or database credentials to GitHub.

## API endpoints
Base URL: `http://localhost:5000/api/students`

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/students` | List, search, filter, sort and paginate |
| GET | `/api/students/:id` | Get one student |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |
| GET | `/api/students/stats` | Extra summary: totals, cities and categories |

### Example POST body (Postman → Body → raw → JSON)
```json
{
  "name": "Aarav Shah",
  "email": "aarav.shah@example.com",
  "phone": "9876543210",
  "city": "Surat",
  "category": "Backend Development"
}
```

### Query examples
- Search: `GET /api/students?search=aarav`
- Search email: `GET /api/students?search=example.com`
- City: `GET /api/students?city=Surat`
- Category: `GET /api/students?category=Backend%20Development`
- A–Z: `GET /api/students?sort=asc`
- Z–A: `GET /api/students?sort=desc`
- Page 2 with 5 rows: `GET /api/students?page=2&limit=5`
- Combined: `GET /api/students?search=aarav&city=Surat&sort=asc&page=1&limit=10`

If `limit` is omitted or invalid, the API uses 5. Search and filters can be combined.

## Test with Postman
Import `postman/CampusConnect.postman_collection.json` into Postman. Run the create request first, then copy the returned `_id` into the collection variable `studentId` for get/update/delete requests. The collection includes examples for all required endpoints and the extra stats endpoint.
