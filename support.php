<?php
// Database Configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "steamsupport";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

// API Endpoints
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sname = isset($_POST['SName']) ? $conn->real_escape_string($_POST['SName']) : '';
    $sgender = isset($_POST['SGender']) ? $conn->real_escape_string($_POST['SGender']) : '';
    $semail = isset($_POST['SEmail']) ? $conn->real_escape_string($_POST['SEmail']) : '';
    $sfeedback = isset($_POST['SFeedback']) ? $conn->real_escape_string($_POST['SFeedback']) : '';
    $sdate = isset($_POST['SDate']) ? $conn->real_escape_string($_POST['SDate']) : date('Y-m-d');

    if (empty($sname) || empty($sgender) || empty($semail) || empty($sfeedback)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }

    $sql = "INSERT INTO steamsupport (SName, SGender, SEmail, SFeedback, SDate) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $sname, $sgender, $semail, $sfeedback, $sdate);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Feedback submitted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error submitting feedback: ' . $conn->error]);
    }

    $stmt->close();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT SName, SGender, SEmail, SFeedback, SDate FROM steamsupport ORDER BY SDate DESC";
    $result = $conn->query($sql);

    $feedbacks = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $feedbacks[] = [
                'name' => $row['SName'],
                'gender' => $row['SGender'],
                'email' => $row['SEmail'],
                'feedback' => $row['SFeedback'],
                'date' => $row['SDate']
            ];
        }
    }

    echo json_encode(['success' => true, 'data' => $feedbacks]);
}

$conn->close();
?>
