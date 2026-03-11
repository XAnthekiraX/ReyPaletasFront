## Home (/)

### Purpose

The Home page introduces the company and highlights key information about the brand and its products.

Its goal is to quickly communicate the identity of the company and guide users to explore products or other sections of the site.

---

### Sections

Hero Section

Contains:

- Company image or visual banner
- Short description of the company

Purpose:

- communicate brand identity
- create a strong first impression

---

Announcements Section

Displays recent announcements from the company.

Content examples:

- promotions
- news
- events
- updates

Data source:

announcements

---

Upcoming Flavors Section

Displays products that will be available in the future.

Purpose:

- generate interest
- show innovation and upcoming releases

Data source:

future_products

---

Featured Flavors Section

Displays selected popular products.

Purpose:

- highlight the most important products
- encourage users to explore the catalog

Data source:

products

## Sabores (/sabores)

### Purpose

The Sabores page displays the complete catalog of available products.

Users can explore products by category and add items to the shopping cart.

---

### Page Structure

Top Navigation (Categories)

Displays product categories as a secondary navigation menu.

Categories:

Chocolates  
Cremosas  
Especiales  
Paletitas  
De Hielo  
De Sal  
Bebidas  
Otros

Purpose:

- help users navigate the catalog
- filter products by category

---

Cart Button

A shopping cart icon appears in the top-right area of the page.

Responsibilities:

- provide quick access to the cart
- redirect users to the cart page

Route:

/compras

---

Products Grid

Products are displayed in a grid layout.

Each product is represented by a card.

---

### Product Card Structure

Layout:

flex-col

Elements:

Product Image  
Product Price  
Quantity Selector (- 1 +)  
Add Button

---

Product Image

Displays the visual representation of the product.

---

Price

Shows the product price clearly.

---

Quantity Selector

Allows the user to select the quantity before adding the product to the cart.

Controls:

- decrease quantity
- increase quantity

---

Add Button

Button label:

ADD

Responsibilities:

- add the selected product to the cart
- respect the selected quantity

---

### Cart Interaction

When the user clicks ADD:

- the product is added to the cart
- the selected quantity is stored
- the user remains on the page

## Quienes Somos (/quienes-somos)

### Purpose

The Quienes Somos page presents the history and identity of the company.

Its goal is to communicate the origin, growth, and philosophy of the brand to build trust with customers, partners, and potential franchise owners.

---

### Page Structure

Company History Section

Displays the history of the company using a vertical timeline.

Structure:

Vertical Timeline

The timeline is divided into 6 sections.

Each section contains:

Title  
Description

Purpose:

- explain the origin of the company
- show the evolution of the business
- communicate important milestones

Each timeline block represents a stage in the company's development.

---

### Company Philosophy Section

Located below the timeline.

This section presents the values and philosophy of the company.

Structure:

3 content blocks.

Each block contains:

Title  
Short description

Possible content examples:

Mission  
Vision  
Values

Purpose:

- communicate company principles
- reinforce brand identity
- show long-term vision

## Puntos de Venta (/puntos-de-venta)

### Purpose

The Puntos de Venta page explains what the company's sales locations are and how customers can find the products.

Its purpose is to inform users about the availability of the products in different locations and provide a visual explanation of how the distribution works.

---

### Page Structure

Introduction Section

Contains a short explanation describing what the sales points are and how the company distributes its products.

Content:

Title  
Short descriptive text

Purpose:

- explain the concept of sales locations
- inform customers where products can be found

---

Informational Video Section

Displays an informative video related to the sales points.

Content:

Embedded video player.

Purpose:

- visually explain how the sales points work
- provide a clearer understanding of product distribution

## Franquicias (/franquicias)

### Purpose

The Franquicias page presents the locations where the company has active franchises.

Its goal is to show the geographic presence of the brand and provide information about each franchise location.

---

### Page Structure

Cities Navigation

Displays a navigation menu containing the cities where franchises exist.

Purpose:

- allow users to switch between franchise locations
- organize franchise information by city

Each city acts as a content filter for the franchise information.

---

Franchise Location Map

Displays a map showing the location of the selected franchise.

Content:

Interactive map with the franchise marker.

Purpose:

- visually indicate where the franchise is located
- help users easily identify the location

---

Franchise Gallery

Displays photos of the franchise location.

Content:

Image gallery of the store.

Purpose:

- show the physical location
- reinforce brand presence

---

Franchise Manager Section

Displays information about the person responsible for the franchise.

Content:

Manager photo  
Manager name  
Short description

Purpose:

- personalize the franchise location
- show the local representation of the brand

## Contáctanos (/contactanos)

### Purpose

The Contactanos page allows users to send inquiries directly to the company.

Its goal is to provide a simple and clear communication channel for customers, potential employees, and business partners.

---

### Page Structure

Contact Form Section

Displays a form that allows users to send a message to the company.

Form fields:

Name  
Email  
Subject  
Message

Action:

When the form is submitted, the message is sent to the backend service which processes and delivers the email.

Purpose:

- allow users to contact the company
- centralize inquiries
- provide a direct communication channel

## Compras (/compras)

### Purpose

The Compras page acts as the shopping cart of the application.

Its goal is to allow users to review the selected products, modify quantities, and send the order through WhatsApp.

---

### Page Structure

Page Header

Displays the page title and main cart actions.

Content:

Title: Compras

Left Button:

Volver a Sabores

Purpose:
Return the user to the products page.

Right Button:

Eliminar Pedido

Purpose:
Remove all products from the cart.

---

Cart Product List

Displays all products added from the Sabores page.

Each product item structure:

Flex Row Layout

Product Image

Product Info Column

Quantity Control  
(- 1 +)

Product Name

Total Price

Remove Button

Purpose:

- allow quantity modification
- allow product removal
- display the total value per product

---

Purchase Summary

Displays a summary of the order.

Content:

Total Price

Shipping Information

Includes Shipping: No

Purpose:

- show the total cost of the order
- clarify shipping conditions

---

Order Action

Primary Button:

Realizar Pedido

Behavior:

When the button is pressed, the system generates a WhatsApp message containing the order information.

The user is redirected to WhatsApp with the order ready to send.

---

Order Confirmation

After initiating the order process, a success animation is displayed.

Purpose:

- confirm that the order was generated correctly
- provide visual feedback to the user
