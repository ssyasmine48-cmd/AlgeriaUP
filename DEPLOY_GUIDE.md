# How to Deploy Your Next.js Project to Vercel

## The Problem
Your project files (app, components, etc.) are on your computer but not on GitHub, so Vercel can't access them.

## The Solution
Deploy directly from your computer using Vercel CLI.

---

## Steps to Deploy:

### Step 1: Fix PowerShell (One-time setup)
1. **Right-click** on PowerShell
2. Select **"Run as Administrator"**
3. Run this command:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. Press **Y** to confirm
5. Close PowerShell

### Step 2: Install Vercel CLI
Open a **new** PowerShell window (normal, not admin) and run:
```bash
npm install -g vercel
```

### Step 3: Deploy Your Project
1. Navigate to your project:
   ```bash
   cd C:\Users\p\Desktop\LOL
   ```

2. Run the deploy command:
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Login to Vercel (it will open your browser)
   - "Set up and deploy?"  → Press **Y**
   - "Which scope?"  → Choose your account
   - "Link to existing project?"  → Press **N** (create new)
   - "Project name?"  → Press Enter (use default)
   - "In which directory?"  → Press Enter (use ./)
   - "Detected Next.js. Override?"  → Press **N**
   - "Deploy?"  → Press **Y**

4. **Wait for deployment** ⏳

5. You'll get a URL like:  
   `https://your-project.vercel.app` ✅

---

## That's It!
Your website will be live at the URL Vercel gives you.

### For Future Deployments:
Just run:
```bash
vercel --prod
```

---

## Alternative: Use GitHub Desktop (Easier for Future)
If you want to avoid CLI:
1. Push code to GitHub using GitHub Desktop
2. Connect Vercel to GitHub
3. Auto-deploys on every push
