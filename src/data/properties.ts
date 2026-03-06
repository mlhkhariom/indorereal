// This file is kept for backward compatibility but data now comes from the database.
// Use useProperties() hook from @/hooks/useProperties instead.

import { Property } from "@/types/property";
export { formatPrice } from "@/types/property";

// Empty array - properties are now fetched from the database
export const properties: Property[] = [];
