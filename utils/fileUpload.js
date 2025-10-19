const { supabase } = require('./supabase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * FileUploader Class
 * 
 * Handles file upload, deletion, and retrieval operations with Supabase Storage.
 * Provides methods for managing files in a Supabase storage bucket.
 * 
 * @class
 */
class FileUploader {
  /**
   * Creates a FileUploader instance
   * @param {string} [bucketName='project-documents'] - Name of the Supabase storage bucket
   */
  constructor(bucketName = 'project-documents') {
    this.bucketName = bucketName;
  }

  async uploadFile(file, userId, folder = 'documents') {
    try {
      if (!file || !file.buffer) {
        throw new Error('No file provided');
      }

      // Generate a unique filename
      const fileExt = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = `${userId}/${folder}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(filePath, file.buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.mimetype,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        fileName: file.originalname,
        filePath: data.path,
        publicUrl,
        mimeType: file.mimetype,
        size: file.size,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  async deleteFile(filePath) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }

  async getFileUrl(filePath) {
    try {
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw new Error(`Failed to get file URL: ${error.message}`);
    }
  }

  async listUserFiles(userId, folder = '') {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list(`${userId}/${folder}`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }
}

module.exports = new FileUploader();
