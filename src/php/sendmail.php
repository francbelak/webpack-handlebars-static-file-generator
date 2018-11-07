<?php
$recipient  = 'f.belak@digitalists.at, c.weinhapl@digitalists.at';
$subject = 'Webseitenanfrage';
$message = '
<html>
<head>
  <title>Webseitenanfrage</title>
</head>
<body>
  <p>' . $_POST['message'] . '</p>
</body>
</html>
';

$header[] = 'MIME-Version: 1.0';
$header[] = 'Content-type: text/html; charset=iso-8859-1';
$header[] = 'From: ' . $_POST['name'] . ' <' . $_POST['mail'] . '>';

mail($recipient, $subject, $message, implode("\r\n", $header));
?>
