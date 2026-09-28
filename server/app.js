// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { connectDB } from "./utils/connection.js";
// import authRouter from "./routes/auth-routes/index.js";
// import mediaRouter from "./routes/instructor-routes/media-routes.js";
// import instructorCourseRoutes from "./routes/instructor-routes/course-routes.js";
// import studentViewCourseRoutes from "./routes/student-routes/course-routes.js";
// import studentViewOrderRoutes from "./routes/student-routes/order-routes.js";
// import studentCoursesRoutes from "./routes/student-routes/student-courses-routes.js";
// import studentCourseProgressRoutes from "./routes/student-routes/course-progress-routes.js";
// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 5000;
// connectDB();
// app.use(express.json());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://e-lms-1.onrender.com",
//       "https://e-lms-delta.vercel.app"
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "DELETE", "PUT"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.use("/auth", authRouter);
// app.use("/media", mediaRouter);
// app.use("/instructor/course", instructorCourseRoutes);
// app.use("/student/course", studentViewCourseRoutes);
// app.use("/student/order", studentViewOrderRoutes);
// app.use("/student/courses-bought", studentCoursesRoutes);
// app.use("/student/course-progress", studentCourseProgressRoutes);
// app.get("/", (req, res) => {
//   res.send("123456");
// });
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: "Something went wrong!",
//     error: err.message,
//   });
// });
// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on port ${PORT}`);
// });

import dns from "dns";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./utils/connection.js";

import authRouter from "./routes/auth-routes/index.js";
import mediaRouter from "./routes/instructor-routes/media-routes.js";
import instructorCourseRoutes from "./routes/instructor-routes/course-routes.js";
import studentViewCourseRoutes from "./routes/student-routes/course-routes.js";
import studentViewOrderRoutes from "./routes/student-routes/order-routes.js";
import studentCoursesRoutes from "./routes/student-routes/student-courses-routes.js";
import studentCourseProgressRoutes from "./routes/student-routes/course-progress-routes.js";

// ======================================================
// ENV
// ======================================================

dotenv.config();

// ======================================================
// DNS
// ======================================================

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

// ======================================================
// APP
// ======================================================

const app = express();

const PORT = process.env.PORT || 3000;

// ======================================================
// CORS
// ======================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://e-lms-1.onrender.com",
  "https://e-lms-delta.vercel.app",
  "https://brainboostcom.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / mobile / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked:", origin);

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ======================================================
// BODY PARSER
// ======================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-LMS API is running 🚀",
    environment:
      process.env.NODE_ENV || "development",
  });
});

// ======================================================
// API ROUTES
// ======================================================

app.use("/auth", authRouter);

app.use("/media", mediaRouter);

app.use(
  "/instructor/course",
  instructorCourseRoutes
);

app.use(
  "/student/course",
  studentViewCourseRoutes
);

app.use(
  "/student/order",
  studentViewOrderRoutes
);

app.use(
  "/student/courses-bought",
  studentCoursesRoutes
);

app.use(
  "/student/course-progress",
  studentCourseProgressRoutes
);

// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  // CORS error
  if (err.message?.startsWith("CORS blocked")) {
    return res.status(403).json({
      success: false,
      message: "CORS policy blocked this request.",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// ======================================================
// START SERVER
// ======================================================

const startServer = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `🚀 Server is running on port ${PORT}`
      );

      console.log(
        `🌍 Environment: ${
          process.env.NODE_ENV || "development"
        }`
      );
    });
  } catch (error) {
    console.error(
      "❌ Failed to start server:",
      error.message
    );

    process.exit(1);
  }
};

startServer();

// ======================================================
// GRACEFUL SHUTDOWN
// ======================================================

const shutdown = async (signal) => {
  console.log(
    `\n🛑 ${signal} received. Shutting down...`
  );

  try {
    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Shutdown error:",
      error
    );

    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));