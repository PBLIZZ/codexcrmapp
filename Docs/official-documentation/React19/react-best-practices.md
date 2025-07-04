# React Best Practices - Professional Development Standards

## Document Information
- **Name**: react-best-practices.mdc
- **Description**: Comprehensive best practices for React component development
- **File Patterns**: `**/*.{tsx,jsx}`
- **Always Apply**: true

## Executive Summary

This document establishes enterprise-grade React development standards focusing on functional components, modern hooks, performance optimization, and maintainable architecture. These practices ensure scalable, testable, and performant React applications that align with Model Context Protocol (MCP) requirements.

## 1. Component Architecture Standards

### 1.1 Functional Component Implementation

**Professional Component Structure:**
```typescript
// components/user-profile.tsx
import React, { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { User, Settings, Bell } from 'lucide-react'
import { Button } from '@codexcrm/ui/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@codexcrm/ui/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@codexcrm/ui/components/ui/card'

interface UserProfileProps {
  userId: string
  onProfileUpdate?: (user: UserData) => void
  showNotifications?: boolean
  className?: string
  'data-testid'?: string
}

interface UserData {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: UserPreferences
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
}

export const UserProfile = memo<UserProfileProps>(({
  userId,
  onProfileUpdate,
  showNotifications = true,
  className,
  'data-testid': testId = 'user-profile',
}) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data with error handling
  const fetchUserData = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/users/${id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`)
      }
      
      const userData = await response.json()
      setUser(userData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching user data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Effect for initial data loading
  useEffect(() => {
    if (userId) {
      fetchUserData(userId)
    }
  }, [userId, fetchUserData])

  // Memoized computed values
  const userInitials = useMemo(() => {
    if (!user?.name) return 'U'
    return user.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }, [user?.name])

  // Event handlers
  const handleSettingsClick = useCallback(() => {
    // Implementation for settings modal/page
    console.log('Opening settings for user:', userId)
  }, [userId])

  const handleNotificationToggle = useCallback(async () => {
    if (!user) return

    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        notifications: !user.preferences.notifications,
      },
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: updatedUser.preferences }),
      })

      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }

      setUser(updatedUser)
      onProfileUpdate?.(updatedUser)
    } catch (err) {
      console.error('Error updating preferences:', err)
      setError('Failed to update preferences')
    }
  }, [user, userId, onProfileUpdate])

  // Loading state
  if (isLoading) {
    return (
      <Card className={className} data-testid={`${testId}-loading`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="animate-pulse rounded-full bg-muted h-12 w-12" />
            <div className="space-y-2">
              <div className="animate-pulse bg-muted h-4 w-32 rounded" />
              <div className="animate-pulse bg-muted h-3 w-48 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card className={className} data-testid={`${testId}-error`}>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p className="font-medium">Error loading profile</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchUserData(userId)}
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No user data
  if (!user) {
    return (
      <Card className={className} data-testid={`${testId}-empty`}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-2" />
            <p>No user data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Success state
  return (
    <Card className={className} data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Profile</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSettingsClick}
          aria-label="Open settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={`${user.name}'s avatar`} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-medium leading-none">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {showNotifications && (
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Notifications</span>
            </div>
            <Button
              variant={user.preferences.notifications ? "default" : "outline"}
              size="sm"
              onClick={handleNotificationToggle}
            >
              {user.preferences.notifications ? 'On' : 'Off'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

UserProfile.displayName = 'UserProfile'

export default UserProfile
```

### 1.2 Custom Hook Implementation

**Professional Custom Hook Pattern:**
```typescript
// hooks/use-api.ts
import { useState, useEffect, useCallback, useRef } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  retryCount?: number
  retryDelay?: number
}

export function useApi<T = any>(
  url: string | null,
  options: UseApiOptions = {}
) {
  const {
    immediate = true,
    onSuccess,
    onError,
    retryCount = 3,
    retryDelay = 1000,
  } = options

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)

  const execute = useCallback(async (requestUrl?: string) => {
    const targetUrl = requestUrl || url
    if (!targetUrl) return

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(targetUrl, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      setState({
        data,
        loading: false,
        error: null,
      })

      onSuccess?.(data)
      retryCountRef.current = 0
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return // Request was cancelled
        }

        // Retry logic
        if (retryCountRef.current < retryCount) {
          retryCountRef.current++
          setTimeout(() => execute(targetUrl), retryDelay * retryCountRef.current)
          return
        }

        setState({
          data: null,
          loading: false,
          error: error.message,
        })

        onError?.(error)
      }
    }
  }, [url, onSuccess, onError, retryCount, retryDelay])

  const retry = useCallback(() => {
    retryCountRef.current = 0
    execute()
  }, [execute])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
    retryCountRef.current = 0
  }, [])

  useEffect(() => {
    if (immediate && url) {
      execute()
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [url, immediate, execute])

  return {
    ...state,
    execute,
    retry,
    reset,
  }
}
```

## 2. State Management Patterns

### 2.1 Context API Implementation

**Professional Context Setup:**
```typescript
// contexts/theme-context.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  systemTheme: 'light' | 'dark'
}

type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_SYSTEM_THEME'; payload: 'light' | 'dark' }

interface ThemeContextValue extends ThemeState {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_THEME':
      const newTheme = action.payload
      const resolvedTheme = newTheme === 'system' ? state.systemTheme : newTheme
      return {
        ...state,
        theme: newTheme,
        resolvedTheme,
      }
    case 'SET_SYSTEM_THEME':
      return {
        ...state,
        systemTheme: action.payload,
        resolvedTheme: state.theme === 'system' ? action.payload : state.resolvedTheme,
      }
    default:
      return state
  }
}

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'app-theme',
}: ThemeProviderProps) {
  const [state, dispatch] = useReducer(themeReducer, {
    theme: defaultTheme,
    resolvedTheme: 'light',
    systemTheme: 'light',
  })

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      dispatch({ type: 'SET_THEME', payload: savedTheme })
    }
  }, [storageKey])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch({
        type: 'SET_SYSTEM_THEME',
        payload: e.matches ? 'dark' : 'light',
      })
    }

    // Set initial system theme
    dispatch({
      type: 'SET_SYSTEM_THEME',
      payload: mediaQuery.matches ? 'dark' : 'light',
    })

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(state.resolvedTheme)
  }, [state.resolvedTheme])

  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKey, theme)
    dispatch({ type: 'SET_THEME', payload: theme })
  }

  const toggleTheme = () => {
    const newTheme = state.resolvedTheme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const value: ThemeContextValue = {
    ...state,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

### 2.2 Advanced State Management with useReducer

**Complex State Management Pattern:**
```typescript
// hooks/use-form-state.ts
import { useReducer, useCallback, useMemo } from 'react'

interface FormField {
  value: any
  error?: string
  touched: boolean
  dirty: boolean
}

interface FormState<T extends Record<string, any>> {
  fields: Record<keyof T, FormField>
  isSubmitting: boolean
  submitError?: string
  isValid: boolean
}

type FormAction<T extends Record<string, any>> =
  | { type: 'SET_FIELD_VALUE'; field: keyof T; value: any }
  | { type: 'SET_FIELD_ERROR'; field: keyof T; error?: string }
  | { type: 'SET_FIELD_TOUCHED'; field: keyof T; touched: boolean }
  | { type: 'SET_SUBMITTING'; submitting: boolean }
  | { type: 'SET_SUBMIT_ERROR'; error?: string }
  | { type: 'RESET_FORM'; initialValues: T }
  | { type: 'VALIDATE_ALL_FIELDS' }

interface ValidationRule<T> {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: T) => string | undefined
}

interface UseFormStateOptions<T extends Record<string, any>> {
  initialValues: T
  validationRules?: Partial<Record<keyof T, ValidationRule<any>>>
  onSubmit?: (values: T) => Promise<void> | void
}

function createFormReducer<T extends Record<string, any>>() {
  return (state: FormState<T>, action: FormAction<T>): FormState<T> => {
    switch (action.type) {
      case 'SET_FIELD_VALUE':
        return {
          ...state,
          fields: {
            ...state.fields,
            [action.field]: {
              ...state.fields[action.field],
              value: action.value,
              dirty: true,
            },
          },
        }

      case 'SET_FIELD_ERROR':
        return {
          ...state,
          fields: {
            ...state.fields,
            [action.field]: {
              ...state.fields[action.field],
              error: action.error,
            },
          },
        }

      case 'SET_FIELD_TOUCHED':
        return {
          ...state,
          fields: {
            ...state.fields,
            [action.field]: {
              ...state.fields[action.field],
              touched: action.touched,
            },
          },
        }

      case 'SET_SUBMITTING':
        return {
          ...state,
          isSubmitting: action.submitting,
        }

      case 'SET_SUBMIT_ERROR':
        return {
          ...state,
          submitError: action.error,
          isSubmitting: false,
        }

      case 'RESET_FORM':
        const resetFields: Record<keyof T, FormField> = {} as any
        Object.keys(action.initialValues).forEach(key => {
          resetFields[key as keyof T] = {
            value: action.initialValues[key as keyof T],
            touched: false,
            dirty: false,
          }
        })
        return {
          fields: resetFields,
          isSubmitting: false,
          submitError: undefined,
          isValid: true,
        }

      default:
        return state
    }
  }
}

export function useFormState<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormStateOptions<T>) {
  const reducer = useMemo(() => createFormReducer<T>(), [])

  const initialState: FormState<T> = useMemo(() => {
    const fields: Record<keyof T, FormField> = {} as any
    Object.keys(initialValues).forEach(key => {
      fields[key as keyof T] = {
        value: initialValues[key as keyof T],
        touched: false,
        dirty: false,
      }
    })

    return {
      fields,
      isSubmitting: false,
      isValid: true,
    }
  }, [initialValues])

  const [state, dispatch] = useReducer(reducer, initialState)

  // Validation function
  const validateField = useCallback((field: keyof T, value: any): string | undefined => {
    const rules = validationRules[field]
    if (!rules) return undefined

    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return 'This field is required'
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      return `Minimum length is ${rules.minLength} characters`
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      return `Maximum length is ${rules.maxLength} characters`
    }

    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return 'Invalid format'
    }

    if (rules.custom) {
      return rules.custom(value)
    }

    return undefined
  }, [validationRules])

  // Field handlers
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    dispatch({ type: 'SET_FIELD_VALUE', field, value })
    
    // Validate immediately if field was touched
    if (state.fields[field]?.touched) {
      const error = validateField(field, value)
      dispatch({ type: 'SET_FIELD_ERROR', field, error })
    }
  }, [state.fields, validateField])

  const setFieldTouched = useCallback((field: keyof T, touched = true) => {
    dispatch({ type: 'SET_FIELD_TOUCHED', field, touched })
    
    if (touched) {
      const error = validateField(field, state.fields[field].value)
      dispatch({ type: 'SET_FIELD_ERROR', field, error })
    }
  }, [state.fields, validateField])

  // Form handlers
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()

    // Validate all fields
    let hasErrors = false
    const values: Partial<T> = {}

    Object.keys(state.fields).forEach(key => {
      const field = key as keyof T
      const value = state.fields[field].value
      const error = validateField(field, value)
      
      if (error) {
        hasErrors = true
        dispatch({ type: 'SET_FIELD_ERROR', field, error })
      } else {
        values[field] = value
      }
      
      dispatch({ type: 'SET_FIELD_TOUCHED', field, touched: true })
    })

    if (hasErrors) {
      return
    }

    if (!onSubmit) {
      return
    }

    dispatch({ type: 'SET_SUBMITTING', submitting: true })
    dispatch({ type: 'SET_SUBMIT_ERROR', error: undefined })

    try {
      await onSubmit(values as T)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      dispatch({ type: 'SET_SUBMIT_ERROR', error: errorMessage })
    } finally {
      dispatch({ type: 'SET_SUBMITTING', submitting: false })
    }
  }, [state.fields, validateField, onSubmit])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET_FORM', initialValues })
  }, [initialValues])

  // Computed values
  const values = useMemo(() => {
    const result: Partial<T> = {}
    Object.keys(state.fields).forEach(key => {
      result[key as keyof T] = state.fields[key as keyof T].value
    })
    return result as T
  }, [state.fields])

  const errors = useMemo(() => {
    const result: Partial<Record<keyof T, string>> = {}
    Object.keys(state.fields).forEach(key => {
      const field = key as keyof T
      if (state.fields[field].error) {
        result[field] = state.fields[field].error
      }
    })
    return result
  }, [state.fields])

  const isValid = useMemo(() => {
    return Object.values(state.fields).every(field => !field.error)
  }, [state.fields])

  const isDirty = useMemo(() => {
    return Object.values(state.fields).some(field => field.dirty)
  }, [state.fields])

  return {
    values,
    errors,
    isValid,
    isDirty,
    isSubmitting: state.isSubmitting,
    submitError: state.submitError,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    reset,
    getFieldProps: (field: keyof T) => ({
      value: state.fields[field]?.value ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
        setFieldValue(field, e.target.value),
      onBlur: () => setFieldTouched(field, true),
      error: state.fields[field]?.touched ? state.fields[field]?.error : undefined,
    }),
  }
}
```

## 3. Performance Optimization Techniques

### 3.1 Memoization Strategies

**Professional Memoization Implementation:**
```typescript
// components/data-table.tsx
import React, { memo, useMemo, useCallback, useState } from 'react'

interface DataItem {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  lastLogin: Date
}

interface DataTableProps {
  data: DataItem[]
  onItemSelect?: (item: DataItem) => void
  onBulkAction?: (action: string, items: DataItem[]) => void
  searchTerm?: string
  sortBy?: keyof DataItem
  sortOrder?: 'asc' | 'desc'
}

// Memoized row component to prevent unnecessary re-renders
const DataRow = memo<{
  item: DataItem
  isSelected: boolean
  onSelect: (item: DataItem) => void
  onToggleSelect: (id: string) => void
}>(({ item, isSelected, onSelect, onToggleSelect }) => {
  const handleRowClick = useCallback(() => {
    onSelect(item)
  }, [item, onSelect])

  const handleCheckboxChange = useCallback(() => {
    onToggleSelect(item.id)
  }, [item.id, onToggleSelect])

  return (
    <tr 
      className={`hover:bg-muted/50 cursor-pointer ${isSelected ? 'bg-muted' : ''}`}
      onClick={handleRowClick}
    >
      <td className="p-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          className="rounded"
        />
      </td>
      <td className="p-3 font-medium">{item.name}</td>
      <td className="p-3 text-muted-foreground">{item.email}</td>
      <td className="p-3">
        <span className={`px-2 py-1 rounded-full text-xs ${
          item.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {item.status}
        </span>
      </td>
      <td className="p-3 text-muted-foreground">
        {item.lastLogin.toLocaleDateString()}
      </td>
    </tr>
  )
})

DataRow.displayName = 'DataRow'

export const DataTable = memo<DataTableProps>(({
  data,
  onItemSelect,
  onBulkAction,
  searchTerm = '',
  sortBy = 'name',
  sortOrder = 'asc',
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filteredData = data

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      let comparison = 0
      if (aValue < bValue) comparison = -1
      else if (aValue > bValue) comparison = 1
      
      return sortOrder === 'desc' ? -comparison : comparison
    })
  }, [data, searchTerm, sortBy, sortOrder])

  // Memoized selection handlers
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSelection = new Set(prev)
      if (newSelection.has(id)) {
        newSelection.delete(id)
      } else {
        newSelection.add(id)
      }
      return newSelection
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === processedData.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(processedData.map(item => item.id)))
    }
  }, [processedData, selectedItems.size])

  const handleItemSelect = useCallback((item: DataItem) => {
    onItemSelect?.(item)
  }, [onItemSelect])

  // Memoized bulk action handler
  const handleBulkAction = useCallback((action: string) => {
    const selectedData = data.filter(item => selectedItems.has(item.id))
    onBulkAction?.(action, selectedData)
  }, [data, selectedItems, onBulkAction])

  // Memoized computed values
  const isAllSelected = useMemo(() => 
    processedData.length > 0 && selectedItems.size === processedData.length,
    [processedData.length, selectedItems.size]
  )

  const isIndeterminate = useMemo(() => 
    selectedItems.size > 0 && selectedItems.size < processedData.length,
    [selectedItems.size, processedData.length]
  )

  return (
    <div className="border rounded-lg">
      {selectedItems.size > 0 && (
        <div className="p-4 bg-muted border-b flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
          </span>
          <div className="space-x-2">
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded"
            >
              Delete
            </button>
            <button
              onClick={() => handleBulkAction('export')}
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded"
            >
              Export
            </button>
          </div>
        </div>
      )}

      <table className="w-full">
        <thead className="border-b">
          <tr>
            <th className="p-3 text-left">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate
                }}
                onChange={handleSelectAll}
                className="rounded"
              />
            </th>
            <th className="p-3 text-left font-medium">Name</th>
            <th className="p-3 text-left font-medium">Email</th>
            <th className="p-3 text-left font-medium">Status</th>
            <th className="p-3 text-left font-medium">Last Login</th>
          </tr>
        </thead>
        <tbody>
          {processedData.map(item => (
            <DataRow
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onSelect={handleItemSelect}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </tbody>
      </table>

      {processedData.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          {searchTerm ? 'No items match your search' : 'No data available'}
        </div>
      )}
    </div>
  )
})

DataTable.displayName = 'DataTable'
```

### 3.2 Virtual Scrolling Implementation

**Performance-Optimized Virtual List:**
```typescript
// components/virtual-list.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  containerHeight: number
  renderItem: (item: T, index: number) => React.ReactNode
  overscan?: number
  className?: string
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollElementRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    const containerItemCount = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + containerItemCount + overscan,
      items.length
    )

    const visibleStartIndex = Math.max(0, startIndex - overscan)
    const visibleItems = items.slice(visibleStartIndex, endIndex)

    return {
      visibleItems: visibleItems.map((item, index) => ({
        item,
        index: visibleStartIndex + index,
      })),
      totalHeight: items.length * itemHeight,
      offsetY: visibleStartIndex * itemHeight,
    }
  }, [items, itemHeight, scrollTop, containerHeight, overscan])

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

## 4. Component Testing Standards

### 4.1 Comprehensive Testing Strategy

**Professional Test Implementation:**
```typescript
// __tests__/user-profile.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { UserProfile } from '../components/user-profile'

// Mock API responses
const mockUserData = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  preferences: {
    theme: 'light' as const,
    notifications: true,
    language: 'en',
  },
}

// Setup fetch mock
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('UserProfile Component', () => {
  const defaultProps = {
    userId: '1',
    onProfileUpdate: vi.fn(),
    showNotifications: true,
  }

  beforeEach(() => {
    mockFetch.mockClear()
    defaultProps.onProfileUpdate.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Loading State', () => {
    it('should display loading skeleton while fetching data', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves
      
      render(<UserProfile {...defaultProps} />)
      
      expect(screen.getByTestId('user-profile-loading')).toBeInTheDocument()
      expect(screen.getByRole('generic', { name: /loading/i })).toBeInTheDocument()
    })
  })

  describe('Success State', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    })

    it('should render user profile correctly', async () => {
      render(<UserProfile {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })
      
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByRole('img', { name: /John Doe's avatar/i })).toBeInTheDocument()
    })

    it('should display user initials when avatar is not available', async () => {
      const userWithoutAvatar = { ...mockUserData, avatar: undefined }
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(userWithoutAvatar),
      })

      render(<UserProfile {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('JD')).toBeInTheDocument()
      })
    })

    it('should show notifications toggle when enabled', async () => {
      render(<UserProfile {...defaultProps} showNotifications={true} />)
      
      await waitFor(() => {
        expect(screen.getByText('Notifications')).toBeInTheDocument()
      })
      
      expect(screen.getByRole('button', { name: /on/i })).toBeInTheDocument()
    })

    it('should hide notifications toggle when disabled', async () => {
      render(<UserProfile {...defaultProps} showNotifications={false} />)
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })
      
      expect(screen.queryByText('Notifications')).not.toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should display error message when fetch fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))
      
      render(<UserProfile {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByTestId('user-profile-error')).toBeInTheDocument()
      })
      
      expect(screen.getByText('Error loading profile')).toBeInTheDocument()
      expect(screen.getByText('Network error')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })

    it('should retry fetching when retry button is clicked', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockUserData),
        })

      render(<UserProfile {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
      })

      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /retry/i }))
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument()
      })
    })
  })

  describe('User Interactions', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    })

    it('should open settings when settings button is clicked', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      render(<UserProfile {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /open settings/i })).toBeInTheDocument()
      })

      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /open settings/i }))
      
      expect(consoleSpy).toHaveBeenCalledWith('Opening settings for user:', '1')
      
      consoleSpy.mockRestore()
    })

    it('should toggle notifications when notification button is clicked', async () => {
      // Setup successful toggle response
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUserData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            ...mockUserData,
            preferences: { ...mockUserData.preferences, notifications: false },
          }),
        })

      render(<UserProfile {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /on/i })).toBeInTheDocument()
      })

      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /on/i }))
      
      await waitFor(() => {
        expect(defaultProps.onProfileUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            preferences: expect.objectContaining({
              notifications: false,
            }),
          })
        )
      })
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockUserData),
      })
    })

    it('should have proper ARIA labels', async () => {
      render(<UserProfile {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /open settings/i })).toBeInTheDocument()
      })
      
      expect(screen.getByRole('img', { name: /John Doe's avatar/i })).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      render(<UserProfile {...defaultProps} />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /open settings/i })).toBeInTheDocument()
      })

      const settingsButton = screen.getByRole('button', { name: /open settings/i })
      settingsButton.focus()
      
      expect(settingsButton).toHaveFocus()
      
      fireEvent.keyDown(settingsButton, { key: 'Enter' })
      // Verify interaction handling
    })
  })
})
```

## 5. Quality Assurance Standards

### 5.1 Code Review Checklist

**Pre-Merge Requirements:**
- [ ] Component follows single responsibility principle
- [ ] Props are properly typed with TypeScript interfaces
- [ ] Error boundaries are implemented where appropriate
- [ ] Loading and error states are handled gracefully
- [ ] Memoization is used appropriately (React.memo, useMemo, useCallback)
- [ ] Custom hooks are extracted for reusable logic
- [ ] Components are accessible (ARIA labels, keyboard navigation)
- [ ] Test coverage is above 80%
- [ ] No console.log statements in production code
- [ ] ESLint and Prettier rules are followed

### 5.2 Performance Benchmarks

**Target Metrics:**
- Component render time: < 16ms
- Bundle size increase: < 50KB per major feature
- Memory usage: No memory leaks detected
- First Contentful Paint contribution: < 100ms
- Time to Interactive impact: < 50ms

### 5.3 Accessibility Compliance

**WCAG 2.1 AA Standards:**
```typescript
// components/accessible-button.tsx
import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    loadingText = 'Loading...',
    disabled,
    children,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Size variants
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          
          // Color variants
          {
            'bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary': 
              variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary': 
              variant === 'secondary',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive': 
              variant === 'destructive',
          },
          
          className
        )}
        disabled={isDisabled}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        <span className={loading ? 'sr-only' : undefined}>
          {loading ? loadingText : children}
        </span>
        
        {loading && (
          <span aria-live="polite" className="sr-only">
            {loadingText}
          </span>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'
```

## 6. Advanced Patterns and Techniques

### 6.1 Compound Component Pattern

**Professional Compound Component Implementation:**
```typescript
// components/modal/modal.tsx
import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback,
  ReactNode 
} from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalContextValue {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  modalId: string
}

const ModalContext = createContext<ModalContextValue | null>(null)

function useModalContext() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('Modal components must be used within a Modal')
  }
  return context
}

interface ModalProps {
  children: ReactNode
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Modal({ children, defaultOpen = false, onOpenChange }: ModalProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const modalId = `modal-${Math.random().toString(36).substr(2, 9)}`

  const onClose = useCallback(() => {
    setIsOpen(false)
    onOpenChange?.(false)
  }, [onOpenChange])

  const onOpen = useCallback(() => {
    setIsOpen(true)
    onOpenChange?.(true)
  }, [onOpenChange])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const contextValue: ModalContextValue = {
    isOpen,
    onClose,
    onOpen,
    modalId,
  }

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  )
}

interface ModalTriggerProps {
  children: ReactNode
  asChild?: boolean
}

function ModalTrigger({ children, asChild = false }: ModalTriggerProps) {
  const { onOpen } = useModalContext()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (event: React.MouseEvent) => {
        children.props.onClick?.(event)
        onOpen()
      },
    })
  }

  return (
    <button onClick={onOpen} type="button">
      {children}
    </button>
  )
}

interface ModalContentProps {
  children: ReactNode
  className?: string
  showCloseButton?: boolean
}

function ModalContent({ 
  children, 
  className = '', 
  showCloseButton = true 
}: ModalContentProps) {
  const { isOpen, onClose, modalId } = useModalContext()

  if (!isOpen) return null

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${modalId}-title`}
      aria-describedby={`${modalId}-description`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  )
}

function ModalHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { modalId } = useModalContext()
  
  return (
    <div className={`p-6 pb-2 ${className}`}>
      <div id={`${modalId}-title`} className="text-lg font-semibold">
        {children}
      </div>
    </div>
  )
}

function ModalBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { modalId } = useModalContext()
  
  return (
    <div id={`${modalId}-description`} className={`p-6 py-2 ${className}`}>
      {children}
    </div>
  )
}

function ModalFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-6 pt-2 flex justify-end space-x-2 ${className}`}>
      {children}
    </div>
  )
}

// Export compound component
Modal.Trigger = ModalTrigger
Modal.Content = ModalContent
Modal.Header = ModalHeader
Modal.Body = ModalBody
Modal.Footer = ModalFooter

export { Modal }

// Usage example:
/*
<Modal>
  <Modal.Trigger>
    <button>Open Modal</button>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Header>
      Confirm Action
    </Modal.Header>
    <Modal.Body>
      Are you sure you want to delete this item?
    </Modal.Body>
    <Modal.Footer>
      <button onClick={() => {}}>Cancel</button>
      <button onClick={() => {}}>Delete</button>
    </Modal.Footer>
  </Modal.Content>
</Modal>
*/
```

### 6.2 Render Props Pattern

**Advanced Render Props Implementation:**
```typescript
// components/data-fetcher.tsx
import React, { useState, useEffect, useCallback, ReactNode } from 'react'

interface DataFetcherState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

interface DataFetcherProps<T> {
  url: string
  children: (state: DataFetcherState<T>) => ReactNode
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  dependencies?: any[]
}

export function DataFetcher<T = any>({
  url,
  children,
  onSuccess,
  onError,
  dependencies = [],
}: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      onError?.(err instanceof Error ? err : new Error(errorMessage))
    } finally {
      setLoading(false)
    }
  }, [url, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData, ...dependencies])

  const state: DataFetcherState<T> = {
    data,
    loading,
    error,
    refetch: fetchData,
  }

  return <>{children(state)}</>
}

// Usage example:
/*
<DataFetcher<User[]> url="/api/users">
  {({ data, loading, error, refetch }) => {
    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!data) return <div>No data</div>
    
    return (
      <div>
        <button onClick={refetch}>Refresh</button>
        {data.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    )
  }}
</DataFetcher>
*/
```

## 7. Integration with External Libraries

### 7.1 Third-Party Library Integration

**Professional Library Wrapper:**
```typescript
// hooks/use-intersection-observer.ts
import { useEffect, useRef, useState, RefObject } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
  triggerOnce?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLElement>, boolean] {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
    triggerOnce = false,
  } = options

  const elementRef = useRef<HTMLElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting

        setIsIntersecting(isElementIntersecting)

        if (isElementIntersecting && triggerOnce) {
          observer.unobserve(element)
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, root, rootMargin, triggerOnce])

  const frozenValue = useRef(isIntersecting)

  if (freezeOnceVisible && isIntersecting && !frozenValue.current) {
    frozenValue.current = true
  }

  return [elementRef, freezeOnceVisible ? frozenValue.current : isIntersecting]
}

// Usage in component:
/*
function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [ref, isVisible] = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div ref={ref}>
      {isVisible ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="bg-gray-200 animate-pulse h-48 w-full" />
      )}
    </div>
  )
}
*/
```

## 8. Documentation Standards

### 8.1 Component Documentation Template

**Professional Component Documentation:**
```typescript
/**
 * UserProfile Component
 * 
 * A comprehensive user profile component that displays user information,
 * handles loading states, and provides interactive features like notification
 * preferences and settings access.
 * 
 * @example
 * ```tsx
 * <UserProfile
 *   userId="123"
 *   onProfileUpdate={(user) => console.log('Updated:', user)}
 *   showNotifications={true}
 *   className="max-w-md"
 * />
 * ```
 * 
 * @features
 * - Automatic data fetching with error handling
 * - Loading states with skeleton UI
 * - User avatar with fallback initials
 * - Notification preferences toggle
 * - Settings button with callback
 * - Accessibility compliant
 * - Fully typed with TypeScript
 * 
 * @performance
 * - Memoized to prevent unnecessary re-renders
 * - Optimized API calls with proper error handling
 * - Lazy loading for non-critical features
 * 
 * @accessibility
 * - ARIA labels for all interactive elements
 * - Keyboard navigation support
 * - Screen reader friendly
 * - High contrast support
 */
```

## 9. Maintenance and Best Practices

### 9.1 Regular Maintenance Checklist

**Monthly Tasks:**
- [ ] Update React and related dependencies
- [ ] Review and refactor complex components
- [ ] Update type definitions for external APIs
- [ ] Run performance audits
- [ ] Review and update tests
- [ ] Check for unused code and dependencies

**Quarterly Tasks:**
- [ ] Major dependency updates
- [ ] Architecture review and improvements
- [ ] Code splitting optimization
- [ ] Bundle size analysis
- [ ] Accessibility audit
- [ ] Performance benchmarking

### 9.2 Migration Strategies

**Class to Functional Component Migration:**
```typescript
// Before (Class Component)
class OldComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }

  componentDidMount() {
    document.title = `Count: ${this.state.count}`
  }

  componentDidUpdate() {
    document.title = `Count: ${this.state.count}`
  }

  increment = () => {
    this.setState(prevState => ({ count: prevState.count + 1 }))
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    )
  }
}

// After (Functional Component)
function NewComponent() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count])

  const increment = useCallback(() => {
    setCount(prev => prev + 1)
  }, [])

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

This comprehensive React best practices document provides enterprise-grade standards for component development, ensuring consistent, maintainable, and performant React applications that comply with Model Context Protocol requirements.