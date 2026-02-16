# UW-Course-Overview
University of Washington course review and discussion web application that enables students to explore courses, read and write reviews, and participate in course-specific discussions. Built with a React frontend, Node.js/Express REST API, and MongoDB database using a client-server architecture.


# Project Description
University of Washington students frequently rely on official departmental course pages when planning their academic paths. While these pages provide standardized descriptions, prerequisites, and credit information, they rarely capture what a course is actually like from a student’s perspective. As a result, students often turn to fragmented sources such as Reddit threads, Discord servers, or word-of-mouth conversations to learn about workload, grading style, teaching quality, or overall difficulty. These informal sources are difficult to search, scattered across platforms, and often drift away from focused academic discussion.
Our application is designed specifically for current and prospective University of Washington students who are planning their schedules, choosing between courses, or mapping out their academic trajectory within a major. We envision students using this platform during registration periods or while exploring future quarters. These are moments when uncertainty about course expectations can create stress, hesitation, or poor planning decisions.
Students would use this application because it centralizes course-specific insight into a structured, searchable system. Rather than navigating long discussion threads or relying on anecdotal advice, users can access organized course pages that include student-written reviews, discussion threads, and practical details such as perceived difficulty, time commitment, grading structure, and teaching style. By anchoring conversations to individual courses, the platform ensures that feedback remains focused, relevant, and actionable.
As developers and UW students ourselves, we have personally experienced the frustration of enrolling in courses without understanding what they would truly involve beyond the catalog description. We have seen peers avoid classes due to uncertainty or misinformation. This project allows us to address a real problem within our academic community while building meaningful full-stack development skills. We are motivated not only to create a technically functional system, but also to design something that could realistically improve the course planning experience for students like us.


# Technical Description
# User Stories


# API Endpoints
## Courses:
GET /courses


Returns all courses.


GET /courses/:id


Returns detailed course information.
POST /courses
(Admin use) Adds a new course.
## Reviews:
GET /courses/:id/reviews
Returns reviews for a course.
POST /courses/:id/reviews
Creates a new review.
DELETE /reviews/:id
Deletes review.
## Threads:
GET /courses/:id/threads
Returns all threads for a course.
POST /courses/:id/threads
Creates new discussion thread.
## Comments:
GET /threads/:id/comments
Returns all comments in thread.
POST /threads/:id/comments
Adds comment to thread.
## Users:
POST /users/register
Create user account.
POST /users/login
Authenticate user.
# Database Schemas
Course Schema
{
  _id: ObjectId,
  department: String,
  courseNumber: String,
  title: String,
  description: String,
  credits: Number,
  syllabusLink: String
}

User Schema
{
  _id: ObjectId,
  username: String,
  email: String,
  passwordHash: String,
  createdAt: Date
}

Review Schema
{
  _id: ObjectId,
  courseId: ObjectId,
  userId: ObjectId,
  difficultyRating: Number,
  workloadRating: Number,
  overallRating: Number,
  reviewText: String,
  createdAt: Date
}

Thread Schema
{
  _id: ObjectId,
  courseId: ObjectId,
  title: String,
  createdBy: ObjectId,
  createdAt: Date
}

Comment Schema
{
  _id: ObjectId,
  threadId: ObjectId,
  userId: ObjectId,
  content: String,
  createdAt: Date
}



