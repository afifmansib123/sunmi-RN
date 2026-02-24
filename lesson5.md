### Lesson 5 - Constants and Types ###

it is always a good idea to keep constants like spacing , colors and 
other constants standard in one file. 
For Types as well we will keep all types in a file that keeps track of everything. 

check files :

--- src/constants/theme.ts ---
--- src/types/index.ts ---


Explanation :

theme.ts holds:
  - COLORS object (primary orange = #E8500A)
  - SIZES object (font sizes)
  - SPACING object (padding/margin values)
  - RADIUS object (border radius values)

Instead of hardcoding numbers everywhere, you reference
COLORS.primary or SPACING.lg. Easy to change later.

types/index.ts holds TypeScript interfaces:
  - Job interface (jobNo, status, warehouse, customer, products)
  - JobProduct interface (name, quantity, serialNumbers[])
  - SerialNumber interface (sn, verified, installed)
  - User interface (id, name, email, phone, role)