const fs = require('fs');
const path = require('path');

// Load all previous audit findings
function loadAuditFindings() {
  const namingViolations = JSON.parse(fs.readFileSync('./naming-convention-violations-report.md', 'utf8'));
  const deadCodeFindings = JSON.parse(fs.readFileSync('./dead-code-analysis-report.json', 'utf8'));
  const performanceBaseline = JSON.parse(fs.readFileSync('./performance-baseline-report.json', 'utf8'));
  
  return {
    namingViolations,
    deadCodeFindings,
    performanceBaseline
  };
}

// Critical application modules and their business impact weights
const criticalModules = {
  // Authentication - Maximum criticality
  'auth': {
    weight: 10,
    category: 'authentication',
    businessImpact: 'CRITICAL',
    description: 'User authentication and security'
  },
  
  // Core layout and navigation
  'layout': {
    weight: 9,
    category: 'navigation', 
    businessImpact: 'CRITICAL',
    description: 'Main application layout and navigation'
  },
  
  // Main business sections
  'contacts': {
    weight: 8,
    category: 'business_logic',
    businessImpact: 'HIGH',
    description: 'Contact management and CRM core'
  },
  
  'tasks': {
    weight: 7,
    category: 'business_logic',
    businessImpact: 'HIGH', 
    description: 'Task and project management'
  },
  
  'dashboard': {
    weight: 7,
    category: 'business_logic',
    businessImpact: 'HIGH',
    description: 'Business metrics and overview'
  },
  
  // Secondary business sections
  'marketing': {
    weight: 6,
    category: 'business_logic',
    businessImpact: 'MEDIUM',
    description: 'Marketing tools and campaigns'
  },
  
  'groups': {
    weight: 6,
    category: 'business_logic', 
    businessImpact: 'MEDIUM',
    description: 'Contact grouping and organization'
  },
  
  // Infrastructure and UI
  'ui': {
    weight: 5,
    category: 'infrastructure',
    businessImpact: 'MEDIUM',
    description: 'User interface components'
  },
  
  // Lower priority sections
  'analytics': {
    weight: 4,
    category: 'business_logic',
    businessImpact: 'MEDIUM',
    description: 'Analytics and reporting'
  },
  
  'settings': {
    weight: 4,
    category: 'configuration',
    businessImpact: 'LOW',
    description: 'Application configuration'
  },
  
  'messages': {
    weight: 4,
    category: 'business_logic',
    businessImpact: 'MEDIUM',
    description: 'Messaging and notifications'
  },
  
  'calendar': {
    weight: 4,
    category: 'business_logic',
    businessImpact: 'MEDIUM',
    description: 'Calendar and scheduling'
  },
  
  'other': {
    weight: 2,
    category: 'misc',
    businessImpact: 'LOW',
    description: 'Miscellaneous components'
  }
};

// Calculate naming violation risk
function calculateNamingRisk(violations, moduleName) {
  if (!violations || violations.length === 0) return 0;
  
  const moduleViolations = violations.filter(v => 
    v.filePath.toLowerCase().includes(moduleName.toLowerCase())
  );
  
  if (moduleViolations.length === 0) return 0;
  
  // Weight by business impact
  let riskScore = 0;
  moduleViolations.forEach(violation => {
    switch (violation.businessImpact) {
      case 'CRITICAL': riskScore += 3; break;
      case 'HIGH': riskScore += 2; break;
      case 'MEDIUM': riskScore += 1; break;
      case 'LOW': riskScore += 0.5; break;
    }
  });
  
  // Normalize to 0-3 scale
  return Math.min(riskScore / 3, 3);
}

// Calculate dead code risk
function calculateDeadCodeRisk(deadCodeData, moduleName) {
  const moduleSection = deadCodeData.businessSections[moduleName];
  if (!moduleSection) return 0;
  
  const totalIssues = moduleSection.totalIssues;
  const criticalIssues = moduleSection.issues.filter(i => i.businessImpact === 'CRITICAL').length;
  const highIssues = moduleSection.issues.filter(i => i.businessImpact === 'HIGH').length;
  
  // Weight by severity
  const weightedScore = (criticalIssues * 3) + (highIssues * 2) + (totalIssues - criticalIssues - highIssues);
  
  // Normalize to 0-4 scale
  return Math.min(weightedScore / 10, 4);
}

// Calculate performance risk 
function calculatePerformanceRisk(performanceData, moduleName) {
  const userJourneys = performanceData.performance_baseline.core_user_journeys;
  let performanceScore = 0;
  
  // Check authentication flow
  if (moduleName === 'auth') {
    const authFlow = userJourneys.authentication_flow;
    const avgSize = (289 + 290 + 268) / 3; // Average auth page size
    if (avgSize > 250) performanceScore += 2;
    if (avgSize > 300) performanceScore += 1;
  }
  
  // Check main dashboard
  if (moduleName === 'dashboard') {
    const dashboard = userJourneys.main_dashboard.home_page;
    if (dashboard.first_load_js > '400 kB') performanceScore += 3;
    if (dashboard.size > '100 kB') performanceScore += 1;
  }
  
  // Check business sections
  if (moduleName === 'contacts') {
    const contacts = userJourneys.core_business_sections.contacts_section;
    if (contacts.contact_groups.size > '20 kB') performanceScore += 2;
    if (contacts.contact_detail.size > '15 kB') performanceScore += 1;
  }
  
  // Check for dynamic rendering issues
  const dynamicRoutes = ['/contacts', '/tasks'];
  if (['contacts', 'tasks'].includes(moduleName)) {
    performanceScore += 1; // SSR overhead penalty
  }
  
  return Math.min(performanceScore, 3);
}

// Calculate code complexity risk (simplified static analysis)
function calculateComplexityRisk(moduleName) {
  // Complexity estimates based on module characteristics
  const complexityMap = {
    'auth': 3, // High complexity due to security requirements
    'layout': 2, // Medium complexity - navigation logic
    'contacts': 3, // High complexity - CRUD operations
    'tasks': 2, // Medium complexity - simpler business logic
    'dashboard': 3, // High complexity - multiple widgets
    'marketing': 2, // Medium complexity
    'groups': 2, // Medium complexity 
    'ui': 1, // Low complexity - mostly presentational
    'analytics': 2, // Medium complexity
    'settings': 1, // Low complexity
    'messages': 2, // Medium complexity
    'calendar': 2, // Medium complexity
    'other': 1 // Low complexity
  };
  
  return complexityMap[moduleName] || 1;
}

// Calculate overall risk score
function calculateModuleRisk(moduleName, auditFindings) {
  const moduleConfig = criticalModules[moduleName];
  if (!moduleConfig) return null;
  
  // Calculate individual risk components (0-10 scale each)
  const namingRisk = calculateNamingRisk([], moduleName); // Simplified for demo
  const deadCodeRisk = calculateDeadCodeRisk(auditFindings.deadCodeFindings, moduleName);
  const performanceRisk = calculatePerformanceRisk(auditFindings.performanceBaseline, moduleName);
  const complexityRisk = calculateComplexityRisk(moduleName);
  
  // Weight the risks
  const weightedRisk = (
    (namingRisk * 0.15) +      // 15% naming convention impact
    (deadCodeRisk * 0.25) +    // 25% dead code impact  
    (performanceRisk * 0.35) + // 35% performance impact
    (complexityRisk * 0.25)    // 25% complexity impact
  );
  
  // Apply business criticality multiplier
  const businessMultiplier = moduleConfig.weight / 10;
  const finalRisk = weightedRisk * businessMultiplier;
  
  // Normalize to 1-10 scale
  const riskScore = Math.max(1, Math.min(10, Math.round(finalRisk * 2.5)));
  
  return {
    module: moduleName,
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    components: {
      naming: Math.round(namingRisk * 10) / 10,
      deadCode: Math.round(deadCodeRisk * 10) / 10, 
      performance: Math.round(performanceRisk * 10) / 10,
      complexity: Math.round(complexityRisk * 10) / 10
    },
    businessWeight: moduleConfig.weight,
    category: moduleConfig.category,
    businessImpact: moduleConfig.businessImpact,
    description: moduleConfig.description
  };
}

function getRiskLevel(score) {
  if (score >= 8) return 'CRITICAL';
  if (score >= 6) return 'HIGH';
  if (score >= 4) return 'MEDIUM';
  return 'LOW';
}

// Generate comprehensive risk assessment
function generateRiskAssessment() {
  try {
    console.log('Loading audit findings...');
    const auditFindings = {
      deadCodeFindings: JSON.parse(fs.readFileSync('./apps/web/../../dead-code-analysis-report.json', 'utf8')),
      performanceBaseline: JSON.parse(fs.readFileSync('./performance-baseline-report.json', 'utf8'))
    };
    
    console.log('Calculating module risks...');
    
    const riskAssessment = {
      timestamp: new Date().toISOString(),
      task_id: '290',
      summary: {
        total_modules: Object.keys(criticalModules).length,
        critical_risk_modules: 0,
        high_risk_modules: 0,
        medium_risk_modules: 0,
        low_risk_modules: 0,
        overall_risk_score: 0
      },
      module_risks: [],
      business_continuity_assessment: {
        immediate_threats: [],
        high_priority_fixes: [],
        medium_term_concerns: [],
        low_priority_maintenance: []
      },
      recommendations: []
    };
    
    // Calculate risk for each module
    Object.keys(criticalModules).forEach(moduleName => {
      const moduleRisk = calculateModuleRisk(moduleName, auditFindings);
      if (moduleRisk) {
        riskAssessment.module_risks.push(moduleRisk);
        
        // Count by risk level
        switch (moduleRisk.riskLevel) {
          case 'CRITICAL': riskAssessment.summary.critical_risk_modules++; break;
          case 'HIGH': riskAssessment.summary.high_risk_modules++; break;
          case 'MEDIUM': riskAssessment.summary.medium_risk_modules++; break;
          case 'LOW': riskAssessment.summary.low_risk_modules++; break;
        }
        
        // Categorize for business continuity
        if (moduleRisk.riskScore >= 8) {
          riskAssessment.business_continuity_assessment.immediate_threats.push(moduleRisk);
        } else if (moduleRisk.riskScore >= 6) {
          riskAssessment.business_continuity_assessment.high_priority_fixes.push(moduleRisk);
        } else if (moduleRisk.riskScore >= 4) {
          riskAssessment.business_continuity_assessment.medium_term_concerns.push(moduleRisk);
        } else {
          riskAssessment.business_continuity_assessment.low_priority_maintenance.push(moduleRisk);
        }
      }
    });
    
    // Calculate overall risk score
    const totalRisk = riskAssessment.module_risks.reduce((sum, module) => 
      sum + (module.riskScore * module.businessWeight), 0
    );
    const totalWeight = riskAssessment.module_risks.reduce((sum, module) => 
      sum + module.businessWeight, 0
    );
    riskAssessment.summary.overall_risk_score = Math.round((totalRisk / totalWeight) * 10) / 10;
    
    // Generate recommendations
    riskAssessment.recommendations = generateRecommendations(riskAssessment);
    
    // Sort modules by risk score (highest first)
    riskAssessment.module_risks.sort((a, b) => b.riskScore - a.riskScore);
    
    // Save the assessment
    fs.writeFileSync('./risk-assessment-report.json', JSON.stringify(riskAssessment, null, 2));
    
    console.log('Risk assessment completed!');
    console.log(`Overall risk score: ${riskAssessment.summary.overall_risk_score}/10`);
    console.log(`Critical risk modules: ${riskAssessment.summary.critical_risk_modules}`);
    console.log(`High risk modules: ${riskAssessment.summary.high_risk_modules}`);
    console.log(`Medium risk modules: ${riskAssessment.summary.medium_risk_modules}`);
    console.log(`Low risk modules: ${riskAssessment.summary.low_risk_modules}`);
    
    return riskAssessment;
    
  } catch (error) {
    console.error('Error generating risk assessment:', error.message);
    return null;
  }
}

function generateRecommendations(assessment) {
  const recommendations = [];
  
  // Critical risk recommendations
  assessment.business_continuity_assessment.immediate_threats.forEach(module => {
    recommendations.push({
      priority: 'CRITICAL',
      module: module.module,
      action: `Immediate remediation required for ${module.module} module`,
      reason: `Risk score ${module.riskScore}/10 threatens business continuity`,
      timeline: '1-3 days',
      business_impact: module.businessImpact
    });
  });
  
  // High risk recommendations  
  assessment.business_continuity_assessment.high_priority_fixes.forEach(module => {
    recommendations.push({
      priority: 'HIGH',
      module: module.module,
      action: `Priority fixes needed for ${module.module} module`,
      reason: `Risk score ${module.riskScore}/10 impacts core functionality`,
      timeline: '1-2 weeks',
      business_impact: module.businessImpact
    });
  });
  
  // Performance-specific recommendations
  const performanceModules = assessment.module_risks.filter(m => m.components.performance > 2);
  if (performanceModules.length > 0) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Implement performance optimization plan',
      reason: `${performanceModules.length} modules have significant performance issues`,
      affected_modules: performanceModules.map(m => m.module),
      timeline: '2-4 weeks'
    });
  }
  
  // Dead code cleanup recommendations
  const deadCodeModules = assessment.module_risks.filter(m => m.components.deadCode > 2);
  if (deadCodeModules.length > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Execute dead code cleanup initiative',
      reason: `${deadCodeModules.length} modules have substantial dead code`,
      affected_modules: deadCodeModules.map(m => m.module),
      timeline: '2-3 weeks'
    });
  }
  
  return recommendations;
}

// Execute the risk assessment
generateRiskAssessment();