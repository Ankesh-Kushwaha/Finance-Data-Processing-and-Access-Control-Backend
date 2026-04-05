# 📊 Finance Management API

Finance Data Processing and Access Control Backend

# For Testing use 
    https://finance-data-processing-and-access-i9ap.onrender.com/   instead of http://localhost:3000


## Extra things that i created in this assessment :=>
     *  Authentication using tokens (JWT-Based)
     * Pagination for record listing
     * API documentation
     * Search & Filtering
     * Soft delete functionality


----


## 🚀 Features

* 🔐 JWT Authentication (Register/Login)
* 👤 Role-Based Access Control (User / Analyst / Admin)
* 💰 Financial Records CRUD
* 📊 Dashboard Analytics (income, expense, trends)
* 🔍 Search & Filtering
* 📄 Pagination Support
* 🧠 MongoDB Aggregation (Advanced Analytics)

----

## 🏗️ Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication

----

## 🔐 Roles & Permissions

| Role    | Permissions                            |
| ------- | -------------------------------------- |
| user    | Manage own records                     |
| analyst | View all records + dashboard analytics |
| admin   | Full access (CRUD + user management)   |

Full API Documentation page => https://finance-dashboard-api-documentation-by-ankesh-kushwaha.docs.buildwithfern.com/finance-api/auth/register

----
##ALL available API end-points 

For testing can use admin access for 
email=abc123@gmail.com
password=abc123

Deployed url => https://finance-data-processing-and-access-i9ap.onrender.com/health (use for health check)

#for apis requested body format and response refer to the above given full api documentation page

    #Auth
      http://localhost:3000/api/auth/login, 
      http://localhost:3000/api/auth/register

     #user
       http://localhost:3000/api/user/get-all-user ,
       http://localhost:3000/api/user/get-a-single-user ,
       http://localhost:3000/api/user/change-role,
       http://localhost:3000/api/user/change-status

    #Finance Record CRUD Operation 
       http://localhost:3000/api/finance/create,
       http://localhost:3000/api/finance/get-all-record?page=2&limit=5&type=expense&createdAt=2026-04-04,
       http://localhost:3000/api/finance/get-single-record/69d184240290f154ce81843f,
       http://localhost:3000/api/finance/update-record/69d184530290f154ce818445,
       http://localhost:3000/api/finance/delete-record/69d184530290f154ce818445,

    #Dashboard Analytics Endpoint
      http://localhost:3000/api/dashboard/record/summary?startDate=2025-01-01&endDate=2025-12-31

    #Global Search with user query 
     http://localhost:3000/api/finance/search?page=2&limit=5   

## 🔄 System Flow (User Journey)

```text
[ Register ]
     ↓
[ Login → JWT Token ]
     ↓
[ Role Assigned ]

-----------------------------------------
USER
-----------------------------------------
- Create Record
- View Own Records
- Search Own Data

-----------------------------------------
ANALYST
-----------------------------------------
- View All Records
- Access Dashboard Analytics
- Filter Data

-----------------------------------------
ADMIN
-----------------------------------------
- All Analyst Permissions
- Update/Delete Any Record
- Manage Users (Role + Status)
```

----

## 🔐 Authentication APIs

## 📝 Register

POST /api/auth/register

### Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}


### Response

```json
{
  "success": true,
  "token": "JWT_TOKEN"
}


---

## 🔑 Login

POST /api/auth/login

### Body

```json
{
  "email": "john@example.com",
  "password": "123456"
}


---

## 👤 User Management APIs (Admin Only)

## 📌 Get All Users

GET /api/user/get-all-user

----

## 📌 Get Single User

GET /api/user/get-a-single-user/:id

----

## 🔄 Change User Role

PUT /api/user/change-role/:id

### Body

```json
{
  "role": "analyst"
}


---

## 🔒 Change User Status

PUT /api/user/change-status/:id

### Body

```json
{
  "status": "active"
}


---

## 💰 Financial Record APIs

## ➕ Create Record

POST /api/records

### Body

```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "note": "Monthly salary"
}


---

## 📄 Get All Records

GET /api/finance/get-all-record?page=1&limit=10&type=income

### Response

```json
{
  "success": true,
  "pagination": {
    "totalRecords": 20,
    "currentPage": 1,
    "totalPages": 2,
    "pageSize": 10
  },
  "data": []
}


---

## 🔍 Get Single Record

GET /api/finance/get-single-record/:id

----

## ✏️ Update Record (Admin Only)

PUT /api/finance/update-record/:id

----

## ❌ Delete Record (Admin Only)

DELETE /api/finance/delete-record/:id

----

## 🔍 Search API

GET /api/finance/search?page=1&limit=5&query=food&type=expense

### Features

* Keyword search (note, category)
* Filters (type, date, category)
* Pagination

----

## 📊 Dashboard Analytics API

GET /api/dashboard/record/summary

query example
"http://localhost:3000/api/dashboard/record/summary?startDate=2025-01-01&endDate=2025-12-31"


### Response

```json
{
  "success": true,
  "data": {
    "totalIncome": 170000,
    "totalExpense": 19400,
    "balance": 150600,
    "categoryBreakdown": [],
    "recentTransactions": [],
    "monthlyTrends": []
  }
}


---

## 🔐 Authorization Rules

| API                  | Access         |
| -------------------- | -------------- |
| Create Record        | user           |
| View Records         | user           |
| Search               | user           |
| Dashboard            | analyst, admin |
| Update/Delete Record | admin          |
| User Management      | admin          |

----

## 📦 Project Structure

backend
|
src
    ├── controllers
    ├── models
    ├── routes
    ├── middleware
    ├── config
    └── app.js


---

## ⚙️ Setup Instructions

```bash
git clone <your-repo-url>
cd backend
npm install
npm run dev

----

## ⭐ Final Note

This project demonstrates:

* Clean backend architecture
* Role-based security
* Advanced MongoDB aggregation
* Scalable API design

## 🔐 Authentication & Role-Based Access Flow

This system uses JWT-based authentication combined with Role-Based Access Control (RBAC) to secure APIs .

----

## 🔄 Complete Flow (Step-by-Step)


[ 1. User Registers ]
        ↓
User saved in DB with default role = "user"
        ↓
[ 2. User Login ]
        ↓
Server verifies credentials
        ↓
JWT Token Generated:
{
  id: user._id,
  role: user.role
}
        ↓
Client stores token (Postman / Frontend)
        ↓
--------------------------------------------------
[ 3. Request to Protected API ]
--------------------------------------------------
        ↓
Authorization Header:
Bearer <JWT_TOKEN>
        ↓
--------------------------------------------------
[ 4. Auth Middleware (protect) ]
--------------------------------------------------
- Extract token
- Verify token
- Decode payload
- Attach user to request

req.user = {
  id: "...",
  role: "user" | "analyst" | "admin"
}
        ↓
--------------------------------------------------
[ 5. Role Middleware (authorize) ]
--------------------------------------------------
- Check if user.role is allowed
- If not → 403 Forbidden
        ↓
--------------------------------------------------
[ 6. Controller Executes ]
--------------------------------------------------
- Applies role-based data filtering
- Returns response


---

## 🧠 Middleware Implementation Logic

## 🔐 Auth Middleware (protect)

```js
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = {
    id: decoded.id,
    role: decoded.role,
  };

  next();
};


---

## 🔒 Role Middleware (authorize)

```js
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
};


---

## 🔑 How Roles Are Assigned

### Default Role (On Register)

```js
role: "user"

----

### Admin Can Change Role

```http
PUT /api/user/change-role/:id

```json
{
  "role": "analyst"
}

👉 Roles available:

* `viewer`
* `analyst`
* `admin`

----

## 🔐 Role-Based Access Examples

### 👤 viewer

* Can create records
* Can view only own records


if (req.user.role === "user") {
  filter.createdBy = req.user.id;
}

---

### 📊 ANALYST

* Can view all records
* Can access dashboard analytics
---

### 🛠️ ADMIN

* Full system access
* Can:

  * create/Update/Delete any record
  * Manage users
  * Assign roles
----

## 🔥 Route Protection Example

router.get("/summary", protect, authorize("admin", "analyst"), getFinancialSummary);

router.put("/update-record/:id", protect, authorize("admin"), updateRecord);

router.delete("/delete-record/:id", protect, authorize("admin"), deleteRecord);

## 💡 Summary
* Authentication → verifies identity
* Authorization → controls access
* Middleware → enforces security
* Controllers → apply business logic

## 👨‍💻 Author

Ankesh Kushwaha
