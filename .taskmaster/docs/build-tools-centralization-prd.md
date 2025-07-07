# Product Requirements Document: Build Tools Centralization & Architectural Cleanup

## Executive Summary

Following the successful dependency cleanup, critical build tool and architectural issues remain that impact maintainability, consistency, and the monorepo's architectural integrity. This PRD addresses scattered build tools, misplaced dependencies, and architectural violations that prevent the monorepo from reaching optimal efficiency.

## Problem Statement

### Current Issues
1. **Scattered Build Tools**: Multiple packages maintain individual build tools (tsup, rimraf, postcss) instead of centralized management
2. **Architectural Violations**: Next.js dependencies in packages that shouldn't need them (auth, UI)
3. **Version Inconsistencies**: Different versions of the same tools across packages
4. **UI Package Over-Engineering**: Massive build tooling in UI package that should be centralized
5. **Missing Infrastructure**: No centralized package manager configuration

### Impact
- Inconsistent build processes across packages
- Difficult maintenance when updating build tools
- Architectural coupling violations
- Increased bundle sizes and complexity
- Potential version conflicts and build failures

## Solution Overview

Implement a comprehensive build tools centralization strategy:
1. Centralize all build tools to root package
2. Remove architectural violations (Next.js in wrong packages)
3. Standardize package manager configurations
4. Optimize UI package dependencies
5. Establish consistent build patterns

## Requirements

### 1. Build Tools Centralization (P0)

#### 1.1 Centralize tsup Configuration
- **Requirement**: Move all tsup dependencies and configurations to root level
- **Affected Packages**: UI package (^8.2.3), trpc package (^8.0.0), config package (^8.0.2)
- **Acceptance Criteria**:
  - Single tsup version in root package.json
  - Individual packages reference centralized tsup
  - All packages build successfully with centralized configuration
  - Consistent build output across packages

#### 1.2 Centralize rimraf Utility
- **Requirement**: Standardize file cleanup utility across monorepo
- **Current State**: Root has ^6.0.1, UI package has ^5.0.9
- **Acceptance Criteria**:
  - Single rimraf version in root (latest stable)
  - Remove rimraf from individual packages
  - All clean scripts work with centralized version

#### 1.3 Centralize ESLint Versions
- **Requirement**: Ensure consistent ESLint versions across packages
- **Current State**: Root ^9.0.0, database/UI ^9.29.0
- **Acceptance Criteria**:
  - Single ESLint version in root
  - Remove ESLint from individual packages
  - All linting works with centralized configuration

### 2. Architectural Violations Cleanup (P0)

#### 2.1 Remove Next.js from Auth Package
- **Requirement**: Auth package should not depend on Next.js
- **Current Issue**: next ^15.3.1 in devDependencies
- **Acceptance Criteria**:
  - Remove Next.js dependency from auth package
  - Auth functionality still works correctly
  - No build errors after removal
  - Auth package remains framework-agnostic

#### 2.2 Optimize UI Package Next.js Dependency
- **Requirement**: Convert Next.js to peer dependency in UI package
- **Current Issue**: next ^15.0.0 as regular dependency
- **Acceptance Criteria**:
  - Next.js moved to peerDependencies
  - UI package still builds correctly
  - Reduced bundle size for UI package
  - Proper peer dependency warnings

#### 2.3 Remove UI Dependencies from API Package
- **Requirement**: API package should not have UI-related dependencies
- **Current Issues**: next-themes ^0.4.6, sonner ^2.0.3
- **Acceptance Criteria**:
  - Remove UI theming and notification dependencies
  - API functionality preserved
  - Clean architectural separation maintained

### 3. Package Manager Standardization (P1)

#### 3.1 Consistent Package Manager Configuration
- **Requirement**: All packages should reference consistent pnpm version
- **Current State**: Only root has packageManager field
- **Acceptance Criteria**:
  - All packages have consistent packageManager field
  - Lock file remains stable
  - Installation process consistent across packages

### 4. Build Configuration Optimization (P1)

#### 4.1 Centralize PostCSS Configuration
- **Requirement**: Consolidate PostCSS tooling for Tailwind processing
- **Current State**: Individual PostCSS configs in packages
- **Acceptance Criteria**:
  - Centralized PostCSS configuration
  - Tailwind processing works correctly
  - Consistent CSS build output

#### 4.2 Centralize Tailwind Configuration
- **Requirement**: Optimize Tailwind CSS build setup
- **Current State**: Multiple Tailwind configs across packages
- **Acceptance Criteria**:
  - Efficient Tailwind configuration
  - Proper CSS purging and optimization
  - Reduced build times

### 5. Version Consistency (P2)

#### 5.1 Standardize Build Tool Versions
- **Requirement**: Ensure all build tools use consistent versions
- **Current Issues**: Various tsup versions, rimraf versions
- **Acceptance Criteria**:
  - Single version for each build tool
  - All packages use centralized versions
  - No version conflicts in dependency tree

#### 5.2 Standardize Development Tools
- **Requirement**: Consistent development tooling versions
- **Current Issues**: Different Supabase CLI versions
- **Acceptance Criteria**:
  - Consistent tool versions across packages
  - Reliable development experience

## Implementation Strategy

### Phase 1: Critical Architectural Fixes (Day 1)
1. Remove Next.js from auth package
2. Fix UI dependencies in API package
3. Test core functionality preservation

### Phase 2: Build Tools Centralization (Day 2)
1. Centralize tsup configuration
2. Standardize rimraf usage
3. Consolidate ESLint versions

### Phase 3: Configuration Optimization (Day 3)
1. Optimize UI package dependencies
2. Centralize PostCSS/Tailwind configuration
3. Standardize package manager configs

### Phase 4: Validation and Testing (Day 4)
1. Comprehensive build testing
2. Functionality validation
3. Performance measurement

## Success Metrics

### Primary Metrics
- **Build Tool Count**: Reduce individual build tool installations by 80%
- **Package Complexity**: Reduce UI package devDependencies by 30%
- **Version Consistency**: 100% version alignment for shared tools

### Secondary Metrics
- **Build Time**: Maintain or improve build performance
- **Bundle Size**: Reduce UI package bundle by 20%
- **Architectural Purity**: Zero architectural violations

## Risk Assessment

### High Risk
- Breaking UI package builds with dependency changes
- Auth functionality disruption from Next.js removal

### Mitigation
- Incremental changes with testing at each step
- Backup configurations before major changes
- Rollback plan for each phase

## Testing Strategy

### Validation Requirements
1. All packages build successfully
2. UI components render correctly
3. Auth functionality preserved
4. API endpoints function properly
5. Development server starts without issues

### Test Coverage
- Build process validation for each package
- Runtime functionality testing
- Integration testing across package boundaries
- Performance regression testing

## Technical Specifications

### Target Build Tool Versions
```json
{
  "tsup": "^8.2.3",
  "rimraf": "^6.0.1", 
  "eslint": "^9.0.0",
  "postcss": "^8.4.33",
  "tailwindcss": "^4.1.4"
}
```

### Target Package Structure
- Root: All build tools and shared configurations
- Packages: Minimal, focused dependencies only
- UI: Optimized component library with peer dependencies
- API: Pure backend logic without UI dependencies
- Auth: Framework-agnostic authentication utilities

## Acceptance Criteria Summary

The project will be considered successful when:
1. All build tools centralized to root package
2. Zero architectural violations (Next.js in wrong packages)
3. Consistent package manager configurations
4. UI package optimized and framework-agnostic
5. All packages build and function correctly
6. Performance maintained or improved

## Dependencies

### Technical Dependencies
- Completion of dependency cleanup (Tasks 331-334)
- Access to all package.json files
- Build testing capabilities

### Business Dependencies
- Development team coordination
- Testing time allocation
- Rollback procedures documentation

## Rollback Plan

### Rollback Triggers
- Build failures that cannot be resolved within 2 hours
- Functional regressions in critical paths
- Performance degradation beyond acceptable thresholds

### Rollback Procedure
1. Revert package.json changes in reverse order
2. Restore previous working configurations
3. Document issues for iterative resolution
4. Plan alternative implementation approaches