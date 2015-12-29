<table id="lclay-header" class="lcx-header">
  <tr>
    <td width="10px"></td>

    <td width="60px" align="left">

        <div id="lcx-start-entry">
            <div>
                <img class="lse-logo" src="/lesscreator/~/lesscreator/img/gen/creator-white-96.png" />
            </div>
            <div class="lcc-box-entered">
                <img class="lse-logo-ar" src="/lesscreator/~/lesscreator/img/gen/arrow-b2-white-32.png" />
            </div>
        </div>

        <div class="lcx-start-well" style="display:none">

            <div class="lc-head">
                <div class="lc-logo">
                    <img src="/lesscreator/~/lesscreator/img/gen/creator-white-96.png">
                </div>
                <div class="lc-title">less Creator <em id="lcbind-lc-version">{{.lc_version}}</em></div>
                <div class="lc-close">&times;</div>
            </div>

            <div class="lc-line"></div>
            
            <div class="lc-body less-tile-area">

                <div class="less-tile-group x4">

                    <div class="ltg-title ">
                        {{T . "Project"}}
                    </div>
                    
                    <div class="less-tile flatui-bg-peter-river" onclick="l9rProj.New()">
                        <div class="lt-content icon">
                            <img src="/lesscreator/~/lesscreator/img/gen/pen0-48.png">
                        </div>
                        <div class="lt-status">
                            <div class="lts-name">{{T . "New Project"}}</div>
                        </div>
                    </div>

                    <div class="less-tile flatui-bg-nephritis" onclick="l9rProj.NavOpen()">
                        <div class="lt-content icon">
                            <img src="/lesscreator/~/lesscreator/img/gen/pen0-48.png">
                        </div>
                        <div class="lt-status">
                            <div class="lts-name">{{T . "Open Project"}}</div>
                        </div>
                    </div>

                    <a class="less-tile flatui-bg-alizarin" 
                        href="https://github.com/lessos/lesscreator/issues/new" target="_blank">
                        <div class="lt-content icon">
                            <div class="lcx-icon-bug lcx-icon-white"></div>
                        </div>
                        <div class="lt-status">
                            <div class="lts-name">{{T . "Report Issue"}}</div>
                        </div>
                    </a>

                    <a class="less-tile flatui-bg-amethyst" 
                        href="http://www.lesscompute.com/p/lesscreator" target="_blank">
                        <div class="lt-content icon">
                            <div class="lcx-icon-help lcx-icon-white"></div>
                        </div>
                        <div class="lt-status">
                            <div class="lts-name">{{T . "Help"}}</div>
                        </div>
                    </a>
                </div>
           
            </div>
        </div>
    </td>

    <td align="left">
        
        <div id="l9r-pod-nav" class="lcx-nav-grp">
            <div class="lcx-nav-itemex">
                <div class="lni-label">Pod</div>
                <div class="lni-title" id="l9r-pod-status-msg">Connecting</div>
            </div><ul class="lcnav-tile-group" style="margin:0">
                <li class="">
                    <a href="javascript:l9rPod.EntryStatus()" title="Pod Status">
                    <i class="lcico32-white" style="background-image:url(/lesscreator/~/lesscreator/img/std/box-32.png)"></i>
                    </a>
                </li>
                <li class="">
                    <a href="javascript:l9rPod.WebTermOpen()" title="Web Terminal">
                    <i class="lcico32-white" style="background-image:url(/lesscreator/~/lesscreator/img/std/term-32.png)"></i>
                    </a>
                </li>
            </ul>
        </div>

        <div id="l9r-proj-nav" class="lcx-nav-grp" style="display:none">
            <div class="lcx-nav-itemex">
                <div class="lni-label">Project</div>
                <div class="lni-title" id="l9r-proj-nav-status">Connecting</div>
            </div><ul class="lcnav-tile-group" style="margin:0">
                <li class="">
                    <a href="javascript:l9rProj.Set()" title="Project Settings">
                    <i class="lcico32-white" style="background-image:url(/lesscreator/~/lesscreator/img/std/set2-32.png)"></i>
                    </a>
                </li>
                <li class="">
                    <a href="javascript:lcExt.ListRuntime()" title="Runtime, Dependent packages">
                    <i class="lcico32-white" style="background-image:url(/lesscreator/~/lesscreator/img/std/ext-32.png)"></i>
                    </a>
                </li>
                <!-- <li class="">
                    <a href="javascript:l9rProj.Run()" title="Run this Project">
                    <i class="lcico32-white" style="background-image:url(/lesscreator/~/lesscreator/img/std/play-32.png)"></i>
                    </a>
                </li> -->
            </ul>
        </div>

        <div id="lcext-nav" class="lcx-nav-grp"></div>
        <script id="lcext-nav-tpl" type="text/html">
            {[~it :v]}
            <div id="lcext-nav{[=v.name]}" class="lcx-nav-item" onclick="lcExt.RtSet('{[=v.name]}')">
                <i class="lcico32-std" style="background-image:url(/lesscreator/+/{[=v.name]}/img/s32.png)"></i>
            </div>
            {[~]}
        </script>

        <div class="lcx-nav-grp">
            <div id="l9r-halert" style="display:none"></div>
        </div>

        <div id="lcbind-proj-navstart" class="lcx-proj-navbox"></div>
    </td>
    
    <td align="right">      
      {{if .nav_user}}
      <div id="l9r-nav-user-box">
        <span><img class="nu-photo" src="{{.nav_user.photo}}" /></span>
      </div>

      <div id="l9r-nav-user-pbox" style="display:none;">

        <img class="nu-photo" src="{{.nav_user.photo}}">

        <div class="nu-name">{{.nav_user.name}}</div>

        <div id="lcx-nav-user-alert" class="alert hide"></div>

        <a class="btn btn-primary nu-btn" href="{{.nav_user.lessids_endpoint}}" target="_blank">Account Center</a>
        <a class="btn btn-default nu-btn" href="{{.nav_user.lessids_endpoint_signout}}">Sign out</a>

      </div>
      {{end}}
    </td>

    <td width="10px"></td>
  </tr>  
</table>

<div id="lcbind-layout">
    <div class="colsep"></div>
    <div id="lclay-colfilenav"></div>

    <div class="colsep lclay-col-resize" lc-layid="main"></div>
    <div id="lclay-colmain"></div>

    <div id="lcbind-laycol" class="colsep"></div>
</div>


<audio src="/lesscreator/~/lesscreator/media/bell.ogg" id="bell" style="display: none;"></audio>

<div id="lc_editor_tools" style="display:none">
    <script type="text/text" id="lc_editor_tools"></script>

    <!-- <div class="editor_bar hdev-ws hdev-tabs hcr-pgbar-editor"> -->
    <div class="lceditor-tools">
        
        <div class="let-menu-item" onclick="lcEditor.SaveCurrent()">
            <div class="ctn"><i class="icon-hdd"></i> {{T . "Save"}}</div>
        </div>

        <div class="navline"></div>
        <div class="let-menu-item" onclick="lcEditor.Search()">
            <div class="ctn"><i class="icon-search"></i> {{T . "Search"}}</div>
        </div>

        <div class="navline"></div>
        <div class="let-menu-item" onclick="lcEditor.Undo()">
            <div class="ctn"><i class="icon-chevron-left"></i> {{T . "Undo"}}</div>
        </div>

        <div class="let-menu-item" onclick="lcEditor.Redo()">
            <div class="ctn"><i class="icon-chevron-right"></i> {{T . "Redo"}}</div>
        </div>
        
        <!-- <div class="navline"></div>
        <div class="let-menu-item">
            <div class="ico"><img src="/lesscreator/~/lesscreator/img/disk.png" align="absmiddle" /></div>
            <div class="ctn"><input onclick="lcEditor.ConfigSet('editor_autosave')" type="checkbox" id="editor_autosave" name="editor_autosave" value="on" /> Auto Saving</div>
        </div> -->

        <div class="navline"></div>
        <div class="let-menu-item" onclick="lcEditor.ConfigEditMode()">
            <div class="ico lc-editor-editmode"><img src="/lesscreator/~/lesscreator/img/editor/mode-win-48.png" class="_h5c_icon" /></div>
            <div class="ctn">{{T . "Editor Mode"}}</div>
        </div>

        <div class="navline"></div>
        <div class="let-menu-item" onclick="lcEditor.ConfigModal()">
            <div class="ctn"><i class="icon-cog"></i> {{T . "Setting"}}</div>
        </div>
    </div>

    <div class="lc_editor_searchbar hide form-inline">
        <div class="input-prepend input-append">
            <span class="add-on"><i class="icon-search"></i></span>
            <input class="input-small" type="text" name="find" value="{{T . "Find Word"}}" />
            <button class="btn" onclick="lcEditor.SearchNext()">{{T . "Search"}}</button>
        </div>

        <label class="inline"> {{T . "or"}} </label>
        
        <div class="input-append">
            <input class="input-small" name="replace" type="text" value="{{T . "Replace with"}}">
            <button class="btn" type="button" onclick="lcEditor.SearchReplace(false)">{{T . "Replace"}}</button>
            <button class="btn" type="button" onclick="lcEditor.SearchReplace(true)">{{T . "Replace All"}}</button>
        </div>
        
        <!-- <label class="checkbox inline">
          <input onclick="lcEditor.ConfigSet('editor_search_case')" type="checkbox" id="editor_search_case" name="editor_search_case" value="on" />
          Match case
        </label> -->

        <button type="button" class="close" onclick="lcEditor.Search()">&times;</button>
    </div>
</div>

<div id="lctab-tpl" style="display:none">
  <table id="lctab-box{[=it.tabid]}" class="lctab-box" style="width:100%;height:100%">
    <tr>
      <td class="" valign="top">

        <div id="lctab-nav{[=it.tabid]}" class="lctab-nav">
          <div class="lctab-navm">
            <div id="lctab-navtabs{[=it.tabid]}" class="lctab-navs"></div>
          </div>
          <div class="lctab-navr">
            <div class="lcpg-tab-more" href="#{[=it.tabid]}"></div>
          </div>
        </div>

        <div id="lctab-bar{[=it.tabid]}" class="lctab-bar"></div>
        <div id="lctab-body{[=it.tabid]}" class="lctab-body less_scroll"></div>
      </td>
    </tr>
  </table>
</div>

<div id="lctab-openfiles-ol" class="less_scroll"></div>

<script id="l9r-pod-connecting" type="text/html">
<div style="text-align:center;font-size:20px">
    <p>Connecting to Pod #{[=it._meta_id]} ...</p>
    <p><span id="l9r-pod-connecting-status">*</span></p>
</div>
</script>

<script>

$("#l9r-nav-user-box").hover(
    function() {
        $("#l9r-nav-user-pbox").fadeIn(300);
    },
    function() {
    }
);
$("#l9r-nav-user-pbox").hover(
    function() {
    },
    function() {
        $("#l9r-nav-user-pbox").fadeOut(300);
    }
);


$("#lcx-start-entry").click(function() {
    $("#lcx-start-entry").fadeOut(150);
    $(".lcx-start-well").show(150);
});
$("#lcx-start-entry").hover(function() {  
    $("#lcx-start-entry").fadeOut(150);
    $(".lcx-start-well").show(150);
});
$(".lcx-start-well").click(function() {
    $("#lcx-start-entry").fadeIn(300);
    $(".lcx-start-well").hide(300);
});


//$("#lcx-start-entry").fadeOut(150);
//$(".lcx-start-well").show(150);
//$(body).css({
//    "-webkit-filter": blur(2px) contrast(0.4) brightness(1.4)
//});

</script>
