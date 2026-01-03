<?php

/**
 * Diagnostic script to check cleaning_tasks table constraints
 * Run: php check_cleaning_tables.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $db = DB::connection();

    echo "=== CHECKING cleaning_tasks TABLE ===\n\n";

    // Check if table exists
    $tableExists = $db->select("SHOW TABLES LIKE 'cleaning_tasks'");
    if (empty($tableExists)) {
        echo "❌ Table 'cleaning_tasks' does NOT exist.\n";
        exit(1);
    }
    echo "✅ Table 'cleaning_tasks' exists.\n\n";

    // Check existing foreign keys
    echo "=== EXISTING FOREIGN KEY CONSTRAINTS ===\n";
    $foreignKeys = $db->select("
        SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'cleaning_tasks'
        AND CONSTRAINT_NAME LIKE '%cleaning_plan%'
    ");

    if (empty($foreignKeys)) {
        echo "No foreign key constraints found referencing cleaning_plan.\n";
    } else {
        foreach ($foreignKeys as $fk) {
            echo "Found: {$fk->CONSTRAINT_NAME} -> {$fk->REFERENCED_TABLE_NAME}({$fk->REFERENCED_COLUMN_NAME})\n";
        }
    }

    // Check existing indexes
    echo "\n=== EXISTING INDEXES ===\n";
    $indexes = $db->select("SHOW INDEX FROM cleaning_tasks WHERE Key_name LIKE '%cleaning_plan%'");
    if (empty($indexes)) {
        echo "No indexes found containing 'cleaning_plan'.\n";
    } else {
        foreach ($indexes as $index) {
            echo "Found index: {$index->Key_name} on column {$index->Column_name}\n";
        }
    }

    // Check table structure
    echo "\n=== TABLE STRUCTURE ===\n";
    $columns = $db->select("SHOW COLUMNS FROM cleaning_tasks WHERE Field LIKE '%cleaning_plan%'");
    if (empty($columns)) {
        echo "No columns found containing 'cleaning_plan'.\n";
    } else {
        foreach ($columns as $column) {
            echo "Found column: {$column->Field} ({$column->Type})\n";
        }
    }

    echo "\n=== END OF DIAGNOSTIC ===\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
