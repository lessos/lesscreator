<?php

use Zend\Version\Version;

?>

<div style="background:#f6f7f8;padding: 10px 5px;">
    <img src="/lesscreator/static/img/plugins/php-zf/zf-ico-l-360.png" class="h5c_ico" width="60" height="30" />
    <span class="inline"><strong>Zend Framework 2</strong> ( <em>Version: <?php echo Version::VERSION?></em> )</span>
</div>

<div style="padding:5px;">

<div  class="alert alert-success">

<h3>Zend Framework MVC</h3>

Develop a browser / server-side Web applications based on Zend Framework<br/><br/>

<p style="color:#dc4437;">
This Wizard will create a default directory structure and initial configuration files. The following files will be overwritten!</p><br/>

<ul>
	<li>public/index.php</li>
	<li>config/application.config.php</li>
	<li>config/autoload/global.php</li>
	<li>misc/nginx/virtual.custom.conf</li>
</ul><br/>

<a class="btn btn-success" href="#php-zf/start" onclick="_plugin_zf_mvc_start()">Confirm and Start Zend Framework MVC layer</a>
</div>

<div id="f79gwj">

</div>

<script type="text/javascript">

function _plugin_zf_mvc_start()
{
	var req = {
        "access_token" : lessCookie.Get("access_token"),
        "data" : {
        	"projdir": lessSession.Get("ProjPath")
        }
    }

	$.ajax({
        type    : "POST",
        url     : '/lesscreator/plugins/php-zf/fs-init?_='+ Math.random(),
        data    : JSON.stringify(req),
        success : function(rsp) {
            //$("#pt"+p).html(data);
            //h5cLayoutResize();
            lessAlert("#f79gwj", "alert-success", rsp);
        },
        error   : function(xhr, textStatus, error) {
            //hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
}

</script>