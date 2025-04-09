import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './ResultPage.css' // optional styling file
import api from '../../services/api';

const ResultPage = () => {
  const { examCode } = useParams()
  const [results, setResults] = useState([])
  const [examInfo, setExamInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`/api/exams/${examCode}/results`)
        const data = await res.json()
        setResults(data.results)
        setExamInfo(data.exam)
      } catch (err) {
        console.error('Error fetching result:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [examCode])

  if (loading) return <div className="result-container">Loading...</div>

  return (
    <div className="result-container">
      <h2>📊 Results for Exam: {examInfo?.title || examCode}</h2>
      <p><strong>Code:</strong> {examCode}</p>
      <p><strong>Total Marks:</strong> {examInfo?.totalMarks}</p>

      <table className="result-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Student</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {results?.sort((a, b) => b.marks - a.marks).map((r, i) => (
            <tr key={r.studentId}>
              <td>{i + 1}</td>
              <td>{r.studentName}</td>
              <td>{r.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResultPage
