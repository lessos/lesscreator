<!-- <div onresize="window.resize &amp;&amp; window.scr &amp;&amp; resize(scr, ws)">
</div> -->

<audio src="bell.ogg" id="bell" style="display: none;"></audio>
<textarea id="lc-terminal2" style="z-index:-1000;position:absolute;" class="lc-terminal">fff</textarea>
<div id="lc-terminal" class="lc-terminal"></div>

<script>
$('#lc-terminal').height($('#h5c-tablet-body-w1').height());

lc_terminal_start('lc-terminal', 'ws://' + window.location.hostname + ':9531/lesscreator/api/terminal-ws');




</script>