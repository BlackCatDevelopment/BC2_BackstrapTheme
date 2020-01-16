{include file='backend_addons_tabs.tpl'}

<div class="alert alert-info mt-2">
    {translate('You can upload and install an addon from a zip file here. Please check if the addon is suitable for BC2 before uploading.')}
</div>

{if $error}
<div class="alert alert-danger">
    {$error}
</div>
{/if}

{if $success}
<div class="alert alert-success">
    {$success}
</div>
{/if}

<form action="{$CAT_ADMIN_URL}/addons/upload" enctype="multipart/form-data" id="upload_addon" method="post">
    <input type="file" name="upload_file" />
    <input type="submit" name="upload" value="{translate('Upload and install')}" class="btn btn-primary" />
</form>
