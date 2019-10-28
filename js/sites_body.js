$(function() {
    $('button#bsSiteFormShow').unbind('click').bind('click',function(e) {
        // remove buttons from form
        $("#bsSiteForm .form-group.row.buttonline").remove();
        $("#bsSiteForm legend").remove();
        $('#bsSiteForm').modal('show');
        var _this = $(this);
        $("#bsSiteForm .modal-content button.btn-primary").unbind("click").on("click",function(e) {
            e.preventDefault();
            $.ajax({
                type    : "POST",
                url     : CAT_ADMIN_URL+"/sites/add/",
                dataType: "json",
                data    : $("#bsSiteForm form").serialize(),
                success : function(data, status) {
                    if(data.success==true) {
                        $("#bsSiteForm").modal("hide");
                        BCGrowl($.cattranslate('Success'),data.success);
                        window.location.href = CAT_ADMIN_URL + "/sites";
                    } else {
                        $("#bsSiteForm .modal-body").html(data.message);
                        $("#bsSiteForm .form-group.row.buttonline").remove();
                        $("#bsSiteForm legend").remove();
                    }
                }
            });
        });
    });
});