    <div class="filemng">
        <div class="card">
            <div class="card-header">
                <img height="32" alt="" src="{$CAT_URL}/templates/backstrap/images/folder_blue.png" width="32">
                <span id="tdName" class="ActualFolder">
                {if ! $isRoot}/<a href="{$CAT_ADMIN_URL}/media/index"><i>Home</i></a>{/if}
                {if $currentPath}{$path=''}{foreach $currentPath f}{$path.="/"}{$path.=$f}
                /<a href="{$CAT_ADMIN_URL}/media/index{$path}">{$f}</a>
                {/foreach}{/if}</span>
            </div>
            <div class="card-body pb-filemng-panel-body row">

                <div class="col-sm-3 col-md-2 FolderArea">
                {if ! $isRoot}
                    <a href="{$CAT_ADMIN_URL}/media/index/{$parent}">
                        <img alt="" src="{$CAT_URL}/templates/backstrap/images/folder_blue.png" width="20" height="20" border="0"> ..
                    </a><br />
                {/if}
                {if $subfolders}
                {foreach $subfolders f data}
                    <a href="{$CAT_ADMIN_URL}/media/index/{$data.folder}" title="{translate('Click to open folder')}">
                        <img alt="{translate('Folder icon')}" src="{$CAT_URL}/templates/backstrap/images/folder_{if $f==$currentFolder}green{else}blue{/if}.png" width="20" height="20" border="0">
                        {$data.name}
                    </a><br />
                {/foreach}
                {/if}
                </div>

                <div class="col-sm-9 col-md-10 container">
                {if $folders}
                    <div class="input-group">
                        <div class="input-group-prepend">
                          <div class="input-group-text"><img alt="" src="{$CAT_URL}/templates/backstrap/images/folder_blue.png" width="20" height="20" border="0"></div>
                        </div>
                        <select class="form-control">
                            {foreach $folders f}
                            <option value="{$f}">{$f}</option>
                            {/foreach}
                        </select>
                    </div>
                {/if}

                {if $files}
                    <div class="card-deck mt-2 FileCards">
                    {foreach $files f data}
                        <div class="card mb-2">
                            <div class="card-header">
                                <div class="row">
                                    <div class="col-2"><img src="{$CAT_URL}/templates/backstrap/images/file.png" style="width:16px" /></div>
                                    <div class="col">{if $data.mime_type}{$data.mime_type}{/if}</div>
                                    <div class="col-2"><i class="fa fa-fw fa-trash"></i></div>
                                </div>
                            </div>

                            <div class="card-body">
                                <a href="{$data.url}">
                                {if $data.image == true}
                                    <img class="card-img-top" src="{$data.url}" />
                                {else}
                                    <div class="filetype {$data.filetype}"></div>
                                {/if}
                                    <span class="caption">
                                    {translate('Filename')}:<br />{$f}
                                    </span>
                                </a>
                            </div>

                            <div class="card-footer">
                                <small class="text-muted">
                                    {$data.hfilesize}
                                    {if $data.resolution_x} | <span title="{translate('Dimensions')}">{$data.resolution_x} x {$data.resolution_y}</span>{/if}
                                </small>
                            </div>
                        </div>
                        {if $.foreach.default.iteration % 2 == 0}
                        <div class="w-100 d-none d-sm-block d-md-none"><!-- wrap every 2 on sm--></div>
                        {/if}{if $.foreach.default.iteration % 3 == 0}
                        <div class="w-100 d-none d-md-block d-lg-none"><!-- wrap every 3 on md--></div>
                        {/if}{if $.foreach.default.iteration % 4 == 0}
                        <div class="w-100 d-none d-xl-block"><!-- wrap every 4 on lg--></div>
                        {/if}
                    {/foreach}
                    </div>
                {else}
                <br /><i>{translate('No files')}</i>
                {/if}
                </div>
            </div>
        </div>
    </div>

<!--
files (array):
12508803_1695055897443354_5488451947572868016_n.jpg (array):
mime_type = 'image/jpeg'
filesize = 34027
bits_per_sample = 24
resolution_x = 454
resolution_y = 468
encoding = 'UTF-8'
error = null
warning = null
hfilesize = '33.23 KB'
moddate = '25.01.2016 10:13'
image = true
url = 'http://localhost:444/site1/media/12508803_1695055897443354_5488451947572868016_n.jpg'
-->