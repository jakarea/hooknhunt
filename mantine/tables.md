Here is the list of tables and their corresponding fields :

### 1. affiliates

* id, user_id, referral_code, commission_rate, total_earned, withdrawn_amount, is_approved, created_at, updated_at

### 2. affiliate_earnings

* id, affiliate_id, sales_order_id, order_amount, commission_amount, status, created_at, updated_at

### 3. attendances

* id, user_id, date, clock_in, clock_out, status, note, updated_by, created_at, updated_at

### 4. banners

* id, title, image_url, redirect_url, position, sort_order, is_active, created_at, updated_at

### 5. brands

* id, name, slug, logo_id, website, created_at, updated_at

### 6. cache

* key, value, expiration

### 7. cache_locks

* key, owner, expiration

### 8. categories

* id, name, slug, parent_id, image_id, is_active, sort_order, created_at, updated_at

### 9. chart_of_accounts

* id, name, code, type, is_active, description, created_at, updated_at

### 10. couriers

* id, name, type, api_key, secret_key, tracking_url_template, is_active, created_at, updated_at

### 11. courier_zone_rates

* id, courier_id, zone_name, base_charge, base_weight_kg, extra_charge_per_kg, created_at, updated_at

### 12. crm_activities

* id, user_id, lead_id, customer_id, type, summary, description, schedule_at, is_done, created_at, updated_at

### 13. crm_campaigns

* id, title, type, start_date, end_date, crm_segment_id, status, created_at, updated_at

### 14. crm_campaign_products

* id, crm_campaign_id, product_id, offer_price, regular_price_at_time, created_at, updated_at

### 15. crm_segments

* id, name, description, is_auto, created_at, updated_at

### 16. customers

* id, user_id, name, phone, shipping_address, type, wallet_balance, created_at, updated_at

### 17. customer_crm_segment

* id, customer_id, crm_segment_id, created_at, updated_at

### 18. departments

* id, name, is_active, created_at, updated_at

### 19. discounts

* id, code, type, amount, starts_at, expires_at, max_uses, used_count, is_active, created_at, updated_at

### 20. dropshipper_configs

* id, user_id, store_name, store_url, logo_url, default_profit_margin, api_key, auto_sync_products, created_at, updated_at

### 21. expenses

* id, title, amount, expense_date, account_id, paid_by, attachment, is_approved, created_at, updated_at

### 22. faqs

* id, question, answer, sort_order, is_active, created_at, updated_at

### 23. inventory_adjustments

* id, warehouse_id, adjusted_by, reference_no, date, reason, created_at, updated_at

### 24. inventory_adjustment_items

* id, adjustment_id, inventory_batch_id, qty, type, created_at, updated_at

### 25. inventory_batches

* id, product_id, product_variant_id, warehouse_id, batch_no, cost_price, initial_qty, remaining_qty, manufacturing_date, expiry_date, created_at, updated_at

### 26. journal_entries

* id, entry_number, date, description, reference_type, reference_id, created_by, created_at, updated_at

### 27. journal_items

* id, journal_entry_id, account_id, debit, credit, created_at, updated_at

### 28. landing_pages

* id, title, slug, content_sections, meta_title, meta_description, is_active, created_at, updated_at

### 29. leads

* id, first_name, last_name, phone, email, source, ad_campaign_name, status, assigned_to, converted_customer_id, notes, created_at, updated_at

### 30. leaves

* id, user_id, type, start_date, end_date, days_count, reason, status, approved_by, created_at, updated_at

### 31. loyalty_rules

* id, name, channel, min_order_amount, reward_points, spend_amount, is_active, created_at, updated_at

### 32. loyalty_transactions

* id, customer_id, sales_order_id, type, points, equivalent_amount, description, created_at, updated_at

### 33. marketplaces

* id, name, slug, api_key, api_secret, access_token, refresh_token, token_expires_at, webhook_url, is_active, sync_stock, sync_price, created_at, updated_at

### 34. media_files

* id, folder_id, filename, original_filename, path, url, mime_type, width, height, size, disk, uploaded_by_user_id, created_at, updated_at, alt_text, variants

### 35. media_folders

* id, name, slug, parent_id, created_at, updated_at

### 36. menus

* id, name, slug, items, created_at, updated_at

### 37. migrations

* id, migration, batch

### 38. notifications

* id, type, notifiable_type, notifiable_id, data, read_at, created_at, updated_at

### 39. otps

* id, user_id, identifier, token, expires_at, created_at, updated_at

### 40. payments

* id, sales_order_id, customer_id, method, transaction_id, amount, status, bank_name, cheque_no, cheque_date, clearing_date, cheque_status, approved_by, note, created_at, updated_at

### 41. payrolls

* id, user_id, month_year, basic_salary, bonus, deductions, net_payable, status, payment_date, created_at, updated_at

### 42. permissions

* id, name, slug, group_name, created_at, updated_at

### 43. permission_user

* user_id, permission_id, is_blocked, created_at, updated_at

### 44. personal_access_tokens

* id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at

### 45. products

* id, name, slug, category_id, brand_id, thumbnail_id, gallery_images, description, short_description, video_url, seo_title, seo_description, seo_tags, status, created_at, updated_at, deleted_at

### 46. product_channel_settings

* id, product_variant_id, channel, custom_name, channel_slug, price, is_active, created_at, updated_at

### 47. product_search_term

* id, product_id, search_term_id

### 48. product_supplier

* id, product_id, supplier_id, product_links, supplier_sku, cost_price, created_at, updated_at

### 49. product_variants

* id, product_id, sku, custom_sku, variant_name, size, color, unit_id, unit_value, default_purchase_cost, default_retail_price, default_wholesale_price, stock_alert_level, wholesale_moq, is_active, created_at, updated_at, deleted_at

### 50. return_requests

* id, tracking_no, customer_id, sales_order_id, reason, details, images, status, refund_method, admin_note, created_at, updated_at

### 51. return_request_items

* id, return_request_id, product_variant_id, qty, condition, created_at, updated_at

### 52. roles

* id, name, slug, description, created_at, updated_at

### 53. role_permission

* id, role_id, permission_id

### 54. sales_item_allocations

* id, sales_order_item_id, inventory_batch_id, qty_deducted, cost_per_unit, created_at, updated_at

### 55. sales_orders

* id, invoice_no, external_order_id, external_source, external_data, customer_id, sold_by, channel, status, courier_tracking_id, shipped_at, payment_status, sub_total, discount_amount, coupon_code, delivery_charge, total_amount, due_amount, paid_amount, total_profit, note, created_at, updated_at, deleted_at

### 56. sales_order_items

* id, sales_order_id, product_variant_id, quantity, unit_price, total_price, total_cost, created_at, updated_at

### 57. search_terms

* id, term, hits, created_at, updated_at

### 58. sessions

* id, user_id, ip_address, user_agent, payload, last_activity

### 59. settings

* id, group, key, value, created_at, updated_at

### 60. shipments

* id, supplier_id, po_number, lot_number, status, exchange_rate, total_china_cost_rmb, total_weight_actual, total_weight_chargeable, shipping_cost_intl, shipping_cost_local, misc_cost, note, created_at, updated_at, deleted_at, int_courier_name, int_tracking_no, bd_courier_name, bd_tracking_no, lost_item_total_value, arrived_bd_at, arrived_bogura_at, total_extra_cost, total_extra_weight

### 61. shipment_costs

* id, shipment_id, cost_head, amount, paid_by_user_id, created_at, updated_at

### 62. shipment_histories

* id, shipment_id, user_id, field_name, old_value, new_value, reason, created_at, updated_at

### 63. shipment_items

* id, shipment_id, product_variant_id, product_id, ordered_qty, received_qty, unit_weight, lost_qty, is_sorted, is_lost, unit_price_rmb, shipping_cost_actual, extra_weight_charge, calculated_landed_cost, created_at, updated_at

### 64. shipment_timelines

* id, shipment_id, status_label, description, updated_by, happened_at, created_at, updated_at

### 65. stock_ledgers

* id, product_variant_id, warehouse_id, inventory_batch_id, type, qty_change, reference_type, reference_id, date, created_at, updated_at

### 66. suppliers

* id, name, shop_name, contact_person, phone, wechat_id, alipay_id, address, is_active, created_at, updated_at

### 67. supplier_ledgers

* id, supplier_id, type, amount, balance, transaction_id, reason, created_at, updated_at

### 68. support_tickets

* id, ticket_number, customer_id, subject, priority, status, created_at, updated_at

### 69. ticket_messages

* id, ticket_id, user_id, message, attachment, created_at, updated_at

### 70. units

* id, name, symbol, allow_decimal, created_at, updated_at

### 71. users

* id, role_id, name, phone, email, password, is_active, phone_verified_at, last_login_at, remember_token, created_at, updated_at, deleted_at

### 72. user_profiles

* id, user_id, department_id, designation, joining_date, base_salary, address, city, dob, gender, profile_photo_id, created_at, updated_at

### 73. warehouses

* id, name, location, type, is_active, created_at, updated_at

### 74. webhook_logs

* id, source, event, payload, status_code, response_body, created_at, updated_at