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

$info = hwl\Yaml\Yaml::decode(file_get_contents($projpath."/hootoapp.yaml"));

if (isset($info['name'])) {
    
    $pjc = SYS_ROOT .'/conf/h5creator/projlist.json';
    $pjs = "";
    if (file_exists($pjc)) {
        $pjs = file_get_contents($pjc);
    }
    $pjs = json_decode($pjs, true);
    if (!is_array($pjs)) {
        $pjs = array();
    }
    
    if (!isset($pjs[$info['appid']])
        || $pjs[$info['appid']]['name'] != $info['name']
        || $pjs[$info['appid']]['path'] != $projpath) {

        $pjs[$info['appid']]['name'] = $info['name'];
        $pjs[$info['appid']]['path'] = $projpath;

        hwl_util_dir::mkfiledir($pjc);
        file_put_contents($pjc, hwl_Json::prettyPrint($pjs));
    }
}

$props = isset($info['props']) ? explode(",", $info['props']) : array();
$props_def = array(
    'pagelet'       => 'Pagelet',
    'data'          => 'Database',
    'dataflow'      => 'Dataflow',
);
?>

  <div style="padding:5px 10px 5px 10px; background-color:#f6f7f8;">
    <span>
      <img src="/h5creator/static/img/app-t3-16.png" /> 
      <strong><?php echo $info['name']?></strong> [#<?php echo $info['appid']?>]
    </span>
    <a href="javascript:h5cProjSet()" class="h5c_block pull-right">
      <img src="/h5creator/static/img/cog.png" class="h5c_icon" />
      Setting 
    </a>
  </div>

  <ul class="h5c_navtabs _proj_nav" style="background-color:#f6f7f8;">
    <li class="active"><a href="#proj/file" class="_proj_tab_href">Files</a></li>
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
        echo "<li><a href=\"#proj/{$v}\" class=\"_proj_tab_href\">{$props_def[$v]}</a></li>";
    }
    ?>
  </ul>

  <div id="_proj_inlet_body" style="padding:5px;"></div>

<script>

$("title").text('<?php echo $info['name']?> - Hooto Developer');

<?php
if (!is_writable("{$projpath}")) {
    echo 'hdev_header_alert("error", "The Project is not Writable");';
}
?>

var _proj = '<?php echo $proj?>';

function _proj_nav_open(url)
{
    $.ajax({
        type: "GET",
        url: '/h5creator/proj/'+ url +'/index?proj='+ _proj,
        success: function(rsp) {
            $("#_proj_inlet_body").html(rsp);
            h5cLayoutResize();
        }
    });
}
_proj_nav_open('file');

$('._proj_tab_href').click(function() {

    url = $(this).attr('href').substr(6);
    _proj_nav_open(url);

    $("._proj_nav li.active").removeClass("active");
    $(this).parent().addClass("active");
});

</script>