const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key in environment variables');
}

// Client for client-side usage (with limited permissions)
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Admin client for server-side usage (with elevated permissions)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Helper function to handle Supabase errors
const handleSupabaseError = (error, defaultMessage = 'An error occurred') => {
  console.error('Supabase Error:', error);
  return {
    error: error?.message || defaultMessage,
    details: error?.details || null,
    hint: error?.hint || null,
    code: error?.code || 'unknown_error'
  };
};

// File upload to Supabase Storage
const uploadFile = async (bucketName, filePath, file, options = {}) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        ...options
      });

    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return { data: { ...data, publicUrl }, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
};

// File download from Supabase Storage
const downloadFile = async (bucketName, filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
};

// Delete file from Supabase Storage
const deleteFile = async (bucketName, filePaths) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove(filePaths);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
};

// Execute a database query with error handling
const query = async (table, operation, params = {}) => {
  try {
    let query = supabase.from(table);
    
    // Handle different operations
    switch (operation) {
      case 'insert':
        query = query.insert(params.data);
        break;
      case 'select':
        query = query.select(params.columns || '*');
        if (params.eq) query = query.eq(params.eq.column, params.eq.value);
        if (params.gt) query = query.gt(params.gt.column, params.gt.value);
        if (params.lt) query = query.lt(params.lt.column, params.lt.value);
        if (params.contains) query = query.contains(params.contains.column, params.contains.value);
        if (params.order) query = query.order(params.order.column, { ascending: params.order.ascending });
        if (params.range) query = query.range(params.range.from, params.range.to);
        break;
      case 'update':
        query = query.update(params.data).match(params.match);
        break;
      case 'delete':
        query = query.delete().match(params.match);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
};

// Execute a raw SQL query (admin only)
const sql = async (query, params = []) => {
  try {
    const { data, error } = await supabaseAdmin.rpc('execute_sql', {
      query,
      params
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
};

// User management functions
const auth = {
  // Sign up a new user
  signUp: async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
  
  // Sign in a user
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
  
  // Sign out the current user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: handleSupabaseError(error) };
    }
  },
  
  // Get the current user session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
  
  // Update user data
  updateUser: async (userData) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  },
  
  // Reset password
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/update-password`
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  handleSupabaseError,
  uploadFile,
  downloadFile,
  deleteFile,
  query,
  sql,
  auth
};
