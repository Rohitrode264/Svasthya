# Zustand State Management Implementation

This document describes the Zustand state management implementation for the Svasthya application.

## Overview

The application uses Zustand for state management, providing a lightweight, modern, and efficient way to manage user profile data, statistics, and related information across components. Zustand is fully compatible with React 19 and provides excellent performance.

## Structure

### Store (`frontend/src/store/profileStore.ts`)
The main store contains:
- **State**: All profile-related data (profile, loading, message, stats, etc.)
- **Actions**: Async functions for API calls (fetchProfile, createProfile, etc.)
- **Setters**: Functions to update specific state values
- **Selectors**: Computed values derived from state

### Key Features
- **TypeScript Support**: Full type safety with interfaces
- **DevTools Integration**: Zustand devtools for debugging
- **Performance**: Only components using changed state re-render
- **Simplicity**: Clean, minimal API without boilerplate

## Usage Examples

### Basic Profile Data Access
```tsx
import { useProfileStore } from '../store/profileStore';

function UserGreeting() {
  const profile = useProfileStore(state => state.profile);
  const displayName = profile?.name || 'User';
  
  return <h1>Welcome, {displayName}!</h1>;
}
```

### Using Selectors
```tsx
import { useProfileSelectors } from '../store/profileStore';

function ProfileSummary() {
  const {
    profileExists,
    profileDisplayName,
    medicationCount,
    adherenceRate
  } = useProfileSelectors();

  // Use the computed values...
}
```

### Profile Management
```tsx
import { useProfileStore } from '../store/profileStore';

function ProfileComponent() {
  const {
    profile,
    loading,
    fetchProfile,
    updateProfile,
    showProfileCreation,
    createProfile
  } = useProfileStore();

  // Use the store functions...
}
```

### Profile Creation
When a user doesn't have a profile, the system automatically shows a profile creation form. The `showProfileCreation` state controls this behavior.

## Key Features

1. **Automatic Profile Creation**: If a user doesn't have a profile, the system shows a creation form
2. **Centralized State**: All profile-related data is managed in one place with Zustand
3. **Performance Optimized**: Only components using changed state re-render
4. **Type Safe**: Full TypeScript support prevents runtime errors
5. **Scalable**: Easy to add new state and computed values
6. **Developer Friendly**: Clean API with excellent debugging tools
7. **React 19 Compatible**: Works perfectly with the latest React version

## Migration from Recoil

The application was migrated from Recoil to Zustand for better React 19 compatibility and improved performance. Zustand provides:
- Better React 19 support
- Smaller bundle size
- Simpler API
- Better TypeScript integration
- Excellent devtools

## API Integration

The Zustand implementation integrates with the existing backend API:
- `POST /profiles` - Create new profile
- `GET /profiles/:userId/overview` - Fetch profile data
- `PUT /profiles/:userId` - Update profile
- `GET /profiles/:userId/stats` - Fetch statistics
- And more...

## Benefits

1. **Performance**: Zustand only re-renders components that use changed state
2. **Developer Experience**: Clean API and excellent debugging tools
3. **Scalability**: Easy to add new state and computed values
4. **Consistency**: Centralized state management prevents data inconsistencies
5. **Type Safety**: Full TypeScript support prevents runtime errors
6. **React 19 Compatible**: No compatibility issues with latest React
7. **Lightweight**: Smaller bundle size compared to other state management libraries
