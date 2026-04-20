Project Blueprint: QuickCommerce (Startup Edition)

1. Project Overview
QuickCommerce is a minimalist e-commerce platform where customers can place orders quickly without registration or login. The system automatically creates or updates user profiles based on phone numbers.

Goal:
- Fast order conversion
- Simple management system

Core Focus:
- User-friendly order form
- Clean admin dashboard

2. Technical Stack
Frontend:
- React.js
- Bootstrap 5
- Axios
- React Router DOM

Backend:
- Node.js
- Express.js

Database:
- MongoDB (Mongoose ODM)

Authentication:
- JWT (Admin only)

Image Hosting:
- Cloudinary

3. System Architecture

3.1 Customer Workflow
- Browse products from homepage
- Click "Order Now"
- Fill name, phone, address
- Backend checks user by phone:
  - If exists → update user
  - If not → create new user
- Order saved and success message shown

3.2 Admin Workflow
- Admin login with email/password
- View all orders
- Update order status (Pending → Delivered)
- Manage products (Add/Edit/Delete)

4. Database Schema

User:
- name
- phone (unique)
- address

Product:
- title
- price
- image
- description
- stock

Order:
- userId
- customerDetails
- orderItems
- totalAmount
- status

Admin:
- email
- password

5. API Endpoints

Customer:
- GET /api/products
- GET /api/products/:id
- POST /api/orders

Admin:
- POST /api/admin/login
- GET /api/admin/orders
- PUT /api/admin/orders/:id
- POST /api/admin/products
- DELETE /api/admin/products/:id

6. Folder Structure

/quick-commerce
  /backend
    /models
    /controllers
    /routes
    /middleware
    server.js

  /frontend
    /src
      /components
      /pages
      /api
      App.js
    index.html

  .env

7. Key Features
- Guest Checkout
- Auto User Update
- Responsive Design
- Order Status Tracking
- Secure Admin Panel

8. Future Roadmap
- OTP Verification
- bKash/Nagad Integration
- Customer Order Tracking (via phone login)
