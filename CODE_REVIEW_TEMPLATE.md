# Code Review Template

## Proposed Changes

### File: `src/components/TodoList.jsx`

**Status:** ✅ Already Implemented
- Filter state: Line 15
- Filter buttons: Lines 105-127
- Filter logic: Lines 130-194

Everything looks good! No changes needed.

---

## Future Changes Format

When I propose changes, they'll look like this:

### Example: Adding a Feature

**File:** `src/components/TodoList.jsx`

**Change Type:** Add new function

**Location:** After line 88

**Proposed Code:**
```javascript
// New function to toggle todo completion
const handleToggleComplete = async (id) => {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  const updated = { ...todo, completed: !todo.completed };
  try {
    const res = await updateTodo(id, updated);
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? res.data : t))
    );
  } catch (err) {
    console.error("Error updating todo:", err);
  }
};
```

**Reason:** Allows users to toggle todos complete/incomplete by clicking

**Impact:** Low - only adds new functionality

---

## Approval Process

1. **Review** the proposed changes above
2. **Approve** by saying "approve" or "yes"
3. **Reject** by saying "no" or suggest modifications
4. **Ask questions** if something is unclear

---

## Current Status

Your filter feature is **already working**! ✅

No changes needed at this time.

