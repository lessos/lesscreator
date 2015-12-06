
<div class="lcx-fsnav">

    <span class="lfn-title">Files</span>

    <ul class="lfn-menus">
        <li class="lfnm-item">
            
            <span class="glyphicon glyphicon-plus-sign lfnm-item-ico"></span>
            
            <ul class="lfnm-item-submenu">
                <li>
                    <a href="#proj/fs/file-new" onclick="l9rProjFs.FileNew('file', null, '')">
                        <img src="/lesscreator/~/lesscreator/img/page_white_add.png" class="h5c_icon" />
                        {%New File%}
                    </a>
                </li>
                <li>
                    <a href="#proj/fs/file-new-dir" onclick="l9rProjFs.FileNew('dir', null, '')">
                        <img src="/lesscreator/~/lesscreator/img/folder_add.png" class="h5c_icon" />
                        {%New Folder%}
                    </a>
                </li>
                <li>
                    <a href="#proj/fs/file-upl" onclick="l9rProjFs.FileUpload(null)">
                        <img src="/lesscreator/~/lesscreator/img/page_white_get.png" class="h5c_icon" />
                        {%Upload%}
                    </a>
                </li>
            </ul>
        </li>

        <li class="lfnm-item">
            <a href="#fs/file-upl" 
                onclick="_fs_tree_dir('', 1)" 
                class="glyphicon glyphicon-refresh lfnm-item-ico" title="Refresh">
            </a>
        </li>
    </ul>
</div>


<!-- Project Files Tree -->
<div id="lcbind-fsnav-fstree" class="less_scroll">
    <div id="fstdroot" class="lcx-fstree">loading</div>
</div>


<!--- TPL: File Item -->
<script id="lcx-filenav-tree-tpl" type="text/html">
{[~it :v]}
<div id="ptp{[=v.fsid]}" class="lcx-fsitem" 
  lc-fspath="{[=v.path]}" lc-fstype="{[=v.fstype]}" lc-fsico="{[=v.ico]}">
    <img src="/lesscreator/~/lesscreator/img/{[=v.ico]}.png" align="absmiddle">
    <a href="#" class="anoline">{[=v.name]}</a>
</div>
{[~]}
</script>


<!--- TPL: File Right Click Menu -->
<div id="lcbind-fsnav-rcm" style="display:none">
  
  <div class="lcbind-fsrcm-item fsrcm-isdir" lc-fsnav="new-file">
    <div class="rcico">
        <img src="/lesscreator/~/lesscreator/img/page_white_add.png" align="absmiddle" />
    </div>
    <a href="#" class="rcctn">{%New File%}</a>
  </div>
  <div class="lcbind-fsrcm-item fsrcm-isdir" lc-fsnav="new-dir">
    <div class="rcico">
        <img src="/lesscreator/~/lesscreator/img/folder_add.png" align="absmiddle">
    </div>
    <a href="#" class="rcctn">{%New Folder%}</a>
  </div>
  <div class="lcbind-fsrcm-item fsrcm-isdir" lc-fsnav="upload">
    <div class="rcico">
        <img src="/lesscreator/~/lesscreator/img/page_white_get.png" align="absmiddle">
    </div>
    <a href="#" class="rcctn">{%Upload%}</a>
  </div>

  <div class="rcm-sepline fsrcm-isdir"></div>

  <div class="lcbind-fsrcm-item" lc-fsnav="rename">
    <div class="rcico">
        <img src="/lesscreator/~/lesscreator/img/page_white_copy.png" align="absmiddle">
    </div>
    <a href="#" class="rcctn">{%Rename%}</a>
  </div>
  <div class="lcbind-fsrcm-item" lc-fsnav="file-del">
    <div class="rcico">
        <img src="/lesscreator/~/lesscreator/img/delete.png" align="absmiddle">
    </div>
    <a href="#" class="rcctn">{%Delete%}</a>
  </div>
</div>


<!-- TPL : File New -->
<div id="lcbind-fstpl-filenew" style="display:none"> 
<form id="{[=it.formid]}" action="#" onsubmit="l9rProjFs.FileNewSave('{[=it.formid]}');return false;">
  <div class="input-group">
    <span class="input-group-addon">
        <img src="/lesscreator/~/lesscreator/img/page_white_add.png" class="h5c_icon">
        {[=it.path]}/
    </span>
    <input type="text" name="name" value="{[=it.file]}" class="form-control">
    <input type="hidden" name="path" value="{[=it.path]}">
    <input type="hidden" name="type" value="{[=it.type]}">
  </div>
</form>
</div>


<!-- TPL : File Rename -->
<div id="lcbind-fstpl-filerename" style="display:none"> 
<form id="{[=it.formid]}" action="#" onsubmit="l9rProjFs.FileRenameSave('{[=it.formid]}');return false;">
  <div class="input-group">
    <span class="input-group-addon">
        <img src="/lesscreator/~/lesscreator/img/folder_edit.png" class="h5c_icon">
    </span>
    <input type="text" name="pathset" value="{[=it.path]}" class="form-control">
    <input type="hidden" name="path" value="{[=it.path]}">
  </div>
</form>
</div>


<!-- TPL : File Delete -->
<div id="lcbind-fstpl-filedel" style="display:none"> 
<form id="{[=it.formid]}" action="#" onsubmit="l9rProjFs.FileDelSave('{[=it.formid]}');return false;">
  <input type="hidden" name="path" value="{[=it.path]}" class="form-control">
  <div class="alert alert-danger" role="alert">
    <p>Are you sure to delete this file or folder?</p>
    <p><strong>{[=it.path]}</strong><p>
  </div>
</form>
</div>


<!-- TPL : File Upload -->
<style type="text/css">
.lsarea {
    margin: 15px 0;
    display: inline-block;
    height: 120px;
    width: 100%;
    color: #333;
    font-size: 18px;
    padding: 10px;
    border: 3px dashed #5cb85c;
    border-radius: 10px;
    text-align: center;
    vertical-align: middle;
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
}
</style>
<div id="lcbind-fstpl-fileupload" style="display:none">
<div id="{[=it.reqid]}">
  <div>{%The target of Upload directory%}</div>
  <div class="input-group">
    <span class="input-group-addon"><img src="/lesscreator/~/lesscreator/img/page_white_get.png" align="absmiddle"></span>
    <input class="form-control" name="path" type="text" value="{[=it.path]}">
    <button class="btn hide" type="button" onclick="_fs_upl_chgdir()">{%Change directory%}</button>
  </div>
  <div id="{[=it.areaid]}" class="lsarea">
    {%Drag and Drop your files or folders to here%}
  </div>
  <div class="alert alert-info status" style="display:none;"></div>
</div>
</div>
