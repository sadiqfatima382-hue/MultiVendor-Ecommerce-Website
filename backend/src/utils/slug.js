export function generateSlug(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")       // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "")    // Remove special characters
    .replace(/--+/g, "-")       // Replace multiple hyphens with one
    .replace(/^-+|-+$/g, "");   // Remove leading/trailing hyphens
}