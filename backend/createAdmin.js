const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin'); // আপনার অ্যাডমিন মডেলের পাথ
require('dotenv').config();

const createAdmin = async () => {
    try {
        // ১. ডাটাবেস কানেক্ট করা
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected for Admin Creation...");

        // ২. আপনি যে ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করতে চান তা এখানে লিখুন
        const adminEmail = "admin@snaporder.com"; // আপনার পছন্দমতো ইমেইল দিন
        const adminPassword = "admin123";       // আপনার পছন্দমতো পাসওয়ার্ড দিন

        // ৩. চেক করা হচ্ছে এই ইমেইলে আগে কোনো অ্যাডমিন আছে কি না
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin already exists with this email!");
            process.exit();
        }

        // ৪. পাসওয়ার্ড হ্যাস (Hash) করা (নিরাপত্তার জন্য)
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // ৫. নতুন অ্যাডমিন সেভ করা
        const newAdmin = new Admin({
            email: adminEmail,
            password: hashedPassword
        });

        await newAdmin.save();
        console.log("-----------------------------------------");
        console.log("✅ Admin Created Successfully!");
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log("-----------------------------------------");

        // কাজ শেষ হলে কানেকশন বন্ধ করে দেওয়া
        process.exit();
    } catch (error) {
        console.error("❌ Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();