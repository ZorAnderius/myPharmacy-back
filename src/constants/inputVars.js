/**
 * Regular expression to validate email addresses.
 * Matches standard emails like example@example.com.
 *
 * @constant {RegExp}
 */
export const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const zipCodeRegexp = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

export const phoneRegexp = /^07\d{9}$/; // UK phone numbers

/**
 * List of possible product statuses.
 * Used to define or validate the state of products in the system.
 *
 * @constant {string[]}
 */
export const productStatuses = [
  'available',
  'out_of_stock',
  'backordered',
  'preorder',
  'discontinued',
  'coming_soon',
  'limited_edition',
  'on_sale',
  'new_arrival',
  'featured',
  'best_seller',
  'seasonal',
  'clearance',
  'archived',
  'unavailable',
  'pending_approval',
];

/**
 * List of predefined product category names.
 * Used for categorizing products in the system.
 *
 * @constant {string[]}
 */
export const categoryNames = [
  'All',
  'Pharmacy',
  'Supplements',
  'Personal Care',
  'Medical Devices',
  'Vitamins',
  'Skincare',
  'Dental',
  'Haircare',
  'Baby Care',
  'First Aid',
  'Wellness',
  'Nutrition',
];

export const userRole = ['customer', 'administrator', 'moderator', 'supplier'];
