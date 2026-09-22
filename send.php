<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Metode ikke tillatt.']);
    exit;
}

function clean_header_value(string $value): string {
    return trim(str_replace(["\r", "\n"], '', $value));
}

$name     = clean_header_value($_POST['name'] ?? '');
$email    = clean_header_value($_POST['email'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$address  = trim($_POST['address'] ?? '');
$module   = trim($_POST['module'] ?? '');
$message  = trim($_POST['message'] ?? '');
$honeypot = trim($_POST['company'] ?? '');

// Bots fyller ofte ut skjulte felt — later som suksess uten å sende noe.
if ($honeypot !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Navn og gyldig e-post er påkrevd.']);
    exit;
}

$to = 'steinar@idle.no';
$subject = '=?UTF-8?B?' . base64_encode("Tilbudsforespørsel fra {$name}") . '?=';

$body = "Navn: {$name}\n"
      . "E-post: {$email}\n"
      . 'Telefon: ' . ($phone !== '' ? $phone : '—') . "\n"
      . 'Garasjeadresse: ' . ($address !== '' ? $address : '—') . "\n"
      . 'Ønsket modul: ' . ($module !== '' ? $module : '—') . "\n\n"
      . "Melding:\n" . ($message !== '' ? $message : '—') . "\n";

$headers = [
    'From: idle.no kontaktskjema <noreply@idle.no>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Kunne ikke sende meldingen. Prøv igjen senere.']);
}
