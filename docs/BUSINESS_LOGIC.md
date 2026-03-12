# Business Logic - Product Filtering and Catalog Management

## 1. Catalog Filtering (Sabores Page)

The Flavors page (`/sabores`) implements a dynamic filtering system to allow users to browse the product catalog by category and availability.

### Filtering Workflow

1. **User Action**: When a user selects a category from the `CategoryTabs` component, the application captures the specific `category_id`.
2. **API Interaction**: The frontend performs a request to the public products endpoint using specific query parameters to narrow down results.
   - **Endpoint**: `GET /public/products`
   - **Parameters**:
     - `category_id`: The unique identifier of the selected category to ensure precise filtering from the database.
     - `exists`: Explicitly set to `true` to ensure only products that are currently in stock and ready for purchase are returned.
3. **UI Update**: The application updates the `ProductsGrid` with the returned data, mapping each item to a `ProductCard` component.

## 2. Product Availability Logic

The system uses the `exists` boolean flag to differentiate between active inventory and marketing content:

- **Available Products (`exists = true`)**:
  - Visible on the `/sabores` page.
  - Can be added to the shopping cart and included in WhatsApp orders.
- **Upcoming Flavors (`exists = false`)**:
  - Excluded from the main catalog and filtering results on the Sabores page.
  - Displayed exclusively in the "Upcoming Flavors" section on the Home page to generate anticipation for future releases.

## 3. State and Persistence

- **Active Category State**:
  - The currently selected category is stored in the UI state.
  - Manages the "active" visual style of navigation tabs and ensures the correct filter is applied during re-renders.
- **Price Variation Handling**:
  - If a product has `price_varies = true`, the frontend prioritizes displaying the associated variants rather than the base price.
  - Ensures the customer sees accurate pricing before adding an item to the cart.

## 4. Order Generation

1. Items selected by the user are stored in a local cart (`localStorage`).
2. A plain-text summary of the selected products, their quantities, and chosen variants is generated.
3. The user is redirected to WhatsApp with the pre-filled message, bypassing a complex internal checkout or payment gateway.
