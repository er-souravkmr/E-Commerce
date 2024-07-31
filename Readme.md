E-commerce Backend Project
--------------------------

### Project Overview

This Node.js and Express.js-based backend project serves as the foundation for an e-commerce platform. It provides RESTful APIs for managing products, orders, carts, and users. Key features include authentication, authorization, and data persistence using MongoDB.

### Technologies Used

-   Node.js
-   Express.js
-   MongoDB Atlas
-   Mongoose (MongoDB ODM)
-   Cloudinary
-   JWT (JSON Web Tokens)
-   bcrypt (Password hashing)

### Project Structure

```
project-directory/
├── public/
│   └── temp/
├── package.json
├── .env_sample
├── index.js
├── models/
│   ├── product.model.js
│   ├── order.model.js
│   ├── cart.model.js
│   └──user.model.js
├── routes/
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── cartRoutes.js
│   ├── userRoutes.js
│   └── auth.js
├── utils/
│   └── cloudinary.js
├── middleware/
│   ├── auth.middleware.js
│   └── multer.middleware.js
└── .gitignore

```

### API Endpoints

**Postman Document**

| API Documentation  | [click here](https://documenter.getpostman.com/view/37179255/2sA3kbhduS)    |

**Authentication**

-   JWT-based authentication is implemented to protect API endpoints.
-   User roles and permissions can be added for authorization.

## Installation and Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/er-souravkmr/E-Commerce.git
    ```

2. **Install dependencies:**

    ```bash
    cd E-Commerce
    npm install
    ```

3. **Set up environment variables:**
    Create a .env in root of project and fill in the required values in the .env file using .env.sample file

4. **Start the server:**

    ```bash
    npm run start
    ```

## Contributing

If you wish to contribute to this project, please feel free to contribute.

## Thanks to 

Yotube, Google(Gemini Also), ChatGPT