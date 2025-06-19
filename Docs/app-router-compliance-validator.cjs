const fs = require('fs');
const path = require('path');

// Read the JSON scan results from task 285
const scanResults = JSON.parse(fs.readFileSync('./monorepo-scan-results.json', 'utf8'));

// Next.js 15 App Router standards and patterns
const appRouterStandards = {
  // Required files for pages
  pageFile: 'page.tsx',
  layoutFile: 'layout.tsx',
  loadingFile: 'loading.tsx',
  errorFile: 'error.tsx',
  notFoundFile: 'not-found.tsx',
  
  // Protected vs unprotected routes
  protectedRoutes: [
    '/dashboard',
    '/contacts',
    '/tasks',
    '/messages',
    '/calendar',
    '/marketing',
    '/analytics',
    '/settings',
    '/account'
  ],
  
  unprotectedRoutes: [
    '/(auth)/log-in',
    '/(auth)/sign-up',
    '/(auth)/forgot-password',
    '/(auth)/reset-password',
    '/docs'
  ],
  
  // Special route groups
  authGroup: '(auth)',
  
  // Expected nested routing patterns
  nestedRouting: {
    '/contacts': ['/contacts/groups', '/contacts/[contactId]', '/contacts/import'],
    '/tasks': [],
    '/messages': [],
    '/marketing': [],
    '/settings': []
  }
};

function findAppDirectories() {
  const appBasePath = './apps/web/app';
  const directories = [];
  
  function scanDirectory(dirPath, routePath = '') {
    if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory()) {
      return;
    }
    
    const items = fs.readdirSync(dirPath);
    const hasPageFile = items.includes('page.tsx');
    const hasLayoutFile = items.includes('layout.tsx');
    const hasLoadingFile = items.includes('loading.tsx');
    const hasErrorFile = items.includes('error.tsx');
    const hasNotFoundFile = items.includes('not-found.tsx');
    
    if (hasPageFile || hasLayoutFile || routePath === '') {
      directories.push({
        path: dirPath,
        routePath: routePath || '/',
        hasPageFile,
        hasLayoutFile,
        hasLoadingFile,
        hasErrorFile,
        hasNotFoundFile,
        files: items.filter(item => item.endsWith('.tsx')),
        subdirectories: items.filter(item => {
          const itemPath = path.join(dirPath, item);
          return fs.lstatSync(itemPath).isDirectory();
        })
      });
    }
    
    // Recursively scan subdirectories
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      if (fs.lstatSync(itemPath).isDirectory()) {
        let newRoutePath;
        if (item.startsWith('(') && item.endsWith(')')) {
          // Route group - doesn't affect URL
          newRoutePath = routePath;
        } else if (item.startsWith('[') && item.endsWith(']')) {
          // Dynamic route
          newRoutePath = routePath + '/' + item;
        } else {
          // Regular route
          newRoutePath = routePath + '/' + item;
        }
        scanDirectory(itemPath, newRoutePath);
      }
    }
  }
  
  scanDirectory(appBasePath);
  return directories;
}

function validateAuthFlow(directories) {
  const authRoutes = directories.filter(dir => 
    dir.routePath.includes('(auth)') || dir.routePath.includes('/auth')
  );
  
  const protectedRoutes = directories.filter(dir =>
    appRouterStandards.protectedRoutes.some(route => dir.routePath.startsWith(route))
  );
  
  const authCompliance = {
    unprotectedAuthRoutes: [],
    protectedMainRoutes: [],
    authRedirectsPresent: false,
    loadingStatesPresent: false
  };
  
  // Check auth routes
  authRoutes.forEach(route => {
    authCompliance.unprotectedAuthRoutes.push({
      path: route.path,
      routePath: route.routePath,
      hasPage: route.hasPageFile,
      hasLayout: route.hasLayoutFile,
      compliance: route.hasPageFile ? 'COMPLIANT' : 'MISSING_PAGE'
    });
  });
  
  // Check protected routes
  protectedRoutes.forEach(route => {
    const hasProtection = checkForAuthProtection(route.path);
    authCompliance.protectedMainRoutes.push({
      path: route.path,
      routePath: route.routePath,
      hasPage: route.hasPageFile,
      hasLayout: route.hasLayoutFile,
      hasLoading: route.hasLoadingFile,
      hasAuthProtection: hasProtection,
      compliance: route.hasPageFile && hasProtection ? 'COMPLIANT' : 'NEEDS_REVIEW'
    });
  });
  
  return authCompliance;
}

function checkForAuthProtection(dirPath) {
  // Check if directory or parent directories have auth protection
  // This is a simplified check - in reality we'd scan file contents
  const layoutPath = path.join(dirPath, 'layout.tsx');
  const pagePath = path.join(dirPath, 'page.tsx');
  
  // Check for layout.tsx with potential auth guards
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    if (layoutContent.includes('auth') || layoutContent.includes('Auth') || 
        layoutContent.includes('redirect') || layoutContent.includes('session')) {
      return true;
    }
  }
  
  // Check for page.tsx with potential auth guards
  if (fs.existsSync(pagePath)) {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    if (pageContent.includes('auth') || pageContent.includes('Auth') || 
        pageContent.includes('redirect') || pageContent.includes('session')) {
      return true;
    }
  }
  
  return false;
}

function validateNestedRouting(directories) {
  const nestedRoutingCompliance = {};
  
  Object.keys(appRouterStandards.nestedRouting).forEach(parentRoute => {
    const expectedNested = appRouterStandards.nestedRouting[parentRoute];
    const actualNested = directories.filter(dir => 
      dir.routePath.startsWith(parentRoute) && dir.routePath !== parentRoute
    );
    
    nestedRoutingCompliance[parentRoute] = {
      expected: expectedNested,
      actual: actualNested.map(dir => dir.routePath),
      parentHasPage: directories.find(d => d.routePath === parentRoute)?.hasPageFile || false,
      nestedCompliance: actualNested.map(nested => ({
        route: nested.routePath,
        hasPage: nested.hasPageFile,
        hasLayout: nested.hasLayoutFile,
        status: nested.hasPageFile ? 'COMPLIANT' : 'MISSING_PAGE'
      }))
    };
  });
  
  return nestedRoutingCompliance;
}

function validateAppRouterStructure(directories) {
  const structureCompliance = {
    rootLayout: null,
    rootPage: null,
    globalError: null,
    routeCompliance: []
  };
  
  // Check for root layout and page
  const rootDir = directories.find(dir => dir.routePath === '/');
  if (rootDir) {
    structureCompliance.rootLayout = {
      exists: rootDir.hasLayoutFile,
      path: rootDir.hasLayoutFile ? path.join(rootDir.path, 'layout.tsx') : null,
      status: rootDir.hasLayoutFile ? 'COMPLIANT' : 'MISSING_ROOT_LAYOUT'
    };
    
    structureCompliance.rootPage = {
      exists: rootDir.hasPageFile,
      path: rootDir.hasPageFile ? path.join(rootDir.path, 'page.tsx') : null,
      status: rootDir.hasPageFile ? 'COMPLIANT' : 'MISSING_ROOT_PAGE'
    };
    
    structureCompliance.globalError = {
      exists: rootDir.files.includes('global-error.tsx'),
      path: rootDir.files.includes('global-error.tsx') ? path.join(rootDir.path, 'global-error.tsx') : null,
      status: rootDir.files.includes('global-error.tsx') ? 'COMPLIANT' : 'MISSING_GLOBAL_ERROR'
    };
  }
  
  // Check each route directory
  directories.forEach(dir => {
    if (dir.routePath === '/') return; // Skip root, already handled
    
    const compliance = {
      route: dir.routePath,
      path: dir.path,
      hasPage: dir.hasPageFile,
      hasLayout: dir.hasLayoutFile,
      hasLoading: dir.hasLoadingFile,
      hasError: dir.hasErrorFile,
      files: dir.files,
      subdirectories: dir.subdirectories,
      status: 'UNKNOWN'
    };
    
    // Determine compliance status
    if (dir.hasPageFile) {
      compliance.status = 'COMPLIANT';
    } else if (dir.hasLayoutFile && dir.subdirectories.length > 0) {
      compliance.status = 'LAYOUT_ONLY'; // Valid for grouping routes
    } else {
      compliance.status = 'MISSING_PAGE';
    }
    
    structureCompliance.routeCompliance.push(compliance);
  });
  
  return structureCompliance;
}

function generateComplianceScore(structureCompliance, authCompliance, nestedRoutingCompliance) {
  let totalChecks = 0;
  let passedChecks = 0;
  
  // Root structure checks
  totalChecks += 3; // root layout, root page, global error
  if (structureCompliance.rootLayout?.status === 'COMPLIANT') passedChecks++;
  if (structureCompliance.rootPage?.status === 'COMPLIANT') passedChecks++;
  if (structureCompliance.globalError?.status === 'COMPLIANT') passedChecks++;
  
  // Route compliance checks
  structureCompliance.routeCompliance.forEach(route => {
    totalChecks++;
    if (route.status === 'COMPLIANT' || route.status === 'LAYOUT_ONLY') {
      passedChecks++;
    }
  });
  
  // Auth flow checks
  authCompliance.unprotectedAuthRoutes.forEach(route => {
    totalChecks++;
    if (route.compliance === 'COMPLIANT') passedChecks++;
  });
  
  authCompliance.protectedMainRoutes.forEach(route => {
    totalChecks++;
    if (route.compliance === 'COMPLIANT') passedChecks++;
  });
  
  return {
    score: Math.round((passedChecks / totalChecks) * 100),
    totalChecks,
    passedChecks,
    failedChecks: totalChecks - passedChecks
  };
}

// Execute validation
console.log('Starting App Router compliance validation...');

const directories = findAppDirectories();
const structureCompliance = validateAppRouterStructure(directories);
const authCompliance = validateAuthFlow(directories);
const nestedRoutingCompliance = validateNestedRouting(directories);
const complianceScore = generateComplianceScore(structureCompliance, authCompliance, nestedRoutingCompliance);

// Generate comprehensive report
const report = {
  timestamp: new Date().toISOString(),
  task_id: '287',
  next_js_version: '15',
  app_router_compliance: {
    overall_score: complianceScore,
    structure_compliance: structureCompliance,
    auth_flow_compliance: authCompliance,
    nested_routing_compliance: nestedRoutingCompliance,
    directories_analyzed: directories.length,
    summary: {
      total_routes: directories.length,
      compliant_routes: structureCompliance.routeCompliance.filter(r => 
        r.status === 'COMPLIANT' || r.status === 'LAYOUT_ONLY'
      ).length,
      missing_pages: structureCompliance.routeCompliance.filter(r => 
        r.status === 'MISSING_PAGE'
      ).length,
      protected_routes_count: authCompliance.protectedMainRoutes.length,
      auth_routes_count: authCompliance.unprotectedAuthRoutes.length
    },
    recommendations: []
  }
};

// Add recommendations based on findings
if (structureCompliance.rootLayout?.status !== 'COMPLIANT') {
  report.app_router_compliance.recommendations.push({
    priority: 'CRITICAL',
    issue: 'Missing root layout.tsx',
    action: 'Create apps/web/app/layout.tsx with proper metadata and providers'
  });
}

if (structureCompliance.globalError?.status !== 'COMPLIANT') {
  report.app_router_compliance.recommendations.push({
    priority: 'HIGH',
    issue: 'Missing global error handler',
    action: 'Create apps/web/app/global-error.tsx for better error handling'
  });
}

const missingPages = structureCompliance.routeCompliance.filter(r => r.status === 'MISSING_PAGE');
if (missingPages.length > 0) {
  report.app_router_compliance.recommendations.push({
    priority: 'MEDIUM',
    issue: `${missingPages.length} routes missing page.tsx files`,
    action: 'Add page.tsx files to complete route definitions',
    affected_routes: missingPages.map(r => r.route)
  });
}

const unprotectedMain = authCompliance.protectedMainRoutes.filter(r => r.compliance !== 'COMPLIANT');
if (unprotectedMain.length > 0) {
  report.app_router_compliance.recommendations.push({
    priority: 'HIGH',
    issue: 'Protected routes may lack authentication guards',
    action: 'Review and implement proper auth protection',
    affected_routes: unprotectedMain.map(r => r.routePath)
  });
}

// Save the report
fs.writeFileSync('./app-router-compliance-report.json', JSON.stringify(report, null, 2));

console.log(`App Router compliance validation completed!`);
console.log(`Overall compliance score: ${complianceScore.score}%`);
console.log(`Directories analyzed: ${directories.length}`);
console.log(`Recommendations: ${report.app_router_compliance.recommendations.length}`);
console.log('Report saved to: app-router-compliance-report.json');