# Deployment Guide - Item Vertical View App

This guide walks you through deploying the Item Vertical View app to production and configuring it as a monday.com Item View.

---

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ A monday.com developer account
- ✅ A monday.com app registered in the Apps Marketplace
- ✅ A hosting provider (Vercel, Netlify, AWS, etc.)
- ✅ The app built and tested locally

---

## 🏗️ Step 1: Build the App

### From the Monorepo Root

```bash
# Navigate to monorepo root
cd monday-apps

# Build shared components first
npm run build --workspace=@npm-workspace-demo/components

# Build the Item Vertical View app
npm run build --workspace=@npm-workspace-demo/item-vertical-view-ui
```

The build output will be in: `apps/item-vertical-view-ui/build/`

### Verify the Build

```bash
# Check the build directory
ls apps/item-vertical-view-ui/build/

# You should see:
# - index.html
# - static/ (folder with JS, CSS)
# - asset-manifest.json
# - manifest.json
# - robots.txt
```

---

## 🚀 Step 2: Deploy to Hosting

### Option A: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd apps/item-vertical-view-ui
vercel --prod
```

3. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Root Directory: `apps/item-vertical-view-ui`

4. **Note your deployment URL:** `https://your-app.vercel.app`

### Option B: Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Deploy:**
```bash
cd apps/item-vertical-view-ui/build
netlify deploy --prod --dir .
```

3. **Note your deployment URL:** `https://your-app.netlify.app`

### Option C: AWS S3 + CloudFront

1. **Create S3 Bucket:**
```bash
aws s3 mb s3://item-vertical-view-app
```

2. **Upload Build:**
```bash
cd apps/item-vertical-view-ui/build
aws s3 sync . s3://item-vertical-view-app --acl public-read
```

3. **Enable Static Website Hosting** in S3 console

4. **Set up CloudFront distribution** for HTTPS

5. **Note your CloudFront URL:** `https://xxxxx.cloudfront.net`

---

## 📱 Step 3: Register the App on monday.com

### Create a New App

1. Go to [monday.com Apps Marketplace](https://auth.monday.com/developers)
2. Click **"Create App"**
3. Fill in the details:
   - **App Name:** Item Vertical View
   - **Description:** View all item fields in a vertical list - no more horizontal scrolling
   - **Category:** Productivity & Workflow
   - **Icon:** Upload a relevant icon (512x512px recommended)

### Configure App Permissions

Under **"OAuth & Permissions"**, request:
- `boards:read` - Read board data
- `boards:write` - Update column values
- `me:read` - Check user permissions

### Add Feature: Item View

1. Go to **"Features"** tab
2. Click **"Add Feature"** → Select **"Item View"**
3. Configure:
   - **View Name:** Item Vertical View
   - **View URL:** `https://your-deployment-url.vercel.app`
   - **Iframe Height:** `600px` (or `100%` for full height)
   - **Supports mobile:** Yes

### Set Up OAuth Redirect

1. Under **"OAuth & Permissions"**
2. Add redirect URL: `https://your-deployment-url.vercel.app/oauth/callback`

### Generate Client ID & Secret

1. Copy your **Client ID**
2. Copy your **Client Secret** (keep this secure!)

---

## 🔐 Step 4: Configure Environment Variables

### For React App (Optional)

If you need environment-specific configuration, create `.env.production`:

```bash
REACT_APP_MONDAY_CLIENT_ID=your_client_id_here
REACT_APP_API_VERSION=2023-10
```

**Note:** The app currently doesn't require backend secrets since it's 100% client-side.

### For Hosting Provider

Set environment variables in your hosting dashboard:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- AWS: Use Parameter Store or Secrets Manager

---

## ✅ Step 5: Test the Deployment

### Test in monday.com

1. Go to your monday.com board
2. Open any item
3. Click **"Add View"**
4. Find your app in the list
5. Click to install it
6. The view should load in the item card

### Verify Functionality

Test all features:
- ✅ Item data loads correctly
- ✅ All fields are displayed
- ✅ Theme changes work (light/dark/black)
- ✅ Editing works (for users with permissions)
- ✅ Export to CSV works
- ✅ Export to PDF works
- ✅ Search functionality works
- ✅ Auto-refresh works
- ✅ Permissions are respected

### Check Browser Console

Open DevTools and check for:
- No JavaScript errors
- GraphQL queries succeed
- monday SDK initializes correctly

---

## 🔄 Step 6: Continuous Deployment (Optional)

### GitHub Actions (Vercel)

Create `.github/workflows/deploy-item-view.yml`:

```yaml
name: Deploy Item Vertical View

on:
  push:
    branches: [main, master]
    paths:
      - 'apps/item-vertical-view-ui/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd apps/item-vertical-view-ui
          npm install
      
      - name: Build app
        run: |
          cd apps/item-vertical-view-ui
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/item-vertical-view-ui
```

### Netlify Auto-Deploy

1. Connect your GitHub repo to Netlify
2. Configure build settings:
   - Base directory: `apps/item-vertical-view-ui`
   - Build command: `npm run build`
   - Publish directory: `build`
3. Netlify will auto-deploy on every push

---

## 📊 Step 7: Monitoring & Analytics

### Add Error Tracking (Recommended)

**Sentry Integration:**

```bash
npm install @sentry/react
```

Update `src/index.js`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: "production",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### Add Analytics (Optional)

**Google Analytics:**

Add to `public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

---

## 🚨 Troubleshooting Deployment

### App Not Loading in monday.com

**Check:**
- HTTPS is enabled (required by monday.com)
- CORS headers are set correctly
- Content-Security-Policy allows iframe embedding

**Fix for CORS (Vercel):**

Create `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOW-FROM https://monday.com"
        },
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors https://*.monday.com"
        }
      ]
    }
  ]
}
```

### Build Fails

**Common Issues:**
- Missing dependencies: Run `npm install`
- Build errors: Check `npm run build` output
- Memory issues: Increase Node.js memory with `NODE_OPTIONS=--max_old_space_size=4096 npm run build`

### API Calls Failing

**Check:**
- monday SDK is initialized correctly
- API version is set: `monday.setApiVersion("2023-10")`
- App has required permissions in monday.com
- User is authenticated

---

## 🔒 Security Best Practices

1. **Never commit secrets** to Git
2. **Use environment variables** for sensitive data
3. **Enable HTTPS only** (never HTTP)
4. **Validate all user inputs** before sending to API
5. **Implement rate limiting** if needed
6. **Regular dependency updates**: Run `npm audit fix`
7. **Monitor for vulnerabilities**: Use Snyk or Dependabot

---

## 📈 Performance Optimization

### For Large Boards (100+ columns)

1. **Enable virtual scrolling:**
   - Install: `npm install react-window`
   - Implement in `ItemDetailsPanel.js`

2. **Lazy load images/videos**

3. **Optimize bundle size:**
```bash
npm run build -- --stats
npx webpack-bundle-analyzer build/static/bundle-stats.json
```

4. **Enable code splitting:**
```javascript
const FieldEditor = React.lazy(() => import('./FieldEditor'));
```

---

## 🎉 Going Live

### Publish to monday.com Marketplace

1. Complete app in developer portal
2. Submit for review
3. Address any feedback
4. Once approved, app is live!

### Marketing Your App

- Create app listing with screenshots
- Write clear descriptions
- Provide video demo
- Respond to user reviews
- Update regularly

---

## 📞 Support

For deployment issues:
- Check [monday.com Developer Docs](https://developer.monday.com/)
- Review hosting provider documentation
- Open an issue on GitHub
- Contact your hosting support

---

**Congratulations! Your Item Vertical View app is now deployed! 🎊**
