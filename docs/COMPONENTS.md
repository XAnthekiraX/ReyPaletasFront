# COMPONENTS.md

This document defines the reusable UI components used in the frontend application.

All components must be modular, reusable, and maintain clear responsibilities.

The project uses:

React (Vite)
TailwindCSS
Component-based architecture

---

# Global Layout Components

## Header

Purpose

Provides global navigation across the website.

Structure

Logo (company icon)

Navigation Menu

Routes:

Inicio  
Sabores  
Quienes Somos  
Puntos de Venta  
Franquicias  
Contactanos

Responsibilities

display company branding  
provide navigation between pages  
remain consistent across all pages

---

## Footer

Purpose

Displays company information and social links.

Structure

Social Media Links

Contact Information

Responsibilities

provide company contact information  
link to social networks  
display consistent branding

---

# Product Components

## ProductCard

Used in the Sabores page.

Purpose

Display an individual product and allow it to be added to the cart.

Structure

Flex Column Layout

Product Image

Price

Quantity Control

(- 1 +)

Add Button

ADD

Responsibilities

display product image  
display product price  
allow quantity selection  
allow product addition to cart

---

## CartItem

Used in the Compras page.

Purpose

Display a product inside the shopping cart.

Structure

Flex Row Layout

Product Image

Product Info Column

Quantity Control

(- 1 +)

Product Name

Total Price

Remove Button

Responsibilities

display selected product  
allow quantity modification  
allow product removal  
show total product price

---

# Navigation Components

## CategoryTabs

Used in the Sabores page.

Purpose

Allow users to filter products by category.

Categories

Categories are dynamically fetched from the backend via the `/categories` endpoint.

Responsibilities

switch visible product categories  
improve product navigation

---

## CityTabs

Used in the Franquicias page.

Purpose

Allow users to navigate between cities with active franchises.

Responsibilities

filter franchise information by city  
control displayed map and gallery

---

# Content Components

## Timeline

Used in the Quienes Somos page.

Purpose

Display the company history using a vertical timeline.

Structure

6 Timeline Blocks

Each block contains

Title  
Description

Responsibilities

present company milestones  
organize historical content

---

## PhilosophySection

Used in the Quienes Somos page.

Purpose

Display the company philosophy.

Structure

3 Blocks

Mission  
Vision  
Values

Responsibilities

communicate brand identity  
present company values

---

## VideoSection

Used in the Puntos de Venta page.

Purpose

Display an informative video explaining the sales points.

Structure

Title  
Embedded Video Player

Responsibilities

present visual explanation  
support informational content

---

# Franchise Components

## FranchiseMap

Used in the Franquicias page.

Purpose

Display the location of a franchise on the map.

Responsibilities

visualize franchise location  
assist users in finding stores

---

## FranchiseGallery

Used in the Franquicias page.

Purpose

Display photos of the franchise location.

Responsibilities

show the physical location  
reinforce brand presence

---

## FranchiseManager

Used in the Franquicias page.

Purpose

Display information about the franchise manager.

Structure

Manager Photo  
Manager Name  
Short Description

Responsibilities

personalize the franchise location  
present the responsible manager

---

# Cart Components

## CartSummary

Used in the Compras page.

Purpose

Display the purchase summary.

Structure

Total Price

Shipping Information

Includes Shipping: No

Responsibilities

show order total  
summarize purchase information

---

## OrderButton

Used in the Compras page.

Purpose

Trigger the order process.

Behavior

Generates a WhatsApp message containing the order information.

Responsibilities

initiate order creation  
redirect user to WhatsApp
