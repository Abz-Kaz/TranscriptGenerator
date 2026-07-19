import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const sairam = await prisma.student.findFirst({
    where: { first_name: 'sairam' }
  })
  
  if (sairam) {
    await prisma.grade.updateMany({
      where: { student_id: sairam.id },
      data: {
        marks_obtained: 100.0,
        grade_letter: 'A',
        grade_point: 4.0
      }
    })
    console.log("Successfully updated Sairam's grades. His CGPA is now 4.0!")
  } else {
    console.log("Could not find a student named sairam.")
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
