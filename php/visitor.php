<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

// ===== GET REAL IP =====
function getRealIP() {
    $headers = [
        'HTTP_CF_CONNECTING_IP',   // Cloudflare
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_REAL_IP',
        'HTTP_CLIENT_IP',
        'REMOTE_ADDR'
    ];
    foreach ($headers as $h) {
        if (!empty($_SERVER[$h])) {
            $ip = trim(explode(',', $_SERVER[$h])[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return $ip;
            }
        }
    }
    // fallback (localhost/dev)
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

// ===== GET LOCATION FROM IP (ipapi.co — free, no key needed) =====
function getLocationByIP($ip) {
    $default = [
        'country'   => null,
        'city'      => null,
        'region'    => null,
        'latitude'  => null,
        'longitude' => null,
        'timezone'  => null,
        'isp'       => null,
    ];

    // Skip for localhost
    if (in_array($ip, ['127.0.0.1', '::1', '0.0.0.0'])) {
        $default['country'] = 'Localhost';
        $default['city']    = 'Development';
        return $default;
    }

    $url = "https://ipapi.co/{$ip}/json/";

    $ctx = stream_context_create([
        'http' => [
            'timeout'       => 5,
            'method'        => 'GET',
            'header'        => "User-Agent: Mozilla/5.0\r\n",
            'ignore_errors' => true,
        ]
    ]);

    $response = @file_get_contents($url, false, $ctx);
    if (!$response) return $default;

    $data = json_decode($response, true);
    if (!$data || isset($data['error'])) return $default;

    return [
        'country'   => $data['country_name']  ?? null,
        'city'      => $data['city']           ?? null,
        'region'    => $data['region']         ?? null,
        'latitude'  => $data['latitude']       ?? null,
        'longitude' => $data['longitude']      ?? null,
        'timezone'  => $data['timezone']       ?? null,
        'isp'       => $data['org']            ?? null,
    ];
}

// ===== SANITIZE =====
function clean($v) {
    return htmlspecialchars(strip_tags(trim((string)($v ?? ''))));
}

// ===== COLLECT DATA =====
$ip          = getRealIP();
$location    = getLocationByIP($ip);

$device_type = clean($_POST['device_type'] ?? '');
$device_name = clean($_POST['device_name'] ?? '');
$os_name     = clean($_POST['os_name']     ?? '');
$browser     = clean($_POST['browser']     ?? '');
$screen_size = clean($_POST['screen_size'] ?? '');
$page_url    = clean($_POST['page_url']    ?? '');
$referrer    = clean($_POST['referrer']    ?? '');
$language    = clean($_POST['language']    ?? '');

// ===== SAVE TO DATABASE =====
$db = getDB();

$stmt = $db->prepare("
    INSERT INTO visitors
        (device_type, device_name, os_name, browser, screen_size,
         ip_address, country, city, region, latitude, longitude, timezone, isp,
         page_url, referrer, language, visited_at)
    VALUES
        (?, ?, ?, ?, ?,
         ?, ?, ?, ?, ?, ?, ?, ?,
         ?, ?, ?, NOW())
");

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'DB prepare failed.']);
    exit;
}

$stmt->bind_param(
    'ssssssssssssssss',
    $device_type,
    $device_name,
    $os_name,
    $browser,
    $screen_size,
    $ip,
    $location['country'],
    $location['city'],
    $location['region'],
    $location['latitude'],
    $location['longitude'],
    $location['timezone'],
    $location['isp'],
    $page_url,
    $referrer,
    $language
);

if ($stmt->execute()) {
    echo json_encode([
        'success'  => true,
        'location' => [
            'country' => $location['country'],
            'city'    => $location['city'],
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Insert failed.']);
}

$stmt->close();
$db->close();
?>
