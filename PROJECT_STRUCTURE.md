# Shuddhi Farms Website - Project Structure

This document outlines the essential components of the Shuddhi Farms website project and explains which files are necessary for the website to function correctly.

## Essential Components

### Django Applications
- **quadraise/**: Main project configuration with settings, URLs, and base views
- **gallery/**: Handles the gallery and farm location features
- **orders/**: Manages the sheep ordering system
- **users/**: Handles user authentication and accounts

### Core Files
- **manage.py**: Django command-line utility for administrative tasks
- **db.sqlite3**: Database file containing all website data
- **requirements.txt**: Lists all Python package dependencies

### Static Files
- **static/styles.css**: Main stylesheet
- **static/scripts.js**: Main JavaScript functions
- **static/responsive.css**: Responsive design styles
- **static/responsive-enhancements.js**: Additional responsive behavior
- **static/youtube-integration.js**: YouTube video integration

### Templates
- **templates/base.html**: Base template with common elements
- **templates/home.html**: Homepage template
- **templates/add_media.html**: Template for adding media to the gallery
- **templates/farm_location.html**: Farm location map page
- **templates/gallery_home.html**: Gallery main page
- **templates/login.html**: Login page
- **templates/order_form.html**: Sheep ordering form
- **templates/signup.html**: User registration page
- **templates/view_image.html**: Gallery image/video detail view

### Media and User Content
- **media/**: Directory containing all uploaded images and videos

## Removed Components

The following components were moved to a backup folder as they are not essential for the website's functionality:

1. **Email Testing Scripts**: Various scripts for testing email functionality
2. **VS Code Configuration**: Editor-specific configuration files
3. **Server Start Scripts**: Duplicate scripts for starting the Django server
4. **Diagnostic Tools**: Troubleshooting and diagnostic scripts
5. **Backup Files**: Old versions and backups of various files

## Maintenance Notes

- If you need to restore any removed files, check the `backup_files` directory
- Keep the `.env` file secure as it contains sensitive configuration information
- The project uses Django 4.x with Python 3.x
- Ensure media files have appropriate permissions to be served by the web server

## Key Dependencies

- Django: Web framework
- Pillow: Image processing library
- SendGrid: Email service integration
- python-dotenv: Environment variable management

Last updated: June 16, 2025
