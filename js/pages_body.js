$(function() {

    var pageID = $('#bsPageHeader').data('page');

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

    if($("#bs-pagesGrid").length) {

        var grid;
        var dataView;

        var bsPageNameFormatter = function (row, cell, value, columnDef, dataContext) {
            if (value == null || value == undefined || dataContext === undefined) { return ""; }
            value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
            var spacer = "<span style='display:inline-block;margin-left:10px;height:1px;width:" + (15 * dataContext["level"]-1) + "px'></span>";
            return spacer + value;
        };

        var bsVisibilityFormatter = function (row, cell, value, columnDef, dataContext) {
            return "<i class='fa fa-fw fa-"+dataContext["visibility"]+"' title='"+$.cattranslate(dataContext["visibility"])+"'></i>";
        };

        var columns = [
            {id:"#", name: "", width:30, behavior:"MoveRow", selectable:false, resizable:false, cssClass:"bsMoveSubtree"},
            {id:"page_id", name:"ID", width:40, field:"id"},
            {id:"menutitle", width:300, name: $.cattranslate("Menu title"), field: "value", formatter: bsPageNameFormatter},
            {id:"visibility", width:40, name: $.cattranslate("Visibility"), field: "visibility", formatter: bsVisibilityFormatter},
            {id:"##", name: "", selectable:false, resizable:false}
        ];

        var options = {
            enableCellNavigation: true,
            enableColumnReorder: false,
            forceFitColumns: true,
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
                        dataView.setItems(data,"id");
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
                                $('#bsDialog .modal-body').html('<div class="">'+$.cattranslate("Do you want so save the new page tree?")+'</div>');
                                $('#bsDialog').modal('show');
                            },5000);
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

