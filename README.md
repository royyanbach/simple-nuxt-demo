# Product Catalog Manager

A comprehensive product catalog management application built with Nuxt 3, Vue 3, and TailwindCSS. This application allows users to view, search, edit, and manage product information through an intuitive interface.

## Features

- **Product Listing:** View all products in a responsive grid layout
- **Search Functionality:** Real-time product filtering via search bar
- **Product Details:** View complete information for individual products
- **Product Editing:** Edit existing product information with validation
- **Responsive Design:** Consistent experience across all devices

## Technologies Used

- **Nuxt 3:** For server-side rendering and application structure
- **Vue 3:** Using the Composition API
- **TypeScript:** For type safety
- **TailwindCSS:** For responsive styling
- **REST API:** Built-in API endpoint for product data

## Getting Started

### Prerequisites

- Node.js (v20+)
- yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/royyanbach/simple-nuxt-demo.git
   cd simple-nuxt-demo
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Start the development server:
   ```
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
/
├── assets/                # Static assets (CSS, images)
├── components/            # Reusable Vue components
├── layouts/               # Application layouts
├── pages/                 # Application pages and routes
├── public/                # Public static files
├── server/                # Server-side API endpointsc
├── app.vue                # Application entry point
├── nuxt.config.ts         # Nuxt configuration
└── tailwind.config.js     # TailwindCSS configuration
```

## Usage

- **Home Page:** Browse all available products
- **Search:** Use the search bar in the header to filter products
- **Product Details:** Click on a product card to view detailed information
- **Edit Product:** Navigate to a product's edit page to modify its information

## License

MIT

