<?php
/**
 * Created by PhpStorm.
 * User: martin
 * Date: 11.7.17
 * Time: 17:14
 */

$q = isset($_POST['xml']) ? $_POST['xml'] : null;
$s = isset($_POST['save']) ? $_POST['save'] : null;

$directory = 'xml/';
$name = '-produktu-z-data--' . date("H-i-s") . '--' . date("d-m-Y") . '.xml';

$doc = new DOMDocument('1.0', 'UTF-8');
$doc->loadXML($_POST['xml']);
$doc->saveXML();

switch ($s) {
	case 'autosave':
		$prefix = 'SHOPTET-autosave';
		$subdirectory = 'autosaves/';
		break;

	case 'export':
		$prefix = 'SHOPTET-export';
		$subdirectory = 'exports/';

		//Overwrite latest export to download
		$doc->save($prefix . '.xml');
		break;

	case 'imports':
		$prefix = 'SHOPTET-import';
		$subdirectory = 'imports/';
		break;
}

//Save everytime to related folder
$doc->save($directory . $subdirectory . $prefix . $name);

exit;


