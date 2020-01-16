(function(){
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // a and b are javascript Date objects
    function dateDiffInDays(a, b) {
        // Discard the time and time-zone information.
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    function convertTimestamp(unix_timestamp) {
        var date = new Date(unix_timestamp*1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();
        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }



    // get the time period settings template
    var bsPublishingTemplate = $('#publishing').detach();
    var bsModalTemplate      = $('#bsDialog').clone().detach();

    // load tab content on activation
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    	var url     = $(this).attr("data-url");
        if(url)
        {
alert('toggle tab, open url: ' + url);
            e.preventDefault();

          	var pane    = $(this);
            var target  = this.hash;

        	// ajax load from data-url
            $.ajax({
                type    : 'POST',
                url     : url,
                dataType: 'json',
                data    : {
                    page_id: pageID
                },
                success : function(data, status) {
                    if(target == '#headerfiles') {

                    }
                    else {
                        $('div'+target).html(data.message);
                    }
                    //$('div'+target).find('form').fieldset_to_tabs();
                    $('.fa-spinner').remove();
                    $('div#headerfiles').html(data.content);
                    pane.tab('show');
                },
                error   : function(data, status) {
                    pane.find('div').show();
                }
            });
        }
    });

    // unhide buttons
    if($("ul.draggable-card > li").length>0) {
        $("#bsCollapseAll").removeAttr('hidden');
        $("#bsExpandAll").removeAttr('hidden');
        // drag & drop
        if($("ul.draggable-card > li").length>1) {
            $("ul.draggable-card").sortable({
                connectWith: "ul.draggable-card",
                placeholder: "bs_placeholder",
                handle: ".fa-arrows",
                axis: "y",
                over:function(event,ui){
                    $('.bs_placeholder').parent().addClass('bs_highlight');
                },
                out:function(event,ui){
                    $('.bs_placeholder').parent().removeClass('bs_highlight');
                },
                update:function(event,ui){
                    // make sure this only fires once
                    if (this === ui.item.parent()[0]) {
                        $(this).removeClass('bs_highlight');
                        $(this).find('.card').effect("highlight","slow");
                        $.ajax({
                            type    : 'POST',
                            url     : CAT_ADMIN_URL + '/section/order',
                            data    : {
                                page_id: pageID,
                                order: $(this).sortable('toArray', {attribute: 'data-id'}),
                            },
                            dataType: 'json'
                        });
                    }
                }
            });//.disableSelection();
        } else {
            $("span.fa-arrows").hide();
        }
    }

    $("[contenteditable]").each(function () {
        var target = this;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === "class" && $(mutation.target).prop(mutation.attributeName).indexOf("haschanged")>0) {
                    var attributeValue = $(mutation.target).prop(mutation.attributeName);
                    //console.log("Class attribute changed to:", attributeValue);
                    $(mutation.target).parentsUntil('li.card').parent().find('.bsChangedFlag').addClass("fa-exclamation-triangle text-warning");
                    $('span#bsGlobalChangeIndicator').addClass("fa-exclamation-triangle text-warning");
                }
            });
        });
        observer.observe(target, {attributes: true});
    });

})(jQuery);