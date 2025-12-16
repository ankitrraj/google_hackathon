import { AgentConfig, ExtractField } from '@/lib/types';

/**
 * Validate user prompt input
 */
export function validatePrompt(prompt: string): { isValid: boolean; error?: string } {
  // Check if prompt is empty or only whitespace
  if (!prompt || prompt.trim().length === 0) {
    return { isValid: false, error: 'Please enter a description for your agent.' };
  }

  // Check minimum length
  if (prompt.trim().length < 10) {
    return { isValid: false, error: 'Please provide a more detailed description (at least 10 characters).' };
  }

  // Check maximum length
  if (prompt.length > 1000) {
    return { isValid: false, error: 'Description is too long. Please keep it under 1000 characters.' };
  }

  return { isValid: true };
}

/**
 * Validate agent configuration
 */
export function validateAgentConfig(config: any): { isValid: boolean; error?: string } {
  try {
    // Check required fields
    const requiredFields = ['name', 'industry', 'system_prompt', 'questions', 'extract_fields'];
    
    for (const field of requiredFields) {
      if (!(field in config)) {
        return { isValid: false, error: `Missing required field: ${field}` };
      }
    }

    // Validate name
    if (typeof config.name !== 'string' || config.name.trim().length === 0) {
      return { isValid: false, error: 'Agent name must be a non-empty string' };
    }

    if (config.name.length > 100) {
      return { isValid: false, error: 'Agent name must be under 100 characters' };
    }

    // Validate industry
    if (typeof config.industry !== 'string' || config.industry.trim().length === 0) {
      return { isValid: false, error: 'Industry must be a non-empty string' };
    }

    // Validate system prompt
    if (typeof config.system_prompt !== 'string' || config.system_prompt.trim().length < 50) {
      return { isValid: false, error: 'System prompt must be at least 50 characters long' };
    }

    if (config.system_prompt.length > 5000) {
      return { isValid: false, error: 'System prompt must be under 5000 characters' };
    }

    // Validate questions
    if (!Array.isArray(config.questions)) {
      return { isValid: false, error: 'Questions must be an array' };
    }

    if (config.questions.length === 0) {
      return { isValid: false, error: 'At least one question is required' };
    }

    if (config.questions.length > 10) {
      return { isValid: false, error: 'Maximum 10 questions allowed' };
    }

    for (const question of config.questions) {
      if (typeof question !== 'string' || question.trim().length === 0) {
        return { isValid: false, error: 'All questions must be non-empty strings' };
      }
    }

    // Validate extract fields
    if (!Array.isArray(config.extract_fields)) {
      return { isValid: false, error: 'Extract fields must be an array' };
    }

    if (config.extract_fields.length === 0) {
      return { isValid: false, error: 'At least one extract field is required' };
    }

    if (config.extract_fields.length > 20) {
      return { isValid: false, error: 'Maximum 20 extract fields allowed' };
    }

    for (const field of config.extract_fields) {
      const fieldValidation = validateExtractField(field);
      if (!fieldValidation.isValid) {
        return fieldValidation;
      }
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid configuration format' };
  }
}

/**
 * Validate extract field
 */
export function validateExtractField(field: any): { isValid: boolean; error?: string } {
  if (!field || typeof field !== 'object') {
    return { isValid: false, error: 'Extract field must be an object' };
  }

  // Check required properties
  if (!field.name || typeof field.name !== 'string') {
    return { isValid: false, error: 'Extract field must have a valid name' };
  }

  if (!field.description || typeof field.description !== 'string') {
    return { isValid: false, error: 'Extract field must have a valid description' };
  }

  if (!field.type || typeof field.type !== 'string') {
    return { isValid: false, error: 'Extract field must have a valid type' };
  }

  // Validate field name format (snake_case)
  if (!/^[a-z][a-z0-9_]*$/.test(field.name)) {
    return { isValid: false, error: 'Field name must be in snake_case format (lowercase letters, numbers, underscores)' };
  }

  // Validate type
  const validTypes = ['string', 'number', 'date', 'boolean'];
  if (!validTypes.includes(field.type)) {
    return { isValid: false, error: `Field type must be one of: ${validTypes.join(', ')}` };
  }

  return { isValid: true };
}

/**
 * Validate PDF file
 */
export function validatePDFFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { isValid: false, error: 'File must be a PDF document' };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: 'PDF file must be under 10MB' };
  }

  // Check minimum size (1KB)
  if (file.size < 1024) {
    return { isValid: false, error: 'PDF file appears to be empty or corrupted' };
  }

  return { isValid: true };
}

/**
 * Validate UUID format
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate extracted data against field definitions
 */
export function validateExtractedData(
  data: Record<string, any>, 
  fields: ExtractField[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const field of fields) {
    const value = data[field.name];

    // Skip validation for null/undefined values (they're optional)
    if (value === null || value === undefined) {
      continue;
    }

    // Type-specific validation
    switch (field.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`Field '${field.name}' must be a string`);
        }
        break;
      
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          errors.push(`Field '${field.name}' must be a valid number`);
        }
        break;
      
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`Field '${field.name}' must be a boolean`);
        }
        break;
      
      case 'date':
        if (typeof value === 'string') {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors.push(`Field '${field.name}' must be a valid date`);
          }
        } else {
          errors.push(`Field '${field.name}' must be a date string`);
        }
        break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}