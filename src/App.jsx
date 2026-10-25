
import { useState } from 'react'
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'

const USERS_KEY = 'leaveflow_demo_users'
const SESSION_KEY = 'leaveflow_demo_session'
const REQUESTS_KEY = 'leaveflow_demo_requests'

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function getUsers() {
  return readStorage(USERS_KEY, [])
}

function getRequests() {
  return readStorage(REQUESTS_KEY, [])
}

function saveRequests(requests) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
}

function Brand({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-200">
        L
      </div>
      <div>
        <p className={`text-xl font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
          LeaveFlow
        </p>
        <p className={`text-xs ${light ? 'text-slate-400' : 'text-slate-500'}`}>
          Leave management, simplified
        </p>
      </div>
    </Link>
  )
}

function Button({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  )
}

function Status({ status }) {
  const styles = {
    Pending: 'bg-amber-50 text-amber-700',
    Approved: 'bg-emerald-50 text-emerald-700',
    Rejected: 'bg-rose-50 text-rose-700',
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

function AuthLayout({ children, subtitle }) {
  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-slate-950 p-12 text-white lg:flex xl:p-16">
        <Brand light />
        <div className="max-w-lg">
          <span className="rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
            Your workplace, organized
          </span>
          <h1 className="mt-8 text-5xl font-black leading-tight">
            Time off should be the easiest part of work.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Apply for leave, track every request, and help your team plan ahead with one simple workspace.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-2xl font-bold">01</p>
              <p className="mt-2 text-sm text-slate-300">Submit your request</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-2xl font-bold">02</p>
              <p className="mt-2 text-sm text-slate-300">Track your decision</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500">LeaveFlow · Employee leave management</p>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Welcome to LeaveFlow
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
            {subtitle}
          </h2>
          <p className="mt-3 leading-6 text-slate-500">
            Manage your workplace leave requests in one place.
          </p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            Frontend demonstration. Secure production authentication will be added with the backend.
          </p>
        </div>
      </section>
    </main>
  )
}

function SignIn({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const user = getUsers().find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password,
    )

    if (!user) {
      setError('Invalid email or password. Please check your details or create an account.')
      return
    }

    onLogin(user)
    navigate(user.role === 'manager' ? '/manager' : '/dashboard', {
      replace: true,
    })
  }

  return (
    <AuthLayout subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </p>
        )}

        <Field
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <div className="space-y-2">
          <Field
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <label className="flex items-center gap-2 text-sm text-slate-500">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(event) => setShowPassword(event.target.checked)}
            />
            Show password
          </label>
        </div>

        <Button type="submit" className="w-full">
          Sign in to LeaveFlow →
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-800">
          Create account
        </Link>
      </p>
    </AuthLayout>
  )
}

function SignUp({ onLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    role: 'employee',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Your password must contain at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    const users = getUsers()
    const email = form.email.trim().toLowerCase()

    if (users.some((user) => user.email.toLowerCase() === email)) {
      setError('An account with this email already exists. Please sign in.')
      return
    }

    const user = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email,
      employeeId: form.employeeId.trim(),
      department: form.department,
      role: form.role,
      password: form.password,
    }

    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
    onLogin(user)

    navigate(user.role === 'manager' ? '/manager' : '/dashboard', {
      replace: true,
    })
  }

  return (
    <AuthLayout subtitle="Create your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </p>
        )}

        <Field
          label="Full name"
          name="name"
          placeholder="Your full name"
          value={form.name}
          onChange={update}
          autoComplete="name"
          required
        />

        <Field
          label="Work email"
          name="email"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={update}
          autoComplete="email"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Employee ID"
            name="employeeId"
            placeholder="EMP001"
            value={form.employeeId}
            onChange={update}
            required
          />

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Department</span>
            <select
              name="department"
              value={form.department}
              onChange={update}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none focus:border-indigo-500"
            >
              <option value="">Select</option>
              <option>IT</option>
              <option>Human Resources</option>
              <option>Finance</option>
              <option>Marketing</option>
              <option>Operations</option>
              <option>Other</option>
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-700">Account type</span>
          <select
            name="role"
            value={form.role}
            onChange={update}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager (demo only)</option>
          </select>
          <span className="block text-xs leading-5 text-slate-400">
            Role selection is for frontend testing only. The real application will assign and verify roles on the server.
          </span>
        </label>

        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={update}
          autoComplete="new-password"
          minLength={8}
          required
        />

        <Field
          label="Confirm password"
          name="confirmPassword"
          type="password"
          placeholder="Enter your password again"
          value={form.confirmPassword}
          onChange={update}
          autoComplete="new-password"
          minLength={8}
          required
        />

        <Button type="submit" className="w-full">
          Create account →
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already registered?{' '}
        <Link to="/signin" className="font-bold text-indigo-600 hover:text-indigo-800">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

function ProtectedRoute({ user, children, requiredRole }) {
  if (!user) {
    return <Navigate to="/signin" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'manager' ? '/manager' : '/dashboard'} replace />
  }

  return children
}

function AppShell({ user, onLogout, children }) {
  const links =
    user.role === 'manager'
      ? [{ to: '/manager', label: 'Overview', icon: '▦' }]
      : [
          { to: '/dashboard', label: 'Overview', icon: '▦' },
          { to: '/apply', label: 'Apply for leave', icon: '+' },
          { to: '/my-requests', label: 'My requests', icon: '▤' },
        ]

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="flex w-full flex-col bg-slate-950 px-5 py-6 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="mb-9">
          <Brand light />
        </div>

        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-500">
          Workspace
        </p>

        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto hidden border-t border-white/10 pt-5 md:block">
          <p className="text-xs text-slate-500">SIGNED IN AS</p>
          <p className="mt-2 truncate font-semibold">{user.name}</p>
          <p className="mt-1 text-sm capitalize text-slate-400">{user.role}</p>
          <button
            onClick={onLogout}
            className="mt-5 w-full rounded-xl border border-white/10 px-4 py-3 text-left text-sm text-slate-300 hover:bg-white/10"
          >
            ↪ Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-sm text-slate-500">Workspace / {user.role}</p>
            <p className="font-bold text-slate-900">{user.name}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-5 sm:p-8">{children}</main>

        <div className="border-t border-slate-200 px-5 py-4 text-center text-xs text-slate-400 md:hidden">
          <button onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </div>
  )
}

function PageTitle({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  )
}

function StatCard({ label, value, detail, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-xl font-bold ${colors[color]}`}>
        {color === 'indigo' ? '▦' : color === 'amber' ? '◷' : color === 'green' ? '✓' : '×'}
      </div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{detail}</p>
    </div>
  )
}

function RequestTable({ requests, manager = false, onDecision }) {
  if (!requests.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <p className="text-lg font-bold text-slate-800">Nothing here yet</p>
        <p className="mt-2 text-sm text-slate-500">
          Leave requests will appear here when they are submitted.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {manager && <th className="px-5 py-4">Employee</th>}
            <th className="px-5 py-4">Leave type</th>
            <th className="px-5 py-4">Dates</th>
            <th className="px-5 py-4">Days</th>
            <th className="px-5 py-4">Status</th>
            {manager && <th className="px-5 py-4">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.map((request) => (
            <tr key={request.id} className="hover:bg-slate-50/70">
              {manager && (
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-800">{request.employeeName}</p>
                  <p className="mt-1 text-xs text-slate-400">{request.department}</p>
                </td>
              )}
              <td className="px-5 py-4 font-medium text-slate-800">{request.type}</td>
              <td className="px-5 py-4 text-slate-600">
                {request.startDate} – {request.endDate}
              </td>
              <td className="px-5 py-4 text-slate-600">{request.days}</td>
              <td className="px-5 py-4"><Status status={request.status} /></td>
              {manager && (
                <td className="px-5 py-4">
                  {request.status === 'Pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onDecision(request.id, 'Approved')}
                        className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onDecision(request.id, 'Rejected')}
                        className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Reviewed</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmployeeDashboard({ user, requests }) {
  const mine = requests.filter((request) => request.userId === user.id)
  const pending = mine.filter((request) => request.status === 'Pending').length
  const approved = mine.filter((request) => request.status === 'Approved').length
  const rejected = mine.filter((request) => request.status === 'Rejected').length

  return (
    <>
      <PageTitle
        eyebrow="Employee workspace"
        title={`Welcome back, ${user.name.split(' ')[0]}!`}
        description="Here is an overview of your leave activity."
        action={
          <Link to="/apply" className="rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-bold text-white hover:bg-indigo-700">
            + Apply for leave
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total requests" value={mine.length} detail="All your submissions" />
        <StatCard label="Pending" value={pending} detail="Waiting for a decision" color="amber" />
        <StatCard label="Approved" value={approved} detail="Approved leave requests" color="green" />
        <StatCard label="Rejected" value={rejected} detail="Requests not approved" color="rose" />
      </div>

      <section className="mt-9">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent requests</h2>
          <Link to="/my-requests" className="text-sm font-bold text-indigo-600">View all →</Link>
        </div>
        <RequestTable requests={mine.slice().reverse().slice(0, 5)} />
      </section>
    </>
  )
}

function ApplyLeave({ user, onSubmit }) {
  const [form, setForm] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function submit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (form.endDate < form.startDate) {
      setError('The end date cannot be before the start date.')
      return
    }

    const start = new Date(`${form.startDate}T00:00:00`)
    const end = new Date(`${form.endDate}T00:00:00`)
    const days = Math.round((end - start) / 86400000) + 1

    onSubmit({
      id: crypto.randomUUID(),
      userId: user.id,
      employeeName: user.name,
      department: user.department,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days,
      reason: form.reason.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    })

    setMessage('Your leave request has been submitted.')
    setForm({ type: 'Annual Leave', startDate: '', endDate: '', reason: '' })
    window.setTimeout(() => navigate('/my-requests'), 900)
  }

  return (
    <>
      <PageTitle
        eyebrow="Employee workspace"
        title="Apply for leave"
        description="Complete the form below to send your request for review."
      />

      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
        {error && <p role="alert" className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
        {message && <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</p>}

        <form onSubmit={submit} className="space-y-6">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Leave type</span>
            <select
              name="type"
              value={form.type}
              onChange={update}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500"
            >
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Personal Leave</option>
              <option>Unpaid Leave</option>
              <option>Parental Leave</option>
            </select>
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Start date"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={update}
              min={new Date().toISOString().slice(0, 10)}
              required
            />
            <Field
              label="End date"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={update}
              min={form.startDate || new Date().toISOString().slice(0, 10)}
              required
            />
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Reason for leave</span>
            <textarea
              name="reason"
              rows={5}
              value={form.reason}
              onChange={update}
              placeholder="Briefly explain your request..."
              required
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="sm:flex-1">Submit request →</Button>
            <Link to="/dashboard" className="rounded-xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

function MyRequests({ user, requests }) {
  const mine = requests.filter((request) => request.userId === user.id)

  return (
    <>
      <PageTitle
        eyebrow="Employee workspace"
        title="My requests"
        description="Track the status of your submitted leave applications."
        action={
          <Link to="/apply" className="rounded-xl bg-indigo-600 px-5 py-3 text-center text-sm font-bold text-white">
            + New request
          </Link>
        }
      />
      <RequestTable requests={mine.slice().reverse()} />
    </>
  )
}

function ManagerDashboard({ requests, onDecision }) {
  const pending = requests.filter((request) => request.status === 'Pending').length
  const approved = requests.filter((request) => request.status === 'Approved').length
  const rejected = requests.filter((request) => request.status === 'Rejected').length

  function decide(id, status) {
    if (status === 'Rejected') {
      const reason = window.prompt('Enter a reason for rejecting this request:')
      if (reason === null) return
      onDecision(id, status, reason.trim())
      return
    }

    if (window.confirm('Approve this leave request?')) {
      onDecision(id, status, '')
    }
  }

  return (
    <>
      <PageTitle
        eyebrow="Manager workspace"
        title="Leave approvals"
        description="Review team leave requests and record your decisions."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="All requests" value={requests.length} detail="Across this demo workspace" />
        <StatCard label="Awaiting review" value={pending} detail="Require your attention" color="amber" />
        <StatCard label="Approved" value={approved} detail="Requests approved" color="green" />
        <StatCard label="Rejected" value={rejected} detail="Requests rejected" color="rose" />
      </div>

      <section className="mt-9">
        <h2 className="mb-4 text-lg font-bold text-slate-900">All employee requests</h2>
        <RequestTable
          requests={requests.slice().reverse()}
          manager
          onDecision={decide}
        />
      </section>
    </>
  )
}

function LandingPage({ user }) {
  if (user) {
    return <Navigate to={user.role === 'manager' ? '/manager' : '/dashboard'} replace />
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <Brand />
        <div className="flex items-center gap-3">
          <Link to="/signin" className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600">
            Sign in
          </Link>
          <Link to="/signup" className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700">
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            A simpler way to manage time off
          </span>
          <h1 className="mt-7 max-w-2xl text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Leave planning, <span className="text-indigo-600">without the paperwork.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
            Give employees a simple way to request leave and managers a clear way to review and approve it.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="rounded-xl bg-indigo-600 px-6 py-4 text-center font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
              Create your account →
            </Link>
            <Link to="/signin" className="rounded-xl border border-slate-200 px-6 py-4 text-center font-bold text-slate-700 hover:bg-slate-50">
              Sign in
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
            <span>✓ Leave request tracking</span>
            <span>✓ Manager approvals</span>
            <span>✓ Simple dashboard</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-indigo-100/70 blur-2xl" />
          <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Your workspace</p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Leave overview</h2>
              </div>
              <div className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700">Preview</div>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-indigo-50 p-4">
                <p className="text-xs text-indigo-700">Total</p>
                <p className="mt-2 text-2xl font-black text-indigo-900">12</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4">
                <p className="text-xs text-amber-700">Pending</p>
                <p className="mt-2 text-2xl font-black text-amber-900">04</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs text-emerald-700">Approved</p>
                <p className="mt-2 text-2xl font-black text-emerald-900">08</p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {[
                ['Annual leave', 'Oct 28 – Oct 30', 'Pending'],
                ['Personal leave', 'Nov 05 – Nov 05', 'Approved'],
                ['Sick leave', 'Nov 12 – Nov 13', 'Approved'],
              ].map(([type, dates, status]) => (
                <div key={type} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-4">
                  <div>
                    <p className="font-bold text-slate-800">{type}</p>
                    <p className="mt-1 text-xs text-slate-500">{dates}</p>
                  </div>
                  <Status status={status} />
                </div>
              ))}
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              Example preview · Your real requests appear after sign in
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50 px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Everything in one place</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
              Better for employees. Clearer for managers.
            </h2>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              ['01', 'Easy applications', 'Submit leave type, dates, and a reason in one simple form.'],
              ['02', 'Clear decisions', 'Managers can approve or reject requests and record a reason.'],
              ['03', 'Status tracking', 'Employees can see which requests are pending, approved, or rejected.'],
            ].map(([number, title, description]) => (
              <article key={number} className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-sm font-black text-indigo-600">{number}</p>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-7 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} LeaveFlow · Leave management made simpler.
      </footer>
    </main>
  )
}

export default function App() {
  const [user, setUser] = useState(() => readStorage(SESSION_KEY, null))
  const [requests, setRequests] = useState(getRequests)

  function login(nextUser) {
    setUser(nextUser)
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }

  function submitRequest(request) {
    const updated = [...getRequests(), request]
    saveRequests(updated)
    setRequests(updated)
  }

  function decideRequest(id, status, rejectionReason = '') {
    const updated = getRequests().map((request) =>
      request.id === id
        ? { ...request, status, rejectionReason, reviewedAt: new Date().toISOString() }
        : request,
    )
    saveRequests(updated)
    setRequests(updated)
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage user={user} />} />

      <Route
        path="/signin"
        element={user ? <Navigate to={user.role === 'manager' ? '/manager' : '/dashboard'} replace /> : <SignIn onLogin={login} />}
      />

      <Route
        path="/signup"
        element={user ? <Navigate to={user.role === 'manager' ? '/manager' : '/dashboard'} replace /> : <SignUp onLogin={login} />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} requiredRole="employee">
            <AppShell user={user} onLogout={logout}>
              <EmployeeDashboard user={user} requests={requests} />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/apply"
        element={
          <ProtectedRoute user={user} requiredRole="employee">
            <AppShell user={user} onLogout={logout}>
              <ApplyLeave user={user} onSubmit={submitRequest} />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-requests"
        element={
          <ProtectedRoute user={user} requiredRole="employee">
            <AppShell user={user} onLogout={logout}>
              <MyRequests user={user} requests={requests} />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <ProtectedRoute user={user} requiredRole="manager">
            <AppShell user={user} onLogout={logout}>
              <ManagerDashboard requests={requests} onDecision={decideRequest} />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
