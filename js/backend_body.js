/*!
  * backend_body.js
  */
(function($) {
    jQuery.ajaxSetup({
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

    /* page tree open/closed state */
    if(typeof(Storage)!=="undefined") {
        $('div#sidebar .collapse').on('hide.bs.collapse', function (e) {
            e.stopPropagation();
            window.localStorage.removeItem('bsCollState_#'+$(this).attr('id'));
        });
        $('div#sidebar .collapse').on('show.bs.collapse', function (e) {
            e.stopPropagation();
            window.localStorage.setItem('bsCollState_#'+$(this).attr('id'), 1); // saves with no expiration
        });
        $('div#sidebar div.list-group.panel div.list-group-item.collapsed').each(function() {
            if(window.localStorage.getItem('bsCollState_'+$(this).data('target')) !== null) {
                $(this).trigger('click');
            }
        });
    }

    /* page tree dbl click */
    $("#sidebar .pagename").on("dblclick", function(e) {
        e.preventDefault();
        $(this).collapse('toggle');
    });

    /* toggle search field */
    $('div#sidebar div#bsSearch').unbind('click').on('click', function(e) {
        $('div#bsSearchField').toggle(500).queue(function(){
            if($('div#bsSearchField').is(':hidden')) {
                $('button#bsSearchClear').trigger('click');
            }
            $(this).dequeue();
        });
    });

    /* clear search field */
    $('button#bsSearchClear').unbind('click').on('click',function() {
        $('div#sidebar div span.pagename').removeClass('text-muted').removeClass('text-danger');
        $('#bsPageSearch').val('');
    });

    /* page tree filter */
    $("input#bsPageSearch").keyup(function() {
        var find = $(this).val().toLowerCase();
        if(find.length) {
            $('div#sidebar div span.pagename').each(function() {
                var text = $(this).text().toLowerCase();
                if(text.indexOf(find) != -1) {
                    $(this).removeClass('text-muted').addClass('text-danger');
                } else {
                    $(this).addClass('text-muted').removeClass('text-danger');
                }
            });
        } else {
            $('div#sidebar div span.pagename').removeClass('text-muted').removeClass('text-danger');
        }
    });

    /* show javascript errors as modal */
    function bsErrorMsg(message)
    {
        $('#bsDialog .modal-title').html('<div class="text-danger"><i class="fa fa-fw fa-warning"></i> '+$.cattranslate('Sorry, there was an error')+'</div>');
        $('#bsDialog .modal-body').html('<div class="text-danger">'+$.cattranslate(message)+'</div>');
        $('#bsDialog').modal('show');
    }

    /* x-editable */
    if(typeof editable != 'undefined') {
        $('.editable').editable();
    }

    /* handle session timeout and re-login */
    function CATSessionTimedOut()
    {
        $('#bsSessionTimedOutDialog').modal('show');
        $('#bsSessionToFE').unbind('click').on('click',function(e) {
            e.preventDefault();
            window.location.replace(CAT_URL); // also removes history
        });
        $('button#bsSessionLogin').unbind('click').on('click',function(e) {
            $('div#login-error').text('').hide(); // make sure there is no old error
            var ufield = $('input.form-control.u').prop('id');
            var pfield = $('input.form-control.p').prop('id');
            var dates  = {
                'username_fieldname': $('input.form-control.u').prop('id'),
                'password_fieldname': $('input.form-control.p').prop('id'),
                'acc'               : true
            };
            dates[ufield] = $('input.form-control.u').val();
            dates[pfield] = $('input.form-control.p').val();
            $.ajax({
                type    : 'POST',
                url     : CAT_ADMIN_URL+'/authenticate',
                dataType: 'json',
                data    : dates,
                success : function(data, status) {
                    if(data.success === false)
                    {
                        $('div#login-error').text(data.message).show();
                    }
                    else
                    {
                        // reset form
                        $('input.form-control.u').val('');
                        $('input.form-control.p').val('');
                        $('#bsSessionTimedOutDialog').modal('hide');
                        // reset session timer
                        CATSessionSetTimer(sess_time,CATSessionTimedOut,'span#sesstime','sesstimealert');
                    }
                }
            });
            e.preventDefault();
        });
    }

    // really disable disabled links
    $('a.disabled').on('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    // allow to add a new page everywhere
    $("a.bsAddPage, button.bsAddPage").unbind("click").on("click",function(e) {
        e.preventDefault();
        $("#add_page_modal .modal-title").text($.cattranslate('Add page',null,'BE'));
        // remove buttons from form
        $("#add_page_modal .form-group.row.buttonline").remove();
        // select parent; e.target is the icon so we need parent()
        parent = $(e.target).parent().data("parent");
        self   = $(e.target).parent().data("id");
        pos    = $(e.target).parent().data("pos");
        if(typeof parent == "undefined") { parent = 0; }
        $("#add_page_modal select[name=page_parent]").val(parent).change();
        $("#add_page_modal input[value=\""+pos+"\"]").attr("checked","checked");
        $("#add_page_modal input[name=page_before_after]").val($("#add_page_modal select[name=page_parent] option[value="+self+"]").text().replace(/\|-- /g,""));
        $("#add_page_modal").modal("show");
        var _this = $(this);
        $("#add_page_modal .modal-content button.btn-primary").unbind("click").on("click",function(e) {
            e.preventDefault();
            $("#add_page_modal").modal("hide");
            $.ajax({
                type    : "POST",
                url     : CAT_ADMIN_URL+"/pages/add/",
                dataType: "json",
                data    : $("#add_page_modal form").serialize(),
                success : function(data, status) {
                    BCGrowl(data.message,data.success);
                    window.location.href = CAT_ADMIN_URL + "/pages/edit/" + data.page_id
                }
            });
        });
    });

    // delete page
    $('a.bsDelPage').unbind("click").on("click",function(e) {
        e.preventDefault();
        var title = $(this).parentsUntil('.list-group-item').parent().find('span.pagename').text();
        var immort = $(this).parentsUntil('.dropright').find('i.fa-life-saver');
        $('#bsDialog .modal-title').html('<div class="text-danger"><i class="fa fa-fw fa-warning"></i> '+$.cattranslate('Are you sure?')+'</div>');
        $('#bsDialog .modal-body').html($.cattranslate('Do you really want to delete this page?')+'<br /><br />'+$.cattranslate('Page title')+": "+title);
        if(immort.length) {
            $('#bsDialog .modal-body').html($('#bsDialog .modal-body').html() + '<br /><br /><p class="text-danger">' + $.cattranslate('Please note: The page will be finally deleted!') + '</p>');
        }
        $('#bsDialog').modal('show');
        var _this = $(this);
        $("#bsDialog .modal-content button.btn-primary").unbind("click").on("click",function(e) {
            e.preventDefault();
            $("#bsDialog").modal("hide");
            $('#bsDialog .modal-title').html('');
            $('#bsDialog .modal-body').html('');
            $.ajax({
                type    : "POST",
                url     : CAT_ADMIN_URL+"/pages/delete/"+_this.data('id'),
                dataType: "json",
                success : function(data, status) {
                    BCGrowl(data.message,data.success);
                    window.location.href = CAT_ADMIN_URL + "/pages/index"
                }
            });
        });
    });

    // recover
    $('a.bsRecoverPage').unbind("click").on("click",function(e) {
        e.preventDefault();
        $.ajax({
            type    : "POST",
            url     : CAT_ADMIN_URL+"/pages/recover/"+_this.data('id'),
            dataType: "json",
            success : function(data, status) {
                BCGrowl(data.message,data.success);
                window.location.href = CAT_ADMIN_URL + "/pages/index"
            }
        });
    });

    // handle nested tabs
    $("ul.nav-tabs.inner a").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    // tooltips
    if(typeof tippy != 'undefined') {
        tippy(document.querySelectorAll('*:not([title=""])'),{arrow:true,theme:'light'});
    } else {
        console.log('no tippy');
    }

    // detach = move to region header
    $('.detach').each( function() {
        $(this).detach()
               .addClass("float-right")
               .appendTo('.breadcrumb');
    });

    // attach Bootstrap classes to form elements
    $('input[type="submit"],button[type="submit"]').addClass('btn btn-primary');
    $('input.cancel').addClass('btn btn-link');
    $('input[type="reset"]').addClass('btn btn-default');
    $('input[type="button"]').addClass('btn btn-default');
    $('input[type="text"],textarea').addClass('form-control');

    // avoid modal contents to be sent more than once
    $('body').on('hidden.bs.modal', '.modal', function() {
        $(this).removeData('bs.modal');
    });

    // close any modals before opening a new one
    $('body').on('show.bs.modal', ".modal", function(e) {
        if($('.modal:visible').length) {
            $('.modal').modal('hide');
        }
    });

    // trigger primary button on enter
    $("body").on("shown.bs.modal", ".modal", function() {
        $(this).keypress(function(e) {
            if (e.which == "13") {
                $("div.modal-footer > button.btn-primary").trigger('click');
            }
        });
    });

    $("#sidebar-closer").click(function() {
        $("#sidebar")
            .css("overflow-x","hidden")
            .css("white-space","nowrap")
            .removeClass("col-md-2 col-xs-1 p-l-0 p-r-0 collapse show")
            .addClass("col-0")
            .queue(function(){
                $("main").addClass("ml-5");
                $( this ).dequeue();
                $("#sidebar-opener").addClass("visible");
            });
    });
    $("#sidebar-opener").click(function() {
        $("#sidebar")
            .css("overflow-x","hidden")
            .css("white-space","nowrap")
            .addClass("col-md-2 col-xs-1")
            .removeClass("col-0")
            .queue(function(){
                $("main").removeClass("ml-5");
                $( this ).dequeue();
                $("#sidebar-opener").removeClass("visible");
            });
    });

/*
    // toggle sidebar
    $("#sidebar-closer").click(function() {
        $("#sidebar").css("display","none").queue(function(){
            $("#sidebar-opener").addClass("visible");
            $("main").addClass("ml-5");
            $( this ).dequeue();
        })
    });
    $("#sidebar-opener").click(function() {
        $("#sidebar-opener").removeClass("visible");
        $("main").removeClass("ml-5");
        $("#sidebar").show("slide","slow");
    });
*/
    // add session timer
    var sess_time = CATTimeStringToSecs($('div#sessiontimer span#sesstime').text());
    CATSessionSetTimer(sess_time,CATSessionTimedOut,'span#sesstime','sesstimealert');

})(jQuery);