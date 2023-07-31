<?php
	$url =  "{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
	
	// functions
	function getRequestHeaders() {
    $headers = array();
    foreach($_SERVER as $key => $value) {
        if (substr($key, 0, 5) <> 'HTTP_') {
            continue;
        }
        $header = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
        $headers[$header] = $value;
    }
    return $headers;
	}
	function decrypt($str) {
		global $ciphering_value, $encryption_key, $VI;
		return openssl_decrypt($str, $ciphering_value, $encryption_key, 0, $VI);
	}

	$headers = getRequestHeaders();
	$bodyJSON = file_get_contents('php://input');
	$body = json_decode($bodyJSON, true);

	if (isset($headers['Password'])) {
		$password = $headers['Password'];
		// $hashed_password =  password_hash($password, PASSWORD_DEFAULT);
		$hashed_password = file_get_contents("./encryptedPass.md");
	} else {return;}
	if(!password_verify($password, $hashed_password)) {return;}

	if (isset($body['action'])) $action = $body['action']; else return;
	$ciphering_value = "AES-128-CTR";  
	$encryption_key = $password;
	$VI = 3921831234545455;
	switch ($action) {
		case "append":
			$original_string = $params['input']; 
			$encryption_value = openssl_encrypt($original_string, $ciphering_value, $encryption_key, 0, $VI); 
			file_put_contents('data.data', $encryption_value.PHP_EOL, FILE_APPEND);
			echo $encryption_value;	
		case "read":
			$data_content = file_get_contents("./data.data");
			$encrypted_data = explode(PHP_EOL,$data_content);
			$decrypted_data = array_map('decrypt', $encrypted_data);
			echo json_encode($decrypted_data);			
		default:
			return;
	}
?>