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
$projpath = preg_replace("/\/+/", "/", rtrim($projpath, '/'));
if (strlen($projpath) < 1) {
    die("ERROR");
}

$grps = array();
$glob = $projpath."/dataflow/*.grp.json";
foreach (glob($glob) as $v) {
    $json = file_get_contents($v);
    $json = json_decode($json, true);
    if (!isset($json['id'])) {
        continue;
    }

    $grps[$json['id']] = $json;
}

echo "<table width=\"100%\" class='table-hover'>";
foreach ($grps as $k => $v) {
    echo "<tr>
        <td width='5px'></td>
        <td width='20px'>
            <img src='/fam3/icons/package.png' class='h5c_icon' /> 
        </td>
        <td>
            {$v['name']}
        </td>
        <td align='right'></td>
        <td align='right'><a href='#{$k}' class='k810ll'>Edit</a></td>
        <td width='5px'></td>
    </tr>";

    $glob = $projpath."/dataflow/{$k}/*.actor.json";
    foreach (glob($glob) as $v2) {
        
        $json = file_get_contents($v2);
        $json = json_decode($json, true);
        
        if (!isset($json['id'])) {
            continue;
        }

        echo "<tr>
        <td></td>
        <td></td>
        <td>
            <img src='/fam3/icons/brick.png' class='h5c_icon' />
            <a href='#{$k}/{$json['id']}' class='to8kit' title='{$json['name']}'>{$json['name']}</a>
        </td>
        <td align='right'>
            <a href='#{$k}/{$json['id']}' class='j4sa3r'>Run</a>
        </td>
        <td align='right'>
            <a href='#{$k}/{$json['id']}' class='to8kit' title='{$json['name']}'>Edit</a>
            <a href='#{$k}/{$json['id']}.actor' class='ejiqlh' title='{$json['name']}'>Script</a>
        </td>
        <td></td>
        </tr>";
    }
}
echo "</table>";
?>

<script type="text/javascript">
$('.k810ll').click(function() {
    var uri = $(this).attr('href').substr(1);
    var url = "/h5creator/proj/dataflow/grp-edit?proj="+projCurrent+"&grpid="+uri;
    h5cModalOpen(url, 'Edit Group', 400, 0);
});

$('.to8kit').click(function() {
    var uri = $(this).attr('href').substr(1);
    var tit = $(this).attr('title');
    var url = "/h5creator/proj/dataflow/actor-edit?proj="+projCurrent+"&uri="+uri;
    h5cTabOpen(url, 'w0', 'html', 
        {'title': tit, 'close':'1', 'img': '/fam3/icons/brick.png'});
});

$('.ejiqlh').click(function() {
    var uri = $(this).attr('href').substr(1);
    var tit = $(this).attr('title');
    var url = "dataflow/"+ uri;
    h5cTabOpen(url, 'w0', 'editor', 
        {'title': tit, 'close':'1', 'img': '/fam3/icons/package.png'});
});
</script>