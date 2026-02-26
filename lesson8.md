### Lesson 8 - Frontend Reusable Components ###

I will now be creating some frontend components that will be used throughout 
the application. this is very similiar to nextjs components with a keyword here 
and there as different. look at code commits and see how frontend development in 
react native looks like. 

  src/components/common/Button.tsx
  src/components/common/Input.tsx
  src/components/common/Card.tsx
  src/components/common/StatusBadge.tsx
  src/components/common/SectionHeader.tsx

--- Button.tsx ---
Props: title, onPress, variant (primary/outline/ghost), size, loading, disabled
Variants change background and text color.
Loading shows ActivityIndicator instead of text.

--- Input.tsx ---
Props: leftIcon, rightIcon, isPassword, error
isPassword adds show/hide toggle eye button.

--- StatusBadge.tsx ---
Takes a JobStatus string.
Maps each status to a background color and text color.
Example: 'กำลังเดินทาง' → blue badge

--- SectionHeader.tsx ---
Orange icon + title + optional right text.
Used at the top of each info section in job cards.