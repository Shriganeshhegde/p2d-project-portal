// Calculate estimated delivery date (3 working days from submission)
// If submitted after 5 PM, add 1 extra day
export const calculateDeliveryDate = (submissionDate) => {
  const submission = new Date(submissionDate);
  const submissionHour = submission.getHours();
  
  // If submitted after 5 PM (17:00), start counting from next day
  let startDate = new Date(submission);
  if (submissionHour >= 17) {
    startDate.setDate(startDate.getDate() + 1);
  }
  
  // Add 3 working days
  let workingDaysAdded = 0;
  let currentDate = new Date(startDate);
  
  while (workingDaysAdded < 3) {
    currentDate.setDate(currentDate.getDate() + 1);
    
    // Check if it's a weekday (Monday = 1, Sunday = 0)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not Saturday (6) or Sunday (0)
      workingDaysAdded++;
    }
  }
  
  return currentDate;
};

// Format date for display
export const formatDeliveryDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Parse description to extract project details
export const parseProjectDescription = (description) => {
  if (!description) return {};
  
  const details = {};
  
  // Extract pages
  const pagesMatch = description.match(/(\d+)\s*pages?/i);
  if (pagesMatch) details.pages = pagesMatch[1];
  
  // Extract copies
  const copiesMatch = description.match(/(\d+)\s*cop(?:y|ies)/i);
  if (copiesMatch) details.copies = copiesMatch[1];
  
  // Extract print type
  if (description.includes('color')) {
    details.printType = 'Color Print';
  } else if (description.includes('black-white') || description.includes('b&w')) {
    details.printType = 'Black & White';
  }
  
  // Extract binding type
  if (description.includes('spiral')) {
    details.bindingType = 'Spiral Binding';
  } else if (description.includes('hardcover')) {
    details.bindingType = 'Hardcover Binding';
  } else if (description.includes('softcover')) {
    details.bindingType = 'Softcover Binding';
  }
  
  // Extract binding color
  const bindingColorMatch = description.match(/\(([^)]+)\)/);
  if (bindingColorMatch) {
    details.bindingColor = bindingColorMatch[1];
  }
  
  return details;
};
