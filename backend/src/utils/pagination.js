export function getPagination(query) {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  // Default values
  if (Number.isNaN(page) || page < 1) {
    page = 1;
  }

  if (Number.isNaN(limit) || limit < 1) {
    limit = 10;
  }

  // Prevent very large requests
  if (limit > 100) {
    limit = 100;
  }

  const skip = (page - 1) * limit;
  const take = limit;

  return {
    page,
    limit,
    skip,
    take,
  };
}