# Wiki Migration Guide

This document provides instructions for manually migrating the wiki content from the `/wiki` directory to GitHub's native wiki feature.

## Migration Process

### Step 1: Access GitHub Wiki
1. Navigate to [https://github.com/nashthecoder/fitmatch-fixed/wiki](https://github.com/nashthecoder/fitmatch-fixed/wiki)
2. Click "Create the first page" if the wiki doesn't exist yet

### Step 2: Create Wiki Pages

The following pages need to be created in GitHub's wiki with the corresponding content:

#### Required Wiki Pages:

1. **Home** (Default landing page)
   - Source: `/wiki/Home.md`
   - URL: `https://github.com/nashthecoder/fitmatch-fixed/wiki`

2. **Project-Overview**
   - Source: `/wiki/Project-Overview.md`
   - URL: `https://github.com/nashthecoder/fitmatch-fixed/wiki/Project-Overview`

3. **Current-Status**
   - Source: `/wiki/Current-Status.md`
   - URL: `https://github.com/nashthecoder/fitmatch-fixed/wiki/Current-Status`

4. **Changelog**
   - Source: `/wiki/Changelog.md`
   - URL: `https://github.com/nashthecoder/fitmatch-fixed/wiki/Changelog`

5. **Development-Guide**
   - Source: `/wiki/Development-Guide.md`
   - URL: `https://github.com/nashthecoder/fitmatch-fixed/wiki/Development-Guide`

6. **Improvements-Summary**
   - Source: `/wiki/Improvements-Summary.md`
   - URL: `https://github.com/nashthecoder/fitmatch-fixed/wiki/Improvements-Summary`

7. **Pending-Fixes**
   - Source: `/wiki/Pending-Fixes.md`
   - URL: `https://github.com/nashthecoder/fitmatch-fixed/wiki/Pending-Fixes`

8. **Prior-State**
   - Source: `/wiki/Prior-State.md`
   - URL: `https://github.com/nashthecoder/fitmatch-fixed/wiki/Prior-State`

9. **Technical-Architecture**
   - Source: `/wiki/Technical-Architecture.md`
   - URL: `https://github.com/nashthecoder/fitmatch-fixed/wiki/Technical-Architecture`

### Step 3: Copy Content

For each page:
1. Open the source markdown file from the `/wiki` directory
2. Copy the entire content
3. Create a new page in GitHub wiki with the exact name (without `.md` extension)
4. Paste the content
5. Save the page

### Step 4: Update Internal Links

After creating all pages, review each page and update any internal links:
- Change `[Page Name](Page-Name.md)` to `[Page Name](Page-Name)`
- Update relative links to use full GitHub wiki URLs where needed

### Step 5: Verify Navigation

1. Test all links in the README.md file
2. Ensure the Home page provides proper navigation to all other pages
3. Verify that the Quick Wiki Navigation section in README.md works correctly

### Step 6: Clean Up

Once all content is successfully migrated and verified:
1. The `/wiki` directory can be safely removed from the repository
2. This migration guide can be deleted if no longer needed

## Notes

- GitHub wiki uses the same markdown syntax, so content should transfer directly
- Page names in GitHub wiki are case-sensitive and spaces become hyphens
- The Home page is special and serves as the wiki landing page
- GitHub wiki has its own git repository, separate from the main codebase

## Verification Checklist

After migration, verify:
- [ ] All 9 wiki pages are created in GitHub wiki
- [ ] Home page displays correctly and provides navigation
- [ ] All links in README.md point to correct GitHub wiki URLs
- [ ] Internal wiki links work properly
- [ ] Content formatting is preserved
- [ ] No content is lost during migration