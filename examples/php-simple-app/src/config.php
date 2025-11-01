<?php
/**
 * Configuration file for PHP Simple App
 */

// Load environment variables from .env file if it exists
if (file_exists(__DIR__ . '/../.env')) {
    $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

// Database configuration
define('DB_HOST', $_ENV['DB_HOST'] ?? 'mysql');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'myapp_db');
define('DB_USER', $_ENV['DB_USER'] ?? 'myuser');
define('DB_PASSWORD', $_ENV['DB_PASSWORD'] ?? 'mypassword');
define('DB_CHARSET', 'utf8mb4');

// Application configuration
define('APP_ENV', $_ENV['APP_ENV'] ?? 'production');
define('DEBUG', $_ENV['DEBUG'] ?? 'false') === 'true';

// Error reporting
if (DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../logs/php-errors.log');
}

