<style>
.err-brw {
    position: absolute;
    padding: 15px;
    width: 600px;
    border: 2px solid #ccc;
    background-color: #fff;
}
.err-brw td {
    padding: 10px 20px 10px 0;
}
.err-brw .imgs1 {
    width: 48px; height: 48px;
}
.err-brw .imgs0 {
    width: 24px; height: 24px;
}
</style>
<div class="err-brw border_radius_t5">
  <div class="">
    <div class="alert alert-error">
        This Application are not fully supported in this browser/version</div>
    
    <p>Please install the Google Chrome, and upgrade to the latest version</p>
    <table>
      <tr>
        <td><img src="/lesscreator/static/img/browser/chrome.png" class="imgs1" /></td>
        <td><strong>Google Chrome</strong></td>
        <td><a href="http://www.google.com/chrome/" target="_blank">http://www.google.com/chrome/</a></td>
      </tr>
      
    </table>
    
    <br />
    <div>We are developing to support the following browsers in the future, pls wait. :-)</div>
    <table>
      <tr>
        <td><img src="/lesscreator/static/img/browser/safari.png" class="imgs0" /></td>
        <td>
            Apple Safari
            <!--<a href="http://www.apple.com/safari/" target="_blank">http://www.apple.com/safari/</a>-->
        </td>
        <td></td>
        <td><img src="/lesscreator/static/img/browser/firefox.png" class="imgs0" /></td>
        <td>
            Mozilla Firefox
            <!--<a href="http://www.mozilla.org/" target="_blank">http://www.mozilla.org/</a>-->
        </td>
      </tr>
    </table>
  </div>
</div>

<script>

$(window).resize(function() {
    _lc_err_brw_resize();
});

function _lc_err_brw_resize()
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

_lc_err_brw_resize();
</script>
