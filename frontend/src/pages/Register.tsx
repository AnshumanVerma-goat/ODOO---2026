import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ApiRequestError } from '../api/client'
import { REGISTER_ROLE_OPTIONS } from '../config/registerRoles'
import { getDashboardPath } from '../config/roles'
import { useAuth } from '../context/AuthContext'
import { register as registerUser } from '../services/authService'

function BusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6v6" />
      <path d="M15 6v6" />
      <path d="M2 12h19.6" />
      <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
      <circle cx="7" cy="18" r="2" />
      <path d="M9 18h5" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE_PATTERN = /^\+?[\d\s\-()]{10,20}$/

function validateForm(fields: {
  firstName: string
  lastName: string
  mobileNumber: string
  role: string
  email: string
  password: string
  confirmPassword: string
}): string | null {
  const firstName = fields.firstName.trim()
  const lastName = fields.lastName.trim()

  if (!firstName) return 'First name is required.'
  if (!lastName) return 'Last name is required.'

  const fullName = `${firstName} ${lastName}`
  if (fullName.length < 2) return 'Full name must be at least 2 characters.'
  if (fullName.length > 150) return 'Full name must be 150 characters or fewer.'

  if (!fields.mobileNumber.trim()) return 'Mobile number is required.'
  if (!MOBILE_PATTERN.test(fields.mobileNumber.trim())) {
    return 'Enter a valid mobile number (at least 10 digits).'
  }

  if (!fields.role) return 'Please select a role.'

  const email = fields.email.trim()
  if (!email) return 'Email is required.'
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address.'

  if (!fields.password) return 'Password is required.'
  if (fields.password.length < 8) return 'Password must be at least 8 characters.'
  if (fields.password.length > 128) return 'Password must be 128 characters or fewer.'

  if (!fields.confirmPassword) return 'Please confirm your password.'
  if (fields.password !== fields.confirmPassword) return 'Passwords do not match.'

  return null
}

export function Register() {
  const { user, role, isInitializing } = useAuth()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isInitializing) {
    return null
  }

  if (user && role) {
    return <Navigate to={getDashboardPath(role)} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm({
      firstName,
      lastName,
      mobileNumber,
      role: selectedRole,
      email,
      password,
      confirmPassword,
    })

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      await registerUser({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
        role_name: selectedRole,
      })

      navigate('/login', {
        replace: true,
        state: { message: 'Account created successfully. Please sign in.' },
      })
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-panel login-panel--brand">
        <div className="login-brand-top">
          <div className="login-brand-icon">
            <BusIcon />
          </div>
          <div>
            <h1 className="login-brand-name">TransportOps</h1>
            <p className="login-brand-tagline">Smart Transport Operations Platform</p>
          </div>
        </div>

        <div className="login-brand-content">
          <h2 className="login-brand-headline">Join the fleet operations platform</h2>
          <p className="login-brand-desc">
            Create your account to manage trips, vehicles, safety compliance, and financial analytics in one place.
          </p>
        </div>
      </div>

      <div className="login-panel login-panel--form login-panel--form-scroll">
        <div className="login-form-wrap login-form-wrap--wide">
          <div className="login-form-header">
            <h2>Create account</h2>
            <p>Sign up for your TransportOps account</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="login-field-row">
              <div className="login-field">
                <label htmlFor="firstName">First Name</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><UserIcon /></span>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    autoComplete="given-name"
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="lastName">Last Name</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon"><UserIcon /></span>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><PhoneIcon /></span>
                <input
                  id="mobileNumber"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="role">Role</label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><BriefcaseIcon /></span>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select a role</option>
                  {REGISTER_ROLE_OPTIONS.map((option) => (
                    <option key={option.roleName} value={option.roleName}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="email">Email</label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><MailIcon /></span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@transportops.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><LockIcon /></span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="login-input-wrap">
                <span className="login-input-icon"><LockIcon /></span>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="login-footer-link">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
