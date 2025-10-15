# Authentication Routes Documentation

This document outlines all the authentication routes available in the Svasthya frontend application.

## Route Structure

The application uses React Router v7 for client-side routing with the following structure:

```
/ (root)
├── /login (Sign In)
├── /signin (Alternative Sign In)
├── /signup (Sign Up)
├── /register (Alternative Sign Up)
├── /verify (Email Verification)
├── /verify-email (Alternative Email Verification)
├── /forgot-password (Forgot Password)
├── /reset-password (Reset Password)
├── /dashboard (Protected - Dashboard)
├── /profile (Protected - Profile)
├── /settings (Protected - Settings)
└── /* (404 - Not Found)
```

## Public Routes (Authentication)

### 1. Sign In Routes
- **Path**: `/login` or `/signin`
- **Component**: `SignIn`
- **Description**: User login form
- **Features**:
  - Email and password authentication
  - Form validation
  - Error handling
  - Redirect to dashboard on success
  - Links to forgot password and sign up

### 2. Sign Up Routes
- **Path**: `/signup` or `/register`
- **Component**: `SignUp`
- **Description**: User registration form
- **Features**:
  - Name, email, and password fields
  - Form validation
  - Email verification flow
  - Redirect to verification page on success
  - Link to sign in

### 3. Email Verification Routes
- **Path**: `/verify` or `/verify-email`
- **Component**: `SignUpVerification`
- **Description**: Email verification form
- **Features**:
  - Verification code input
  - Resend verification code
  - Redirect to login on success
  - Link back to sign up

### 4. Forgot Password Routes
- **Path**: `/forgot-password`
- **Component**: `ForgotPassword`
- **Description**: Password reset request form
- **Features**:
  - Email input for reset code
  - Redirect to reset password page
  - Link back to login

### 5. Reset Password Routes
- **Path**: `/reset-password`
- **Component**: `ForgotPasswordVerification`
- **Description**: Password reset form
- **Features**:
  - Verification code and new password inputs
  - Password confirmation
  - Redirect to login on success

## Protected Routes (Authenticated Users Only)

### 1. Dashboard
- **Path**: `/dashboard`
- **Component**: `Dashboard`
- **Description**: Main application dashboard
- **Protection**: Requires authentication
- **Features**:
  - Navigation bar
  - User welcome message
  - Main application content

### 2. Profile
- **Path**: `/profile`
- **Component**: `Profile`
- **Description**: User profile management
- **Protection**: Requires authentication
- **Features**:
  - Navigation bar
  - Profile settings
  - User information management

### 3. Settings
- **Path**: `/settings`
- **Component**: `Settings`
- **Description**: Application settings
- **Protection**: Requires authentication
- **Features**:
  - Navigation bar
  - Application configuration
  - User preferences

## Route Protection

The application implements route protection using:

1. **ProtectedRoute Component**: Wraps protected routes and redirects unauthenticated users
2. **useAuth Hook**: Provides authentication state and user information
3. **Authentication Check**: Based on localStorage token presence

## Navigation

### Public Navigation
- Links between auth pages (login ↔ signup, forgot password, etc.)
- Uses React Router `Link` components for client-side navigation

### Authenticated Navigation
- Navigation bar with links to dashboard, profile, and settings
- User welcome message with name display
- Logout functionality
- Responsive design with mobile support

## Default Behavior

- **Root Path (`/`)**: Redirects to `/dashboard` if authenticated, otherwise `/login`
- **404 Routes**: Shows custom 404 page with navigation back to appropriate route
- **Auth Routes**: Redirect to `/login` if accessed while authenticated

## File Structure

```
src/
├── routes/
│   ├── index.tsx          # Main app routes configuration
│   ├── authRoutes.tsx     # Authentication routes configuration
│   └── README.md          # This documentation
├── components/
│   ├── ProtectedRoute.tsx # Route protection component
│   └── Navigation.tsx     # Navigation component
└── pages/Auth/
    ├── SignIn.tsx
    ├── SignUp.tsx
    ├── SignUpVerification.tsx
    ├── ForgotPassword.tsx
    └── ForgotPasswordVarification.tsx
```

## Usage Examples

### Programmatic Navigation
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard'); // Navigate to dashboard
navigate('/login'); // Navigate to login
```

### Link Components
```tsx
import { Link } from 'react-router-dom';

<Link to="/signup">Sign Up</Link>
<Link to="/forgot-password">Forgot Password?</Link>
```

### Route Protection
```tsx
import { ProtectedRoute } from '../components/ProtectedRoute';

<ProtectedRoute isAuthenticated={isAuthenticated}>
  <YourComponent />
</ProtectedRoute>
```

## Authentication Flow

1. **Sign Up**: User registers → Email verification → Login
2. **Sign In**: User logs in → Dashboard
3. **Forgot Password**: User requests reset → Email code → Reset password → Login
4. **Logout**: User logs out → Login page

## Error Handling

- 404 pages for unknown routes
- Form validation and error messages
- Network error handling in API calls
- Graceful fallbacks for authentication failures
