import { ExtractField } from '@/lib/types';

/**
 * Generate agent URL from ID
 */
export function generateAgentUrl(agentId: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${base}/agent/${agentId}`;
}

/**
 * Parse and clean extracted data
 */
export function parseExtractedData(
  rawData: Record<string, any>, 
  fields: ExtractField[]
): Record<string, any> {
  const cleanedData: Record<string, any> = {};

  for (const field of fields) {
    const value = rawData[field.name];

    if (value === null || value === undefined) {
      cleanedData[field.name] = null;
      continue;
    }

    // Type conversion and cleaning
    switch (field.type) {
      case 'string':
        cleanedData[field.name] = String(value).trim();
        break;
      
      case 'number':
        const numValue = Number(value);
        cleanedData[field.name] = isNaN(numValue) ? null : numValue;
        break;
      
      case 'boolean':
        if (typeof value === 'boolean') {
          cleanedData[field.name] = value;
        } else if (typeof value === 'string') {
          const lowerValue = value.toLowerCase().trim();
          cleanedData[field.name] = ['true', 'yes', '1', 'on'].includes(lowerValue);
        } else {
          cleanedData[field.name] = Boolean(value);
        }
        break;
      
      case 'date':
        if (typeof value === 'string') {
          const date = new Date(value);
          cleanedData[field.name] = isNaN(date.getTime()) ? null : date.toISOString();
        } else {
          cleanedData[field.name] = null;
        }
        break;
      
      default:
        cleanedData[field.name] = value;
    }
  }

  return cleanedData;
}

/**
 * Format extracted data for display
 */
export function formatExtractedDataForDisplay(
  data: Record<string, any>, 
  fields: ExtractField[]
): Array<{ label: string; value: string; type: string }> {
  return fields.map(field => {
    const value = data[field.name];
    let formattedValue = 'Not provided';

    if (value !== null && value !== undefined) {
      switch (field.type) {
        case 'string':
          formattedValue = String(value);
          break;
        
        case 'number':
          formattedValue = Number(value).toLocaleString();
          break;
        
        case 'boolean':
          formattedValue = value ? 'Yes' : 'No';
          break;
        
        case 'date':
          try {
            const date = new Date(value);
            formattedValue = date.toLocaleDateString();
          } catch {
            formattedValue = String(value);
          }
          break;
        
        default:
          formattedValue = String(value);
      }
    }

    return {
      label: field.description,
      value: formattedValue,
      type: field.type
    };
  });
}

/**
 * Calculate call duration in human-readable format
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Generate conversation insights
 */
export function generateConversationInsights(calls: Array<{
  transcript: string;
  extracted_data: Record<string, any>;
  duration: number;
  created_at: string;
}>): {
  totalCalls: number;
  avgDuration: number;
  successRate: number;
  commonTopics: string[];
  peakHours: number[];
} {
  if (calls.length === 0) {
    return {
      totalCalls: 0,
      avgDuration: 0,
      successRate: 0,
      commonTopics: [],
      peakHours: []
    };
  }

  // Calculate basic stats
  const totalCalls = calls.length;
  const avgDuration = calls.reduce((sum, call) => sum + call.duration, 0) / totalCalls;
  
  // Calculate success rate (calls with extracted data)
  const successfulCalls = calls.filter(call => 
    Object.keys(call.extracted_data).some(key => call.extracted_data[key] !== null)
  );
  const successRate = (successfulCalls.length / totalCalls) * 100;

  // Extract common topics from transcripts
  const allWords = calls
    .map(call => call.transcript.toLowerCase())
    .join(' ')
    .split(/\W+/)
    .filter(word => word.length > 3);
  
  const wordCounts = allWords.reduce((counts, word) => {
    counts[word] = (counts[word] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const commonTopics = Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);

  // Calculate peak hours
  const hourCounts = calls.reduce((counts, call) => {
    const hour = new Date(call.created_at).getHours();
    counts[hour] = (counts[hour] || 0) + 1;
    return counts;
  }, {} as Record<number, number>);

  const peakHours = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));

  return {
    totalCalls,
    avgDuration: Math.round(avgDuration),
    successRate: Math.round(successRate),
    commonTopics,
    peakHours
  };
}

/**
 * Export data to CSV format
 */
export function exportCallsToCSV(calls: Array<{
  id: string;
  transcript: string;
  extracted_data: Record<string, any>;
  duration: number;
  created_at: string;
}>): string {
  if (calls.length === 0) {
    return 'No data to export';
  }

  // Get all unique extracted data keys
  const allKeys = new Set<string>();
  calls.forEach(call => {
    Object.keys(call.extracted_data).forEach(key => allKeys.add(key));
  });

  // Create CSV headers
  const headers = [
    'Call ID',
    'Date',
    'Duration (seconds)',
    'Transcript',
    ...Array.from(allKeys)
  ];

  // Create CSV rows
  const rows = calls.map(call => {
    const row = [
      call.id,
      new Date(call.created_at).toISOString(),
      call.duration.toString(),
      `"${call.transcript.replace(/"/g, '""')}"`, // Escape quotes in transcript
      ...Array.from(allKeys).map(key => {
        const value = call.extracted_data[key];
        return value !== null && value !== undefined ? String(value) : '';
      })
    ];
    return row.join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Truncate text for display
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    return date.toLocaleDateString();
  }
}