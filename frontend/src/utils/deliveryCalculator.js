/**
 * Calculate estimated delivery date based on submission time
 * Rules:
 * - If submitted before 5:00 PM: 3 working days
 * - If submitted after 5:00 PM: 4 working days (1 extra day)
 * - Working days exclude weekends (Saturday & Sunday)
 */
export const calculateDeliveryDate = (submissionDate) => {
  const submission = new Date(submissionDate);
  const submissionHour = submission.getHours();
  
  // Determine base working days needed
  let workingDaysNeeded = submissionHour < 17 ? 3 : 4; // 17:00 = 5:00 PM
  
  // Start from the next day
  let currentDate = new Date(submission);
  currentDate.setDate(currentDate.getDate() + 1);
  currentDate.setHours(0, 0, 0, 0);
  
  let workingDaysCounted = 0;
  
  // Count working days
  while (workingDaysCounted < workingDaysNeeded) {
    const dayOfWeek = currentDate.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDaysCounted++;
    }
    
    // If we haven't reached the target, move to next day
    if (workingDaysCounted < workingDaysNeeded) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return currentDate;
};

/**
 * Format date for display
 */
export const formatDeliveryDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Parse description to extract project details
 */
export const parseProjectDescription = (description) => {
  if (!description) return {};
  
  const details = {};
  
  // Extract pages
  const pagesMatch = description.match(/(\d+)\s*pages?/i);
  if (pagesMatch) details.pages = parseInt(pagesMatch[1]);
  
  // Extract copies
  const copiesMatch = description.match(/(\d+)\s*copies?/i);
  if (copiesMatch) details.copies = parseInt(copiesMatch[1]);
  
  // Extract print type
  if (description.includes('color')) {
    details.printType = 'Color';
  } else if (description.includes('black-white') || description.includes('black and white')) {
    details.printType = 'Black & White';
  }
  
  // Extract binding type
  if (description.includes('spiral')) {
    details.bindingType = 'Spiral';
  } else if (description.includes('hardcover')) {
    details.bindingType = 'Hardcover';
  } else if (description.includes('softcover')) {
    details.bindingType = 'Softcover';
  }
  
  // Extract binding color
  const colorMatch = description.match(/\(([^)]+)\)/);
  if (colorMatch) {
    details.bindingColor = colorMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return details;
};
