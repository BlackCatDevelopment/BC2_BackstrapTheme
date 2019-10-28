$(function() {
    $('select#filter').on('change', function () {
        var filter = $(this).val();
        filter = filter.substring(0, filter.length - 1);
        $("table.table tbody tr").show();
        if(filter.length>0) {
            $("table.table tbody tr:not('.type_"+filter+"')").hide();
        }
    });
    $('button#bsAddonsCatalog').unbind('click').on('click', function(e) {
        $.ajax({
            type    : "GET",
            url     : CAT_ADMIN_URL+"/addons/catalog/update",
            dataType: "json",
            success : function(data, status) {
                BCGrowl('Success',true);
                if(data.success) {
                    window.location.href = CAT_ADMIN_URL + '/addons/catalog';
                }
            }
        });
    });
});