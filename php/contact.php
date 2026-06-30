<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'db.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// ===== SANITIZE INPUT =====
function clean($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

$name    = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$phone   = clean($_POST['phone']   ?? '');
$subject = clean($_POST['subject'] ?? '');
$message = clean($_POST['message'] ?? '');

// ===== VALIDATION =====
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Please fill all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (strlen($message) < 10) {
    echo json_encode(['success' => false, 'message' => 'Message is too short.']);
    exit;
}

// ===== SAVE TO DATABASE =====
$db = getDB();

$stmt = $db->prepare(
    "INSERT INTO contacts (name, email, phone, subject, message, created_at)
     VALUES (?, ?, ?, ?, ?, NOW())"
);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error. Please try again.']);
    exit;
}

$stmt->bind_param('sssss', $name, $email, $phone, $subject, $message);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you, ' . $name . '! Your message has been sent. I will get back to you soon.'
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save message. Please try again.']);
}

$stmt->close();
$db->close();
?>
