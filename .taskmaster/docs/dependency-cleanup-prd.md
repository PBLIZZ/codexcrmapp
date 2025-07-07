# Product Requirements Document: CodexCRM Dependency Cleanup & Build Optimization

## Executive Summary

The CodexCRM monorepo is experiencing critical build failures and memory exhaustion (2GB+ consumption) due to dependency conflicts, version inconsistencies, and poor dependency management. This PRD outlines a systematic approach to resolve these issues and optimize the build system.

## Problem Statement

### Current Issues
1. **Critical Build Failures**: ESLint version conflicts between root (v9) and config package (v8)
2. **Memory Exhaustion**: Development server consuming 2GB+ memory due to dependency duplication
3. **Version Drift**: Inconsistent package versions across workspace packages
4. **Poor Dependency Distribution**: Heavy dependencies scattered across packages instead of centralized

### Impact
- Developers cannot run the dev server without memory issues
- Build processes are failing due to version conflicts
- CI/CD pipelines are unstable
- Development velocity is severely impacted

## Solution Overview

Implement a comprehensive dependency cleanup strategy focusing on:
1. Resolving critical version conflicts
2. Centralizing common dependencies
3. Eliminating unnecessary duplications
4. Standardizing package manager configurations

## Requirements

### 1. Critical Version Conflict Resolution

#### 1.1 ESLint Version Standardization (P0)
- **Requirement**: Standardize all ESLint dependencies to version 9.x
- **Acceptance Criteria**:
  - All packages use ESLint 9.x compatible plugins
  - No version conflicts in dependency tree
  - Linting works across all packages
  - Build processes complete successfully

#### 1.2 tRPC Version Alignment (P0)
- **Requirement**: Remove pre-release tRPC versions and standardize to stable v11.3.1
- **Acceptance Criteria**:
  - All tRPC packages use stable version 11.3.1
  - No pre-release dependencies in production code
  - Type compatibility maintained across packages
  - API functionality preserved

#### 1.3 Supabase Version Unification (P1)
- **Requirement**: Standardize all Supabase packages to latest stable version
- **Acceptance Criteria**:
  - All packages use Supabase v2.49.4
  - Authentication flows continue working
  - Database connections remain stable
  - No breaking changes introduced

### 2. Dependency Centralization

#### 2.1 Root-Level Common Dependencies (P0)
- **Requirement**: Move shared development dependencies to root package.json
- **Dependencies to Centralize**:
  - `typescript` (remove from 6+ packages)
  - `@types/react` and `@types/react-dom`
  - `@types/node`
  - `rimraf` utility
  - `eslint` (except config package)
- **Acceptance Criteria**:
  - Dependencies installed once at root level
  - All packages can access shared dependencies
  - Build performance improved
  - Memory usage reduced

#### 2.2 Package Manager Standardization (P1)
- **Requirement**: Standardize package manager versions across all packages
- **Acceptance Criteria**:
  - All packages use consistent pnpm version (10.12.4)
  - Remove inconsistent packageManager fields
  - Lockfile remains stable

### 3. Dependency Cleanup

#### 3.1 Remove Unnecessary Dependencies (P1)
- **Requirement**: Identify and remove unused or misplaced dependencies
- **Target Areas**:
  - Next.js dependencies in non-frontend packages
  - Duplicate build tools (tsup, rimraf, etc.)
  - Unused TypeScript installations
- **Acceptance Criteria**:
  - No unused dependencies in any package
  - All packages can still build successfully
  - Functionality preserved

#### 3.2 Peer Dependency Optimization (P2)
- **Requirement**: Convert appropriate dependencies to peer dependencies
- **Acceptance Criteria**:
  - UI package uses peer dependencies for React
  - Reduced bundle duplication
  - Proper peer dependency warnings

### 4. Build System Optimization

#### 4.1 Centralized Build Configuration (P1)
- **Requirement**: Consolidate build tools and configurations
- **Acceptance Criteria**:
  - Build tools centralized where possible
  - Consistent build processes across packages
  - Improved build performance

#### 4.2 Memory Usage Optimization (P0)
- **Requirement**: Reduce development server memory consumption
- **Target**: Reduce memory usage from 2GB+ to under 1GB
- **Acceptance Criteria**:
  - Dev server runs without memory exhaustion
  - Build processes complete within memory limits
  - Development experience improved

## Implementation Strategy

### Phase 1: Critical Fixes (Immediate)
1. Fix ESLint version conflicts
2. Standardize tRPC versions
3. Test build processes

### Phase 2: Dependency Centralization (Week 1)
1. Move TypeScript to root
2. Centralize common dev dependencies
3. Remove duplicates

### Phase 3: Optimization (Week 2)
1. Supabase version alignment
2. Package manager standardization
3. Final cleanup and testing

## Success Metrics

### Primary Metrics
- **Memory Usage**: < 1GB for dev server (from 2GB+)
- **Build Success Rate**: 100% (from failing)
- **Dependency Count**: Reduce total dependencies by 30%

### Secondary Metrics
- **Build Time**: Improve by 20%
- **Install Time**: Reduce by 25%
- **Bundle Size**: Reduce by 15%

## Risk Assessment

### High Risk
- Breaking changes in ESLint 9 migration
- Type compatibility issues with tRPC updates

### Mitigation
- Thorough testing after each change
- Incremental updates with rollback capability
- Maintain development branch for testing

## Testing Strategy

### Validation Requirements
1. All packages build successfully
2. All existing functionality preserved
3. No new lint errors introduced
4. Memory usage within acceptable limits
5. CI/CD pipelines pass

### Test Coverage
- Unit tests continue passing
- Integration tests validate API functionality
- Build processes complete successfully
- Development server starts without issues

## Technical Specifications

### Dependency Versions (Target State)
```json
{
  "eslint": "^9.0.0",
  "@trpc/client": "^11.3.1",
  "@trpc/server": "^11.3.1",
  "@supabase/supabase-js": "^2.49.4",
  "typescript": "^5.6.0",
  "pnpm": "10.12.4"
}
```

### Package Structure (Post-Cleanup)
- Root: Common dev dependencies and build tools
- Apps/Web: Application-specific dependencies only
- Packages: Minimal, focused dependencies per package
- Config: Shared configuration with appropriate versions

## Rollback Plan

### Rollback Triggers
- Build failures that cannot be resolved quickly
- Breaking functionality in critical paths
- Memory usage increases beyond current levels

### Rollback Procedure
1. Revert to previous working commit
2. Document issues encountered
3. Plan incremental approach for problematic changes

## Timeline

- **Day 1**: Critical version conflicts (ESLint, tRPC)
- **Day 2-3**: Dependency centralization
- **Day 4-5**: Cleanup and optimization
- **Day 6-7**: Testing and validation

## Dependencies

### Technical Dependencies
- Access to all package.json files
- Ability to run build processes for testing
- Package manager access (pnpm)

### Business Dependencies
- Development team availability for testing
- Stakeholder approval for changes
- CI/CD system access

## Success Criteria

The project will be considered successful when:
1. Development server runs under 1GB memory usage
2. All build processes complete successfully
3. No version conflicts in dependency tree
4. All existing functionality preserved
5. Improved development experience confirmed by team