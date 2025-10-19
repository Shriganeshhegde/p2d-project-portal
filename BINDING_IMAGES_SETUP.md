# 📸 Binding Color Images Setup

## 🎯 Image Placement Instructions

### Step 1: Create Directory
Create this folder structure:
```
frontend/
  └─ public/
      └─ images/
          └─ binding-colors/
```

### Step 2: Save Images
Save the 4 uploaded images with these exact names:

1. **royal-blue.jpg** - PS 588 BUCKRAM Royal Blue image
2. **green.jpg** - LEVANT 900 Dark Green image
3. **maroon.jpg** - PS 192 BUCKRAM Maroon image
4. **black.jpg** - LEVANT 898 Black image

### Step 3: File Paths
Final structure should be:
```
frontend/public/images/binding-colors/
  ├─ royal-blue.jpg
  ├─ green.jpg
  ├─ maroon.jpg
  └─ black.jpg
```

---

## ✅ What's Already Done

### Code Updated:
- ✅ ProjectCustomization.jsx - Image paths configured
- ✅ ProjectCustomization.css - Image card styles added
- ✅ Color options updated to 4 colors:
  - Royal Blue (PS 588 BUCKRAM)
  - Dark Green (LEVANT 900)
  - Maroon (PS 192 BUCKRAM)
  - Black (LEVANT 898)

### Features:
- ✅ Large image cards (280px height)
- ✅ Hover effects (zoom on hover)
- ✅ Selected badge overlay
- ✅ Color name and description
- ✅ Responsive grid layout

---

## 🎨 How It Will Look

```
┌─────────────────────────────────────────────────────────┐
│                  Choose Binding Color                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │  [Image] │  │  [Image] │  │  [Image] │  │  [Image] ││
│  │          │  │          │  │          │  │          ││
│  │  Royal   │  │   Dark   │  │  Maroon  │  │  Black   ││
│  │  Blue    │  │  Green   │  │          │  │          ││
│  │ PS 588   │  │LEVANT900 │  │  PS 192  │  │LEVANT898 ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

When selected:
- Border turns purple
- "✓ Selected" badge appears on image
- Card lifts up with shadow

---

## 📝 Manual Steps Required

### Using File Explorer:

1. **Open File Explorer**
2. **Navigate to:**
   ```
   C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\frontend\public
   ```

3. **Create folders:**
   - Right-click → New → Folder → "images"
   - Inside images → New → Folder → "binding-colors"

4. **Copy the 4 images** you uploaded to:
   ```
   C:\Users\RAMACHANDRA S HEGDE\CascadeProjects\windsurf-project\student-project-portal\frontend\public\images\binding-colors\
   ```

5. **Rename them exactly as:**
   - Image 1 (Royal Blue) → `royal-blue.jpg`
   - Image 2 (Dark Green) → `green.jpg`
   - Image 3 (Maroon) → `maroon.jpg`
   - Image 4 (Black) → `black.jpg`

---

## 🧪 Testing

After placing images:

1. **Refresh browser** (Ctrl + F5)
2. **Go to Customization page**
3. **Scroll to "Binding Color" section**
4. **You should see:**
   - 4 large image cards
   - Actual binding photos
   - Hover effects
   - Click to select

---

## 🎯 Image Mapping

| Image File | Color Name | Description |
|------------|------------|-------------|
| royal-blue.jpg | Royal Blue | PS 588 BUCKRAM Royal Blue |
| green.jpg | Dark Green | LEVANT 900 Dark Green |
| maroon.jpg | Maroon | PS 192 BUCKRAM Maroon |
| black.jpg | Black | LEVANT 898 Black |

---

## 💡 Notes

- Images will be displayed at 280px height
- Width auto-adjusts to maintain aspect ratio
- Images zoom slightly on hover
- Selected image gets purple border + badge
- Responsive: 2 columns on tablet, 1 on mobile

---

**Code is ready! Just place the images and refresh!** 🎉
