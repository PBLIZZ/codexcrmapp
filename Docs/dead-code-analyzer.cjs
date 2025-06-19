const fs = require('fs');
const path = require('path');

// Business critical component categories
const businessCategories = {
  auth: ['auth', 'login', 'signup', 'reset'],
  dashboard: ['dashboard', 'metric', 'widget'],
  contacts: ['contact', 'client', 'customer'],
  tasks: ['task', 'todo', 'board'],
  messages: ['message', 'chat', 'notification'],
  calendar: ['calendar', 'event', 'schedule'],
  marketing: ['marketing', 'campaign', 'email'],
  analytics: ['analytics', 'report', 'chart'],
  settings: ['settings', 'config', 'preference'],
  layout: ['layout', 'sidebar', 'header', 'nav'],
  ui: ['button', 'form', 'input', 'modal']
};

function categorizeByBusinessSection(filePath, ruleId) {
  const lowerPath = filePath.toLowerCase();
  const lowerRule = ruleId.toLowerCase();
  
  for (const [category, keywords] of Object.entries(businessCategories)) {
    for (const keyword of keywords) {
      if (lowerPath.includes(keyword) || lowerRule.includes(keyword)) {
        return category;
      }
    }
  }
  
  // Check directory structure
  if (lowerPath.includes('/auth/')) return 'auth';
  if (lowerPath.includes('/dashboard/')) return 'dashboard';
  if (lowerPath.includes('/contacts/')) return 'contacts';
  if (lowerPath.includes('/tasks/')) return 'tasks';
  if (lowerPath.includes('/marketing/')) return 'marketing';
  if (lowerPath.includes('/layout/')) return 'layout';
  if (lowerPath.includes('/ui/')) return 'ui';
  
  return 'other';
}

function getBusinessImpact(category, ruleId, message) {
  const lowerMessage = message.toLowerCase();
  const lowerRule = ruleId.toLowerCase();
  
  // Critical business logic
  if (category === 'auth' && (lowerMessage.includes('unused') || lowerRule.includes('no-unused'))) {
    return 'CRITICAL';
  }
  
  // High impact areas
  if (['dashboard', 'contacts', 'tasks'].includes(category) && 
      (lowerMessage.includes('function') || lowerMessage.includes('variable'))) {
    return 'HIGH';
  }
  
  // Medium impact
  if (['marketing', 'layout', 'ui'].includes(category)) {
    return 'MEDIUM';
  }
  
  // Deprecated features (high impact)
  if (lowerMessage.includes('deprecated') || lowerMessage.includes('obsolete')) {
    return 'HIGH';
  }
  
  return 'LOW';
}

function analyzeDeadCode() {
  try {
    // Read ESLint output
    const eslintOutput = JSON.parse(fs.readFileSync('./eslint-analysis.json', 'utf8'));
    
    const deadCodeReport = {
      timestamp: new Date().toISOString(),
      task_id: '288',
      summary: {
        totalFiles: eslintOutput.length,
        filesWithIssues: 0,
        totalIssues: 0,
        criticalIssues: 0,
        highIssues: 0,
        mediumIssues: 0,
        lowIssues: 0
      },
      businessSections: {},
      deadCodeFindings: []
    };
    
    // Initialize business sections
    Object.keys(businessCategories).forEach(category => {
      deadCodeReport.businessSections[category] = {
        totalIssues: 0,
        files: [],
        issues: []
      };
    });
    deadCodeReport.businessSections.other = {
      totalIssues: 0,
      files: [],
      issues: []
    };
    
    // Process each file
    eslintOutput.forEach(fileResult => {
      if (fileResult.messages && fileResult.messages.length > 0) {
        deadCodeReport.summary.filesWithIssues++;
        
        const relativePath = fileResult.filePath.replace(process.cwd(), '.');
        
        fileResult.messages.forEach(message => {
          deadCodeReport.summary.totalIssues++;
          
          const category = categorizeByBusinessSection(relativePath, message.ruleId || '');
          const impact = getBusinessImpact(category, message.ruleId || '', message.message);
          
          // Count by impact
          switch (impact) {
            case 'CRITICAL': deadCodeReport.summary.criticalIssues++; break;
            case 'HIGH': deadCodeReport.summary.highIssues++; break;
            case 'MEDIUM': deadCodeReport.summary.mediumIssues++; break;
            case 'LOW': deadCodeReport.summary.lowIssues++; break;
          }
          
          const issue = {
            file: relativePath,
            line: message.line,
            column: message.column,
            rule: message.ruleId,
            severity: message.severity,
            message: message.message,
            category,
            businessImpact: impact,
            fix: message.fix || null
          };
          
          deadCodeReport.deadCodeFindings.push(issue);
          deadCodeReport.businessSections[category].totalIssues++;
          deadCodeReport.businessSections[category].issues.push(issue);
          
          if (!deadCodeReport.businessSections[category].files.includes(relativePath)) {
            deadCodeReport.businessSections[category].files.push(relativePath);
          }
        });
      }
    });
    
    // Generate recommendations
    deadCodeReport.recommendations = generateRecommendations(deadCodeReport);
    
    // Save the report
    fs.writeFileSync('../../dead-code-analysis-report.json', JSON.stringify(deadCodeReport, null, 2));
    
    console.log('Dead code analysis completed!');
    console.log(`Total files analyzed: ${deadCodeReport.summary.totalFiles}`);
    console.log(`Files with issues: ${deadCodeReport.summary.filesWithIssues}`);
    console.log(`Total issues found: ${deadCodeReport.summary.totalIssues}`);
    console.log(`Critical issues: ${deadCodeReport.summary.criticalIssues}`);
    console.log(`High impact issues: ${deadCodeReport.summary.highIssues}`);
    console.log(`Report saved to: dead-code-analysis-report.json`);
    
  } catch (error) {
    console.error('Error analyzing dead code:', error.message);
    
    // Create a basic report if ESLint output is unavailable
    const basicReport = {
      timestamp: new Date().toISOString(),
      task_id: '288',
      error: 'ESLint analysis failed or output too large',
      message: 'Manual code review recommended for dead code detection',
      recommendations: [
        {
          priority: 'HIGH',
          action: 'Run ESLint manually on specific directories',
          reason: 'Automated analysis failed due to output size'
        },
        {
          priority: 'MEDIUM', 
          action: 'Review unused imports and variables in auth components',
          reason: 'Critical business logic area'
        },
        {
          priority: 'MEDIUM',
          action: 'Check for deprecated authentication methods',
          reason: 'Security and maintenance concerns'
        },
        {
          priority: 'LOW',
          action: 'Clean up unused utility functions',
          reason: 'Code maintenance and bundle size optimization'
        }
      ]
    };
    
    fs.writeFileSync('../../dead-code-analysis-report.json', JSON.stringify(basicReport, null, 2));
    console.log('Created basic report due to analysis error.');
  }
}

function generateRecommendations(report) {
  const recommendations = [];
  
  if (report.summary.criticalIssues > 0) {
    recommendations.push({
      priority: 'CRITICAL',
      action: `Fix ${report.summary.criticalIssues} critical dead code issues`,
      reason: 'May affect authentication or core business logic',
      affectedSections: Object.keys(report.businessSections).filter(
        section => report.businessSections[section].issues.some(i => i.businessImpact === 'CRITICAL')
      )
    });
  }
  
  if (report.summary.highIssues > 0) {
    recommendations.push({
      priority: 'HIGH',
      action: `Address ${report.summary.highIssues} high impact dead code issues`,
      reason: 'Affects main business sections and user experience',
      affectedSections: Object.keys(report.businessSections).filter(
        section => report.businessSections[section].issues.some(i => i.businessImpact === 'HIGH')
      )
    });
  }
  
  // Section-specific recommendations
  const authIssues = report.businessSections.auth?.totalIssues || 0;
  if (authIssues > 0) {
    recommendations.push({
      priority: 'HIGH',
      action: `Review authentication code for ${authIssues} potential issues`,
      reason: 'Security-critical area requires clean code',
      section: 'auth'
    });
  }
  
  const contactsIssues = report.businessSections.contacts?.totalIssues || 0;
  if (contactsIssues > 0) {
    recommendations.push({
      priority: 'MEDIUM',
      action: `Clean up contacts section with ${contactsIssues} issues`,
      reason: 'Core business functionality maintenance',
      section: 'contacts'
    });
  }
  
  if (report.summary.totalIssues > 50) {
    recommendations.push({
      priority: 'MEDIUM',
      action: 'Implement automated dead code detection in CI/CD',
      reason: 'High volume of issues suggests need for automation',
      totalIssues: report.summary.totalIssues
    });
  }
  
  return recommendations;
}

// Run the analysis
analyzeDeadCode();