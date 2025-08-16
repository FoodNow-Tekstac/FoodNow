# FoodNow

Module 1 Complete

🧪 Test Scenarios
Success Scenariohttps://github.com/techTenzen/FoodNow/pull/4s
1. Successful User Registration

Action: Create a new user with unique details.

Request:

Method: POST

URL: http://localhost:8080/api/auth/register

Body (raw, JSON):

JSON

{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "password123",
    "phoneNumber": "1112223330"
}
Expected Response:

Status: 200 OK

Body: User registered successfully!

2. Successful Login

Action: Log in with the user you just created.

Request:

Method: POST

URL: http://localhost:8080/api/auth/login

Body (raw, JSON):

JSON

{
    "email": "alice@example.com",
    "password": "password123"
}
Expected Response:

Status: 200 OK

Body: A JSON object containing the JWT token.

JSON

{
    "accessToken": "ey...",
    "tokenType": "Bearer"
}
Failure Scenarios (Testing your Exception Handler)
3. Registration with a Duplicate Email

Action: Try to register a new user with the same email as before.

Request:

Method: POST

URL: http://localhost:8080/api/auth/register

Body:

JSON

{
    "name": "Bob",
    "email": "alice@example.com", // DUPLICATE
    "password": "password456",
    "phoneNumber": "4445556667"
}
Expected Response (from handleDataIntegrityViolation):

Status: 409 Conflict

Body:

JSON

{
    "timestamp": "...",
    "status": 409,
    "error": "Conflict",
    "message": "Email address already exists"
}
4. Login with Incorrect Password

Action: Use the correct email but the wrong password.

Request:

Method: POST

URL: http://localhost:8080/api/auth/login

Body:

JSON

{
    "email": "alice@example.com",
    "password": "wrongpassword" // INCORRECT
}
Expected Response (from handleBadCredentials):

Status: 401 Unauthorized

Body:

JSON

{
    "timestamp": "...",
    "status": 401,
    "error": "Unauthorized",
    "message": "Invalid email or password"
}
5. Login with a Non-Existent User

Action: Try to log in with an email that is not registered.

Request:

Method: POST

URL: http://localhost:8080/api/auth/login

Body:

JSON

{
    "email": "notauser@example.com", // DOES NOT EXIST
    "password": "password123"
}
Expected Response (from handleUserNotFound):

Status: 401 Unauthorized

Body:

JSON

{
    "timestamp": "...",
    "status": 401,
    "error": "Unauthorized",
    "message": "Invalid credentials"
}


✅ How to Test Role-Based Access
Here’s how you can test that the new security rule is working correctly.

Test 1: Access Denied for a Regular User
Register a new user (or use "alice@example.com" if she's still in your database). This user will have the CUSTOMER role.

Log in as the CUSTOMER user (alice@example.com) to get a JWT token.

Try to access the admin endpoint with that token.

Request:

Method: GET

URL: http://localhost:8080/api/admin/dashboard

Headers:

Authorization: Bearer <token_from_customer_login>

Expected Response:

Status: 403 Forbidden

This proves that users without the ADMIN role cannot access the endpoint.

Test 2: Access Granted for the Admin User
Log in as the default admin user.

Method: POST

URL: http://localhost:8080/api/auth/login

Body:

JSON

{
    "email": "admin@foodnow.com",
    "password": "admin123"
}
You will receive a new JWT token for the admin.

Access the admin endpoint using the admin's token.

Request:

Method: GET

URL: http://localhost:8080/api/admin/dashboard

Headers:

Authorization: Bearer <token_from_admin_login>

Expected Response:

Status: 200 OK

Body:

JSON

{
    "message": "Welcome to the Admin Dashboard!"
}

<<<<<<< HEAD

Module 2: Restaurant Application & Management Tests
1. Customer Submits a Restaurant Application
Action: A logged-in CUSTOMER applies to open a restaurant.

Method: POST

URL: http://localhost:8080/api/applications/restaurant/apply

Headers: Authorization: Bearer <customer_token>

Body:

JSON

{
    "restaurantName": "The Test Kitchen",
    "restaurantAddress": "123 API Lane, Hyderabad",
    "restaurantPhone": "9988776655",
    "locationPin": "17.3850,78.4867"
}
Result: 200 OK with the application details and a "status": "PENDING".

2. Admin Approves an Application
Action: An ADMIN approves a pending application, creating a restaurant and upgrading the user's role.

Method: POST

URL: http://localhost:8080/api/admin/applications/{applicationId}/approve

Headers: Authorization: Bearer <admin_token>

Result: 200 OK with the details of the newly created Restaurant entity.

3. Admin Rejects an Application
Action: An ADMIN rejects a pending application.

Method: POST

URL: http://localhost:8080/api/admin/applications/{applicationId}/reject

Headers: Authorization: Bearer <admin_token>

Body:

JSON

{
    "reason": "Incomplete documentation provided."
}
Result: 200 OK with a success message.

4. Approved Owner Adds a Menu Item
Action: A newly approved RESTAURANT_OWNER adds an item to their menu.

Method: POST

URL: http://localhost:8080/api/restaurant/menu

Headers: Authorization: Bearer <new_owner_token> (This required logging in again as the user to get a token with the updated role).

Body:

JSON

{
    "name": "Chicken Tikka Masala",
    "description": "Grilled chicken chunks in a spiced curry sauce.",
    "price": 400.00
}
Result: 200 OK with a clean JSON response of the FoodItemDto.



Test 1: Get a List of All Restaurants
This test checks if the API can publicly show all available restaurants.

Open Postman.

Set the Method: GET

Enter the URL: http://localhost:8080/api/public/restaurants

Click "Send".

✅ Expected Result: You should get a 200 OK status. The response body will be a JSON array containing a list of all the restaurants in your system, formatted cleanly by your RestaurantDto.

Test 2: Get the Menu for a Specific Restaurant
This test checks if you can view the menu for a single restaurant.

Get a Restaurant ID: Look at the response from Test 1 and find the id of one of the restaurants (e.g., 2).

Set the Method: GET

Enter the URL: http://localhost:8080/api/public/restaurants/{restaurantId}/menu (replace {restaurantId} with the actual ID, for example: http://localhost:8080/api/public/restaurants/2/menu).

Click "Send".

✅ Expected Result: You should get a 200 OK status. The response body will be a single JSON object for that specific restaurant, including a menu array that lists all of its available food items.

oodNow: End-to-End Backend Test Plan
This guide covers the complete testing workflow for Modules 1, 2, and 3. Follow these steps in order using Postman.

Part 1: User Registration & Application
Objective: Create a new user and have them apply to become a restaurant owner.

Register a New Customer

Action: Create a new user who will become a restaurant owner.

Method: POST

URL: http://localhost:8080/api/auth/register

Body:

{
    "name": "Priya Sharma",
    "email": "priya.sharma@example.com",
    "password": "password123",
    "phoneNumber": "9988776655"
}

Expected Result: 200 OK

Log In as the New Customer

Action: Log in to get an authentication token for Priya.

Method: POST

URL: http://localhost:8080/api/auth/login

Body:

{
    "email": "priya.sharma@example.com",
    "password": "password123"
}

➡️ Action: Copy the accessToken from the response. Let's call this priya_customer_token.

Submit Restaurant Application

Action: Priya submits her application.

Method: POST

URL: http://localhost:8080/api/applications/restaurant/apply

Headers: Authorization: Bearer <priya_customer_token>

Body:

{
    "restaurantName": "Priya's Kitchen",
    "restaurantAddress": "123 Jubilee Hills, Hyderabad",
    "restaurantPhone": "1122334455",
    "locationPin": "17.4375, 78.4483"
}

Expected Result: 200 OK. The application is now pending.

Part 2: Admin Approval
Objective: As an admin, approve Priya's application.

Log In as Admin

Method: POST

URL: http://localhost:8080/api/auth/login

Body:

{
    "email": "admin@foodnow.com",
    "password": "admin123"
}

➡️ Action: Copy the accessToken. Let's call this admin_token.

View Pending Applications

Action: The admin checks for new applications.

Method: GET

URL: http://localhost:8080/api/admin/applications/pending

Headers: Authorization: Bearer <admin_token>

➡️ Action: Find the application for "Priya's Kitchen" in the response and note its id.

Approve the Application

Action: The admin approves Priya's application.

Method: POST

URL: http://localhost:8080/api/admin/applications/{applicationId}/approve (replace {applicationId} with the ID you noted).

Headers: Authorization: Bearer <admin_token>

Expected Result: 200 OK. Priya's role is now RESTAURANT_OWNER.

Part 3: Restaurant Owner Menu Management
Objective: Priya, now an owner, logs in and adds items to her menu.

Log In as Restaurant Owner

Action: Priya logs in again to get a new token with her updated role.

Method: POST

URL: http://localhost:8080/api/auth/login



Body: 

{
    "email": "priya.sharma@example.com",
    "password": "password123"
}

➡️ Action: Copy the new accessToken. Let's call this priya_owner_token.

Add Menu Items

Action: Priya adds two items to her menu.

Method: POST

URL: http://localhost:8080/api/restaurant/menu

Headers: Authorization: Bearer <priya_owner_token>

Body (Item 1):

{
    "name": "Samosa Chaat",
    "description": "Crispy samosas topped with yogurt, chutney, and spices.",
    "price": 120.00
}

Body (Item 2): (Send a second request with this body)

{
    "name": "Mango Lassi",
    "description": "A refreshing yogurt-based mango smoothie.",
    "price": 90.00
}

Expected Result: 200 OK for both requests.

Part 4: Customer Ordering Workflow
Objective: A different customer finds Priya's restaurant and places an order.

Register a New Customer (for ordering)

Action: Create a new customer named Arjun.

Method: POST

URL: http://localhost:8080/api/auth/register

Body:

{
    "name": "Arjun Verma",
    "email": "arjun.v@example.com",
    "password": "password456",
    "phoneNumber": "8877665544"
}

Log In as Arjun

Method: POST

URL: http://localhost:8080/api/auth/login

Body:

{
    "email": "arjun.v@example.com",
    "password": "password456"
}

➡️ Action: Copy the accessToken. Let's call this arjun_token.

Browse Restaurants (Public)

Action: Arjun views all restaurants.

Method: GET

URL: http://localhost:8080/api/public/restaurants

➡️ Action: Find "Priya's Kitchen" and note the id of her "Samosa Chaat" from the menu in the response.

Add Item to Cart

Action: Arjun adds two Samosa Chaats to his cart.

Method: POST

URL: http://localhost:8080/api/cart/items

Headers: Authorization: Bearer <arjun_token>

Body: (Use the foodItemId for Samosa Chaat)

{
    "foodItemId": 1, 
    "quantity": 2
}

Expected Result: 200 OK with the cart details.

Place Order

Action: Arjun confirms his cart and places the order.

Method: POST

URL: http://localhost:8080/api/orders

Headers: Authorization: Bearer <arjun_token>

Expected Result: 200 OK with the new order details and a status of PENDING.

View Order History

Action: Arjun checks his past orders.

Method: GET

URL: http://localhost:8080/api/orders/my-orders

Headers: Authorization: Bearer <arjun_token>

Expected Result: 200 OK. The response will be an array containing the Samosa Chaat order he just placed.


Here is the testing plan for the new payment processing endpoint.

Prerequisites
Have a Pending Order: You must have an order with a PENDING status in your database. To get one, follow the "Customer Ordering Workflow" from our previous test plan:

Log in as a customer.

Add an item to the cart.

Place the order.

Note the id of the new order from the response.

Get the Customer's Token: Make sure you have the JWT accessToken for the same customer who placed the pending order.

Test: Process a Payment for an Order
Action: The customer initiates a payment for the order they just created.

Method: POST

URL: http://localhost:8080/api/payments/process

Headers: Authorization: Bearer <customer_token>

Body: (Use the orderId you noted from the prerequisite step)

JSON

{
    "orderId": 3 
}
Result: You should get a 200 OK status. The response body will be a PaymentDto showing the details of the transaction.

The status will be either SUCCESSFUL or FAILED (since our service logic is random).

You will see a unique transactionId.

Verification
After the test, check your database to confirm the changes:

Check the payments table: You will see a new row for the transaction you just processed.

Check the orders table: Find the order you paid for. If the payment was successful, its status will now be updated from PENDING to CONFIRMED.




TESTED ALL


### **Folder 1: Account Creation & Login**

**1.1 - Login as Admin**
* **Method:** POST
* **URL:** `http://localhost:8080/api/auth/login`
* **Body:** In the Body tab, select raw and JSON, then type: `{"email": "admin@foodnow.com", "password": "adminpass"}`
* **Action:** From the response, copy the value of the `accessToken`. This is your **admin token**.
  
**1.2 - Create Future Restaurant Owner (Priya)**
* **Method:** POST
* **URL:** `http://localhost:8080/api/auth/register`
* **Body:** In the Body tab, select raw and JSON, then type: `{"name": "Priya Patel", "email": "priya@example.com", "password": "password123", "phoneNumber": "9876543210"}`

**1.3 - Create a New Customer (Ravi)**
* **Method:** POST
* **URL:** `http://localhost:8080/api/auth/register`
* **Body:** In the Body tab, select raw and JSON, then type: `{"name": "Ravi Kumar", "email": "ravi@example.com", "password": "password123", "phoneNumber": "8765432109"}`

**1.4 - Admin Creates Delivery Agent (Sanjay)**
* **Method:** POST
* **URL:** `http://localhost:8080/api/admin/delivery-personnel`
* **Authorization:** Use the **admin token**.
* **Body:** In the Body tab, select raw and JSON, then type: `{"name": "Sanjay Singh", "email": "sanjay.delivery@example.com", "password": "password123", "phoneNumber": "7654321098"}`

---

### **Folder 2: Restaurant Application Flow**

**2.1 - Login as Customer (Priya)**
* **Method:** POST
* **URL:** `http://localhost:8080/api/auth/login`
* **Body:** In the Body tab, select raw and JSON, then type: `{"email": "priya@example.com", "password": "password123"}`
* **Action:** Copy the `accessToken` from the response. This is **Priya's token**.

**2.2 - Priya Applies for Restaurant**
* **Method:** POST
* **URL:** `http://localhost:8080/api/restaurant/apply`
* **Authorization:** Use **Priya's token**.
* **Body:** In the Body tab, select raw and JSON, then type: `{"restaurantName": "Priya's Kitchen", "restaurantAddress": "123 Jubilee Hills, Hyderabad", "restaurantPhone": "1122334455", "locationPin": "17.4334,78.4069"}`
* **Action:** From the response, copy the value of the `id`. This is the **application ID**.

**2.3 - Admin Approves Application**
* **Method:** POST
* **URL:** `http://localhost:8080/api/admin/applications/YOUR_APPLICATION_ID/approve` (replace `YOUR_APPLICATION_ID` with the ID you just copied).
* **Authorization:** Use the **admin token**.
* **Action:** From the response, copy the value of the `id`. This is the **restaurant ID**.

---

### **Folder 3: Restaurant - Menu Management**

**3.1 - Login as Restaurant Owner (Priya)**
* **Method:** POST
* **URL:** `http://localhost:8080/api/auth/login`
* **Body:** In the Body tab, select raw and JSON, then type: `{"email": "priya@example.com", "password": "password123"}`
* **Action:** Copy the `accessToken`. This is **Priya's new owner token**.

**3.2 - Owner Adds Food Item to Menu**
* **Method:** POST
* **URL:** `http://localhost:8080/api/restaurant/menu`
* **Authorization:** Use **Priya's new owner token**.
* **Body:** In the Body tab, select raw and JSON, then type: `{"name": "Hyderabadi Biryani", "description": "Authentic chicken dum biryani", "price": 350.00}`
* **Action:** From the response, copy the value of the `id`. This is the **food item ID**.

---

### **Folder 4: Customer - Order Placement**

**4.1 - Login as Customer (Ravi)**
* **Method:** POST
* **URL:** `http://localhost:8080/api/auth/login`
* **Body:** In the Body tab, select raw and JSON, then type: `{"email": "ravi@example.com", "password": "password123"}`
* **Action:** Copy the `accessToken`. This is **Ravi's token**.

**4.2 - Ravi Adds Item to Cart**
* **Method:** POST
* **URL:** `http://localhost:8080/api/cart/items`
* **Authorization:** Use **Ravi's token**.
* **Body:** In the Body tab, select raw and JSON, then type: `{"foodItemId": YOUR_FOOD_ITEM_ID, "quantity": 1}` (replace `YOUR_FOOD_ITEM_ID` with the ID you copied).

**4.3 - Ravi Places Order**
* **Method:** POST
* **URL:** `http://localhost:8080/api/orders`
* **Authorization:** Use **Ravi's token**.
* **Action:** From the response, copy the value of the `id`. This is the **order ID**.

---

### **Folder 5: Order Fulfillment Workflow**

**5.1 - Owner Views Restaurant Orders**
* **Method:** GET
* **URL:** `http://localhost:8080/api/manage/orders/restaurant`
* **Authorization:** Use **Priya's owner token**.

**5.2 - Owner Updates Order Status -> CONFIRMED**
* **Method:** PATCH
* **URL:** `http://localhost:8080/api/manage/orders/YOUR_ORDER_ID/status` (replace `YOUR_ORDER_ID`).
* **Authorization:** Use **Priya's owner token**.
* **Body:** In the Body tab, select raw and JSON, then type: `{"status": "CONFIRMED"}`

**5.3 - Admin Assigns Delivery Agent**
* **Method:** POST
* **URL:** `http://localhost:8080/api/admin/orders/YOUR_ORDER_ID/assign-delivery` (replace `YOUR_ORDER_ID`).
* **Authorization:** Use the **admin token**.
* **Body:** In the Body tab, select raw and JSON, then type: `{"deliveryPersonnelId": 4}` (Adjust ID if needed. Admin=1, Priya=2, Ravi=3, Sanjay=4).

**5.4 - Login as Delivery Agent (Sanjay)**
* **Method:** POST
* **URL:** `http://localhost:8080/api/auth/login`
* **Body:** In the Body tab, select raw and JSON, then type: `{"email": "sanjay.delivery@example.com", "password": "password123"}`
* **Action:** Copy the `accessToken`. This is the **delivery agent's token**.

**5.5 - Agent Views Assigned Orders**
* **Method:** GET
* **URL:** `http://localhost:8080/api/manage/orders/delivery`
* **Authorization:** Use the **delivery agent's token**.

**5.6 - Agent Updates Order Status -> DELIVERED**
* **Method:** PATCH
* **URL:** `http://localhost:8080/api/manage/orders/YOUR_ORDER_ID/status` (replace `YOUR_ORDER_ID`).
* **Authorization:** Use the **delivery agent's token**.
* **Body:** In the Body tab, select raw and JSON, then type: `{"status": "DELIVERED"}`
```
