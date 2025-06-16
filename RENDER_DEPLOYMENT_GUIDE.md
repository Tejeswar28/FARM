# Deploying Shuddhi Farms Website to Render

This guide will walk you through deploying your Django website to Render.com, which provides a free tier suitable for hobby projects.

## Prerequisites

- A GitHub account
- Your project code ready for deployment (with the changes we've made)

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub
2. Initialize Git in your local project folder (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

## Step 2: Sign Up for Render

1. Go to [Render.com](https://render.com/) and sign up for an account
2. You can sign up using your GitHub account for easier integration

## Step 3: Create a New Web Service on Render

1. Once logged in, click on the "New +" button and select "Web Service"
2. Connect your GitHub repository
3. Fill in the following configuration:
   - **Name**: shuddhi-farms (or your preferred name)
   - **Environment**: Python
   - **Region**: Choose the closest to your target audience
   - **Branch**: main (or your default branch)
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn quadraise.wsgi:application`

## Step 4: Configure Environment Variables

In the Render dashboard, navigate to your web service and go to the "Environment" tab. Add the following environment variables:

- `SECRET_KEY`: Generate a secure random key
- `DEBUG`: False
- `ALLOWED_HOSTS`: render.com,yourapp.onrender.com (replace with your actual Render domain)
- `DATABASE_URL`: This will be automatically provided by Render if you add a PostgreSQL database

## Step 5: Add a PostgreSQL Database (Optional but Recommended)

1. In the Render dashboard, click "New +" and select "PostgreSQL"
2. Choose the free plan and give it a name (e.g., "shuddhi-farms-db")
3. Once created, Render will automatically link it to your web service

## Step 6: Deploy

1. Click the "Create Web Service" button
2. Render will automatically start building and deploying your application
3. This process may take a few minutes

## Step 7: Access Your Live Website

Once deployment is complete, you can access your website at the URL provided by Render (typically https://your-app-name.onrender.com).

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in the Render dashboard
2. Ensure all environment variables are correctly set
3. Verify that your database is properly connected
4. Make sure your static files are being served correctly

## Maintaining Your Deployment

To update your website, simply push changes to your GitHub repository. Render will automatically redeploy your application.

For more information, visit the [Render Documentation](https://render.com/docs).
