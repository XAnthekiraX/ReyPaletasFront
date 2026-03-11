## Categories

Represents the product categories used to organize the menu.

Categories are used in the Sabores page to group products.

The admin panel can create new categories dynamically.

Fields

id

Primary identifier.

name

Name of the category.

Example categories

Chocolates  
Cremosas  
Especiales  
Paletitas  
De Hielo  
De Sal  
Bebidas  
Otros

## Products

Represents the products available in the menu.

Products are displayed in the Sabores page.

Some products have a fixed price, while others allow price variations.

Fields

id

Primary identifier.

name

Name of the product.

price

Base price of the product.

exists

Defines product availability.

true → product is currently available  
false → product is a future product

category_id

Reference to the product category.

Relation:

products.category_id → categories.id

price_varies

Boolean value that indicates if the product has price variations.

true → the product has variants  
false → the product uses the base price

image_url

Image displayed in the product card.

## Product Variants

Represents price variations of a product.

Variants are used when a product can be sold with different configurations that change its final price.

Examples include beverages that vary depending on the drink used.

Variants replace the base product price.

Fields

id

Primary identifier.

product_id

Reference to the base product.

Relation:

product_variants.product_id → products.id

name

Name of the variant.

Example:

Pilsener  
Corona  
Club

price

Final price of the product when this variant is selected.

## Announcements

Represents announcements or promotional notices displayed on the Home page.

Announcements are managed through the admin panel and can be activated or deactivated.

Fields

id

Primary identifier.

title

Title of the announcement.

description

Content or message of the announcement.

image_url

Image associated with the announcement.

active

Boolean value that defines if the announcement is visible.

true → announcement is displayed  
false → announcement is hidden

## Franchises

Represents the franchise locations of the company.

Franchise information is displayed in the Franquicias page and includes location data, manager information, and images.

Fields

id

Primary identifier.

city

City where the franchise is located.

location_name

Name of the franchise location.

latitude

Latitude coordinate used to display the location on the map.

longitude

Longitude coordinate used to display the location on the map.

manager_name

Name of the franchise manager.

manager_description

Short description of the manager.

manager_photo

Photo of the franchise manager.

description

Short description of the franchise location.
