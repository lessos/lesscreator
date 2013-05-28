<?php

$projbase = H5C_DIR;

if ($this->req->proj == null) {
    die('ERROR');
}
$proj = preg_replace("/\/+/", "/", rtrim($this->req->proj, '/'));
if (substr($proj, 0, 1) == '/') {
    $projpath = $proj;
} else {
    $projpath = "{$projbase}/{$proj}";
}
if (strlen($projpath) < 1) {
    die("ERROR");
}

$projInfo = json_decode(file_get_contents($projpath."/lcproject.json"), true);

if (isset($projInfo['name'])) {
    
    $pjc = SYS_ROOT .'/conf/h5creator/projlist.json';
    $pjs = "";
    if (file_exists($pjc)) {
        $pjs = file_get_contents($pjc);
    }
    $pjs = json_decode($pjs, true);
    if (!is_array($pjs)) {
        $pjs = array();
    }
    
    if (!isset($pjs[$projInfo['appid']])
        || $pjs[$projInfo['appid']]['name'] != $projInfo['name']
        || $pjs[$projInfo['appid']]['path'] != $projpath) {

        $pjs[$projInfo['appid']]['name'] = $projInfo['name'];
        $pjs[$projInfo['appid']]['path'] = $projpath;

        hwl_util_dir::mkfiledir($pjc);
        file_put_contents($pjc, hwl_Json::prettyPrint($pjs));
    }
}

$props = isset($projInfo['props']) ? explode(",", $projInfo['props']) : array();
$props_def = h5creator_service::listAll();

?>

  <div style="padding:5px 10px 5px 10px; background-color:#f6f7f8;">
    <span>
      <strong><?php echo $projInfo['name']?></strong> [#<?php echo $projInfo['appid']?>]
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
        if (!file_exists($projpath."/{$v}/project.json")) {
            $json = array(
                'created' => time(),
            );
            $jsfi = $projpath."/{$v}/project.json";
            hwl_util_dir::mkfiledir($jsfi);
            file_put_contents($jsfi, hwl_Json::prettyPrint($json));
        }
        echo "<li class='ueg14o_{$v}'><a href=\"#proj/{$v}\" class=\"_proj_tab_href\">{$props_def[$v]}</a></li>";
    }
    ?>
  </ul>

  <div id="_proj_inlet_body"></div>

<script>

// TODO $("title").text('<?php echo $projInfo['name']?> - H5 Creator');

<?php
if (!is_writable("{$projpath}")) {
    echo 'hdev_header_alert("error", "The Project is not Writable");';
}
echo "sessionStorage.ProjPath = '{$projpath}';";
echo "sessionStorage.ProjId = '{$projInfo['appid']}';";
?>

function _proj_nav_open(plg)
{
    $.ajax({
        type    : "GET",
        url     : '/h5creator/proj/'+ plg +'/index?proj='+ projCurrent,
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
