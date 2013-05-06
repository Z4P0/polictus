<?php
		// feed_proxy.php
		// check to see if there is a required 'filename' parameter in the query string
		// example: image_proxy.php?filename=http://www.blahblah.com/file.jpg
		if(array_key_exists('filename',$_REQUEST)){
        	$fileName =$_REQUEST['filename'];
        } else {
        	echo "<b>Need a <i>filename</i> to fetch the XML!</b>";
        	exit();
        }
        
        // check for the optional 'format' parameter
        // example: image_proxy.php?filename=http://www.blahblah.com/file.jpg&format=image/jpeg
        // we need this when returning the content-type
        // if it doesn't exist, use the default
        // see registered media types here:
        // http://www.iana.org/assignments/media-types
        
        if(array_key_exists('format',$_REQUEST)){
        	$format= $_REQUEST['format'];
        } else {
        	$format = "text/xml";
        }
        
        // get the file
     	$fileData = file_get_contents($fileName);
     	
     	// send a content-type header
        header("content-type: $format");  
        // echo the content
    	echo $fileData;
?>