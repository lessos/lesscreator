<style>
.err-brw {
    position: absolute;
    padding: 30px;
    width: 700px;
}
.err-brw td {
    padding: 10px 20px 10px 0;
}
.err-brw img {
    width: 32px; height: 32px;
}
</style>
<div class="err-brw">
  <div class="alert alert-error">
    <h4>This Application are not fully supported in this browser/version</h4>
    <br />
    <p>Please install the following browser, And upgrade to the latest version</p>
    <table>
      <tr>
        <td><img src="/lesscreator/static/img/browser/chrome.png" /></td>
        <td><strong>Google Chrome</strong></td>
        <td>Free (Recommend)</td>
        <td><a href="http://www.google.com/chrome/" target="_blank">http://www.google.com/chrome/</a></td>
      </tr>
      <tr>
        <td><img src="/lesscreator/static/img/browser/safari.png" /></td>
        <td><strong>Apple Safari</strong></td>
        <td>Free</td>
        <td><a href="http://www.apple.com/safari/" target="_blank">http://www.apple.com/safari/</a></td>
      </tr>
      <tr>
        <td><img src="/lesscreator/static/img/browser/firefox.png" /></td>
        <td><strong>Mozilla Firefox</strong></td>
        <td>Free</td>
        <td><a href="http://www.mozilla.org/" target="_blank">http://www.mozilla.org/</a></td>
      </tr>
    </table>
  </div>
</div>
<script>

$(window).resize(function() {
    _err_brw_resize();
});

function _err_brw_resize()
{
    var bh = $('body').height();
    var bw = $('body').width();

    if (bh < 300) {
        bh = 300;
    }
    if (bw < 600) {
        bw = 600;
    }

    var eh = $('.err-brw').height();
    var ew = $('.err-brw').width();

    $('.err-brw').css({
        "top" : ((bh - eh) / 3) + "px",
        "left": ((bw - ew) / 2) + "px"
    });
}

_err_brw_resize();
</script>
