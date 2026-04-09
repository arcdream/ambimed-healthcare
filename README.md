# 🧹 Clean Install & Fresh Build (React + Vite) — Windows PowerShell

Follow these steps to remove old dependencies, clear cache, and generate a fresh `dist/` build.

---

## 🔥 Step 1: Delete existing artifacts

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
```

## 🔥 Step 2: Clear npm cache
```powershell
npm cache clean --force
```

## 🔥 Step 3: Install dependencies
```powershell
npm install
```

## 🔥 Step 4: Build project
```powershell
npm run build
```

## 🚀 One-liner (All steps combined)
```powershell
Remove-Item -Recurse -Force node_modules; 
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue; 
Remove-Item package-lock.json -ErrorAction SilentlyContinue; 
npm cache clean --force; 
npm install; 
npm run build
```

# Important Profile
Doctor - 9972940155, 9900000999, 9900000997

Organization - Manipal Hospitals
Facility - Manipal Bengaluru 
User - 919972911111

Organization - Sarojini Hospitals Group
Facility - Sarojini Noida hospital 
User - 9900000998