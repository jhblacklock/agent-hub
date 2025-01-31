export function generateCleanUrlPath(input: string): string {
  if (!input) return '';

  return input
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/['"]/g, '-') // Convert quotes to dashes
    .replace(/[^a-z0-9\s\-_.]/g, '-') // Convert non-allowed special chars to dash
    .replace(/\s+/g, '-') // Convert spaces to dashes
    .replace(/-+/g, '-') // Replace multiple dashes with a single dash
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}
