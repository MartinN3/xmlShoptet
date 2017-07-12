<?php

$q=$_GET["q"];

echo simplexml_load_file($q)->asXML();
?>