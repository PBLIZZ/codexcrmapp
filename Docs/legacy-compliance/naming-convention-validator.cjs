const fs = require('fs');
const path = require('path');

// Read the JSON scan results
const scanResults = JSON.parse(fs.readFileSync('./monorepo-scan-results.json', 'utf8'));

// Regex pattern for component naming: PascalCase.tsx
const componentRegex = /^[A-Z][a-zA-Z0-9]*\.tsx$/;

// Special case for page.tsx files (Next.js convention)
const pageRegex = /^page\.tsx$/;

// Special case for layout.tsx files (Next.js convention)
const layoutRegex = /^layout\.tsx$/;

// Special case for kebab-case UI components (shadcn convention)
const kebabCaseRegex = /^[a-z]+(?:-[a-z]+)*\.tsx$/;

// Business critical components (highest priority)
const businessCriticalComponents = [
  'AppSidebarController',
  'MainLayout', 
  'UserNav',
  'AppContent',
  'Header',
  'MobileMenu'
];

// Core navigation components (high priority)
const coreNavigationComponents = [
  'SidebarNavLink',
  'SidebarGroupLink', 
  'MainSectionNav',
  'ProjectLinksNav',
  'QuickLinksNav'
];

function getFileName(filePath) {
  return path.basename(filePath);
}

function getBusinessImpact(fileName, filePath) {
  const componentName = fileName.replace('.tsx', '');
  
  if (businessCriticalComponents.includes(componentName)) {
    return 'CRITICAL';
  }
  if (coreNavigationComponents.includes(componentName)) {
    return 'HIGH';
  }
  if (filePath.includes('/layout/') || filePath.includes('/auth/')) {
    return 'HIGH';
  }
  if (filePath.includes('/ui/')) {
    return 'MEDIUM';
  }
  if (filePath.includes('/dashboard/') || filePath.includes('/contacts/') || filePath.includes('/tasks/')) {
    return 'MEDIUM';
  }
  return 'LOW';
}

function getApplicationSection(filePath) {
  if (filePath.includes('/dashboard/')) return 'Dashboard';
  if (filePath.includes('/contacts/')) return 'Contacts';
  if (filePath.includes('/tasks/')) return 'Tasks';
  if (filePath.includes('/marketing/')) return 'Marketing';
  if (filePath.includes('/auth/')) return 'Authentication';
  if (filePath.includes('/layout/')) return 'Layout';
  if (filePath.includes('/ui/')) return 'UI Components';
  if (filePath.includes('/groups/')) return 'Groups';
  if (filePath.includes('/omni-bot/')) return 'OmniBot';
  return 'Other';
}

function validateFileName(filePath) {
  const fileName = getFileName(filePath);
  const businessImpact = getBusinessImpact(fileName, filePath);
  const appSection = getApplicationSection(filePath);
  
  let isValid = false;
  let expectedPattern = '';
  let violationType = '';
  
  // Check for page.tsx files (Next.js convention - valid)
  if (pageRegex.test(fileName)) {
    isValid = true;
    expectedPattern = 'page.tsx (Next.js convention)';
  }
  // Check for layout.tsx files (Next.js convention - valid)
  else if (layoutRegex.test(fileName)) {
    isValid = true;
    expectedPattern = 'layout.tsx (Next.js convention)';
  }
  // Check for kebab-case UI components (shadcn convention)
  else if (filePath.includes('/ui/') && kebabCaseRegex.test(fileName)) {
    isValid = true;
    expectedPattern = 'kebab-case.tsx (shadcn UI convention)';
  }
  // Check for PascalCase components (standard React convention)
  else if (componentRegex.test(fileName)) {
    isValid = true;
    expectedPattern = 'PascalCase.tsx (React component convention)';
  }
  // Violation detected
  else {
    isValid = false;
    expectedPattern = 'PascalCase.tsx';
    
    // Determine violation type
    if (fileName.includes('-')) {
      violationType = 'kebab-case in non-UI component';
    } else if (fileName.toLowerCase() === fileName) {
      violationType = 'lowercase filename';
    } else if (fileName.includes('_')) {
      violationType = 'snake_case filename';
    } else {
      violationType = 'invalid naming pattern';
    }
  }
  
  return {
    filePath,
    fileName,
    isValid,
    expectedPattern,
    violationType,
    businessImpact,
    appSection
  };
}

// Collect all component files from the scan results
const allFiles = [];

// Add core layout components
Object.values(scanResults.monorepo_scan_results.core_layout_components).forEach(filePath => {
  allFiles.push(filePath);
});

// Add section components
Object.values(scanResults.monorepo_scan_results.codex_app_core_sections).forEach(section => {
  if (section.component_files) {
    allFiles.push(...section.component_files);
  }
  if (section.widget_files) {
    allFiles.push(...section.widget_files);
  }
  if (section.sidebar_file) {
    allFiles.push(section.sidebar_file);
  }
  if (section.page_files) {
    allFiles.push(...section.page_files);
  }
});

// Add additional components
if (scanResults.monorepo_scan_results.additional_components.omni_bot) {
  allFiles.push(scanResults.monorepo_scan_results.additional_components.omni_bot);
}
if (scanResults.monorepo_scan_results.additional_components.omni_bot_float) {
  allFiles.push(scanResults.monorepo_scan_results.additional_components.omni_bot_float);
}
Object.values(scanResults.monorepo_scan_results.additional_components.navigation).forEach(filePath => {
  allFiles.push(filePath);
});

// Add authentication components
allFiles.push(...scanResults.monorepo_scan_results.authentication_pages.pages);
allFiles.push(...scanResults.monorepo_scan_results.authentication_pages.components);

// Add UI components
allFiles.push(...scanResults.monorepo_scan_results.ui_components.shadcn_ui);
allFiles.push(...scanResults.monorepo_scan_results.ui_components.custom_ui);

// Add providers and global files
allFiles.push(...scanResults.monorepo_scan_results.providers_and_global.providers);
allFiles.push(scanResults.monorepo_scan_results.providers_and_global.global_error);
allFiles.push(scanResults.monorepo_scan_results.providers_and_global.root_page);

// Remove duplicates
const uniqueFiles = [...new Set(allFiles)];

// Validate all files
const validationResults = uniqueFiles.map(validateFileName);

// Separate violations from valid files
const violations = validationResults.filter(result => !result.isValid);
const validFiles = validationResults.filter(result => result.isValid);

// Sort violations by business impact
const impactOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
violations.sort((a, b) => {
  const impactCompare = impactOrder[a.businessImpact] - impactOrder[b.businessImpact];
  if (impactCompare !== 0) return impactCompare;
  return a.appSection.localeCompare(b.appSection);
});

// Generate statistics
const stats = {
  totalFiles: validationResults.length,
  validFiles: validFiles.length,
  violations: violations.length,
  criticalViolations: violations.filter(v => v.businessImpact === 'CRITICAL').length,
  highViolations: violations.filter(v => v.businessImpact === 'HIGH').length,
  mediumViolations: violations.filter(v => v.businessImpact === 'MEDIUM').length,
  lowViolations: violations.filter(v => v.businessImpact === 'LOW').length
};

// Generate Markdown report
let markdown = `# Naming Convention Validation Report

## Executive Summary

This report analyzes **${stats.totalFiles}** TypeScript React component files across the CodexCRM monorepo for compliance with established naming conventions. The analysis prioritizes business-critical components and core navigation elements.

### Validation Results

- ✅ **Valid Files**: ${stats.validFiles} (${((stats.validFiles / stats.totalFiles) * 100).toFixed(1)}%)
- ❌ **Violations**: ${stats.violations} (${((stats.violations / stats.totalFiles) * 100).toFixed(1)}%)

### Violation Severity Breakdown

| Impact Level | Count | Percentage |
|--------------|-------|------------|
| 🔴 Critical | ${stats.criticalViolations} | ${((stats.criticalViolations / stats.totalFiles) * 100).toFixed(1)}% |
| 🟡 High | ${stats.highViolations} | ${((stats.highViolations / stats.totalFiles) * 100).toFixed(1)}% |
| 🟠 Medium | ${stats.mediumViolations} | ${((stats.mediumViolations / stats.totalFiles) * 100).toFixed(1)}% |
| 🟢 Low | ${stats.lowViolations} | ${((stats.lowViolations / stats.totalFiles) * 100).toFixed(1)}% |

## Naming Convention Standards

### Expected Patterns

1. **React Components**: \`PascalCase.tsx\` (e.g., \`UserProfile.tsx\`)
2. **Next.js Pages**: \`page.tsx\` (App Router convention)
3. **Next.js Layouts**: \`layout.tsx\` (App Router convention)
4. **UI Components**: \`kebab-case.tsx\` (shadcn/ui convention for primitives)

### Validation Regex

Components are validated against: \`^[A-Z][a-zA-Z0-9]*\\.tsx$\`

`;

if (violations.length > 0) {
  markdown += `## 🚨 Naming Convention Violations

The following files violate established naming conventions and require immediate attention:

`;

  // Group violations by business impact
  const groupedViolations = {
    CRITICAL: violations.filter(v => v.businessImpact === 'CRITICAL'),
    HIGH: violations.filter(v => v.businessImpact === 'HIGH'),
    MEDIUM: violations.filter(v => v.businessImpact === 'MEDIUM'),
    LOW: violations.filter(v => v.businessImpact === 'LOW')
  };

  Object.entries(groupedViolations).forEach(([impact, impactViolations]) => {
    if (impactViolations.length === 0) return;
    
    let emoji = '';
    switch (impact) {
      case 'CRITICAL': emoji = '🔴'; break;
      case 'HIGH': emoji = '🟡'; break;
      case 'MEDIUM': emoji = '🟠'; break;
      case 'LOW': emoji = '🟢'; break;
    }
    
    markdown += `### ${emoji} ${impact} Impact Violations (${impactViolations.length})\n\n`;
    markdown += `| File Path | Current Name | Expected Pattern | Violation Type | App Section |\n`;
    markdown += `|-----------|--------------|------------------|----------------|-------------|\n`;
    
    impactViolations.forEach(violation => {
      markdown += `| \`${violation.filePath}\` | \`${violation.fileName}\` | \`${violation.expectedPattern}\` | ${violation.violationType} | ${violation.appSection} |\n`;
    });
    
    markdown += `\n`;
  });
}

markdown += `## ✅ Compliant Files Summary

The following ${validFiles.length} files follow proper naming conventions:

### By Application Section

`;

// Group valid files by section
const validBySection = {};
validFiles.forEach(file => {
  const section = file.appSection;
  if (!validBySection[section]) {
    validBySection[section] = [];
  }
  validBySection[section].push(file);
});

Object.entries(validBySection).forEach(([section, files]) => {
  markdown += `#### ${section} (${files.length} files)\n\n`;
  markdown += `| File Path | Pattern Used |\n`;
  markdown += `|-----------|-------------|\n`;
  files.forEach(file => {
    markdown += `| \`${file.filePath}\` | ${file.expectedPattern} |\n`;
  });
  markdown += `\n`;
});

markdown += `## Recommendations

### Immediate Actions Required

1. **Address Critical Violations**: Fix all critical impact violations immediately as they affect core app functionality
2. **High Priority Fixes**: Resolve high impact violations in layout and navigation components
3. **Standardization**: Implement consistent PascalCase naming for all React components
4. **Exception Documentation**: Document valid exceptions (page.tsx, layout.tsx, kebab-case UI primitives)

### Implementation Strategy

1. **Phase 1**: Fix critical and high impact violations first
2. **Phase 2**: Address medium impact violations in business logic components
3. **Phase 3**: Clean up low impact violations for consistency

### Automated Prevention

Consider implementing:
- ESLint rules for file naming conventions
- Pre-commit hooks to validate naming patterns
- CI/CD checks for naming compliance

---

*Report generated on ${new Date().toISOString()} for Task #286*
*Total files analyzed: ${stats.totalFiles} | Compliance rate: ${((stats.validFiles / stats.totalFiles) * 100).toFixed(1)}%*
`;

// Write the markdown report
fs.writeFileSync('./naming-convention-violations-report.md', markdown);

console.log('Naming convention validation completed!');
console.log(`Total files analyzed: ${stats.totalFiles}`);
console.log(`Valid files: ${stats.validFiles}`);
console.log(`Violations found: ${stats.violations}`);
console.log(`Report saved to: naming-convention-violations-report.md`);