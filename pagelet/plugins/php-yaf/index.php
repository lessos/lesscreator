<?php

use LessPHP\Util\Directory;
    
$info = lesscreator_proj::info($this->req->proj);
if (!isset($info['projid'])) {
    die("Bad Request");
}
$projPath = lesscreator_proj::path($this->req->proj);

?>

<div style="background:#f6f7f8;padding: 10px 5px;border-bottom:1px solid #ccc;">
    <img src="/lesscreator/static/img/plugins/php-yaf/yaf-ico-l-360.png" class="h5c_ico" width="60" height="30" />
    <span class="inline"><strong>PHP Yaf Framework</strong> ( <em>Version: <?php echo YAF_VERSION?></em> )</span>
</div>

<div style="padding:5px;">

<div id="jxaebr" class="alert alert-success hide">

<h3>PHP Yaf Framework MVC</h3>

Develop a browser / server-side Web applications based on PHP Yaf Framework<br/><br/>
<p>Site: <a href="http://pecl.php.net/package/yaf" target="_blank">http://pecl.php.net/package/yaf</a></p>
<p>Source: <a href="https://github.com/laruence/php-yaf" target="_blank">https://github.com/laruence/php-yaf</a></p>
<p>Install: pecl install yaf</p>

<p style="color:#dc4437;margin-top:15px;font-size:16px;">
This Wizard will create a default directory structure and initial configuration files. The following files will be overwritten!</p><br/>

<ul>
<?php
$fs = Directory::listFiles(LESSCREATOR_DIR ."/pagelet/plugins/php-yaf/fs-init-tpl");
foreach ($fs as $v) {
    echo "<li>$v</li>";
}
?>
</ul><br/>

<a class="btn btn-success" href="#php-yaf/start" onclick="_plugin_yaf_mvc_start()">Confirm and Start PHP Yaf Framework MVC layer</a>

</div>

<script type="text/javascript">

<?php
//echo "{$projPath}/conf/application.ini";
//die();
$item = lesscreator_fs::FsFileGet("{$projPath}/conf/application.ini");
//print_r($item);

if ($item->status != 200) {
    echo '$("#jxaebr").show();';
}
?>

function _plugin_yaf_mvc_start()
{
	var req = {
        "access_token" : lessCookie.Get("access_token"),
        "data" : {
        	"projdir": lessSession.Get("ProjPath")
        }
    }

	$.ajax({
        type    : "POST",
        url     : '/lesscreator/plugins/php-yaf/fs-init?_='+ Math.random(),
        data    : JSON.stringify(req),
        success : function(rsp) {
            //$("#pt"+p).html(data);
            //h5cLayoutResize();
            _fs_file_new_callback("/");
            $("#jxaebr").hide();
            //lessAlert("#f79gwj", "alert-success", rsp);
        },
        error   : function(xhr, textStatus, error) {
            //hdev_header_alert('error', textStatus+' '+xhr.responseText);
        }
    });
}

</script>