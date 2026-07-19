import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit-table';

const prisma = new PrismaClient();
const app = express();
app.use(cors());

app.get('/students', async (req, res) => {
  const query = req.query.query as string || '';
  const students = await prisma.student.findMany({
    where: query ? {
      OR: [
        { first_name: { contains: query, mode: 'insensitive' } },
        { last_name: { contains: query, mode: 'insensitive' } },
        { registration_number: { contains: query, mode: 'insensitive' } }
      ] as any
    } : {}
  });
  res.json(students);
});

async function getTranscriptData(studentId: number) {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return null;

  const semesters = await prisma.semester.findMany({ orderBy: { order: 'asc' } });
  let total_points = 0;
  let total_credits = 0;
  const semester_records = [];

  for (const sem of semesters) {
    const grades = await prisma.grade.findMany({
      where: { student_id: studentId, semester_id: sem.id },
      include: { course: true }
    });

    if (grades.length === 0) continue;

    let sem_points = 0;
    let sem_credits = 0;

    for (const g of grades) {
      sem_points += g.grade_point * g.course.credits;
      sem_credits += g.course.credits;
    }

    const gpa = sem_credits > 0 ? sem_points / sem_credits : 0;
    total_points += sem_points;
    total_credits += sem_credits;

    semester_records.push({
      semester: sem,
      grades: grades,
      gpa: gpa
    });
  }

  const cgpa = total_credits > 0 ? total_points / total_credits : 0;

  return {
    student,
    semesters: semester_records,
    cgpa,
    total_credits
  };
}

app.get('/students/:id/transcript', async (req, res) => {
  const data = await getTranscriptData(parseInt(req.params.id));
  if (!data) return res.status(404).json({ error: 'Student not found' });
  res.json(data);
});

app.get('/students/:id/transcript/pdf', async (req, res) => {
  const data = await getTranscriptData(parseInt(req.params.id));
  if (!data) return res.status(404).json({ error: 'Student not found' });

  // @ts-ignore
  const doc = new PDFDocument({ margin: 30, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="transcript_${data.student.registration_number}.pdf"`);
  
  doc.pipe(res);

  doc.fontSize(20).text('SafeX Solutions - Marks Entry System', { align: 'center' });
  doc.fontSize(16).text('OFFICIAL ACADEMIC TRANSCRIPT', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Name: ${data.student.first_name} ${data.student.last_name}`);
  doc.text(`Reg No: ${data.student.registration_number}`);
  doc.text(`Major: ${data.student.major}`);
  doc.text(`Enrollment Year: ${data.student.enrollment_year}`);
  doc.moveDown(2);

  for (const semRec of data.semesters) {
    const tableData = {
      title: `${semRec.semester.name} (GPA: ${semRec.gpa.toFixed(2)})`,
      headers: [
        { label: "Course Code", property: 'code', width: 80 },
        { label: "Course Name", property: 'name', width: 220 },
        { label: "Credits", property: 'credits', width: 60 },
        { label: "Marks", property: 'marks', width: 80 },
        { label: "Grade", property: 'grade', width: 60 }
      ],
      datas: semRec.grades.map(g => ({
        code: g.course.code,
        name: g.course.name,
        credits: g.course.credits.toString(),
        marks: `${g.marks_obtained}/${g.max_marks}`,
        grade: g.grade_letter
      }))
    };

    await doc.table(tableData, {
      prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
      prepareRow: (row: any, indexColumn: any, indexRow: any, rectRow: any, rectCell: any) => {
        doc.font("Helvetica").fontSize(10);
      },
    });
    
    doc.moveDown(1);
  }

  doc.moveDown();
  doc.fontSize(14).font("Helvetica-Bold").text(`Cumulative GPA (CGPA): ${data.cgpa.toFixed(2)}`);
  doc.text(`Total Credits Earned: ${data.total_credits}`);

  doc.end();
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
