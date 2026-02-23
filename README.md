# **Next.js Frontend Project**

This repository contains the frontend code for a web application built using Next.js with the new App Router. The project includes TypeScript, ESLint, Tailwind CSS, ShadCN UI components, Redux Toolkit for state management, React Hook Form for form handling, and Zod for schema validation. By default, the development server runs on port `3000`.

---

## **Getting Started**

### **Prerequisites**
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (for package management)

---

### **Installation Steps**

1. **Clone the Repository**  
   bash
   git clone github.com/yoamart/yoamart-fe.git
   cd yoamart-fe
   

2. **Install Dependencies**  
   Use `pnpm` to install all required dependencies:  
   bash
   pnpm install
   

3. **Run the Development Server**  
   Start the development server with:  
   bash
   pnpm dev
   

   The app will be running at:  
   
   http://localhost:3000
   

---

## **Features**

- **Next.js (App Router):** Built using the latest App Router for improved server-side rendering and file-based routing.  
- **TypeScript:** Strongly typed programming for safer and more maintainable code.  
- **ESLint:** Linting tool to maintain code quality and consistency.  
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.  
- **ShadCN:** Pre-built UI components for a consistent design system.  
- **Redux Toolkit:** Simplified state management for complex applications.  
- **React Hook Form:** Lightweight library for managing forms with validation.  
- **Zod:** Type-safe schema validation and parsing.

---

## **Folder Structure**


/src
├── /app             # Next.js App Router folder for file-based routing
├── /components      # Reusable UI components
├── /redux           # Redux Toolkit store and slices
├── /lib             # Shared types and Zod schemas



---

## **Customization**

- **Tailwind Configuration:** Modify the `tailwind.config.js` file to customize themes and utilities.  
- **Redux Toolkit:** Update the slices in `/redux` for your specific state management needs.  
- **Zod Schemas:** Add or update your validation schemas in the `/lib` folder.  
- **React Hook Form:** Integrate forms with validation using `React Hook Form` and `Zod`.

---

## **Scripts**

Here are the available `pnpm` scripts for this project:

| **Script**    | **Command**         | **Description**                               |
|---------------|---------------------|-----------------------------------------------|
| `dev`         | `pnpm dev`          | Starts the development server on port `3000`. |
| `build`       | `pnpm build`        | Builds the application for production.        |
| `start`       | `pnpm start`        | Starts the production server.                 |
| `lint`        | `pnpm lint`         | Runs ESLint to check for code quality issues. |

---

## **Built With**

- **[Next.js](https://nextjs.org/):** Framework for building web applications with server-side rendering and static site generation.  
- **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework.  
- **[ShadCN UI](https://shadcn.dev/):** Pre-built UI components.  
- **[Redux Toolkit](https://redux-toolkit.js.org/):** State management tool for JavaScript apps.  
- **[React Hook Form](https://react-hook-form.com/):** Lightweight form library.  
- **[Zod](https://zod.dev/):** Type-safe schema validation.  
- **[TypeScript](https://www.typescriptlang.org/):** Superset of JavaScript for type safety.  
- **[ESLint](https://eslint.org/):** Static code analysis tool for JavaScript/TypeScript.

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

## **Contact**

If you have any questions or need further assistance, feel free to reach out:  
**John Chinonso Edeh**  
**netojaycee@gmail.com**  
**github.com/netojaycee**
