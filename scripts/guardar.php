<?php 

  if (isset($_POST['ventas'])) {
      $ventas = file_get_contents('php://input');
      $file = fopen("ventas.json", 'w+b');
      fwrite($file, $ventas);
      fclose($file);
  }

?>