function getPagination(query) {
  const page = Math.abs(Number(query.page)) || 1;
  const limit = Math.abs(Number(query.limit)) || 0;
  const skip = (page - 1) * limit || 0;
  return {
    limit,
    skip,
  };
}

module.exports = getPagination;
