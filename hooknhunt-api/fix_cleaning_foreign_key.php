<?php

/**
 * Fix script to drop existing foreign key and recreate it
 * Run: php fix_cleaning_foreign_key.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $db = DB::connection();

    echo "=== FIXING cleaning_tasks FOREIGN KEY ===\n\n";

    // Check if table exists
    $tableExists = $db->select("SHOW TABLES LIKE 'cleaning_tasks'");
    if (empty($tableExists)) {
        echo "❌ Table 'cleaning_tasks' does NOT exist. Nothing to fix.\n";
        exit(1);
    }

    // Check for existing foreign key
    $existingFK = $db->select("
        SELECT CONSTRAINT_NAME
        FROM information_schema.TABLE_CONSTRAINTS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'cleaning_tasks'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        AND CONSTRAINT_NAME = 'cleaning_tasks_cleaning_plan_id_foreign'
    ");

    if (!empty($existingFK)) {
        echo "⚠️  Found existing foreign key: cleaning_tasks_cleaning_plan_id_foreign\n";
        echo "🔧 Dropping existing constraint...\n";

        $db->statement("ALTER TABLE cleaning_tasks DROP FOREIGN KEY cleaning_tasks_cleaning_plan_id_foreign");
        echo "✅ Dropped successfully.\n\n";
    } else {
        echo "ℹ️  No existing foreign key found with that name.\n\n";
    }

    // Check if column exists
    $columnExists = $db->select("SHOW COLUMNS FROM cleaning_tasks LIKE 'cleaning_plan_id'");
    if (empty($columnExists)) {
        echo "❌ Column 'cleaning_plan_id' does NOT exist in cleaning_tasks table.\n";
        echo "⚠️  Cannot add foreign key - column missing.\n";
        echo "💡 You may need to add the column first.\n";
        exit(1);
    }

    // Check if referenced table exists
    $refTableExists = $db->select("SHOW TABLES LIKE 'cleaning_plans'");
    if (empty($refTableExists)) {
        echo "❌ Referenced table 'cleaning_plans' does NOT exist.\n";
        echo "⚠️  Cannot add foreign key - referenced table missing.\n";
        exit(1);
    }

    // Add the foreign key
    echo "🔧 Adding foreign key constraint...\n";
    $db->statement("
        ALTER TABLE cleaning_tasks
        ADD CONSTRAINT cleaning_tasks_cleaning_plan_id_foreign
        FOREIGN KEY (cleaning_plan_id)
        REFERENCES cleaning_plans(id)
        ON DELETE CASCADE
    ");

    echo "✅ Foreign key added successfully!\n\n";

    // Verify
    echo "=== VERIFICATION ===\n";
    $verifyFK = $db->select("
        SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'cleaning_tasks'
        AND CONSTRAINT_NAME = 'cleaning_tasks_cleaning_plan_id_foreign'
    ");

    if (!empty($verifyFK)) {
        echo "✅ Foreign key verified: {$verifyFK[0]->CONSTRAINT_NAME} -> {$verifyFK[0]->REFERENCED_TABLE_NAME}\n";
    } else {
        echo "⚠️  Verification failed - foreign key not found after creation.\n";
    }

    echo "\n=== FIX COMPLETE ===\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
