# REST API

Basically this personal project it's a CRUD where you can add, edit, update and delete categories, products and users. 
It's built with node.js and some technologies like:
 - express.
 - File upload control with File System.
 - mongoDB as a database.
 - mongoose.
 - JSON Web Tokens to session control.
 - Google Sign-in service.
 - bcrypt to encrypt password.
 
# Some features:
- All models interact with each other, for example: You can't add a product without first create a category
- There are two types of users with different permissions:
   1. Normal user only can access to see all users, products, and categories (GET requests).
   2. Admin user can see, update, create and delete users, products and categories. (GET, POST, PUT and DELETE requests).
- To access to services you have to send in header a valid JWT that is generated every time a user log in.
- Passwords are encrypted with a hash and saved in the database.
- Users can register and log in with google.
- File upload control to save images in the server.


And other things more that you can explore with the help of the documentation of each service in https://documenter.getpostman.com/view/10132835/T1DpBcnS

 
If you want to see this project running, you can make some requests to https://juan-restserver.herokuapp.com/ and test it.
Credentials to test: 
- Normal user: 
test1@gmail.com 
12345678
- Admin user:
admin@gmail.com
12345678


