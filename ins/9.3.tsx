Please read the attached AI_CONTEXT.md file (v1.3). We will update the supplierStore.ts to handle adding and updating suppliers.

Task: Update the src/stores/supplierStore.ts file.

Requirements:

Define a new exported type SupplierFormData based on the suppliers table (e.g., name, shop_name, email, shop_url, contact_info, etc.).

Add a new action: addSupplier(data: SupplierFormData) => Promise<void>.

This function must call the API: POST /api/v1/admin/suppliers (from AI_CONTEXT.md, Section 9.2).

On success, it must add the new supplier to the suppliers array in the state (no full re-fetch).

It must re-throw any API errors.

Add a new action: updateSupplier(id: number, data: SupplierFormData) => Promise<void>.

This function must call the API: PUT /api/v1/admin/suppliers/{id}.

On success, it must update the corresponding supplier in the suppliers array in the state (no full re-fetch).

It must re-throw any API errors.

Provide only the complete, updated code for the src/stores/supplierStore.ts file.