<?php
    // scope content = show page tree
    if(\CAT\Backend::getScope() == 1):
?>

{template pagetree pages}
    {foreach $pages item}
            <div class="list-group-item{if $item.children} collapsed" data-toggle="collapse" data-target="#bsMenu{$item.page_id}" aria-expanded="false"{else} leaf"{/if}>
                <span class="list-group-item-actions">
                    <div class="dropright">
                        <a class="dropdown-toggle" href="#" role="button" id="bsPageMenu{$item.page_id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cogs"></i></a>
                        <div class="dropdown-menu shadow" aria-labelledby="bsPageMenu{$item.page_id}">
                            <div class="btn-toolbar" role="toolbar" aria-label="{translate('Page context toolbar')}">
                                <div class="btn-group btn-group-sm mr-2" style="display: flex;" role="group" aria-label="{translate('View')}">
                                    <a href="{$item.href}" target="_blank" role="button" class="btn btn-secondary" title="{translate('Open in frontend (in new window/tab)')}"><i class="fa fa-fw fa-eye"></i></a>
                                </div>
                                <div class="btn-group btn-group-sm mr-2" role="group" aria-label="{translate('Edit')}">
        {if user_has_perm('pages_edit')}
                                    <a href="{$_root.CAT_ADMIN_URL}/pages/edit/{$item.page_id}" role="button" class="btn btn-secondary" title="{translate('Edit page')}"><i class="fa fa-fw fa-edit"></i></a>
        {/if}
        {if user_has_perm('pages_add')}
                                    <a href="{$_root.CAT_ADMIN_URL}/pages/add/{$item.page_id}" role="button" class="btn btn-secondary bsAddPage" title="{translate('Add page before')}" data-id="{$item.page_id}" data-parent="{$item.parent}" data-pos="before"><i class="fa fa-fw fa-hand-point-up"></i></a>
                                    <a href="{$_root.CAT_ADMIN_URL}/pages/add/{$item.page_id}" role="button" class="btn btn-secondary bsAddPage" title="{translate('Add page below')}" data-id="{$item.page_id}" data-parent="{$item.parent}" data-pos="after"><i class="fa fa-fw fa-hand-point-down"></i></a>
        {/if}
                                </div>
        {if user_has_perm('pages_delete')}
                                <div class="btn-group btn-group-sm mr-2" role="group" aria-label="{translate('Edit')}">
            {if $item.page_visibility==5}
                                    <a href="{$_root.CAT_ADMIN_URL}/pages/recover/{$item.page_id}" role="button" class="btn btn-secondary bsRecoverPage" title="{translate('Recover')}" data-id="{$item.page_id}"><i class="fa fa-fw fa-life-saver"></i></a>
            {/if}
                                    <a href="{$_root.CAT_ADMIN_URL}/pages/delete/{$item.page_id}" role="button" class="btn btn-secondary bsDelPage" title="{translate('Delete page')}" data-id="{$item.page_id}"><i class="fa fa-fw fa-trash text-danger"></i></a>
        {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                </span>
                <a href="#" data-toggle="collapse" data-target="bsMenu{$item.page_id}"><i class="fa fa-fw {if $item.children}fa-caret-right{/if}"></i></a>
                <span class="hidden-sm-down pagename{if $item.page_visibility==5} text-muted" title="{translate('This page is marked as deleted')}{/if}">
                    <a href="{$_root.CAT_ADMIN_URL}/pages/edit/{$item.page_id}">{$item.menu_title}</a>
                </span>
            </div>
        {if $item.children}
            <div class="collapse list-group-item" id="bsMenu{$item.page_id}">
            {pagetree $item.children}
            </div>
        {/if}
    {/foreach}
{/template}

<?php endif; ?>

    <div class="col-md-2 col-xs-1 pl-0" id="sidebar">
        <div class="row">
             <div class="col-12 btn-group btn-group-sm" role="group">
                <div id="bsSearch" role="button" title="{translate('Toggle search field')}" class="btn btn-secondary"><i class="fa fa-fw fa-search"></i></div>
                <div id="sidebar-opener" role="button" title="{translate('Show sidebar')}" class="btn btn-secondary"><i class="fa fa-fw fa-indent"></i></div>
                <div id="sidebar-closer" role="button" title="{translate('Hide sidebar')}" class="btn btn-secondary"><i class="fa fa-fw fa-outdent"></i></div>
            </div>
        </div>
        <div class="row mt-2" id="bsSearchField" style="display:none">
            <div class="col-12 input-group mb-3">
                <input type="text" class="form-control" id="bsPageSearch" placeholder="{translate('Search')}..." autocomplete="off" type="search" aria-label="{translate('Search')}" />
                <div class="input-group-append">
                    <button id="bsSearchClear" class="btn btn-secondary" type="button" title="{translate('Reset (clear) field')}"><i class="fa fa-fw fa-times"></i></button>
                </div>
            </div>
        </div>
        <div class="list-group panel">
<?php
    // scope content = show page tree
    if(\CAT\Backend::getScope() == 1):
?>
{if $pageTree}
    {if ! $pages}
            <button class="btn btn-primary bsAddPage">{translate('Add page')}</button>
    {/if}
            {pagetree $pages}
        </div>
{/if}

<?php else: ?>

{foreach $areas page}
    {if $page.scope_id==2 && $page.name!="administration" && $page.name!="content"}
        {if $page.level==1}
        <div class="list-group-item leaf">
            <a class="nav-link{if $page.name==$area} active{/if}" href="{$page.href}"><i class="fa fa-fw fa-{$page.name}"></i> {translate($page.title)}</a>
        </div>
        {/if}
    {/if}
{/foreach}
    </div>
    <?php endif; ?>
</div>