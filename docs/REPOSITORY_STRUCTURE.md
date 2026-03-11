# Repository Structure

## Overview

The system is organized using two independent repositories.

This separation allows independent deployment, clearer responsibilities, and easier maintenance.

Repositories:

Rey Paletas => frontend  
Rey Paletas Back => backend

Both repositories are deployed independently on Vercel.

---

# 1. Frontend Repository

Repository name example:

Rey Paletas Front

Purpose:

Contains the public website and the admin panel built with React.

### Structure

/src
/assets
/components
/features
/layouts
/pages
/routes
/services
/store
/styles
/utils

/public

/docs

/prompts

### Folder Responsibilities

assets  
Static resources such as images, icons, and media.

components  
Reusable UI components.

features  
Feature-based modules (products, franchises, announcements, cart).

layouts  
Application layouts such as public layout and admin layout.

pages  
Main application pages.

routes  
Application routing configuration.

services  
API communication with the backend.

store  
Client state management (cart, UI state, session state).

styles  
Global styles and Tailwind configuration.

utils  
Helper functions and shared utilities.

docs  
Project documentation related to the frontend.

prompts  
AI prompts used by development agents.

---

# 2. Backend Repository

Repository name example:

Rey Paletas Back

Purpose:

Provides the API and data management for the admin panel.

### Structure

/src
/controllers
/routes
/services
/middlewares
/utils
/config

/docs

/prompts

### Folder Responsibilities

controllers  
Handle incoming requests and responses.

routes  
Define API endpoints.

services  
Business logic and communication with Supabase.

middlewares  
Authentication, validation, and request processing.

utils  
Shared backend utilities.

config  
Environment configuration and external service setup.

docs  
Backend documentation.

prompts  
AI prompts used for backend development agents.

---

# 3. Shared Conventions

Both repositories follow these conventions:

Clear separation of responsibilities  
Feature-based organization where possible  
Minimal business logic inside UI components  
Centralized service layer for external communication

Documentation lives inside the docs directory of each repository.

AI development prompts live inside the prompts directory.
