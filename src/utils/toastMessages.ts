import { toast } from "sonner";

export const showSuccessToast = (operation: string, details?: string) => {
  toast.success(`${operation} completed successfully${details ? `: ${details}` : ''}`);
};

export const showErrorToast = (operation: string, error: string) => {
  toast.error(`Failed to ${operation}: ${error}`);
};

export const showInfoToast = (message: string, details?: string) => {
  toast.info(`${message}${details ? `: ${details}` : ''}`);
};

export const showWarningToast = (message: string, details?: string) => {
  toast.warning(`${message}${details ? `: ${details}` : ''}`);
};

// Common operations
export const showCopySuccessToast = () => {
  showSuccessToast("Copy", "Content copied to clipboard");
};

export const showDownloadSuccessToast = (filename: string) => {
  showSuccessToast("Download", `${filename} downloaded successfully`);
};

export const showUploadSuccessToast = (filename: string) => {
  showSuccessToast("Upload", `${filename} uploaded successfully`);
};

export const showValidationErrorToast = (error: string) => {
  showErrorToast("validate input", error);
};

export const showProcessingErrorToast = (error: string) => {
  showErrorToast("process", error);
};

export const showSaveSuccessToast = () => {
  showSuccessToast("Save", "Changes saved successfully");
};

export const showDeleteSuccessToast = () => {
  showSuccessToast("Delete", "Item deleted successfully");
};

export const showClearSuccessToast = () => {
  showSuccessToast("Clear", "All content cleared");
};

export const showResetSuccessToast = () => {
  showSuccessToast("Reset", "Settings reset to default");
};