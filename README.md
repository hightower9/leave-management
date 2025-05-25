
# LeaveTrack - Employee Leave Management System

LeaveTrack is a modern web application built with Next.js that helps organizations manage employee leaves, track projects, and handle team scheduling efficiently.

## Features

### Leave Management
- Apply for leaves with customizable date ranges
- Track remaining leave balance
- View leave history and status
- Manage leave approvals (for administrators)

### Project Management
- View team projects and assignments
- Track project timelines
- Manage project resources
- Calendar view for project schedules

### User Management
- User roles (Admin/Member)
- Google authentication support
- Profile management
- Password change functionality

### Dashboard
- Overview of leaves and projects
- Visual analytics and charts
- Team calendar
- Quick access to important features

## Getting Started

### Prerequisites
- Node.js 18 or later
- NPM (Node Package Manager)

### Running the Application

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open the application in your browser at `http://0.0.0.0:3000`

## Usage Guide

### For Employees
1. **Login**: Use your credentials or Google account to sign in
2. **Apply for Leave**: 
   - Navigate to the Leaves page
   - Click "Apply for Leave"
   - Fill in the required details
   - Submit your request

3. **View Projects**:
   - Check the Projects page for assignments
   - Use the calendar view for scheduling
   - Track project progress

4. **Profile Management**:
   - Update personal information
   - Change password (for non-Google accounts)
   - View leave balance

### For Administrators
1. **User Management**:
   - Add/remove users
   - Assign roles
   - Manage permissions

2. **Leave Approval**:
   - Review leave requests
   - Approve/reject applications
   - Set leave policies

3. **Project Management**:
   - Create new projects
   - Assign team members
   - Track project status

## Tech Stack

- **Framework**: Next.js 13
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **Authentication**: Built-in auth system with Google support
- **Charts**: Recharts
- **Calendar**: React Day Picker

## Development Notes

- The application uses React Server Components for improved performance
- Client-side state management is handled through React Context
- Form handling is implemented using React Hook Form
- Responsive design works across desktop and mobile devices

## Support

For support inquiries, please contact support@leavetrack.example.com

## License

This project is internal use only. All rights reserved.
