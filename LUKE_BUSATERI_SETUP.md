# Luke Busateri Test User Setup

## 📋 User Details

**Name:** Luke Busateri  
**Email:** lukebusateri22@gmail.com  
**Password:** Daddyb50[$$]  

**School:** Timberland High School  
**Location:** St. Stephen, SC  
**Graduation Year:** 2027  
**Height:** 6'3"  
**Weight:** 200 lbs  

**Events:**
- Triple Jump: 14.98m (49'1.75")
- Long Jump: 6.75m (22'1.75")

## 🚀 Setup Instructions

### **Step 1: Create Auth User in Supabase**

1. Go to Supabase Dashboard
2. Click **Authentication** → **Users**
3. Click **Add User** (or **Invite**)
4. Fill in:
   - **Email:** lukebusateri22@gmail.com
   - **Password:** Daddyb50[$$]
   - **Auto Confirm User:** ✅ (check this box)
5. Click **Create User**
6. **Copy the User ID** (you'll need it for Step 2)

### **Step 2: Create Profile and Data**

1. Open `/supabase/create-luke-busateri.sql`
2. Find line with: `luke_user_id UUID := 'YOUR_USER_ID_HERE';`
3. Replace `'YOUR_USER_ID_HERE'` with the actual User ID you copied
4. Run the SQL script in Supabase SQL Editor
5. You should see: "Luke Busateri profile created successfully!"

### **Step 3: Login and Test**

1. Go to http://localhost:3000/login
2. Login with:
   - **Email:** lukebusateri22@gmail.com
   - **Password:** Daddyb50[$$]
3. You should be redirected to `/athletes` dashboard
4. You'll see Luke's profile with his PRs

## 🎯 What to Test

### **1. View Profile**
- Dashboard should show Luke's info
- 2 PRs (Triple Jump, Long Jump)
- 4 meet results

### **2. Add New PR**
- Go to `/athletes/add-pr`
- Try adding a new jump PR
- See if any schools unlock!

### **3. Top 10 Favorites**
- Go to `/athletes/favorites`
- Search for schools
- Add to Top 10 list
- Reorder them

### **4. School Unlocks**
- Add a PR that meets school standards
- Watch the celebration modal
- See which schools unlock

## 📊 Current PRs

| Event | Performance | Meters | Meet | Date |
|-------|-------------|--------|------|------|
| Triple Jump | 49'1.75" | 14.98m | State Championships | 5/15/2024 |
| Long Jump | 22'1.75" | 6.75m | State Championships | 5/15/2024 |

## 🏫 Schools to Try Unlocking

Luke's jumps are very good! Try adding these to see unlocks:
- Triple Jump standards vary by school
- Long Jump standards vary by school
- Add recruiting standards for jumps to test unlocks

## ⚠️ Important Notes

- Make sure to **Auto Confirm User** when creating in Supabase
- The user_id MUST match between auth.users and the SQL script
- If login doesn't work, check that email confirmation is disabled
- Password is case-sensitive: `Daddyb50[$$]`

---

**Ready to test!** Create the auth user, run the SQL script, and login.
