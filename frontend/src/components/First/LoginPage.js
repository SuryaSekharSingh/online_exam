// src/components/First/LoginPage.js
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './LoginPage.css'
import api from '../../services/api'

const LoginPage = () => {
  const { role } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await api.post(`/api/auth/${role}/login`, formData)
      const userId = res.data.user.id

      // Navigate to dynamic route based on role and user id
      navigate(`/${role}/dashboard/${userId}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="form-container">
      <h2>{role === 'teacher' ? 'Teacher' : 'Student'} Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  )
}

export default LoginPage
