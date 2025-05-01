<?php

require '../vendor/PHP-Mailer/src/PHPMailer.php';
require '../vendor/PHP-Mailer/src/SMTP.php';
require '../vendor/PHP-Mailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Grab POST data safely
    $name     = $_POST['name'] ?? '';
    $email    = $_POST['email'] ?? '';
    $phone    = $_POST['phone'] ?? '';
    $message  = $_POST['message'] ?? '';
    $address  = $_POST['address'] ?? '';
    $services = $_POST['services'] ?? [];
    $pageUrl  = $_SERVER['HTTP_REFERER'] ?? 'Not provided';

    // Basic validation
    if (empty($name) || empty($email) || empty($phone) || empty($message) || empty($address) || empty($services)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields and select at least one service.']);
        exit;
    }

    $mail = new PHPMailer(true);

    try {
        // Mail server config
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'christmaslightcharlotte@gmail.com';
        $mail->Password   = 'ofvi yepm kazk bpzg';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Sender & recipient
        $mail->setFrom('christmaslightcharlotte@gmail.com', 'Christmas Light Installation Charlotte');
        $mail->addAddress('access@sustain-media.com');

        // Format services as a string
        $servicesList = implode(', ', $services);

        // Email body
        $mail->isHTML(true);
        $mail->Subject = 'NEW Installation Request - Website Form Submission';
        $mail->Body    = "
            <h2>Contact Form Submission</h2>
            <p><strong>Name:</strong> {$name}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Phone:</strong> {$phone}</p>
            <p><strong>Address:</strong> {$address}</p>
            <p><strong>Services:</strong> {$servicesList}</p>
            <p><strong>Message:</strong> {$message}</p>
            <p><strong>Submitted From:</strong> <a href='{$pageUrl}' target='_blank'>{$pageUrl}</a></p>
        ";

        $mail->send();

        echo json_encode(['status' => 'success', 'message' => 'Form submitted successfully.']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo
        ]);
    }
}
