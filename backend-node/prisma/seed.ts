import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clear existing
  await prisma.grade.deleteMany()
  await prisma.course.deleteMany()
  await prisma.semester.deleteMany()
  await prisma.student.deleteMany()

  // Create Students
  const students = await Promise.all([
    prisma.student.create({ data: { registration_number: "REG2023001", first_name: "Haziq", last_name: "", email: "haziq@example.com", major: "Computer Science", enrollment_year: 2023 } }),
    prisma.student.create({ data: { registration_number: "REG2023002", first_name: "sairam", last_name: "", email: "sairam@example.com", major: "Software Engineering", enrollment_year: 2023 } }),
    prisma.student.create({ data: { registration_number: "REG2023003", first_name: "shozab", last_name: "", email: "shozab@example.com", major: "Data Science", enrollment_year: 2023 } }),
    prisma.student.create({ data: { registration_number: "REG2023004", first_name: "Zain", last_name: "", email: "zain@example.com", major: "Information Technology", enrollment_year: 2023 } }),
    prisma.student.create({ data: { registration_number: "REG2023005", first_name: "Abdullah", last_name: "", email: "abdullah@example.com", major: "Cyber Security", enrollment_year: 2023 } })
  ])

  // Create Semesters
  const semesters = await Promise.all([
    prisma.semester.create({ data: { name: "Fall 2023", order: 1 } }),
    prisma.semester.create({ data: { name: "Spring 2024", order: 2 } }),
    prisma.semester.create({ data: { name: "Fall 2024", order: 3 } }),
    prisma.semester.create({ data: { name: "Spring 2025", order: 4 } }),
  ])

  // Create Courses
  const courses = await Promise.all([
    prisma.course.create({ data: { code: "CS101", name: "Introduction to Programming", credits: 3 } }),
    prisma.course.create({ data: { code: "CS102", name: "Data Structures", credits: 4 } }),
    prisma.course.create({ data: { code: "MATH101", name: "Calculus I", credits: 3 } }),
    prisma.course.create({ data: { code: "ENG101", name: "English Composition", credits: 2 } }),
    prisma.course.create({ data: { code: "CS201", name: "Algorithms", credits: 4 } }),
    prisma.course.create({ data: { code: "DB101", name: "Database Systems", credits: 3 } }),
  ])

  // Assign Grades
  for (const student of students) {
    for (const sem of semesters) {
      // Randomly select 3 courses
      const semCourses = [...courses].sort(() => 0.5 - Math.random()).slice(0, 3)
      
      for (const course of semCourses) {
        let marks = Math.random() * (100 - 60) + 60
        let letter = 'D'
        let point = 1.0

        // Explicitly give sairam 100 marks and an 'A' grade for a 4.0 CGPA
        if (student.first_name === 'sairam') {
          marks = 100.0
          letter = 'A'
          point = 4.0
        } else {
          if (marks >= 90) { letter = 'A'; point = 4.0 }
          else if (marks >= 80) { letter = 'B'; point = 3.0 }
          else if (marks >= 70) { letter = 'C'; point = 2.0 }
        }

        await prisma.grade.create({
          data: {
            marks_obtained: parseFloat(marks.toFixed(1)),
            max_marks: 100.0,
            grade_letter: letter,
            grade_point: point,
            student_id: student.id,
            course_id: course.id,
            semester_id: sem.id
          }
        })
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
