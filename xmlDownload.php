<?php

// we want a nice output

$file = 'SHOPTET-export.xml';

header('Content-Description: File Transfer');
header('Content-Type: text/xml');
header('Content-Disposition: attachment; filename="'.basename($file).'"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($file));

readfile($file);

exit;