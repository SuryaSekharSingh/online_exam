export const categorizeExams = (exams) => {
  const now = new Date();

  const live = [];
  const past = [];
  const upcoming = [];

  exams.forEach((exam) => {
    const start = new Date(exam.EXAM_TIME);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

    const formattedExam = {
      id: exam.EXAM_ID,
      title: exam.EXAM_NAME,
      startTime: start,
      endTime: end,
    };

    if (now >= start && now <= end && !exam.hasAttempted) {
      live.push(formattedExam);
    } else if (now < start) {
      upcoming.push(formattedExam);
    } else {
      past.push(formattedExam);
    }
  });

  return { live, past, upcoming };
};