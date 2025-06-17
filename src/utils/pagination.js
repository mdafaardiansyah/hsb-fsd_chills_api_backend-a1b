/**
 * @module pagination
 * @description Enhanced pagination utility with comprehensive metadata and links
 */

const pagination = {
  /**
   * Calculate comprehensive pagination metadata
   * @param {Object} options - Pagination options
   * @param {number} options.page - Current page number (1-based)
   * @param {number} options.limit - Items per page
   * @param {number} options.totalItems - Total number of items
   * @param {number} options.maxPages - Maximum pages to show in pagination (default: 10)
   * @returns {Object} Comprehensive pagination metadata
   * @example
   * calculatePagination({ page: 2, limit: 10, totalItems: 95 })
   * // Returns detailed pagination info including navigation data
   */
  calculatePagination: (options) => {
    const { 
      page = 1, 
      limit = 10, 
      totalItems = 0, 
      maxPages = 10 
    } = options;
    
    // Ensure positive integers
    const currentPage = Math.max(1, parseInt(page));
    const itemsPerPage = Math.max(1, parseInt(limit));
    const totalCount = Math.max(0, parseInt(totalItems));
    
    // Calculate basic pagination info
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const offset = (currentPage - 1) * itemsPerPage;
    
    // Navigation flags
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    const hasFirstPage = currentPage > 1;
    const hasLastPage = currentPage < totalPages;
    
    // Calculate item range for current page
    const startItem = totalCount > 0 ? offset + 1 : 0;
    const endItem = Math.min(offset + itemsPerPage, totalCount);
    const itemsOnCurrentPage = Math.max(0, endItem - startItem + 1);
    
    // Calculate page range for pagination display
    const pageRange = pagination.calculatePageRange(currentPage, totalPages, maxPages);
    
    return {
      // Current page info
      currentPage,
      totalPages,
      totalItems: totalCount,
      itemsPerPage,
      
      // Navigation info
      hasNextPage,
      hasPrevPage,
      hasFirstPage,
      hasLastPage,
      nextPage: hasNextPage ? currentPage + 1 : null,
      prevPage: hasPrevPage ? currentPage - 1 : null,
      firstPage: 1,
      lastPage: totalPages,
      
      // Item range info
      startItem,
      endItem,
      itemsOnCurrentPage,
      offset,
      
      // Page range for display
      pageRange,
      
      // Additional metadata
      isEmpty: totalCount === 0,
      isFirstPage: currentPage === 1,
      isLastPage: currentPage === totalPages,
      
      // Progress info
      progressPercentage: totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0
    };
  },

  /**
   * Calculate page range for pagination display
   * @param {number} currentPage - Current page number
   * @param {number} totalPages - Total number of pages
   * @param {number} maxPages - Maximum pages to show
   * @returns {Object} Page range information
   */
  calculatePageRange: (currentPage, totalPages, maxPages = 10) => {
    if (totalPages <= maxPages) {
      // Show all pages if total is within max limit
      return {
        start: 1,
        end: totalPages,
        pages: Array.from({ length: totalPages }, (_, i) => i + 1),
        showEllipsisStart: false,
        showEllipsisEnd: false
      };
    }
    
    const halfMax = Math.floor(maxPages / 2);
    let start = Math.max(1, currentPage - halfMax);
    let end = Math.min(totalPages, start + maxPages - 1);
    
    // Adjust start if we're near the end
    if (end === totalPages) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    
    return {
      start,
      end,
      pages,
      showEllipsisStart: start > 1,
      showEllipsisEnd: end < totalPages
    };
  },

  /**
   * Generate pagination links for API responses
   * @param {Object} pagination - Pagination metadata from calculatePagination
   * @param {string} baseUrl - Base URL for pagination links
   * @param {Object} queryParams - Additional query parameters to preserve
   * @returns {Object} Pagination links object
   */
  generatePaginationLinks: (pagination, baseUrl, queryParams = {}) => {
    const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;
    
    const buildUrl = (page) => {
      const params = new URLSearchParams({ 
        ...queryParams, 
        page: page.toString(),
        limit: pagination.itemsPerPage.toString()
      });
      return `${baseUrl}?${params.toString()}`;
    };
    
    const links = {
      self: buildUrl(currentPage),
      first: buildUrl(1),
      last: buildUrl(totalPages)
    };
    
    if (hasPrevPage) {
      links.prev = buildUrl(currentPage - 1);
    }
    
    if (hasNextPage) {
      links.next = buildUrl(currentPage + 1);
    }
    
    return links;
  },

  /**
   * Create pagination response object for API
   * @param {Array} data - Array of items for current page
   * @param {Object} paginationOptions - Options for pagination calculation
   * @param {string} baseUrl - Base URL for links (optional)
   * @param {Object} queryParams - Query parameters to preserve (optional)
   * @returns {Object} Complete pagination response
   */
  createPaginationResponse: (data, paginationOptions, baseUrl = null, queryParams = {}) => {
    const paginationMeta = pagination.calculatePagination(paginationOptions);
    
    const response = {
      data,
      pagination: {
        currentPage: paginationMeta.currentPage,
        totalPages: paginationMeta.totalPages,
        totalItems: paginationMeta.totalItems,
        itemsPerPage: paginationMeta.itemsPerPage,
        hasNextPage: paginationMeta.hasNextPage,
        hasPrevPage: paginationMeta.hasPrevPage,
        startItem: paginationMeta.startItem,
        endItem: paginationMeta.endItem,
        itemsOnCurrentPage: paginationMeta.itemsOnCurrentPage
      },
      meta: {
        isEmpty: paginationMeta.isEmpty,
        isFirstPage: paginationMeta.isFirstPage,
        isLastPage: paginationMeta.isLastPage,
        progressPercentage: paginationMeta.progressPercentage
      }
    };
    
    // Add links if baseUrl is provided
    if (baseUrl) {
      response.links = pagination.generatePaginationLinks(paginationMeta, baseUrl, queryParams);
    }
    
    return response;
  },

  /**
   * Validate pagination parameters
   * @param {Object} params - Pagination parameters to validate
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {number} maxLimit - Maximum allowed limit (default: 100)
   * @returns {Object} Validation result with sanitized values
   */
  validatePaginationParams: (params, maxLimit = 100) => {
    const { page, limit } = params;
    
    const errors = [];
    let sanitizedPage = 1;
    let sanitizedLimit = 10;
    
    // Validate page
    if (page !== undefined) {
      const pageNum = parseInt(page);
      if (isNaN(pageNum) || pageNum < 1) {
        errors.push('Page must be a positive integer');
      } else {
        sanitizedPage = pageNum;
      }
    }
    
    // Validate limit
    if (limit !== undefined) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1) {
        errors.push('Limit must be a positive integer');
      } else if (limitNum > maxLimit) {
        errors.push(`Limit cannot exceed ${maxLimit}`);
      } else {
        sanitizedLimit = limitNum;
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      page: sanitizedPage,
      limit: sanitizedLimit
    };
  },

  /**
   * Generate user-friendly pagination summary text
   * @param {Object} paginationMeta - Pagination metadata
   * @returns {string} Human-readable pagination summary
   */
  generateSummaryText: (paginationMeta) => {
    const { startItem, endItem, totalItems, currentPage, totalPages } = paginationMeta;
    
    if (totalItems === 0) {
      return 'No items found';
    }
    
    if (totalItems === 1) {
      return 'Showing 1 item';
    }
    
    if (totalPages === 1) {
      return `Showing all ${totalItems} items`;
    }
    
    return `Showing ${startItem}-${endItem} of ${totalItems} items (Page ${currentPage} of ${totalPages})`;
  }
};

module.exports = pagination;