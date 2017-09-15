var formControls = document.getElementsByClassName('form-control');
if (formControls) {
  
  for (var i = 0; i < formControls.length; i++) {
    var item = formControls[i];
    window.onload = animateLabel(item);

    item.addEventListener('focus', function(e) {
      var formGroup = e.path[1];
      formGroup.classList.toggle('active');
    }, false);

    item.addEventListener('focusout', function(e) {
      var formGroup = e.path[1];
      formGroup.classList.toggle('active');
      animateLabel(e.target);
    }, false);
  }

  function animateLabel(item) {
    if (item && item.value.length > 0) {
      item.nextSibling.classList.add('active');
    } else {
      item.nextSibling.classList.remove('active');
    }
  }
}

// Set background image
document.addEventListener("DOMContentLoaded", function(event) { 
  var imgBg = document.getElementsByClassName('img-bg');
  if (imgBg) {
    for (var i = 0; i < imgBg.length; i++) {
      var item  = imgBg[i],
          src   = item.getAttribute('data-src');
          
      item.style.backgroundImage = src ? 'url("' + src + '")' : 'https://www.bus.com/assets/camaleon_cms/image-not-found-4a963b95bf081c3ea02923dceaeb3f8085e1a654fc54840aac61a57a60903fef.png';
    }
  }
});

/**
 * Send data
 */
$(document).ready(function() {
  var alertBox = $('#alert-box');
  $(alertBox).hide();
  
  var validator = new FormValidator('form-register', [{
    name: 'name',
    display: 'Vui lòng điền đầy đủ họ tên!',
    rules: 'required'
  }, {
    name: 'email',
    rules: 'required|valid_email',
    display: 'Email chưa đúng, vui lòng thử lại!'
  }, {
    name: 'mobile',
    rules: 'required|min_length[8]',
    display: 'Số điện thoại chưa đúng định dạng!'
  }, {
    name: 'channel',
    rules: 'required',
    display: 'Vui lòng điền kênh marketing đang chạy!'
  }, {
    name: 'budget',
    rules: 'required',
    display: 'Vui lòng điền ngân sách đã chạy!'
  }], function(error, event) {
    if (error.length > 0) {
      /**
       * Show message alert in box
       */
      var msg = error[0].display;
      $(alertBox).show().addClass('alert-danger').html(msg);
    } else {
      /**
       * Check event of button submit
       */
      if (event && event.preventDefault()) {
        event.preventDefault();
      } else if (event) {
        event.returnValue = false;
      }
      /**
       * Send form data
       */
      var form = $(event.target).closest('form');
      var inputs = $(form).find('.form-control');
      var data = {};
      $(inputs).each(function(index, input) {
        var name = $(input).attr('name');
        var value = $(input).val();
        data[name] = value;
      });
      setTimeout(function() {
        $(alertBox).removeClass('alert-danger').html('Đăng ký thành công!').addClass('alert-success').show();

        window.firebaseDB.ref('subscribe/' + window.u_id).set({ 
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          channel: data.channel,
          budget: data.budget
        });
      }, 300);
    }
  });
});

/**
 * Smooth scroll
 */
(function($){
  $('.btn-scroll')
  .click(function(event) {
    console.log('click');
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
}(jQuery));
