$(function() {

    var pageID = $('#bsPageHeader').data('page');

    function bsChangeLangSelect() {
        count = $('select#linked_page option[data-lang="' + $('select#relation_lang').val() + '"]').length;
        if(count==0) {
            $('select#linked_page').parent().parent().hide();
            $('button#bsSaveLangRelation').hide();
            $('#bsNoPagesInfo').show();
        } else {
            $('select#linked_page').parent().parent().show();
            $('button#bsSaveLangRelation').show();
            $('#bsNoPagesInfo').hide();
        }
        $('select#linked_page option[data-lang!="' + $('select#relation_lang').val() + '"]').attr('disabled','disabled');
    }

    // allows to click on the select inside the dropdown without closing it
    $('.keep-open').on('click', function(e) {
        e.stopPropagation();
    });

    $('button#bsAddCSS').unbind('click').on('click',function(e) {
        var list = $('div#bsCSSFiles').clone();
        $('.modal-body').html(list);
        //$('.modal-title').text($.cattranslate('Remove plugin',undefined,undefined,'backstrap'));
        $('#tplcss').modal('show');
    });

    // ----- select variant ----------------------------------------------------
    $('input.bsVariantSave').unbind('click').on('click',function(e) {
        var _this   = this;
        var id      = $(this).data('id');
        var variant = $(this).parent().parent().find('select[name=variant]').val();
        $.ajax({
            type    : 'POST',
            url     : CAT_ADMIN_URL + '/section/save/' + id,
            dataType: 'json',
            data    : {page_id: pageID, variant: variant},
            success : function(data, status) {
                window.location.href = CAT_ADMIN_URL + '/pages/edit/' + pageID;
            }
        });
    });

    // ----- toggle visibility -------------------------------------------------
    $('div.card-header span.toggle').on('click',function() {
        $(this).parentsUntil('li').next('.card-body').toggle('slow');
        $(this).toggleClass('fa-chevron-down').toggleClass('fa-chevron-right');
    });
    $('div.card-header').on('dblclick',function() {
        $(this).next('.card-body').toggle('slow');
        $(this).find('span.toggle').toggleClass('fa-chevron-down').toggleClass('fa-chevron-right');
    });
    $('button#bsCollapseAll').on('click',function(e) {
        e.preventDefault();
        $('ul.draggable-card li.card').each(function() {
            $(this).find('.card-body').hide();
            $(this).find('span.toggle').toggleClass('fa-chevron-down').toggleClass('fa-chevron-right');
        });
    });
    $('button#bsExpandAll').on('click',function(e) {
        e.preventDefault();
        $('ul.draggable-card li.card').each(function() {
            $(this).find('.card-body').show();
            $(this).find('span.toggle').toggleClass('fa-chevron-down').toggleClass('fa-chevron-right');
        });
    });

    // ----- add section -------------------------------------------------------
    $('button#bsAddonAdd').unbind('click').on('click', function(e) {
        var addon = $('select#module option:selected').val();
        if(addon.length) {
            $.ajax({
                type    : 'POST',
                url     : CAT_ADMIN_URL + '/section/add',
                dataType: 'json',
                data    : {
                    addon  : addon,
                    block  : 1,
                    page_id: pageID
                },
                success : function(data, status) {
                    BCGrowl($.cattranslate(data.message),true);
                    if(data.success) {
                        window.location.href = CAT_ADMIN_URL + '/pages/edit/' + pageID
                    }
                }
            });
        }
    });

    // ----- delete section ----------------------------------------------------
    $('.bsDelSection').unbind('click').on('click', function(e) {
        var id = $(this).data('id');
        $('#bsDialog .modal-body').html(
            $.cattranslate('Do you really want to delete this section?',undefined,undefined,'BE') +
            '<br />' +
            $.cattranslate('ID') + ': ' + id + ' | ' + $.cattranslate('Module',undefined,undefined,'BE') + ': ' + $(this).data('module')
        );
        $('#bsDialog .modal-title').html('<i class="fa fa-fw fa-warning text-danger"></i> '+$.cattranslate('Delete section'));
        $('#bsDialog').modal('show');
        $('#bsDialog .modal-content button.btn-primary').unbind('click').on('click',function(e) {
            e.preventDefault();
            $.ajax({
                type    : 'POST',
                url     : CAT_ADMIN_URL + '/section/delete',
                dataType: 'json',
                data    : {
                    page_id   : pageID,
                    section_id: id
                },
                success : function(data, status) {
                    BCGrowl($.cattranslate(data.message),true);
                    if(data.success) {
                        window.location.href = CAT_ADMIN_URL + '/pages/edit/' + pageID
                    }
                }
            });
            $('#modal_dialog').modal('hide');
        });
    });

    // ----- recover section ---------------------------------------------------
    $('.bsRecoverSection').unbind('click').on('click', function(e) {
        var id = $(this).data('id');
        $('#bsDialog .modal-body').html(
            $.cattranslate('Do you really want to recover this section?')
        );
        $('#bsDialog .modal-title').html('<i class="fa fa-fw fa-life-saver"></i> '+$.cattranslate('Recover section'));
        $('#bsDialog').modal('show');
        $('#bsDialog .modal-content button.btn-primary').unbind('click').on('click',function(e) {
            e.preventDefault();
            $.ajax({
                type    : 'POST',
                url     : CAT_ADMIN_URL + '/section/recover/' + id,
                dataType: 'json',
                success : function(data, status) {
                    BCGrowl($.cattranslate('Success'),true);
                    if(data.success) {
                        window.location.href = CAT_ADMIN_URL + '/pages/edit/' + pageID
                    }
                }
            });
            $('#bsDialog').modal('hide');
        });
    });

    // ----- move section ------------------------------------------------------
    $('.bsMoveSection').unbind('click').on('click', function(e) {
        var dialog = $('#bsDialog').clone().detach();
        var id     = $(this).data('id');
        $(dialog).find('.modal-title').text($.cattranslate('Move section to another page'));
        $.ajax({
            type    : 'POST',
            url     : CAT_ADMIN_URL + '/pages/list',
            dataType: 'json',
            success : function(data, status) {
                var select = $('<select name="page" id="page">');
                var prefix = "|- ";
                for(index in data) {
                    var offset = prefix.repeat(data[index].level);
                    select.append('<option value="'+data[index].page_id+'"'+(data[index].page_id==pageID ? ' disabled="disabled"' : '')+'>'+offset+data[index].menu_title+'</option>');
                }
                select.appendTo($(dialog).find('.modal-body'));
                $(dialog).modal('show');
                $(dialog).find('.modal-content button.btn-primary').unbind('click').on('click',function(e) {
                    e.preventDefault();
                    var to = $(dialog).find('.modal-content select :selected').val();
                    $(dialog).modal('hide');
                    $.ajax({
                        type    : 'POST',
                        url     : CAT_ADMIN_URL + '/section/move',
                        dataType: 'json',
                        data    : {
                            page_id: pageID,
                            section_id: id,
                            to: to
                        },
                        success : function(data, status) {
                            if(data.success) {
                                if(data.message) {
                                    BCGrowl($.cattranslate(data.message));
                                }
                                window.location.href = CAT_ADMIN_URL + '/pages/edit/' + pageID
                            }
                        }
                    });
                });
            }
        });
    });

    // ----- language relations ------------------------------------------------
    $('select#relation_lang').on('focus,change', function() {
        bsChangeLangSelect();
    });
    bsChangeLangSelect(); // initial

    $('button#bsSaveLangRelation').on('click', function(e) {
        e.preventDefault();
        if($('select#linked_page option:selected').val()=="") {
            BCGrowl($.cattranslate('Please select a page to link to'));
        } else {
            $.ajax({
                type    : 'POST',
                url     : CAT_ADMIN_URL + '/pages/save',
                dataType: 'json',
                data    : $('form#bsAddPageRelation').serialize(),
                success : function(data, status) {
                    if(data.success==true) {
                        BCGrowl($.cattranslate('Success'),true);
                    } else {
                        BCGrowl(data.message);
                    }
                }
            });
        }
    });

    // ----- remove page relation ----------------------------------------------
    $('.bsUnlink').unbind('click').on('click', function(e) {
        var id = $(this).data('id');
        var _this = $(this);
        $('#bsDialog .modal-body').html(
            $.cattranslate('Do you really want to unlink the selected page?') +
            '<br />' +
            $(this).parent().next('td').next('td').text()
        );
        $('#bsDialog .modal-title').text($.cattranslate('Remove relation','','BE'));
        $('#bsDialog').modal('show');
        $('#bsDialog .modal-content button.btn-primary').unbind('click').on('click',function(e) {
            e.preventDefault();
            $('#bsDialog').modal('hide');
            $.ajax({
                type    : 'POST',
                url     : CAT_ADMIN_URL + '/pages/unlink',
                dataType: 'json',
                data    : {
                    page_id: pageID,
                    unlink: id
                },
                success : function(data, status) {
                    _this.parent().parent().remove();
                    BCGrowl($.cattranslate('Success'),true);
                }
            });
        });
    });

    // ----- add header file ---------------------------------------------------
    $('form#be_page_headerfiles').parent().hide();
    var pluginform = $('select#jquery_plugin').parent().parent();
    $('button#bsAddPlugin').unbind('click').on('click', function(e) {
        $('.modal-body').html(pluginform);
        $('.modal-title').text($.cattranslate('Add jQuery Plugin'));
        $('#modal_dialog').modal('show');
        $('.modal-content button.btn-primary').unbind('click').on('click',function(e) {
            e.preventDefault();
            $('#modal_dialog').modal('hide');
            $.ajax({
                type    : 'POST',
                url     : CAT_ADMIN_URL + '/pages/header',
                dataType: 'json',
                data    : {
                    page_id: pageID,
                    jquery_plugin: $('.modal-content select :selected').val()
                },
                success : function(data, status) {
                }
            });
        });
    });

    // ----- attach publishing date/time dialog --------------------------------
    $('.bsPublish').on('click',function(e) {

        var $this = $(this),
            id    = $this.data('id'),
            clone = bsPublishingTemplate.clone().detach(),
            modal = bsModalTemplate.clone()
            ;

        $(modal).find('.modal-body').html(clone.html());
        $(modal).find('.modal-title').text($.cattranslate('Set publishing period',undefined,undefined,'backstrap'));

        //$.datetimepicker.setLocale('de');
        $(modal).find('.modal-body input.datepicker').datetimepicker({
            defaultTime: '00:00',
            onShow:function(ct,target){
                if($(target).prop('id')=='publ_start'){
                    this.setOptions({
                        maxDate: $('input#publ_end').val() ? $('input#publ_end').val() : false
                    });
                } else {
                    this.setOptions({
                        minDate: $('input#publ_start').val() ? $('input#publ_start').val() : false
                    });
                }
            }
        });

        $(modal).find('.modal-body input.timepicker').datetimepicker({
            datepicker: false,
            mask      : true,
            format    :'H:i'
        });

        // set values
        var dateformat = $(modal).find('.modal-body input.datepicker').datetimepicker('getFormat');
        if($this.attr('data-pubstart') != 0) {
            var date = new Date($this.attr('data-pubstart')*1000);
            $(modal)
                .find('.modal-body input#publ_start')
                .val($(modal).find('.modal-body input#publ_start').datetimepicker('formatDateTime',date));
        }
        if($this.attr('data-pubend') != 0) {
            var date = new Date($this.attr('data-pubend')*1000);
            $(modal)
                .find('.modal-body input#publ_end')
                .val($(modal).find('.modal-body input#publ_end').datetimepicker('formatDateTime',date));
        }
        if($this.attr('data-timestart') != 0) {
            var date = new Date($this.attr('data-timestart')*1000);
            $(modal)
                .find('.modal-body input#publ_by_time_start')
                .val($(modal).find('.modal-body input#publ_by_time_start').datetimepicker('formatTime',date));
        }
        if($this.attr('data-timeend') != 0) {
            var date = new Date($this.attr('data-timeend')*1000);
            $(modal)
                .find('.modal-body input#publ_by_time_end')
                .val($(modal).find('.modal-body input#publ_by_time_end').datetimepicker('formatTime',date));
        }

        $(modal).find('.fa-trash').unbind('click').on('click',function() {
            $(this).prev('input').val('');
        });

        $(modal).modal('show');

        // note: the unbind() is necessary to prevent multiple execution!
        $(modal).find('.modal-content button.btn-primary').unbind('click').on('click',function(e) {
            e.preventDefault();
            var publ_start = 0,
                publ_end = 0,
                publ_by_time_start = 0,
                publ_by_time_end = 0;

            // start end end date
            if($(modal).find('.modal-content input#publ_start').val() != '') {
                publ_start = $('.modal-content input#publ_start').val();
            }
            if($(modal).find('.modal-content input#publ_end').val() != '') {
                publ_end = $(".modal-content input#publ_end").val();
            }

            // start and end time (per day)
            if(
                   $(modal).find('.modal-content input#publ_by_time_start').val() != ''
                && $(modal).find('.modal-content input#publ_by_time_start').val() != '__:__'
            ) {
                publ_by_time_start = $(".modal-content input#publ_by_time_start").val();
            }
            if(
                   $(modal).find('.modal-content input#publ_by_time_end').val() != ''
                && $(modal).find('.modal-content input#publ_by_time_end').val() != '__:__'
            ) {
                publ_by_time_end = $(".modal-content input#publ_by_time_end").val();
            }

            var dates = {
                publ_start        : publ_start,
                publ_by_time_start: publ_by_time_start,
                publ_end          : publ_end,
                publ_by_time_end  : publ_by_time_end
            };

            $(modal).modal('hide');
            $('.xdsoft_datetimepicker').remove();

            if(dates) {
                dates.section_id = id;
                $.ajax({
                    type    : 'POST',
                    url     : CAT_ADMIN_URL + '/section/publish/' + id,
                    dataType: 'json',
                    data    : dates,
                    success : function(data, status) {
                        $('span.fa-calendar[data-id="'+id+'"]')
                            .attr('data-pubstart',data.publ_start)
                            .attr('data-pubend',data.publ_end)
                            .attr('data-timestart',data.publ_by_time_start)
                            .attr('data-timeend',data.publ_by_time_end);
                        BCGrowl($.cattranslate('Successfully saved'),true);
                    }
                });
            }
        });
    });

    // ----- show options panel ------------------------------------------------
    $('.fa.fa-cogs.bsOptions').unbind('click').on('click', function(e) {
        var id = $(this).data('id');
        $(this).parent().toggleClass('bg-light');
        $('#bsOptionsPanel_'+id).toggle('slow');
    });

    $('div.card-content div.form-group.row.buttonline input.btn.btn-primary').unbind('click').on('click', function(e) {
        var id = $(this).data('id');
        $('#bsOptionsPanel_'+id).hide('slow');
    });

    // ----- save settings -----------------------------------------------------
    $('div#contents.tab-pane.active div.options-panel form button.btn.btn-primary').unbind('click').on('click', function(e) {
        e.preventDefault();
        var form = $(this).parentsUntil("form").parent();
        $.ajax({
            type    : 'POST',
            url     : CAT_ADMIN_URL + '/section/save/',
            data    : $(form).serialize(),
            dataType: 'json',
            success : function(data, status) {
                if(data.success) {
                    BCGrowl($.cattranslate(data.message),data.success);
                    window.location.href = CAT_ADMIN_URL + '/pages/edit/' + pageID;
                } else {
                    BCGrowl($.cattranslate(data.message));
                }
            }
        });
    });

    // ----- save content(s) ---------------------------------------------------
    $('div#contents.tab-pane.active button.btn.btn-primary.btn-save').unbind('click').on('click', function() {
        var _this      = this;
        var section_id = $(this).data('id');
        var page_id    = $(this).data('page');
        var card       = $(this).parent().parent();
        var data       = {
            contents: new Array(),
            page_id: page_id,
            section_id: section_id
        };

        // inline editor
        $(card).find("[contenteditable].haschanged").each(function() {
            var col     = $(this).data("col");
            var opt     = $(this).data("option");
            var content = $(this).html();
            data.contents.push({attribute:opt,column:col,content:content});
            $(this).removeClass("haschanged");
        });

        // default WYSIWYG section
        $(card).find('textarea.wysiwyg').each(function() {
            var instance = $(this).attr('name');
            data.contents.push({content:CKEDITOR.instances[instance].getData()});
        });

        if(data.contents.length==0) {
            BCGrowl($.cattranslate("No data to send"));
        } else {
            //console.log(data);
            $.ajax({
                type    : 'POST',
                url     : CAT_ADMIN_URL + '/section/save/' + section_id,
                data    : data,
                dataType: 'json',
                success : function(data, status) {
                    BCGrowl($.cattranslate(data.message),data.success);
                    if(data.success) {
                        $(card).parent().find('.bsChangedFlag').removeClass("fa-exclamation-triangle").removeClass("text-warning");
                        if(!$("[contenteditable].haschanged").length) {
                            $('span#bsGlobalChangeIndicator').removeClass("fa-exclamation-triangle").removeClass("text-warning");
                        }
                    } else {
                        $(card).parent().find('.bsChangedFlag').removeClass("text-warning").addClass("text-danger");
                    }
                }
            });
        }
    });

    // ----- Grid --------------------------------------------------------------

    if($("#bs-pagesGrid").length) {

        var grid;
        var dataView;

        var bsPageNameFormatter = function (row, cell, value, columnDef, dataContext) {
            if (value == null || value == undefined || dataContext === undefined) { return ""; }
            value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
            var spacer = "<span style='display:inline-block;margin-left:10px;height:1px;width:" + (15 * Number(dataContext["level"])-1) + "px'></span>";
            return spacer + value;
        };

        var bsVisibilityFormatter = function (row, cell, value, columnDef, dataContext) {
            return "<i class='fa fa-fw fa-"+dataContext["visibility"]+"' title='"+$.cattranslate(dataContext["visibility"])+"'></i>";
        };

        var columns = [
            {id:"#", name: "", width:30, behavior:"MoveRow", selectable:false, resizable:false, cssClass:"bsMoveSubtree"},
            {id:"page_id", name:"ID", width:40, field:"page_id"},
            {id:"menu_title", width:300, name: $.cattranslate("Menu title"), field: "menu_title", formatter: bsPageNameFormatter},
            {id:"visibility", width:40, name: $.cattranslate("Visibility"), field: "visibility", formatter: bsVisibilityFormatter},
            {id:"##", name: "", selectable:false, resizable:false}
        ];

        var options = {
            enableCellNavigation: true,
            enableColumnReorder: false,
            autosizeColsMode: 'LFF',
            autoHeight: true
        };
        $(function () {
            $.ajax({
                type    : 'GET',
                url     : CAT_ADMIN_URL + '/pages/list',
                data    : {
                    flattened: true
                },
                dataType: 'json',
                success : function(data, status) {
                    if(status=="success") {
                        dataView = new Slick.Data.DataView({ inlineFilters: true });
                        dataView.beginUpdate();
                        dataView.setItems(data,"page_id");
                        dataView.endUpdate();

                        grid = new Slick.Grid("#bs-pagesGrid", dataView, columns, options);
                        grid.setSelectionModel(new Slick.RowSelectionModel());
                        var moveRowsPlugin = new Slick.SubtreeMoveManager({
                            cancelEditOnDrag: true
                        });

                        moveRowsPlugin.onBeforeMoveRows.subscribe(function (e, data) {
                            for (var i = 0; i < data.rows.length; i++) {
                                // no point in moving before or after itself
                                if (data.rows[i] == data.insertBefore || data.rows[i] == data.insertBefore - 1) {
                                    e.stopPropagation();
                                    return false;
                                }
                            }
                            return true;
                        });

                        moveRowsPlugin.onMoveRows.subscribe(function (e, args) {
                            var extractedRows = [], left, right;
                            var rows = args.rows;
                            var insertBefore = args.insertBefore;

                            left = data.slice(0, insertBefore);
                            right = data.slice(insertBefore, data.length);

                            rows.sort(function(a,b) { return a-b; });

                            for (var i = 0; i < rows.length; i++) {
                                extractedRows.push(data[rows[i]]);
                            }

                            rows.reverse();

                            for (var i = 0; i < rows.length; i++) {
                                var row = rows[i];
                                if (row < insertBefore) {
                                    left.splice(row, 1);
                                } else {
                                    right.splice(row - insertBefore, 1);
                                }
                            }

                            data = left.concat(extractedRows.concat(right));

                            var selectedRows = [];
                            for (var i = 0; i < rows.length; i++)
                              selectedRows.push(left.length + i);

                            grid.resetActiveCell();
                            grid.setData(data);
                            grid.setSelectedRows(selectedRows);
                            grid.render();
                        });

                        moveRowsPlugin.onDragEnd.subscribe(function (e, args) {
                            window.setTimeout(function() {
                                $('#bsDialog .modal-title').html('<div class=""><i class="far fa-fw fa-question-circle"></i> '+$.cattranslate('Are you sure?')+'</div>');
                                $('#bsDialog .modal-body').html('<div class="">'+$.cattranslate("Do you want to save the new page tree?")+'</div>');
                                $('#bsDialog').modal('show');
                            },3000);
                        });

                        grid.registerPlugin(moveRowsPlugin);

                    } else {
                        BCGrowl("fail");
                    }
                }
            });
        });
    }
});

