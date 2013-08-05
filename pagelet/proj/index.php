<?php

use LessPHP\Encoding\Json;


if ($this->req->proj == null) {
    die('ERROR');
}
$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));

$projPath = lesscreator_proj::path($proj);
if (strlen($projPath) < 1) {
    die("ERROR");
}

$projInfo = lesscreator_proj::info($proj);

$basedir = $_COOKIE["basedir"];

if (isset($projInfo['name'])) {

    $pjc = $basedir .'/conf/lesscreator/projlist.json';

    $pjs = null;
    $rs = lesscreator_fs::FsFileGet($pic);
    //print_r($rs);
    if ($rs->status == 200) {
        $pjs = json_decode($rs->data->body, true);
    }

    if (!is_array($pjs)) {
        $pjs = array();
    }

    if (!isset($pjs[$projInfo['projid']])
        || $pjs[$projInfo['projid']]['name'] != $projInfo['name']
        || $pjs[$projInfo['projid']]['path'] != $projPath) {

        $pjs[$projInfo['projid']]['name'] = $projInfo['name'];
        $pjs[$projInfo['projid']]['path'] = $projPath;

        lesscreator_fs::FsFilePut($pjc, Json::prettyPrint($pjs));
    }
}

$props = isset($projInfo['props']) ? explode(",", $projInfo['props']) : array();
$props_def = lesscreator_service::listAll();

?>

  <div style="padding:5px 10px 5px 10px; background-color:#f6f7f8;">
    <span>
      <strong><?php echo $projInfo['name']?></strong> [#<?php echo $projInfo['projid']?>]
    </span>
    <a href="javascript:h5cProjSet()" class="h5c_block pull-right">
      <i class="icon-wrench"></i>
      Setting 
    </a>
  </div>

  <ul class="h5c_navtabs _proj_nav" style="background-color:#f6f7f8;">
    <li class="active ueg14o_fs"><a href="#proj/fs" class="_proj_tab_href">Files</a></li>
    <?php
    foreach ($props as $v) {
        if (!isset($props_def[$v])) {
            continue;
        }
        /* if (!file_exists($projPath."/{$v}/project.json")) {
            $json = array(
                'created' => time(),
            );
            $jsfi = $projPath."/{$v}/project.json";

            lesscreator_fs::FsFilePut($jsfi, Json::prettyPrint($json));
        } */
        echo "<li class='ueg14o_{$v}'><a href=\"#proj/{$v}\" class=\"_proj_tab_href\">{$props_def[$v]}</a></li>";
    }
    ?>
  </ul>

  <div id="_proj_inlet_body"></div>

<script>

$("title").text('<?php echo $projInfo['name']?> - Less Creator');

<?php
echo "sessionStorage.ProjPath = '{$projPath}';";
echo "sessionStorage.ProjId = '{$projInfo['projid']}';";
?>

function _proj_nav_open(plg)
{
    $.ajax({
        type    : "GET",
        url     : '/lesscreator/proj/'+ plg +'/index?proj='+ projCurrent,
        success : function(rsp) {
            
            $("#_proj_inlet_body").html(rsp);
            
            if (sessionStorage.ProjNavLast != plg) {
                sessionStorage.ProjNavLast = plg;
            }
            
            $("._proj_nav li.active").removeClass("active");
            $(".ueg14o_"+plg).addClass("active");
            
            h5cLayoutResize();
        }
    });
}

if (!sessionStorage.ProjNavLast) {
    sessionStorage.ProjNavLast = 'fs';
}

_proj_nav_open(sessionStorage.ProjNavLast);


$('._proj_tab_href').click(function() {
    url = $(this).attr('href').substr(6);
    _proj_nav_open(url);
});

</script>