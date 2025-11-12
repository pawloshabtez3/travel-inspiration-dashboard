# Deployment Guide

This guide provides detailed instructions for deploying the Travel Inspiration Dashboard to Vercel.

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed to a Git repository
- [ ] `.env.local` is in `.gitignore` (never commit API keys)
- [ ] You have valid API keys for all three services
- [ ] Local production build succeeds (`npm run build`)
- [ ] All features work in production mode (`npm start`)

## Vercel Deployment Steps

### 1. Prepare Your Repository

Push your code to GitHub, GitLab, or Bitbucket:

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Import to Vercel

1. Visit [vercel.com/new](https://vercel.com/new)
2. Sign in with your Git provider
3. Click "Import Project"
4. Select your repository
5. Vercel will auto-detect Next.js configuration

### 3. Configure Build Settings

Vercel should auto-detect these settings (verify they match):

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### 4. Add Environment Variables

In the Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_actual_key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_key
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_key
```

**Important:**
- Use production API keys for the Production environment
- You can use the same keys for Preview and Development, or separate keys
- Click "Add" after entering each variable

### 5. Deploy

1. Click **Deploy**
2. Vercel will:
   - Install dependencies
   - Run the build command
   - Deploy to a production URL
   - Provide a deployment URL (e.g., `travel-dashboard.vercel.app`)

### 6. Verify Deployment

After deployment completes:

1. Visit your production URL
2. Test the following:
   - Landing page loads with animations
   - Navigate to /explore page
   - Select a mood category
   - Verify destinations load with images
   - Check weather data displays
   - Add destinations to favorites
   - Refresh page and verify favorites persist
   - Test on mobile device

## Deployment Configuration Files

### vercel.json

The `vercel.json` file configures:

- Build and install commands
- Output directory
- Security headers
- Region selection (defaults to US East)
- Rewrites for client-side routing

### next.config.mjs

The Next.js config includes:

- Image optimization for Unsplash
- Compression settings
- Cache headers
- Security headers
- Bundle optimization

## Continuous Deployment

Vercel automatically deploys:

- **Production**: Commits to `main` branch
- **Preview**: Pull requests and other branches

To trigger a new deployment:

```bash
git push origin main
```

## Environment-Specific Configurations

### Production Environment

- Use production API keys with higher rate limits
- Enable all optimizations
- Monitor API usage
- Set up error tracking (optional)

### Preview Environment

- Use development API keys
- Test new features before merging
- Share preview URLs with team

### Development Environment

- Use development API keys
- Enable source maps for debugging
- Hot reload enabled

## Monitoring and Maintenance

### Check Deployment Status

1. Visit Vercel Dashboard
2. Select your project
3. View deployment logs and analytics

### Monitor API Usage

Regularly check API usage:

- **Unsplash**: [unsplash.com/developers](https://unsplash.com/developers)
- **OpenWeatherMap**: [openweathermap.org/api](https://openweathermap.org/api)
- **Google Gemini**: [makersuite.google.com](https://makersuite.google.com)

### Performance Monitoring

Vercel provides built-in analytics:

- Real User Monitoring (RUM)
- Web Vitals tracking
- Bandwidth usage
- Function execution time

## Troubleshooting

### Build Failures

**Error: Missing dependencies**
```bash
# Solution: Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: TypeScript errors**
```bash
# Solution: Fix TypeScript errors locally first
npm run build
# Fix any errors, then commit and push
```

### Runtime Errors

**Error: API keys not found**
- Verify environment variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

**Error: Images not loading**
- Verify `images.unsplash.com` is in `next.config.mjs`
- Check Unsplash API key is valid
- Review browser console for CORS errors

**Error: Weather data not displaying**
- Verify OpenWeatherMap API key
- Check API rate limits
- Review network tab for failed requests

### Performance Issues

**Slow page loads**
- Check bundle size: `npm run build` shows bundle analysis
- Verify image optimization is working
- Check API response times

**High API usage**
- Implement request caching
- Add debouncing to API calls
- Monitor API rate limits

## Rollback Procedure

If a deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"
4. Fix issues locally and redeploy

## Custom Domain Setup (Optional)

To use a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Wait for DNS propagation (up to 48 hours)

## Security Best Practices

- Never commit API keys to Git
- Rotate API keys periodically
- Use environment-specific keys
- Monitor API usage for anomalies
- Keep dependencies updated
- Review Vercel security logs

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

## Post-Deployment Checklist

After successful deployment:

- [ ] Production URL is accessible
- [ ] All features work correctly
- [ ] Mobile responsive design verified
- [ ] API keys are working
- [ ] Favorites persist across sessions
- [ ] Performance metrics are acceptable
- [ ] Error tracking is set up (optional)
- [ ] Custom domain configured (if applicable)
- [ ] Team members have access to Vercel project
- [ ] Documentation is updated with production URL
