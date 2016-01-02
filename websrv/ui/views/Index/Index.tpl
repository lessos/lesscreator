<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{T . "Creator"}}</title>
  <script src="{{HttpSrvBasePath "~/lessui/js/sea.js"}}"></script>
  <script src="{{HttpSrvBasePath "~/creator/js/main.js"}}"></script>  
  <link href="{{HttpSrvBasePath "~/lessui/less/lessui.less"}}" rel="stylesheet/less" />
  <link href="{{HttpSrvBasePath "~/creator/less/defx.less"}}" rel="stylesheet/less" />
  <script src="{{HttpSrvBasePath "~/lessui/less/less.min.js"}}"></script>
  <link href="{{HttpSrvBasePath "~/creator/img/favicon.ico"}}" rel="shortcut icon" type="image/x-icon" />
  <script type="text/javascript">
    var pandora_endpoint = "{{.pandora_endpoint}}/v1";
    var pandora_ext = "{{.pandora_endpoint}}/ext";
    var l9r_pod_active = "{{.l9r_pod_active}}";
    window.onload = l9r.Boot;
  </script>
  <style>
  .loading {
    margin: 0;
    padding: 30px 40px;
    font-size: 24px;
    color: #000;
  }
  </style>
</head>
<body>
<div id="body-content">    
  <div class="loading">loading ...</div>
  <div class="l9r-loadwell" style="display:none">
    <div class="">
      <div id="_load-alert" class="alert alert-success">
        {{T . "Initializing System Environment"}} ...</div>    
    </div>
    <div class="load-progress-msg">{{T . "Loading dependencies"}} ... </div>
    <div class="load-progress progress progress-success">
      <div class="bar load-progress-num" style="width: 1%"></div>
    </div>
  </div>
</div>
</body>
</html>
