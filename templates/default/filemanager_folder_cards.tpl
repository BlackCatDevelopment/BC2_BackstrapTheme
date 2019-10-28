                    <div class="card-deck FolderCards">
                    {foreach $subfolders f data}
                        <div class="card file mb-2" title="{$f}">
                            <div class="card-header">
                                <a href="{$CAT_ADMIN_URL}/media/index/folder/{$f}" class="folder" data-name="{$f}">
                                    <img src="{$CAT_URL}/templates/backstrap/images/folder_{if $f==$currentFolder}green{else}blue{/if}.png" />
                                    {$f}
                                </a>
                            </div>
                            <div class="filename card-body container">
                                <div class="row">
                                    <div class="col-8">{translate('Folders')}:</div>
                                    <div class="col">{$data.dirs}</div>
                                </div>
                                <div class="row">
                                    <div class="col-8">{translate('Files')}:</div>
                                    <div class="col">{$data.files}</div>
                                </div>
                                <div class="row">
                                    <div class="col-8">{translate('Total size')}:</div>
                                    <div class="col">{$data.size}</div>
                                </div>
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