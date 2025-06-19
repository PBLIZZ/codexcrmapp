# TypeScript Best Practices - Enterprise Development Standards

## Document Information
- **Name**: typescript-best-practices.mdc
- **Description**: Comprehensive TypeScript coding standards and type safety guidelines
- **File Patterns**: `**/*.{ts,tsx}`
- **Always Apply**: true

## Executive Summary

This document establishes enterprise-grade TypeScript development standards focusing on type safety, code maintainability, and developer productivity. These practices ensure consistent, scalable, and error-resistant TypeScript applications that align with Model Context Protocol (MCP) requirements.

## 1. TypeScript Configuration Standards

### 1.1 Production-Ready tsconfig.json

**Strict Configuration Setup:**
```json
{
  "compilerOptions": {
    // Language and Environment
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,

    // Module Resolution
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    // Type Checking - Strict Rules
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitOverride": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,

    // Advanced Type Checking
    "noPropertyAccessFromIndexSignature": true,
    "noUncheckedIndexedAccess": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,

    // Paths and Base URL
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    },

    // Incremental Compilation
    "incremental": true,
    "tsBuildInfoFile": ".tsbuildinfo"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "out",
    "dist",
    "build"
  ],
  "plugins": [
    {
      "name": "next"
    }
  ]
}
```

### 1.2 Type Declaration Files

**Professional Global Type Definitions:**
```typescript
// types/global.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test'
      readonly NEXT_PUBLIC_API_URL: string
      readonly NEXT_PUBLIC_APP_URL: string
      readonly DATABASE_URL: string
      readonly NEXTAUTH_SECRET: string
      readonly NEXTAUTH_URL: string
    }
  }

  interface Window {
    gtag?: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, any>
    ) => void
    dataLayer?: any[]
  }
}

export {}
```

## 2. Type Definition Standards

### 2.1 Interface vs Type Aliases

**Professional Type Organization:**
```typescript
// types/api.ts
// Use interfaces for object shapes that might be extended
interface BaseEntity {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

interface User extends BaseEntity {
  readonly email: string
  readonly name: string
  readonly avatar?: string
  readonly role: UserRole
  readonly preferences: UserPreferences
}

interface UserPreferences {
  readonly theme: ThemeMode
  readonly notifications: NotificationSettings
  readonly language: SupportedLanguage
}

// Use type aliases for unions, primitives, and computed types
type UserRole = 'admin' | 'user' | 'moderator'
type ThemeMode = 'light' | 'dark' | 'system'
type SupportedLanguage = 'en' | 'es' | 'fr' | 'de'

type NotificationSettings = {
  readonly email: boolean
  readonly push: boolean
  readonly sms: boolean
  readonly marketing: boolean
}

// Utility types for API responses
type ApiResponse<T> = {
  readonly data: T
  readonly success: true
} | {
  readonly error: string
  readonly success: false
}

type PaginatedResponse<T> = {
  readonly data: T[]
  readonly pagination: {
    readonly page: number
    readonly limit: number
    readonly total: number
    readonly totalPages: number
  }
}

// Conditional types for different states
type LoadingState<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

// Template literal types for string patterns
type EventType = `user_${string}` | `system_${string}` | `admin_${string}`
type ApiEndpoint = `/api/${string}`
type AssetPath = `/assets/${string}.${string}`
```

### 2.2 Advanced Type Patterns

**Utility Types and Generic Constraints:**
```typescript
// types/utilities.ts
// Deep readonly utility
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

// Strict extract utility
type StrictExtract<T, U extends T> = T extends U ? T : never

// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Make specific properties required
type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// Non-empty array type
type NonEmptyArray<T> = [T, ...T[]]

// Exact type utility (prevents excess properties)
type Exact<T> = T & Record<string, never>

// Function that returns a promise
type AsyncFunction<T extends any[] = any[], R = any> = (...args: T) => Promise<R>

// Extract function parameters
type FunctionParams<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never

// Create a type from an array of strings
type ArrayToUnion<T extends readonly string[]> = T[number]

// Example usage
const themes = ['light', 'dark', 'auto'] as const
type Theme = ArrayToUnion<typeof themes> // 'light' | 'dark' | 'auto'

// Branded types for type safety
type Brand<T, B> = T & { readonly __brand: B }
type UserId = Brand<string, 'UserId'>
type Email = Brand<string, 'Email'>
type Password = Brand<string, 'Password'>

// Type guards and validation
const isUserId = (value: string): value is UserId => {
  return /^user_[a-zA-Z0-9]+$/.test(value)
}

const isEmail = (value: string): value is Email => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

// Recursive type for nested objects
type NestedObject<T> = {
  [K in keyof T]: T[K] extends object ? NestedObject<T[K]> : T[K]
}

// Type for configuration objects
interface AppConfig {
  readonly database: {
    readonly host: string
    readonly port: number
    readonly ssl: boolean
  }
  readonly auth: {
    readonly providers: readonly string[]
    readonly session: {
      readonly maxAge: number
      readonly strategy: 'jwt' | 'database'
    }
  }
  readonly features: {
    readonly [key: string]: boolean
  }
}

// Environment-specific configurations
type EnvironmentConfig<T extends 'development' | 'production' | 'test'> = 
  T extends 'development' 
    ? AppConfig & { readonly debug: true }
    : T extends 'production'
    ? AppConfig & { readonly debug: false; readonly analytics: true }
    : AppConfig & { readonly debug: true; readonly analytics: false }
```

## 3. Function and Method Typing

### 3.1 Professional Function Signatures

**Comprehensive Function Typing:**
```typescript
// lib/api-client.ts
interface RequestConfig {
  readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  readonly headers?: Record<string, string>
  readonly body?: unknown
  readonly timeout?: number
  readonly retries?: number
}

interface ApiClientError {
  readonly message: string
  readonly status?: number
  readonly code?: string
  readonly details?: unknown
}

class ApiClient {
  private readonly baseUrl: string
  private readonly defaultHeaders: Record<string, string>

  constructor(baseUrl: string, defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl
    this.defaultHeaders = defaultHeaders
  }

  // Generic method with proper constraints
  async request<TResponse = unknown, TError = ApiClientError>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<TResponse, TError>> {
    try {
      const url = new URL(endpoint, this.baseUrl)
      const headers = { ...this.defaultHeaders, ...config.headers }

      const response = await fetch(url.toString(), {
        method: config.method ?? 'GET',
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: AbortSignal.timeout(config.timeout ?? 10000),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json() as TResponse

      return {
        data,
        success: true as const,
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false as const,
      }
    }
  }

  // Specific typed methods
  async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  async post<T, U = unknown>(
    endpoint: string, 
    body: U, 
    config?: Omit<RequestConfig, 'method' | 'body'>
  ) {
    return this.request<T>(endpoint, { ...config, method: 'POST', body })
  }

  async put<T, U = unknown>(
    endpoint: string, 
    body: U, 
    config?: Omit<RequestConfig, 'method' | 'body'>
  ) {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body })
  }

  async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }
}

// Usage with proper typing
const apiClient = new ApiClient('https://api.example.com')

// Type-safe API calls
const getUserData = async (userId: UserId): Promise<User | null> => {
  const response = await apiClient.get<User>(`/users/${userId}`)
  
  if (response.success) {
    return response.data
  }
  
  console.error('Failed to fetch user:', response.error)
  return null
}

// Function overloads for different use cases
function processData(data: string): string
function processData(data: number): number
function processData(data: string[]): string[]
function processData(data: string | number | string[]): string | number | string[] {
  if (typeof data === 'string') {
    return data.toUpperCase()
  }
  
  if (typeof data === 'number') {
    return data * 2
  }
  
  return data.map(item => item.toUpperCase())
}

// Generic constraints with conditional types
type AsyncReturnType<T extends (...args: any) => Promise<any>> = 
  T extends (...args: any) => Promise<infer R> ? R : never

interface DatabaseOperations {
  findById<T extends BaseEntity>(id: string): Promise<T | null>
  create<T extends Omit<BaseEntity, 'id' | 'createdAt' | 'updatedAt'>>(
    data: T
  ): Promise<T & BaseEntity>
  update<T extends BaseEntity>(
    id: string, 
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T>
  delete(id: string): Promise<boolean>
}

// Higher-order function typing
type Middleware<T extends Record<string, any> = Record<string, any>> = (
  context: T,
  next: () => Promise<void>
) => Promise<void>

const createMiddlewareChain = <T extends Record<string, any>>(
  middlewares: Middleware<T>[]
) => {
  return async (context: T) => {
    let index = 0
    
    const next = async (): Promise<void> => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++]
        await middleware(context, next)
      }
    }
    
    await next()
  }
}
```

### 3.2 Event Handler Typing

**Professional Event Handler Patterns:**
```typescript
// types/events.ts
// Custom event types
interface CustomEvents {
  'user:login': { userId: UserId; timestamp: Date }
  'user:logout': { userId: UserId; reason: string }
  'data:updated': { entityType: string; entityId: string; changes: Record<string, any> }
  'error:occurred': { error: Error; context: string }
}

// Type-safe event emitter
class TypedEventEmitter<TEvents extends Record<string, any>> {
  private readonly listeners = new Map<keyof TEvents, Set<Function>>()

  on<K extends keyof TEvents>(
    event: K,
    listener: (data: TEvents[K]) => void
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    
    const eventListeners = this.listeners.get(event)!
    eventListeners.add(listener)
    
    // Return cleanup function
    return () => {
      eventListeners.delete(listener)
      if (eventListeners.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error(`Error in event listener for ${String(event)}:`, error)
        }
      })
    }
  }

  off<K extends keyof TEvents>(event: K, listener?: (data: TEvents[K]) => void): void {
    if (!listener) {
      this.listeners.delete(event)
      return
    }
    
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(listener)
      if (eventListeners.size === 0) {
        this.listeners.delete(event)
      }
    }
  }
}

// React event handler typing
interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement
  password: HTMLInputElement
  rememberMe: HTMLInputElement
}

interface LoginFormElement extends HTMLFormElement {
  readonly elements: FormElements
}

type LoginFormHandler = (event: React.FormEvent<LoginFormElement>) => void

const handleLoginSubmit: LoginFormHandler = (event) => {
  event.preventDefault()
  
  const form = event.currentTarget
  const formData = {
    email: form.elements.email.value,
    password: form.elements.password.value,
    rememberMe: form.elements.rememberMe.checked,
  }
  
  // Process form data with full type safety
  console.log('Login data:', formData)
}

// Generic event handler creator
type EventHandler<T extends Event = Event> = (event: T) => void

const createEventHandler = <T extends Event>(
  handler: (event: T) => void,
  options: {
    preventDefault?: boolean
    stopPropagation?: boolean
    debounceMs?: number
  } = {}
): EventHandler<T> => {
  let timeoutId: NodeJS.Timeout | null = null
  
  return (event: T) => {
    if (options.preventDefault) {
      event.preventDefault()
    }
    
    if (options.stopPropagation) {
      event.stopPropagation()
    }
    
    if (options.debounceMs) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        handler(event)
      }, options.debounceMs)
    } else {
      handler(event)
    }
  }
}
```

## 4. Class and Object Typing

### 4.1 Professional Class Implementation

**Enterprise Class Patterns:**
```typescript
// lib/user-service.ts
// Abstract base class with generics
abstract class BaseService<TEntity extends BaseEntity, TCreateDto, TUpdateDto> {
  protected abstract readonly apiEndpoint: string
  protected readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  async findById(id: string): Promise<TEntity | null> {
    const response = await this.apiClient.get<TEntity>(`${this.apiEndpoint}/${id}`)
    return response.success ? response.data : null
  }

  async create(data: TCreateDto): Promise<TEntity | null> {
    const response = await this.apiClient.post<TEntity, TCreateDto>(this.apiEndpoint, data)
    return response.success ? response.data : null
  }

  async update(id: string, data: TUpdateDto): Promise<TEntity | null> {
    const response = await this.apiClient.put<TEntity, TUpdateDto>(`${this.apiEndpoint}/${id}`, data)
    return response.success ? response.data : null
  }

  async delete(id: string): Promise<boolean> {
    const response = await this.apiClient.delete(`${this.apiEndpoint}/${id}`)
    return response.success
  }

  // Template method pattern
  async findAll(filters?: Record<string, any>): Promise<TEntity[]> {
    const queryString = filters ? this.buildQueryString(filters) : ''
    const endpoint = `${this.apiEndpoint}${queryString}`
    
    const response = await this.apiClient.get<TEntity[]>(endpoint)
    return response.success ? response.data : []
  }

  protected buildQueryString(filters: Record<string, any>): string {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })
    
    return params.toString() ? `?${params.toString()}` : ''
  }
}

// Concrete implementation
interface CreateUserDto {
  readonly email: Email
  readonly name: string
  readonly role: UserRole
}

interface UpdateUserDto {
  readonly name?: string
  readonly role?: UserRole
  readonly preferences?: Partial<UserPreferences>
}

class UserService extends BaseService<User, CreateUserDto, UpdateUserDto> {
  protected readonly apiEndpoint = '/users'

  // Additional user-specific methods
  async findByEmail(email: Email): Promise<User | null> {
    const response = await this.apiClient.get<User>(`${this.apiEndpoint}/by-email/${email}`)
    return response.success ? response.data : null
  }

  async updatePreferences(userId: UserId, preferences: Partial<UserPreferences>): Promise<User | null> {
    const response = await this.apiClient.patch<User, Partial<UserPreferences>>(
      `${this.apiEndpoint}/${userId}/preferences`,
      preferences
    )
    return response.success ? response.data : null
  }

  async validateUser(credentials: { email: Email; password: Password }): Promise<User | null> {
    const response = await this.apiClient.post<User, typeof credentials>(
      `${this.apiEndpoint}/validate`,
      credentials
    )
    return response.success ? response.data : null
  }
}

// Singleton pattern with proper typing
class ConfigurationManager {
  private static instance: ConfigurationManager | null = null
  private readonly config: Map<string, unknown> = new Map()

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager()
    }
    return ConfigurationManager.instance
  }

  set<T>(key: string, value: T): void {
    this.config.set(key, value)
  }

  get<T>(key: string): T | undefined {
    return this.config.get(key) as T | undefined
  }

  get<T>(key: string, defaultValue: T): T {
    return (this.config.get(key) as T) ?? defaultValue
  }

  has(key: string): boolean {
    return this.config.has(key)
  }

  delete(key: string): boolean {
    return this.config.delete(key)
  }

  clear(): void {
    this.config.clear()
  }

  // Type-safe configuration getter
  getTypedConfig<T extends Record<string, any>>(schema: T): Partial<T> {
    const result: Partial<T> = {}
    
    Object.keys(schema).forEach(key => {
      if (this.has(key)) {
        ;(result as any)[key] = this.get(key)
      }
    })
    
    return result
  }
}

// Builder pattern implementation
interface DatabaseConnectionOptions {
  readonly host: string
  readonly port: number
  readonly database: string
  readonly username: string
  readonly password: string
  readonly ssl?: boolean
  readonly timeout?: number
  readonly maxConnections?: number
}

class DatabaseConnectionBuilder {
  private readonly options: Partial<DatabaseConnectionOptions> = {}

  host(host: string): this {
    this.options.host = host
    return this
  }

  port(port: number): this {
    this.options.port = port
    return this
  }

  database(database: string): this {
    this.options.database = database
    return this
  }

  credentials(username: string, password: string): this {
    this.options.username = username
    this.options.password = password
    return this
  }

  ssl(enabled: boolean = true): this {
    this.options.ssl = enabled
    return this
  }

  timeout(ms: number): this {
    this.options.timeout = ms
    return this
  }

  maxConnections(count: number): this {
    this.options.maxConnections = count
    return this
  }

  build(): DatabaseConnectionOptions {
    const required: (keyof DatabaseConnectionOptions)[] = [
      'host', 'port', 'database', 'username', 'password'
    ]

    const missing = required.filter(key => !(key in this.options))
    
    if (missing.length > 0) {
      throw new Error(`Missing required options: ${missing.join(', ')}`)
    }

    return {
      ssl: false,
      timeout: 30000,
      maxConnections: 10,
      ...this.options
    } as DatabaseConnectionOptions
  }
}
```

### 4.2 Mixin and Composition Patterns

**Advanced Composition Techniques:**
```typescript
// lib/mixins.ts
// Mixin type helper
type Constructor<T = {}> = new (...args: any[]) => T

// Timestamped mixin
interface Timestamped {
  readonly createdAt: Date
  readonly updatedAt: Date
  updateTimestamp(): void
}

function WithTimestamps<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements Timestamped {
    readonly createdAt: Date = new Date()
    private _updatedAt: Date = new Date()

    get updatedAt(): Date {
      return this._updatedAt
    }

    updateTimestamp(): void {
      this._updatedAt = new Date()
    }
  }
}

// Validation mixin
interface Validatable {
  validate(): string[]
  isValid(): boolean
}

function WithValidation<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements Validatable {
    private readonly validationRules: Array<() => string | null> = []

    protected addValidationRule(rule: () => string | null): void {
      this.validationRules.push(rule)
    }

    validate(): string[] {
      return this.validationRules
        .map(rule => rule())
        .filter((error): error is string => error !== null)
    }

    isValid(): boolean {
      return this.validate().length === 0
    }
  }
}

// Observable mixin
interface Observable<T = any> {
  subscribe(observer: (value: T) => void): () => void
  notify(value: T): void
}

function WithObservable<TBase extends Constructor>(Base: TBase) {
  return class extends Base implements Observable {
    private readonly observers: Set<(value: any) => void> = new Set()

    subscribe(observer: (value: any) => void): () => void {
      this.observers.add(observer)
      
      return () => {
        this.observers.delete(observer)
      }
    }

    notify(value: any): void {
      this.observers.forEach(observer => {
        try {
          observer(value)
        } catch (error) {
          console.error('Error in observer:', error)
        }
      })
    }
  }
}

// Combining mixins
class BaseModel {
  constructor(public readonly id: string) {}
}

// Create a class with multiple mixins
const EnhancedModel = WithObservable(WithValidation(WithTimestamps(BaseModel)))

class UserModel extends EnhancedModel {
  constructor(
    id: string,
    public email: Email,
    public name: string
  ) {
    super(id)
    
    // Add validation rules
    this.addValidationRule(() => {
      return this.email ? null : 'Email is required'
    })
    
    this.addValidationRule(() => {
      return this.name.trim() ? null : 'Name is required'
    })
  }

  updateEmail(newEmail: Email): void {
    if (this.email !== newEmail) {
      this.email = newEmail
      this.updateTimestamp()
      this.notify({ type: 'email_updated', email: newEmail })
    }
  }

  updateName(newName: string): void {
    if (this.name !== newName) {
      this.name = newName
      this.updateTimestamp()
      this.notify({ type: 'name_updated', name: newName })
    }
  }
}

// Usage
const user = new UserModel('user_123', 'john@example.com' as Email, 'John Doe')

// Subscribe to changes
const unsubscribe = user.subscribe((change) => {
  console.log('User changed:', change)
})

// Validate
if (!user.isValid()) {
  console.error('Validation errors:', user.validate())
}

// Update and notify
user.updateEmail('john.doe@example.com' as Email)

// Cleanup
unsubscribe()
```

## 5. Generic Programming

### 5.1 Advanced Generic Patterns

**Professional Generic Implementation:**
```typescript
// lib/repository.ts
// Generic repository pattern
interface Repository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>
  findAll(criteria?: Partial<TEntity>): Promise<TEntity[]>
  create(entity: Omit<TEntity, 'id'>): Promise<TEntity>
  update(id: TId, updates: Partial<TEntity>): Promise<TEntity | null>
  delete(id: TId): Promise<boolean>
}

// Generic implementation with constraints
class InMemoryRepository<
  TEntity extends { id: TId },
  TId extends string | number = string
> implements Repository<TEntity, TId> {
  private readonly entities = new Map<TId, TEntity>()
  private idCounter = 0

  async findById(id: TId): Promise<TEntity | null> {
    return this.entities.get(id) ?? null
  }

  async findAll(criteria?: Partial<TEntity>): Promise<TEntity[]> {
    const entities = Array.from(this.entities.values())
    
    if (!criteria) {
      return entities
    }

    return entities.filter(entity => {
      return Object.entries(criteria).every(([key, value]) => {
        return value === undefined || entity[key as keyof TEntity] === value
      })
    })
  }

  async create(entityData: Omit<TEntity, 'id'>): Promise<TEntity> {
    const id = this.generateId()
    const entity = { ...entityData, id } as TEntity
    
    this.entities.set(id, entity)
    return entity
  }

  async update(id: TId, updates: Partial<TEntity>): Promise<TEntity | null> {
    const entity = this.entities.get(id)
    
    if (!entity) {
      return null
    }

    const updatedEntity = { ...entity, ...updates }
    this.entities.set(id, updatedEntity)
    return updatedEntity
  }

  async delete(id: TId): Promise<boolean> {
    return this.entities.delete(id)
  }

  private generateId(): TId {
    if (typeof this.entities.keys().next().value === 'number') {
      return (++this.idCounter) as TId
    }
    
    return `entity_${++this.idCounter}` as TId
  }

  // Additional utility methods
  async count(criteria?: Partial<TEntity>): Promise<number> {
    const entities = await this.findAll(criteria)
    return entities.length
  }

  async exists(id: TId): Promise<boolean> {
    return this.entities.has(id)
  }

  clear(): void {
    this.entities.clear()
    this.idCounter = 0
  }
}

// Generic cache implementation
interface CacheOptions {
  readonly ttlMs?: number
  readonly maxSize?: number
}

class GenericCache<TKey extends string | number, TValue> {
  private readonly cache = new Map<TKey, { value: TValue; expiresAt: number }>()
  private readonly ttlMs: number
  private readonly maxSize: number

  constructor(options: CacheOptions = {}) {
    this.ttlMs = options.ttlMs ?? 300000 // 5 minutes
    this.maxSize = options.maxSize ?? 1000
  }

  set(key: TKey, value: TValue, customTtl?: number): void {
    // Evict expired entries if at capacity
    if (this.cache.size >= this.maxSize) {
      this.evictExpired()
      
      // If still at capacity, evict oldest
      if (this.cache.size >= this.maxSize) {
        const firstKey = this.cache.keys().next().value
        if (firstKey !== undefined) {
          this.cache.delete(firstKey)
        }
      }
    }

    const expiresAt = Date.now() + (customTtl ?? this.ttlMs)
    this.cache.set(key, { value, expiresAt })
  }

  get(key: TKey): TValue | undefined {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return undefined
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return undefined
    }

    return entry.value
  }

  has(key: TKey): boolean {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return false
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: TKey): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    this.evictExpired()
    return this.cache.size
  }

  keys(): TKey[] {
    this.evictExpired()
    return Array.from(this.cache.keys())
  }

  values(): TValue[] {
    this.evictExpired()
    return Array.from(this.cache.values()).map(entry => entry.value)
  }

  private evictExpired(): void {
    const now = Date.now()
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

// Generic state machine
type StateTransition<TState extends string, TEvent extends string> = {
  readonly from: TState
  readonly to: TState
  readonly event: TEvent
  readonly guard?: () => boolean
  readonly action?: () => void | Promise<void>
}

class StateMachine<TState extends string, TEvent extends string> {
  private currentState: TState
  private readonly transitions: StateTransition<TState, TEvent>[]

  constructor(
    initialState: TState,
    transitions: StateTransition<TState, TEvent>[]
  ) {
    this.currentState = initialState
    this.transitions = transitions
  }

  getCurrentState(): TState {
    return this.currentState
  }

  canTransition(event: TEvent): boolean {
    const transition = this.findTransition(event)
    
    if (!transition) {
      return false
    }

    return transition.guard ? transition.guard() : true
  }

  async transition(event: TEvent): Promise<boolean> {
    const validTransition = this.findTransition(event)
    
    if (!validTransition) {
      return false
    }

    if (validTransition.guard && !validTransition.guard()) {
      return false
    }

    this.currentState = validTransition.to

    if (validTransition.action) {
      await validTransition.action()
    }

    return true
  }

  private findTransition(event: TEvent): StateTransition<TState, TEvent> | undefined {
    return this.transitions.find(
      transition => 
        transition.from === this.currentState && 
        transition.event === event
    )
  }

  getAvailableEvents(): TEvent[] {
    return this.transitions
      .filter(transition => transition.from === this.currentState)
      .filter(transition => !transition.guard || transition.guard())
      .map(transition => transition.event)
  }
}

// Usage examples
type OrderState = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
type OrderEvent = 'confirm' | 'ship' | 'deliver' | 'cancel'

const orderStateMachine = new StateMachine<OrderState, OrderEvent>('pending', [
  { from: 'pending', to: 'confirmed', event: 'confirm' },
  { from: 'pending', to: 'cancelled', event: 'cancel' },
  { from: 'confirmed', to: 'shipped', event: 'ship' },
  { from: 'confirmed', to: 'cancelled', event: 'cancel' },
  { from: 'shipped', to: 'delivered', event: 'deliver' },
])

// Type-safe operations
console.log(orderStateMachine.getCurrentState()) // 'pending'
console.log(orderStateMachine.canTransition('confirm')) // true
console.log(orderStateMachine.canTransition('ship')) // false
```

## 6. Error Handling and Type Safety

### 6.1 Professional Error Handling

**Result Type Pattern:**
```typescript
// lib/result.ts
// Result type for error handling
type Result<T, E = Error> = 
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E }

// Result utility functions
const Result = {
  success: <T>(data: T): Result<T, never> => ({
    success: true,
    data,
  }),

  error: <E>(error: E): Result<never, E> => ({
    success: false,
    error,
  }),

  from: <T>(fn: () => T): Result<T, Error> => {
    try {
      return Result.success(fn())
    } catch (error) {
      return Result.error(error instanceof Error ? error : new Error(String(error)))
    }
  },

  fromAsync: async <T>(promise: Promise<T>): Promise<Result<T, Error>> => {
    try {
      const data = await promise
      return Result.success(data)
    } catch (error) {
      return Result.error(error instanceof Error ? error : new Error(String(error)))
    }
  },

  map: <T, U, E>(
    result: Result<T, E>, 
    fn: (data: T) => U
  ): Result<U, E> => {
    if (result.success) {
      return Result.success(fn(result.data))
    }
    return result
  },

  flatMap: <T, U, E>(
    result: Result<T, E>, 
    fn: (data: T) => Result<U, E>
  ): Result<U, E> => {
    if (result.success) {
      return fn(result.data)
    }
    return result
  },

  mapError: <T, E, F>(
    result: Result<T, E>, 
    fn: (error: E) => F
  ): Result<T, F> => {
    if (!result.success) {
      return Result.error(fn(result.error))
    }
    return result
  },

  unwrap: <T, E>(result: Result<T, E>): T => {
    if (result.success) {
      return result.data
    }
    throw new Error(`Attempted to unwrap error result: ${result.error}`)
  },

  unwrapOr: <T, E>(result: Result<T, E>, defaultValue: T): T => {
    return result.success ? result.data : defaultValue
  },

  unwrapOrElse: <T, E>(result: Result<T, E>, fn: (error: E) => T): T => {
    return result.success ? result.data : fn(result.error)
  },
}

// Custom error types
abstract class AppError extends Error {
  abstract readonly code: string
  abstract readonly statusCode: number

  constructor(message: string, public readonly details?: unknown) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace?.(this, this.constructor)
  }
}

class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR'
  readonly statusCode = 400

  constructor(
    message: string,
    public readonly field?: string,
    details?: unknown
  ) {
    super(message, details)
  }
}

class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND'
  readonly statusCode = 404

  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`)
  }
}

class UnauthorizedError extends AppError {
  readonly code = 'UNAUTHORIZED'
  readonly statusCode = 401

  constructor(message = 'Unauthorized') {
    super(message)
  }
}

class ForbiddenError extends AppError {
  readonly code = 'FORBIDDEN'
  readonly statusCode = 403

  constructor(message = 'Forbidden') {
    super(message)
  }
}

// Type-safe service implementation with Result pattern
class SafeUserService {
  constructor(private readonly repository: Repository<User>) {}

  async findUser(id: UserId): Promise<Result<User, NotFoundError>> {
    const user = await this.repository.findById(id)
    
    if (!user) {
      return Result.error(new NotFoundError('User', id))
    }

    return Result.success(user)
  }

  async createUser(userData: CreateUserDto): Promise<Result<User, ValidationError>> {
    // Validate email format
    if (!isEmail(userData.email)) {
      return Result.error(new ValidationError('Invalid email format', 'email'))
    }

    // Check if user already exists
    const existingUser = await this.repository.findAll({ email: userData.email })
    if (existingUser.length > 0) {
      return Result.error(new ValidationError('User with this email already exists', 'email'))
    }

    const user = await this.repository.create({
      ...userData,
      id: `user_${Date.now()}` as UserId,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        theme: 'system',
        notifications: {
          email: true,
          push: false,
          sms: false,
          marketing: false,
        },
        language: 'en',
      },
    })

    return Result.success(user)
  }

  async updateUser(
    id: UserId, 
    updates: UpdateUserDto
  ): Promise<Result<User, NotFoundError | ValidationError>> {
    // Find user first
    const userResult = await this.findUser(id)
    if (!userResult.success) {
      return userResult
    }

    // Validate updates if email is being changed
    if (updates.email && !isEmail(updates.email)) {
      return Result.error(new ValidationError('Invalid email format', 'email'))
    }

    const updatedUser = await this.repository.update(id, {
      ...updates,
      updatedAt: new Date(),
    })

    if (!updatedUser) {
      return Result.error(new NotFoundError('User', id))
    }

    return Result.success(updatedUser)
  }

  async deleteUser(id: UserId): Promise<Result<boolean, NotFoundError>> {
    const userExists = await this.repository.findById(id)
    
    if (!userExists) {
      return Result.error(new NotFoundError('User', id))
    }

    const deleted = await this.repository.delete(id)
    return Result.success(deleted)
  }
}

// Usage with proper error handling
const safeUserService = new SafeUserService(userRepository)

const handleUserCreation = async (userData: CreateUserDto) => {
  const result = await safeUserService.createUser(userData)
  
  if (result.success) {
    console.log('User created:', result.data)
    return result.data
  } else {
    console.error('Failed to create user:', result.error.message)
    
    // Type-safe error handling
    if (result.error.field === 'email') {
      // Handle email-specific validation error
      showEmailError(result.error.message)
    }
    
    return null
  }
}
```

## 7. Module and Namespace Organization

### 7.1 Professional Module Structure

**Enterprise Module Organization:**
```typescript
// types/index.ts - Central type exports
export type {
  // Core entities
  User,
  UserRole,
  UserPreferences,
  
  // API types
  ApiResponse,
  PaginatedResponse,
  LoadingState,
  
  // Utility types
  DeepReadonly,
  PartialBy,
  RequiredBy,
  NonEmptyArray,
  
  // Branded types
  UserId,
  Email,
  Password,
  
  // Error types
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from './core'

export type {
  // Event types
  CustomEvents,
  EventHandler,
  
  // Configuration
  AppConfig,
  EnvironmentConfig,
} from './events'

export type {
  // Repository patterns
  Repository,
  CacheOptions,
  
  // State machine
  StateTransition,
} from './infrastructure'

// lib/index.ts - Central library exports
export {
  // API Client
  ApiClient,
  
  // Services
  UserService,
  SafeUserService,
  
  // Utilities
  Result,
  
  // Base classes
  BaseService,
  InMemoryRepository,
  GenericCache,
  StateMachine,
  
  // Event system
  TypedEventEmitter,
  
  // Configuration
  ConfigurationManager,
} from './core'

export {
  // Error classes
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from './errors'

export {
  // Type guards
  isUserId,
  isEmail,
  
  // Validators
  validateEmail,
  validatePassword,
  validateUserRole,
} from './validators'

// utils/type-guards.ts
export const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value)
}

export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean'
}

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export const isArray = <T>(value: unknown, guard?: (item: unknown) => item is T): value is T[] => {
  if (!Array.isArray(value)) return false
  if (!guard) return true
  return value.every(guard)
}

export const hasProperty = <T extends Record<string, unknown>, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> => {
  return key in obj
}

export const isNonNull = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined
}

// Utility function to create type-safe object picks
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>
  
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  
  return result
}

// Utility function to create type-safe object omits
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj }
  
  keys.forEach(key => {
    delete result[key]
  })
  
  return result
}
```

### 7.2 Namespace and Declaration Merging

**Advanced Namespace Patterns:**
```typescript
// lib/database.ts
namespace Database {
  export interface Connection {
    readonly host: string
    readonly port: number
    readonly database: string
  }

  export interface QueryResult<T = any> {
    readonly rows: T[]
    readonly rowCount: number
    readonly fields: string[]
  }

  export namespace MySQL {
    export interface Connection extends Database.Connection {
      readonly charset: string
      readonly timezone: string
    }

    export interface QueryOptions {
      readonly timeout?: number
      readonly useTransaction?: boolean
    }
  }

  export namespace PostgreSQL {
    export interface Connection extends Database.Connection {
      readonly schema: string
      readonly sslMode: 'disable' | 'require' | 'verify-ca' | 'verify-full'
    }

    export interface QueryOptions {
      readonly prepared?: boolean
      readonly rowMode?: 'array' | 'object'
    }
  }
}

// Declaration merging for extending external libraries
declare module 'next' {
  interface NextApiRequest {
    user?: User
    session?: {
      userId: UserId
      role: UserRole
      expiresAt: Date
    }
  }
}

declare module 'react' {
  interface HTMLAttributes<T> {
    'data-testid'?: string
  }
}

// Global augmentation for environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test'
      readonly DATABASE_URL: string
      readonly REDIS_URL: string
      readonly JWT_SECRET: string
      readonly NEXT_PUBLIC_API_URL: string
    }
  }
}

// Module augmentation for external libraries
declare module 'lodash' {
  interface LoDashStatic {
    isValidEmail(value: string): value is Email
    isValidUserId(value: string): value is UserId
  }
}
```

## 8. Performance and Optimization

### 8.1 Type-Level Performance

**Optimized Type Patterns:**
```typescript
// lib/performance-types.ts
// Avoid deep recursion in conditional types
type SafeDeepPartial<T, Depth extends number = 5> = Depth extends 0
  ? T
  : T extends object
  ? {
      [P in keyof T]?: SafeDeepPartial<T[P], [-1, 0, 1, 2, 3, 4][Depth]>
    }
  : T

// Use distributive conditional types efficiently
type FilterNullable<T> = T extends null | undefined ? never : T

// Optimize union types for better performance
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500

// Use template literals efficiently
type ApiEndpoint<T extends string> = `/api/${T}`
type UserEndpoint = ApiEndpoint<'users' | 'profile' | 'settings'>

// Optimize mapped types
type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// Use intersection types judiciously
type UserWithTimestamps = User & Timestamped
type UserWithValidation = User & Validatable

// Efficient type predicate functions
const isUserRole = (value: string): value is UserRole => {
  return ['admin', 'user', 'moderator'].includes(value)
}

const isHttpMethod = (value: string): value is HttpMethod => {
  return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(value)
}

// Lazy type evaluation
type LazyPick<T, K extends keyof T> = T extends any ? Pick<T, K> : never

// Cache complex type computations
type UserFieldsCache = {
  readonly required: 'id' | 'email' | 'name' | 'role'
  readonly optional: 'avatar' | 'preferences'
  readonly timestamps: 'createdAt' | 'updatedAt'
}

type RequiredUserFields = Pick<User, UserFieldsCache['required']>
type OptionalUserFields = Pick<User, UserFieldsCache['optional']>
```

### 8.2 Runtime Performance Optimization

**Type-Safe Performance Patterns:**
```typescript
// lib/performance-utils.ts
// Memoization with proper typing
type MemoizedFunction<TArgs extends readonly unknown[], TReturn> = {
  (...args: TArgs): TReturn
  cache: Map<string, TReturn>
  clear(): void
}

function memoize<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyFn?: (...args: TArgs) => string
): MemoizedFunction<TArgs, TReturn> {
  const cache = new Map<string, TReturn>()

  const memoized = (...args: TArgs): TReturn => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }

  memoized.cache = cache
  memoized.clear = () => cache.clear()

  return memoized
}

// Debouncing with proper typing
type DebouncedFunction<TArgs extends readonly unknown[]> = {
  (...args: TArgs): void
  cancel(): void
  flush(): void
}

function debounce<TArgs extends readonly unknown[]>(
  fn: (...args: TArgs) => void,
  delay: number
): DebouncedFunction<TArgs> {
  let timeoutId: NodeJS.Timeout | null = null
  let lastArgs: TArgs | null = null

  const debounced = (...args: TArgs): void => {
    lastArgs = args

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      if (lastArgs) {
        fn(...lastArgs)
        lastArgs = null
      }
    }, delay)
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
      lastArgs = null
    }
  }

  debounced.flush = () => {
    if (timeoutId && lastArgs) {
      clearTimeout(timeoutId)
      fn(...lastArgs)
      timeoutId = null
      lastArgs = null
    }
  }

  return debounced
}

// Throttling with proper typing
type ThrottledFunction<TArgs extends readonly unknown[]> = {
  (...args: TArgs): void
  cancel(): void
}

function throttle<TArgs extends readonly unknown[]>(
  fn: (...args: TArgs) => void,
  limit: number
): ThrottledFunction<TArgs> {
  let inThrottle = false
  let lastArgs: TArgs | null = null
  let timeoutId: NodeJS.Timeout | null = null

  const throttled = (...args: TArgs): void => {
    lastArgs = args

    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      lastArgs = null

      timeoutId = setTimeout(() => {
        inThrottle = false
        if (lastArgs) {
          throttled(...lastArgs)
        }
      }, limit)
    }
  }

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    inThrottle = false
    lastArgs = null
  }

  return throttled
}

// Type-safe deep clone
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const cloned = {} as T
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    
    return cloned
  }

  return obj
}

// Efficient object comparison
function shallowEqual<T extends Record<string, any>>(obj1: T, obj2: T): boolean {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) {
    return false
  }

  return keys1.every(key => obj1[key] === obj2[key])
}

function deepEqual<T>(obj1: T, obj2: T): boolean {
  if (obj1 === obj2) {
    return true
  }

  if (obj1 === null || obj2 === null || typeof obj1 !== typeof obj2) {
    return false
  }

  if (typeof obj1 !== 'object') {
    return obj1 === obj2
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false
  }

  const keys1 = Object.keys(obj1 as any)
  const keys2 = Object.keys(obj2 as any)

  if (keys1.length !== keys2.length) {
    return false
  }

  return keys1.every(key => 
    deepEqual((obj1 as any)[key], (obj2 as any)[key])
  )
}
```

## 9. Testing and Quality Assurance

### 9.1 Type-Safe Testing

**Professional Testing Patterns:**
```typescript
// __tests__/type-safe-testing.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { MockedFunction } from 'vitest'

// Type-safe mock creation
type MockedClass<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? MockedFunction<T[K]>
    : T[K]
}

function createMockClass<T>(implementation?: Partial<T>): MockedClass<T> {
  return vi.fn().mockImplementation(() => implementation) as any
}

// Test data factories with proper typing
interface TestUserData {
  id: UserId
  email: Email
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  preferences: UserPreferences
}

const createTestUser = (overrides: Partial<TestUserData> = {}): TestUserData => ({
  id: 'test_user_123' as UserId,
  email: 'test@example.com' as Email,
  name: 'Test User',
  role: 'user',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  preferences: {
    theme: 'light',
    notifications: {
      email: true,
      push: false,
      sms: false,
      marketing: false,
    },
    language: 'en',
  },
  ...overrides,
})

// Type-safe assertion helpers
const expectResult = <T, E>(result: Result<T, E>) => ({
  toBeSuccess: (expectedData?: T) => {
    expect(result.success).toBe(true)
    if (result.success && expectedData !== undefined) {
      expect(result.data).toEqual(expectedData)
    }
    return result.success ? result.data : null
  },
  
  toBeError: (expectedError?: E | string) => {
    expect(result.success).toBe(false)
    if (!result.success && expectedError !== undefined) {
      if (typeof expectedError === 'string') {
        expect(result.error).toBeInstanceOf(Error)
        expect((result.error as Error).message).toBe(expectedError)
      } else {
        expect(result.error).toEqual(expectedError)
      }
    }
    return !result.success ? result.error : null
  },
})

// Test suite example
describe('SafeUserService', () => {
  let userService: SafeUserService
  let mockRepository: MockedClass<Repository<User>>

  beforeEach(() => {
    mockRepository = createMockClass<Repository<User>>({
      findById: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })

    userService = new SafeUserService(mockRepository as any)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('findUser', () => {
    it('should return success result when user exists', async () => {
      const testUser = createTestUser()
      mockRepository.findById.mockResolvedValue(testUser)

      const result = await userService.findUser(testUser.id)

      expectResult(result).toBeSuccess(testUser)
      expect(mockRepository.findById).toHaveBeenCalledWith(testUser.id)
    })

    it('should return error result when user does not exist', async () => {
      const userId = 'nonexistent_user' as UserId
      mockRepository.findById.mockResolvedValue(null)

      const result = await userService.findUser(userId)

      const error = expectResult(result).toBeError()
      expect(error).toBeInstanceOf(NotFoundError)
      expect((error as NotFoundError).message).toBe(`User with id ${userId} not found`)
    })
  })

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      const userData: CreateUserDto = {
        email: 'new@example.com' as Email,
        name: 'New User',
        role: 'user',
      }

      const createdUser = createTestUser({
        email: userData.email,
        name: userData.name,
        role: userData.role,
      })

      mockRepository.findAll.mockResolvedValue([]) // No existing user
      mockRepository.create.mockResolvedValue(createdUser)

      const result = await userService.createUser(userData)

      expectResult(result).toBeSuccess()
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          name: userData.name,
          role: userData.role,
        })
      )
    })

    it('should return validation error for invalid email', async () => {
      const userData: CreateUserDto = {
        email: 'invalid-email' as Email,
        name: 'New User',
        role: 'user',
      }

      const result = await userService.createUser(userData)

      const error = expectResult(result).toBeError()
      expect(error).toBeInstanceOf(ValidationError)
      expect((error as ValidationError).field).toBe('email')
    })

    it('should return validation error when user already exists', async () => {
      const userData: CreateUserDto = {
        email: 'existing@example.com' as Email,
        name: 'New User',
        role: 'user',
      }

      const existingUser = createTestUser({ email: userData.email })
      mockRepository.findAll.mockResolvedValue([existingUser])

      const result = await userService.createUser(userData)

      const error = expectResult(result).toBeError()
      expect(error).toBeInstanceOf(ValidationError)
      expect((error as ValidationError).field).toBe('email')
      expect((error as ValidationError).message).toBe('User with this email already exists')
    })
  })
})

// Property-based testing helper
type PropertyTest<T> = {
  property: keyof T
  values: Array<{ input: any; expected: boolean; description: string }>
}

function testProperty<T>(
  validator: (value: any) => value is T[keyof T],
  tests: PropertyTest<T>[]
): void {
  tests.forEach(({ property, values }) => {
    describe(`${String(property)} validation`, () => {
      values.forEach(({ input, expected, description }) => {
        it(`should ${expected ? 'accept' : 'reject'} ${description}`, () => {
          expect(validator(input)).toBe(expected)
        })
      })
    })
  })
}

// Usage example for property-based testing
testProperty(isEmail, [
  {
    property: 'email',
    values: [
      { input: 'valid@example.com', expected: true, description: 'valid email' },
      { input: 'invalid-email', expected: false, description: 'invalid email format' },
      { input: '', expected: false, description: 'empty string' },
      { input: null, expected: false, description: 'null value' },
      { input: undefined, expected: false, description: 'undefined value' },
    ],
  },
])
```

## 10. Documentation and Maintenance

### 10.1 Comprehensive Documentation Standards

**Professional Documentation Patterns:**
```typescript
/**
 * @fileoverview Professional TypeScript utility library
 * @version 1.0.0
 * @author Development Team
 * @since 2024-01-01
 */

/**
 * Generic repository interface for data access operations
 * 
 * @template TEntity - The entity type this repository manages
 * @template TId - The type of the entity's identifier (defaults to string)
 * 
 * @example
 * ```typescript
 * interface User extends BaseEntity {
 *   email: string
 *   name: string
 * }
 * 
 * const userRepo: Repository<User> = new InMemoryRepository<User>()
 * const user = await userRepo.findById('user_123')
 * ```
 */
interface Repository<TEntity, TId = string> {
  /**
   * Finds an entity by its unique identifier
   * 
   * @param id - The unique identifier of the entity
   * @returns Promise that resolves to the entity or null if not found
   * 
   * @throws {DatabaseError} When database connection fails
   */
  findById(id: TId): Promise<TEntity | null>

  /**
   * Finds all entities matching the given criteria
   * 
   * @param criteria - Partial entity object to match against
   * @returns Promise that resolves to an array of matching entities
   * 
   * @example
   * ```typescript
   * const activeUsers = await userRepo.findAll({ status: 'active' })
   * ```
   */
  findAll(criteria?: Partial<TEntity>): Promise<TEntity[]>

  /**
   * Creates a new entity in the repository
   * 
   * @param entity - The entity data without the id field
   * @returns Promise that resolves to the created entity with generated id
   * 
   * @throws {ValidationError} When entity data is invalid
   * @throws {DuplicateError} When entity with same unique fields already exists
   */
  create(entity: Omit<TEntity, 'id'>): Promise<TEntity>

  /**
   * Updates an existing entity with partial data
   * 
   * @param id - The unique identifier of the entity to update
   * @param updates - Partial entity data containing fields to update
   * @returns Promise that resolves to the updated entity or null if not found
   * 
   * @throws {ValidationError} When update data is invalid
   */
  update(id: TId, updates: Partial<TEntity>): Promise<TEntity | null>

  /**
   * Deletes an entity by its unique identifier
   * 
   * @param id - The unique identifier of the entity to delete
   * @returns Promise that resolves to true if deleted, false if not found
   * 
   * @throws {DatabaseError} When deletion fails due to constraints
   */
  delete(id: TId): Promise<boolean>
}

/**
 * Type-safe configuration for API client requests
 * 
 * @public
 */
interface RequestConfig {
  /** HTTP method for the request @defaultValue 'GET' */
  readonly method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  
  /** Additional headers to include in the request */
  readonly headers?: Record<string, string>
  
  /** Request body data (will be JSON stringified) */
  readonly body?: unknown
  
  /** Request timeout in milliseconds @defaultValue 10000 */
  readonly timeout?: number
  
  /** Number of retry attempts on failure @defaultValue 0 */
  readonly retries?: number
}

/**
 * Creates a type-safe memoized version of a function
 * 
 * @template TArgs - Tuple type representing function arguments
 * @template TReturn - Function return type
 * 
 * @param fn - The function to memoize
 * @param keyFn - Optional custom key generation function
 * @returns Memoized function with cache management methods
 * 
 * @remarks
 * The memoized function includes a `cache` property for direct cache access
 * and a `clear()` method for cache invalidation.
 * 
 * @example
 * ```typescript
 * const expensiveCalculation = (a: number, b: number): number => {
 *   console.log('Computing...')
 *   return a * b
 * }
 * 
 * const memoized = memoize(expensiveCalculation)
 * 
 * console.log(memoized(5, 10)) // Logs "Computing..." then 50
 * console.log(memoized(5, 10)) // Returns 50 without logging
 * 
 * memoized.clear() // Clears the cache
 * ```
 * 
 * @see {@link https://lodash.com/docs#memoize} for inspiration
 */
function memoize<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keyFn?: (...args: TArgs) => string
): MemoizedFunction<TArgs, TReturn>
```

### 10.2 Maintenance Guidelines

**Quality Assurance Checklist:**

**Daily Maintenance:**
- [ ] TypeScript compiler warnings addressed
- [ ] Type coverage maintained above 95%
- [ ] No any types in production code
- [ ] All public APIs properly documented
- [ ] Test coverage for new type definitions

**Weekly Maintenance:**
- [ ] Review and update type definitions
- [ ] Validate generic constraints
- [ ] Check for unused types and interfaces
- [ ] Update documentation examples
- [ ] Review error handling patterns

**Monthly Maintenance:**
- [ ] TypeScript version updates
- [ ] Type library dependency updates
- [ ] Performance analysis of complex types
- [ ] Code review of type safety patterns
- [ ] Documentation completeness audit

**Quarterly Maintenance:**
- [ ] Major type refactoring initiatives
- [ ] Type safety architecture review
- [ ] Performance benchmarking
- [ ] Developer experience improvements
- [ ] Training and best practices updates

This comprehensive TypeScript best practices document establishes enterprise-grade standards for type safety, performance, and maintainability, ensuring consistent and robust TypeScript development that aligns with Model Context Protocol requirements.