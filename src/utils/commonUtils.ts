/**
 * Common utility functions for page components
 */

/**
 * Formats an entity name to follow camelCase convention
 * Example: "user_profile" -> "userProfile"
 * 
 * @param {string} name - Raw entity name
 * @returns {string} Formatted camelCase name
 */
export function formatEntityName(name: string): string {
  return name.replace(/[-\s]+/g, '_').split('_').map((word, index) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    return index === 0 ? capitalized.toLowerCase() : capitalized;
  }).join('');
}

/**
 * Formats a field name for display
 * Example: "user_name" -> "User Name"
 * 
 * @param {string} name - Raw field name
 * @returns {string} Formatted display name
 */
export function formatFieldLabel(name: string): string {
  return name
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Formats a field name for React Hook Form registration
 * Replaces spaces with underscores for valid JavaScript identifiers
 * 
 * @param {string} name - Raw field name
 * @returns {string} Formatted field name
 */
export function formatFieldName(name: string): string {
  return name.replace(/\s+/g, '_');
}

/**
 * Formats a date to ISO string with timezone
 * 
 * @param {Date} date - Date to format
 * @returns {string} Formatted ISO string
 */
export function formatLocalToISOString(date: Date): string {
  const pad = (num: number) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = pad(date.getMilliseconds());
  const offset = -date.getTimezoneOffset();
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
  const offsetMinutes = pad(Math.abs(offset) % 60);
  const timezoneSign = offset >= 0 ? "+" : "-";
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${offsetHours}:${offsetMinutes}`;
}

/**
 * Converts ISO string to local date string
 * 
 * @param {string} isoString - ISO date string
 * @returns {string} Local date string
 */
export function convertToLocal(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const pad = (num: number) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); 
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Formats date and time for display
 * 
 * @param {string} inputDate - Raw date string
 * @returns {string} Formatted date string
 */
export function formatDateTime(inputDate: string): string {
  if (!inputDate) return "";
  const date = new Date(inputDate.replace(" ", "T")); 
  return date.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });
}

/**
 * Common API call handler with error handling and loading state
 */
export async function handleApiCall<T>(
  apiCall: () => Promise<T>,
  onSuccess: (data: T) => void,
  onError: (error: any) => void,
  setLoading?: (loading: boolean) => void
): Promise<void> {
  try {
    if (setLoading) setLoading(true);
    const data = await apiCall();
    onSuccess(data);
  } catch (error: any) {
    onError(error?.response?.data?.message || error.message || 'An error occurred');
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Common form submission handler
 */
export async function handleFormSubmit<T>(
  formData: any,
  apiCall: (data: any) => Promise<T>,
  onSuccess: (data: T) => void,
  onError: (error: any) => void,
  setLoading?: (loading: boolean) => void
): Promise<void> {
  try {
    if (setLoading) setLoading(true);
    const data = await apiCall(formData);
    onSuccess(data);
  } catch (error: any) {
    onError(error?.response?.data?.message || error.message || 'An error occurred');
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Common delete handler
 */
export async function handleDelete(
  id: string,
  deleteApiCall: (id: string) => Promise<void>,
  onSuccess: () => void,
  onError: (error: any) => void,
  setLoading?: (loading: boolean) => void
): Promise<void> {
  try {
    if (setLoading) setLoading(true);
    await deleteApiCall(id);
    onSuccess();
  } catch (error: any) {
    onError(error?.response?.data?.message || error.message || 'An error occurred');
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Common record fetching handler
 */
export async function fetchRecords<T>(
  apiCall: () => Promise<T[]>,
  onSuccess: (data: T[]) => void,
  onError: (error: any) => void,
  setLoading?: (loading: boolean) => void
): Promise<void> {
  try {
    if (setLoading) setLoading(true);
    const data = await apiCall();
    onSuccess(data);
  } catch (error: any) {
    onError(error?.response?.data?.message || error.message || 'An error occurred');
  } finally {
    if (setLoading) setLoading(false);
  }
}

/**
 * Safely accesses an object property, handling special characters in property names
 * @param obj - The object to access
 * @param prop - The property name to access
 * @returns The property value or a default value if not found
 */
export function safeGet(obj: any, prop: string): any {
  if (!obj) return '-';
  return obj[prop] || '-';
} 