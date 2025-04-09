// src/components/First/RegisterPage.js
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './RegisterPage.css'
import api from '../../services/api'

const RegisterPage = () => {
  const { role } = useParams()
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    contact: ''
  })

  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  })

  const [error, setError] = useState('')

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await api.post(`/api/${role}/signup`, {
        // ✅ Backend expects teacherData or studentData
        [`${role}Data`]: userData,
        addressData
      })

      const userId = res.data.userId || res.data[`${role}Id`] || res.data.id

      navigate(`/${role}/dashboard/${userId}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="form-container">
      <h2>{role === 'teacher' ? 'Teacher' : 'Student'} Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userData.name}
          onChange={handleUserChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleUserChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleUserChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={userData.contact}
          onChange={handleUserChange}
          required
        />

        {/* Address Fields */}
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={addressData.street}
          onChange={handleAddressChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={addressData.city}
          onChange={handleAddressChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={addressData.state}
          onChange={handleAddressChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={addressData.country}
          onChange={handleAddressChange}
          required
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={addressData.pincode}
          onChange={handleAddressChange}
          required
        />

        <button type="submit">Register</button>
        {error && <p className="error-msg">{error}</p>}
      </form>
    </div>
  )
}

export default RegisterPage
