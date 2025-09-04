This is a [Next.js](https://nextjs.org) project built for Vercel serverless APIs. It provides a comprehensive set of RESTful endpoints for a gym management system, including authentication, user management, business operations, subscriptions, classes, QR code validation, admin functions, access control, and revenue analytics.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/route.ts`. The page auto-updates as you edit the file.

## Vercel Environment Setup

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```
   Follow the prompts to authenticate (e.g., via GitHub).

3. **Deploy the Project**:
   ```bash
   vercel --yes
   ```
   This deploys to a preview environment. For production, use `vercel --prod`.

4. **Link to Existing Project** (if redeploying):
   ```bash
   vercel link
   ```

For more details, see [Vercel CLI Documentation](https://vercel.com/docs/cli).

## Managing APIs

This project uses Next.js API Routes in the `src/app/` directory. Each route is a `route.ts` file in a folder representing the path.

### Current APIs
- `GET /` - Returns `{"message": "Hello world!"}`
- `GET /[slug]` - Returns `{"message": "Hello [slug]!"}` (e.g., `/api/test`)

### Adding a New API
1. Create a new folder in `src/app/` (e.g., `src/app/newapi/`).
2. Add a `route.ts` file with your handler:
   ```typescript
   import { NextResponse } from "next/server";

   export async function GET() {
     return NextResponse.json({ message: "New API response" });
   }
   ```
3. For dynamic routes, use `[param]` in folder name.
4. Support other HTTP methods: `POST`, `PUT`, `DELETE`, etc.

### Modifying an API
Edit the corresponding `route.ts` file. Changes auto-reload in dev mode.

### Deleting an API
Remove the folder and `route.ts` file.

For advanced features, see [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers).

## Using the Deployed API

The API is hosted on Vercel at `https://new-jnssk5hb0-avishek-barmans-projects.vercel.app`.

All responses follow the format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-08-30T10:00:00Z"
}
```

### Authentication Endpoints

#### POST /auth/register
Register a new user.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe",
    "role": "member"
  }
  ```
- **Response**: User object with ID.

#### POST /auth/login
User login.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: JWT token.

### User Management Endpoints

#### GET /users/profile
Get current user profile.
- **Response**: User profile data.

#### PUT /users/profile
Update user profile.
- **Request Body**:
  ```json
  {
    "name": "Updated Name"
  }
  ```
- **Response**: Updated profile.

### Business Management Endpoints

#### GET /businesses
Get all businesses.
- **Response**: Array of businesses.

#### GET /businesses/{id}
Get business details.
- **Response**: Business object.

### Subscription Management Endpoints

#### GET /subscriptions
Get user's subscriptions.
- **Response**: Array of subscriptions.

#### POST /subscriptions
Create new subscription.
- **Request Body**:
  ```json
  {
    "business_id": 1,
    "start_date": "2025-08-30",
    "end_date": "2025-09-30"
  }
  ```
- **Response**: Created subscription.

### Class Management Endpoints

#### GET /classes
Get all classes (filtered by user access).
- **Response**: Array of classes with participant count and access status.

#### GET /classes/{id}
Get class details.
- **Response**: Class object.

#### POST /classes/{id}/join
Join a class (member only).
- **Response**: Success message.

#### DELETE /classes/{id}/leave
Leave a class (member only).
- **Response**: Success message.

#### GET /classes/{id}/participants
Get class participants (role-based visibility).
- **Response**: Participants data.

#### POST /classes
Create new class (trainer only).
- **Request Body**:
  ```json
  {
    "business_id": 2,
    "name": "Boxing Class",
    "description": "Advanced boxing techniques",
    "scheduled_time": "2025-08-30T18:00:00Z",
    "duration": 60,
    "max_participants": 10,
    "min_participants": 3
  }
  ```
- **Response**: Created class.

#### PUT /classes/{id}
Update class (trainer only).
- **Request Body**: Updated class data.
- **Response**: Updated class.

#### DELETE /classes/{id}
Cancel class (trainer only).
- **Response**: Success message.

### QR Code Management Endpoints

#### GET /qr/generate
Generate QR codes for user's businesses.
- **Response**: Array of QR codes.

#### POST /qr/validate
Validate QR code access.
- **Request Body**:
  ```json
  {
    "qr_code": "ABC123XYZ",
    "business_id": 1
  }
  ```
- **Response**: Validation result.

### Owner Endpoints

#### GET /admin/users
Get all users (owner only).
- **Response**: Array of users.

#### POST /admin/users
Create user (owner only).
- **Request Body**: User data.
- **Response**: Created user.

#### PUT /admin/users/{id}
Update user (owner only).
- **Request Body**: Updated user data.
- **Response**: Updated user.

#### DELETE /admin/users/{id}
Delete user (owner only).
- **Response**: Success message.

#### GET /admin/analytics
Get system analytics (owner only).
- **Response**: Analytics data.

### Access Control Endpoints

#### POST /api/access/check-in
Member check-in with QR code validation.
- **Request Body**:
  ```json
  {
    "business_id": 1,
    "qr_code": "ABC123XYZ",
    "location": "main_entrance"
  }
  ```
- **Response**: Success message.

#### POST /api/access/validate
Validate access rights.
- **Request Body**:
  ```json
  {
    "user_id": 123,
    "business_id": 1,
    "access_type": "facility_entry"
  }
  ```
- **Response**: Access validation.

### Revenue Management Endpoints (Owner Only)

#### GET /api/revenue/summary
Get revenue summary.
- **Query Params**: start_date, end_date, business_id.
- **Response**: Revenue summary.

#### GET /api/revenue/business/{business_id}
Get detailed revenue for a business.
- **Response**: Business revenue.

#### GET /api/revenue/memberships
Get membership revenue breakdown.
- **Response**: Membership revenue data.

#### GET /api/revenue/profit-margins
Get profit margin analysis.
- **Response**: Profit margins.

#### POST /api/revenue/export
Export revenue data.
- **Request Body**:
  ```json
  {
    "report_type": "monthly_summary",
    "format": "csv",
    "business_ids": [1, 2],
    "date_range": {
      "start": "2025-08-01",
      "end": "2025-08-31"
    }
  }
  ```
- **Response**: Export ID.

#### GET /api/revenue/payment-trends
Get payment trends.
- **Response**: Payment trends.

### Additional Endpoints

#### DELETE /api/classes/{id}/book
Cancel class booking.
- **Response**: Success message.

#### GET /api/classes/{id}/participants
Get class participants (trainer/owner only).
- **Response**: Participants data.

### Examples
- **Register User**:
  ```bash
  curl -X POST https://new-jnssk5hb0-avishek-barmans-projects.vercel.app/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email": "user@example.com", "password": "securepassword", "name": "John Doe", "role": "member"}'
  ```

- **Get Classes**:
  ```bash
  curl https://new-jnssk5hb0-avishek-barmans-projects.vercel.app/classes
  ```

- **Join Class**:
  ```bash
  curl -X POST https://new-jnssk5hb0-avishek-barmans-projects.vercel.app/classes/1/join
  ```

## Testing

Run the test suite:

```bash
npm test
```

Tests are located in `src/__tests__/` and use Jest with TypeScript support.

### How Tests Work

The tests are integration tests that make real HTTP requests to the API endpoints:

1. **Environment Setup**: Tests use the `API_BASE_URL` environment variable to determine the target API URL
   - Local development: `http://localhost:3000` (requires dev server running)
   - Production: Your Vercel deployment URL

2. **Test Execution**:
   - Each test sends HTTP requests (GET/POST/PUT/DELETE) to specific endpoints
   - Validates response status codes and JSON structure
   - Checks for expected fields like `success`, `data`, `message`, `timestamp`
   - Uses Jest's async/await for handling promises

3. **Example Test Flow**:
   ```javascript
   // Test registers a user
   const response = await fetch(`${baseUrl}/auth/register`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(userData)
   });
   
   // Assert response
   expect(response.ok).toBe(true);
   const data = await response.json();
   expect(data.success).toBe(true);
   ```

4. **Mock Data**: Since this is a demo API, endpoints return mock responses with realistic data structures

### Environment Variables for Tests

Create a `.env.local` file in the root directory:

```env
API_BASE_URL=http://localhost:3000
```

For testing against production:
```env
API_BASE_URL=https://new-delta-sable.vercel.app
```

The tests will use the `API_BASE_URL` to make HTTP requests to the API endpoints.

## CI/CD

The project uses GitHub Actions for automated deployment to Vercel.

### Setup Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions and add:

- `VERCEL_TOKEN`: Your Vercel authentication token (get from Vercel dashboard > Account Settings > Tokens)

### Deployment

On every push to the `main` branch, the workflow will:
1. Install dependencies
2. Run tests
3. Build the project
4. Deploy to Vercel production

You can also deploy manually using the Vercel CLI as described in the Vercel Environment Setup section.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).
