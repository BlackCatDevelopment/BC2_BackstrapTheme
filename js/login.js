/** login.js **/
$(function() {
    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    function eraseCookie(name) {
        document.cookie = name+'=; Max-Age=-99999999;';
    }

    jQuery.ajaxSetup({
        xhrFields: {
            withCredentials: true
        },
        error: function( x, e )
        {
            //console.log('x: ',x);
            //console.log('e: ',e);
            if( x.status == 0 )           { bsErrorMsg('You are offline!\nPlease Check Your Network.');     }
            else if( x.status == 404 )    { bsErrorMsg('404 - Requested URL not found.');                   }
            else if( x.status == 500 )    { bsErrorMsg('500 - Internal Server Error.');                     }
            // dismiss parse errors
            else if( e == 'parsererror' ) { console.log('Parse error. Maybe caused by invalid JSON data.'); }
            else if( e == 'timeout' )     { bsErrorMsg('Request timed out.');                               }
            else                          { bsErrorMsg('Unknown Error.\n'+x.responseText);                  }
         }
    });
    $('input.field1').on('focusout', function() {
        $.ajax({
            type:     'POST',
            context:  $(this),
            url:      CAT_ADMIN_URL+'/tfa',
            dataType: 'json',
            data:     {
                user: this.value
            },
            cache:    false,
            success:  function(data,textStatus,jqXHR)
            {
                console.log(data);
                if(data.message === true) {
                    $('div#tfagroup').show('slow');
                } else {
                    $('div#tfagroup').hide('slow');
                }
            }
        });
    });

    $('.btn-primary').unbind('click').on('click', function(e) {
        e.preventDefault();

        // reset error message
        $('div#login-error p').html('');
        $('div#login-error').hide();

        var username_fieldname    = $('form').find('input[name=username_fieldname]').val(),
            password_fieldname    = $('form').find('input[name=password_fieldname]').val(),
            token_fieldname       = $('form').find('input[name=token_fieldname]').val(),
            dates                 = {
                'username_fieldname': username_fieldname,
                'password_fieldname': password_fieldname,
                'token_fieldname'   : token_fieldname,
                'acc'               : $('input#acc').is(':checked')
            };
        dates[username_fieldname] = $('input#' + username_fieldname).val();
        dates[password_fieldname] = $('input#' + password_fieldname).val();
        dates[token_fieldname]    = $('input#' + token_fieldname).val();

        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            type:     'POST',
            context:  $(this),
            url:      CAT_ADMIN_URL+'/authenticate/',
            dataType: 'json',
            data:     dates,
            cache:    false,
            success:  function( data, textStatus, jqXHR  )
            {
console.log(data);
                if ( data.success === true )
                {
                    setCookie(data.cookie, data.token);
                    window.location.replace(data.url + "?_cat_access_token="+data.token);
                }
                else {
                    $('div#login-error p').html(data.message);
                    $('div#login-error').show();
                    $('input[name=' + password_fieldname + ']').val('').focus();
                }
            },
            error:        function( jqXHR, textStatus, errorThrown )
            {
                alert(textStatus + ': ' + jqXHR.responseText );
            }
        });
    });
});