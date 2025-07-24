# Inkwell - Modern Blog Platform

A full-featured blog platform built with Next.js, featuring a rich text editor, user authentication, analytics dashboard, and newsletter subscription system.

## 🚀 Features

### Core Features
- **Rich Text Editor**: Advanced blog post creation with TipTap editor
- **User Authentication**: Multi-provider authentication (Google, GitHub, Credentials)
- **Blog Management**: Full CRUD operations for blog posts
- **Newsletter System**: Email subscription and management
- **Analytics Dashboard**: Comprehensive analytics with charts and metrics
- **View Tracking**: Real-time blog post view tracking
- **Image Management**: Cloudinary integration for image uploads
- **Responsive Design**: Mobile-first responsive UI with Tailwind CSS

### Admin Features
- **Admin Dashboard**: Analytics overview with interactive charts
- **Blog Management**: Create, edit, delete blog posts
- **Subscriber Management**: View and manage newsletter subscribers
- **Analytics**: View metrics, subscriber growth, and blog performance
- **Rich Content Editor**: Full-featured editor with formatting options

### User Features
- **Blog Reading**: Browse and read blog posts
- **Category Filtering**: Filter blogs by categories
- **Search Functionality**: Search blogs by title and content
- **Newsletter Subscription**: Subscribe to newsletter updates
- **Social Authentication**: Sign in with Google or GitHub
- **Password Reset**: Forgot password functionality

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **React 19.0.0** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **TipTap Editor** - Rich text editor with extensions
- **Recharts** - Data visualization and charts
- **React Toastify** - Toast notifications
- **NextAuth.js 5.0** - Authentication library
- **Axios** - HTTP client

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **Resend** - Email service
- **Cloudinary** - Image hosting and management

### Authentication Providers
- **Google OAuth**
- **GitHub OAuth**
- **Credentials (Email/Password)**

### Development Tools
- **Turbopack** - Fast bundler for development
- **PostCSS** - CSS processing
- **ESLint** - Code linting

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd inkwell
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # OAuth Providers
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # Email Service
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=your_sender_email
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### User Model
- Personal information (firstName, lastName, email)
- Authentication data (password, authProvider, authProviderId)
- Role-based access (user/admin)
- Password reset functionality

### Blog Model
- Content (title, description, category, author)
- Media (image, authorImg)
- Analytics (views, viewsHistory)
- Timestamps

### Subscriber Model
- Email subscription management
- Status tracking (active/unsubscribed)
- Email history

### ViewTracker Model
- Blog view tracking by IP and user
- Temporary storage with TTL (3 hours)
- Prevents duplicate view counting

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Blog Management
- `GET /api/blog` - Fetch all blogs
- `POST /api/blog` - Create new blog (Admin)
- `PUT /api/blog` - Update blog (Admin)
- `DELETE /api/blog` - Delete blog (Admin)

### Analytics
- `GET /api/analytics` - Get dashboard analytics

### Subscribers
- `POST /api/subscribers` - Subscribe to newsletter
- `GET /api/subscribers` - Get subscribers list (Admin)

## 🔐 Authentication Flow

1. **Multi-Provider Support**: Users can sign in with Google, GitHub, or email/password
2. **JWT Sessions**: Secure session management with NextAuth.js
3. **Role-Based Access**: Admin and user roles with different permissions
4. **Password Security**: bcrypt hashing for credential-based authentication
5. **Remember Me**: Extended session duration option

## 📊 Analytics Features

- **Real-time Metrics**: Track blog views, subscribers, and growth
- **Interactive Charts**: Visual representation of data trends
- **Time Range Filters**: View data for different periods (week, month, quarter, year)
- **Growth Tracking**: Monitor percentage changes and trends
- **View Tracking**: Unique view counting with IP-based deduplication

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Mobile-first design approach
- **Dark/Light Theme Ready**: Theme-compatible design system
- **Interactive Elements**: Hover effects, animations, and transitions
- **Toast Notifications**: User feedback for all actions
- **Search & Filter**: Easy content discovery

## 📧 Email Integration

- **Newsletter System**: Automated email subscriptions
- **Resend Integration**: Reliable email delivery
- **Development Mode**: Safe testing with designated test email
- **Subscription Management**: Active/inactive status tracking
- 
```

## 🔧 Configuration

### Next.js Configuration
- Image optimization for multiple domains (GitHub, Google, Cloudinary)
- API route handling
- Middleware for authentication

### Database Configuration
- Connection pooling and optimization
- Graceful connection handling
- Error recovery and retry logic

## 📝 Usage

### For Administrators
1. **Access Admin Dashboard**: Navigate to `/admin`
2. **Create Blog Posts**: Use the rich text editor at `/admin/addProduct`
3. **Manage Content**: Edit or delete existing posts
4. **View Analytics**: Monitor site performance and engagement
5. **Manage Subscribers**: View newsletter subscriber list

### For Users
1. **Browse Blogs**: Explore posts on the homepage
2. **Filter by Category**: Use category filters to find specific content
3. **Search Content**: Use the search functionality
4. **Subscribe**: Join the newsletter for updates
5. **Create Account**: Sign up for personalized experience

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js and modern web technologies**
