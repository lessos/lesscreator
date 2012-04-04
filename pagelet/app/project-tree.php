<?php

$projbase = SYS_ROOT."/app";

if ($this->reqs->params->proj == null) {
    //die();
}
$proj  = preg_replace("/\/+/", "/", trim($this->reqs->params->proj,'/'));

if (strlen($proj) < 1) {
    die();
}

$path  = preg_replace("/\/+/", "/", $this->reqs->params->path);

$paths = explode("/", trim($path, "/"));
//die(200);
if (!file_exists($projbase.'/'.$proj.'/'.$path)) {    
    die();
}
?>

<div>
<?php

$file   = '';

$glob = preg_replace(array("/\.+/", "/\/+/"), array(".", "/"), "{$projbase}/{$proj}/{$path}/*");

$prt = $prt0 = '';

foreach (glob($glob) as $f) {

    //$fn = '';
    $fn = substr(strrchr($f, "/"), 1);
    $fm = mime_content_type($f);
    
    $fmi = 'page_white';
    $href = null;
    
    $p = trim("{$path}/$fn", '/');
    $p = preg_replace("/\/+/", "/", $p);
    $pdiv = md5($p);
    
    //$p = urlencode($p);
    if ($fm == 'directory') {
        
        if ($fn == 'pagelet') {
            $fmi = 'layers';
        } else if ($fn == 'action') {
            $fmi = 'script_code_red';
        } else {
            $fmi = 'folder';
        }
        
        $href   = "javascript:_hdev_dir('{$proj}', '{$p}', 0)";
        
    } else if (substr($fm,0,4) == 'text' 
        || $fm == "application/x-empty" 
        || substr($fm, -3) == "xml") {
        
        if (strlen($path) == 0 && $fn == 'hootoapp.yaml') {
            $fmi = 'app-t3-16';
        } else if ($fm == 'text/x-php' || substr($f,-4) == '.php') {
            $fmi = 'page_white_php';
        } else if (substr($f,-2) == '.h' || substr($f,-4) == '.hpp') {
            $fmi = 'page_white_h';
        } else if (substr($f,-2) == '.c') {
            $fmi = 'page_white_c';
        } else if (substr($f,-4) == '.cpp' || substr($f,-3) == '.cc') {
            $fmi = 'page_white_cplusplus';
        }    else if (substr($f,-3) == '.js' || substr($f,-4) == '.css') {
            $fmi = 'page_white_code';
        } else if (substr($f,-5) == '.html' || substr($f,-4) == '.htm' || substr($f,-6) == '.xhtml') {
            $fmi = 'page_white_world';
        } else if (substr($f,-3) == '.sh') {
            $fmi = 'application_osx_terminal';
        }
        
        $href = "javascript:hdev_page_open('{$p}','editor','','{$fmi}')";
        
    } else if (substr($fm, 0, 5) == 'image') {
        $fmi = 'page_white_picture';
    }
    
    $li  = "<div id=\"ptp{$pdiv}\" class=\"hdev-proj-tree fileitem\">";
    $li .= "<img src='/app/hcreator/static/img/{$fmi}.png' align='absmiddle' title='{$fm}' /> ";
    $li .= ($href === null) ? $fn : "<a href=\"{$href}\" class=\"anoline\">{$fn}</a>";
    
    $lip = "";
    
    if ($fm == 'directory') {
        $lip .= "<div class='rcitem'>
            <div class='rcico'><img src='/app/hcreator/static/img/page_white_add.png' align='absmiddle' /></div>
            <a href='#{$p}' class='rcctn hdev_rcobj_file'>New File</a></div>";
        $lip .= "<div class='rcitem'>
            <div class='rcico'><img src='/app/hcreator/static/img/folder_add.png' align='absmiddle' /></div>
            <a href='#{$p}' class='rcctn hdev_rcobj_dir'>New Folder</a></div>";
        $lip .= "<div class='rcitem'>
            <div class='rcico'><img src='/app/hcreator/static/img/page_white_get.png' align='absmiddle' /></div>
            <a href='#{$p}' class='rcctn hdev_rcobj_upload'>Upload</a></div>";
    }
    
    if (strlen($path) != 0 || $fn != 'hootoapp.yaml') {
        
        $lip .= "<div class='rcitem'>
            <div class='rcico'><img src='/app/hcreator/static/img/page_white_copy.png' align='absmiddle' /></div>
            <a href='#{$p}' class='rcctn hdev_rcobj_rename'>Rename</a></div>";
        
        if (strlen($lip)) {
            $lip .= "<div class=\"rcsepli\"></div>";
        }
        $lip .= "<div class='rcitem'>
            <div class='rcico'><img src='/app/hcreator/static/img/delete.png' align='absmiddle' /></div>
            <a href=\"javascript:_page_del('{$proj}','{$p}');\" onclick=\"return confirm('Are you sure you want to delete?')\" class='rcctn'>Delete</a></div>";
    }
    
    if (strlen($lip)) {
        $li .= "<div class=\"hdev-rcmenu displaynone\">".$lip."</div>";
    }
    
    $li .= "</div>";
    $li .= "<div id=\"pt{$pdiv}\" style=\"padding-left:20px;\"></div>";
    
    if ($fn == 'hootoapp.yaml') {
        continue;
        $prt0 = $li; // TODO
    } else {
        $prt .= $li;
    }
}
echo $prt0 . $prt;
?>
</div>
<script>
_refresh_tree();
</script>


