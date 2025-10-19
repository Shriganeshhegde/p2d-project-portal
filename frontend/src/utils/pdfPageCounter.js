// Utility to count pages in PDF files (without external libraries)

export const countPDFPages = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Convert to text
        const decoder = new TextDecoder('latin1');
        const text = decoder.decode(uint8Array);
        
        console.log('PDF file size:', file.size, 'bytes');
        console.log('Analyzing PDF structure...');
        
        // Method 1: Count /Type /Page (excluding /Pages)
        const pagePattern = /\/Type\s*\/Page(?!\s*s)/gi;
        const pageMatches = text.match(pagePattern);
        
        if (pageMatches && pageMatches.length > 0) {
          console.log(`✅ Method 1: Found ${pageMatches.length} pages using /Type /Page pattern`);
          resolve(pageMatches.length);
          return;
        }
        
        // Method 2: Look for /Count in catalog
        const countPattern = /\/Type\s*\/Pages[^]*?\/Count\s+(\d+)/i;
        const countMatch = text.match(countPattern);
        
        if (countMatch && countMatch[1]) {
          const pageCount = parseInt(countMatch[1]);
          console.log(`✅ Method 2: Found ${pageCount} pages using /Count in catalog`);
          resolve(pageCount);
          return;
        }
        
        // Method 3: Count page objects
        const pageObjPattern = /\d+\s+\d+\s+obj[^]*?\/Type\s*\/Page[^s]/gi;
        const pageObjMatches = text.match(pageObjPattern);
        
        if (pageObjMatches && pageObjMatches.length > 0) {
          console.log(`✅ Method 3: Found ${pageObjMatches.length} pages using page objects`);
          resolve(pageObjMatches.length);
          return;
        }
        
        // Method 4: Estimate from file size
        // Average: 50-150KB per page, use 80KB as middle ground
        const estimated = Math.max(1, Math.round(file.size / 80000));
        console.log(`⚠️ Using file size estimation: ${estimated} pages (${file.size} bytes / 80KB per page)`);
        resolve(estimated);
        
      } catch (error) {
        console.error('Error counting PDF pages:', error);
        const estimated = Math.max(1, Math.round(file.size / 80000));
        console.log(`⚠️ Error fallback: ${estimated} pages`);
        resolve(estimated);
      }
    };
    
    reader.onerror = () => {
      console.error('FileReader error');
      const estimated = Math.max(1, Math.round(file.size / 80000));
      resolve(estimated);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Count pages for Word documents (estimate based on file size)
export const countWordPages = (file) => {
  // Rough estimate: 1 page ≈ 25KB for Word docs
  const estimatedPages = Math.max(1, Math.ceil(file.size / 25000));
  return estimatedPages;
};

// Count pages for images (1 page per image)
export const countImagePages = () => {
  return 1;
};

// Main function to count pages based on file type
export const countFilePages = async (file) => {
  const fileType = file.type;
  
  if (fileType === 'application/pdf') {
    return await countPDFPages(file);
  } else if (
    fileType === 'application/msword' || 
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return countWordPages(file);
  } else if (fileType.startsWith('image/')) {
    return countImagePages();
  } else {
    // Default estimate
    return Math.max(1, Math.ceil(file.size / 50000));
  }
};

// Count total pages from multiple files
export const countTotalPages = async (files) => {
  const pageCounts = await Promise.all(
    files.map(file => countFilePages(file))
  );
  
  return pageCounts.reduce((total, count) => total + count, 0);
};
