/**
 * Regular expression to validate email addresses.
 * Matches standard emails like example@example.com.
 *
 * @constant {RegExp}
 */
export const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
 * List of possible order statuses.
 * Used to track the progress or state of customer orders.
 * 
 * @constant {string[]}
 */
export const orderStatuses = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'refunded',
  'on_hold',
  'failed',
  'completed',
  'partially_shipped',
  'awaiting_payment',
  'awaiting_fulfillment',
  'awaiting_pickup',
  'awaiting_dispatch',
  'awaiting_confirmation',
];

/**
 * List of predefined product category names.
 * Used for categorizing products in the system.
 * 
 * @constant {string[]}
 */
export const categoryNames = [
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
