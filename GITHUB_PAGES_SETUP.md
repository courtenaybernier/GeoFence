# GitHub Pages Setup Instructions

## Configure GitHub Pages to use GitHub Actions

1. Go to your repository: https://github.com/courtenaybernier/GeoFence

2. Click **Settings** (top menu)

3. Click **Pages** (left sidebar)

4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions" (instead of "Deploy from a branch")

5. Click **Save**

That's it! GitHub Actions will now automatically build and deploy your app whenever you push to the main branch.

## What This Workflow Does

- ✅ Triggers on every push to `main` branch
- ✅ Installs Node.js 20 and npm dependencies
- ✅ Runs `npm run build` to create the production build
- ✅ Adds `.nojekyll` file automatically
- ✅ Deploys to GitHub Pages
- ✅ Shows build status in the Actions tab

## Viewing Build Status

After pushing changes:
1. Go to https://github.com/courtenaybernier/GeoFence/actions
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Click on it to see detailed logs
4. When complete (green checkmark), your site is live at https://courtenaybernier.github.io/GeoFence/

## Troubleshooting

If the workflow fails:
- Check the Actions tab for error messages
- Ensure `package.json` has the correct `build` script
- Verify `vite.config.js` has `base: '/GeoFence/'`
