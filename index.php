<?php

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SHOPTET XML Editor</title>

    <!--	Includes    -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

    <!--	Xonomy-->
    <link rel="stylesheet" href="includes/xonomy/xonomy.css">
    <script src="includes/xonomy/xonomy.js"></script>
    <!--	/Xonomy-->

    <!--    Bootstrap-->
    <link rel="stylesheet" href="includes/bootstrap/css/bootstrap.css">
    <script src="includes/bootstrap/js/bootstrap.min.js"></script>
    <!--    /Bootstrap-->
</head>
<body>

<div class="col-lg-6">

</div>

<div class="well well-lg">

    <label class="btn btn-primary">
        Vybrat XML z disku... <input type="file" id="file-input" style="display: none"/>
    </label>

    <button type="button" class="btn btn-success" onclick="save('export')">
        Stáhnout
    </button>
</div>

<div id="editor"></div>

<script src="script.js"></script>
</body>
</html>