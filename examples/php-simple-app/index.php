<?php
require_once __DIR__ . '/src/config.php';
require_once __DIR__ . '/src/db.php';

$db = new Database();
$conn = $db->getConnection();

// Example query
try {
    $stmt = $conn->prepare("SELECT * FROM users ORDER BY created_at DESC LIMIT 10");
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $users = [];
    $error = $e->getMessage();
}

?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP Simple App - VPS Deployment</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .info-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .info-card strong {
            display: block;
            color: #667eea;
            margin-bottom: 8px;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-card span {
            color: #333;
            font-size: 1.1em;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 600;
        }
        .status.connected {
            background: #d4edda;
            color: #155724;
        }
        .status.error {
            background: #f8d7da;
            color: #721c24;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
        }
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }
        th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85em;
            letter-spacing: 0.5px;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        .empty-state svg {
            width: 64px;
            height: 64px;
            margin-bottom: 20px;
            opacity: 0.5;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 PHP Application trên VPS</h1>
        <p class="subtitle">Deployment example với Docker, Nginx và MySQL</p>
        
        <div class="info-grid">
            <div class="info-card">
                <strong>PHP Version</strong>
                <span><?php echo phpversion(); ?></span>
            </div>
            <div class="info-card">
                <strong>Server</strong>
                <span><?php echo $_SERVER['SERVER_SOFTWARE'] ?? 'Nginx + PHP-FPM'; ?></span>
            </div>
            <div class="info-card">
                <strong>Database</strong>
                <?php if (isset($conn) && $conn): ?>
                    <span class="status connected">✅ Connected</span>
                <?php else: ?>
                    <span class="status error">❌ Not Connected</span>
                <?php endif; ?>
            </div>
            <div class="info-card">
                <strong>Document Root</strong>
                <span><?php echo $_SERVER['DOCUMENT_ROOT'] ?? '/var/www/html'; ?></span>
            </div>
        </div>

        <h2 style="margin-top: 30px; margin-bottom: 20px; color: #333;">📊 Users từ Database</h2>
        
        <?php if (isset($error)): ?>
            <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <strong>Database Error:</strong> <?php echo htmlspecialchars($error); ?>
                <p style="margin-top: 10px; font-size: 0.9em;">Hãy chắc chắn database đã được setup và tables đã được tạo.</p>
            </div>
        <?php endif; ?>
        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($users)): ?>
                    <tr>
                        <td colspan="4" class="empty-state">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                            </svg>
                            <p>No users found. Run database migrations first.</p>
                            <p style="margin-top: 10px; font-size: 0.9em;">Check the setup instructions in README.md</p>
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($users as $user): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($user['id']); ?></td>
                            <td><strong><?php echo htmlspecialchars($user['name']); ?></strong></td>
                            <td><?php echo htmlspecialchars($user['email']); ?></td>
                            <td><?php echo htmlspecialchars($user['created_at']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>

        <div class="footer">
            <p>PHP Simple App Example - VPS Deployment Guide</p>
            <p style="margin-top: 5px;">Built with PHP <?php echo phpversion(); ?>, Docker, Nginx & MySQL</p>
        </div>
    </div>
</body>
</html>

