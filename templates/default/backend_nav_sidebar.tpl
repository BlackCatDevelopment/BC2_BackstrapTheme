<?php if(\CAT\Backend::getScope() == 1): ?>
{template pagetree pages}
    {foreach $pages item}
            <div class="list-group-item{if $item.children} collapsed" data-toggle="collapse" data-target="#bsMenu{$item.page_id}" aria-expanded="false"{else} leaf"{/if}>
                <span class="list-group-item-actions">
                    <div class="dropright">
                        <a class="dropdown-toggle" href="#" role="button" id="bsPageMenu{$item.page_id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cogs"></i></a>
                        <div class="dropdown-menu" aria-labelledby="bsPageMenu{$item.page_id}">
                            <a href="{$item.href}" class="list-group-link" title="{translate('Open in frontend (in new window/tab)')}" target=”_blank”><i class="fa fa-fw fa-eye"></i></a>
                            {if user_has_perm('pages_edit')}
                            <span style="border-right:1px solid #ccc;margin-right:5px"></span>
                            <a href="{$_root.CAT_ADMIN_URL}/pages/edit/{$item.page_id}" class="list-group-link" title="{translate('Edit page')}"><i class="fa fa-fw fa-edit"></i></a>
                            {/if}
                            {if user_has_perm('pages_add')}
                            <a href="{$_root.CAT_ADMIN_URL}/pages/add/{$item.page_id}" class="list-group-link bsAddPage" title="{translate('Add page before')}" data-id="{$item.page_id}" data-parent="{$item.parent}" data-pos="before"><i class="fa fa-fw fa-hand-point-up"></i></a>
                            <a href="{$_root.CAT_ADMIN_URL}/pages/add/{$item.page_id}" class="list-group-link bsAddPage" title="{translate('Add page below')}" data-id="{$item.page_id}" data-parent="{$item.parent}" data-pos="after"><i class="fa fa-fw fa-hand-point-down"></i></a>
                            {/if}
                            {if user_has_perm('pages_delete')}
                            <span style="border-right:1px solid #ccc;margin-right:5px"></span>
                            {if $item.page_visibility==5}<a href="{$_root.CAT_ADMIN_URL}/pages/recover/{$item.page_id}" class="list-group-link text-success bsRecoverPage" title="{translate('Recover')}" data-id="{$item.page_id}"><i class="fa fa-fw fa-life-saver"></i></a>{/if}
                            <a href="{$_root.CAT_ADMIN_URL}/pages/delete/{$item.page_id}" class="list-group-link text-danger bsDelPage" title="{translate('Delete page')}" data-id="{$item.page_id}"><i class="fa fa-fw fa-times-circle text-danger"></i></a>
                            {/if}
                        </div>
                    </div>
                </span>
                <i class="fa fa-fw{if $item.visibility!="public"} fa-{$item.visibility}{/if}" title="{translate('Visibility')}: {translate($item.visibility)}"></i><span class="hidden-sm-down pagename">{if $item.page_visibility==5}<p title="{translate('This page is marked as deleted')}" class="text-muted"><del>{/if}{$item.menu_title}{if $item.page_visibility==5}</p></del>{/if}</span>
            </div>
            {if $item.children}
            <div class="collapse" id="bsMenu{$item.page_id}">
            {pagetree $item.children}
            </div>
            {/if}
    {/foreach}
{/template}

{if $pageTree}
    <div class="col-md-2 col-xs-1 p-l-0 p-r-0 collapse show" id="sidebar">
        <input class="form-control" id="bsPageSearch" placeholder="{translate('Search')}..." autocomplete="off" type="search" /><br />
        <div class="list-group panel">
        {if ! $pages}
        <button class="btn btn-primary bsAddPage">
         {translate('Add page')}
        </button>
        {/if}
        {pagetree $pages}
        </div>
    </div>

    <div data-toggle="collapse" data-target="#sidebar" id="sidebar-closer" class="">
    </div>
{/if}

<?php else: ?>
    <div class="col-md-2 col-xs-1 p-l-0 p-r-0" id="sidebar">
      <div id="sidebar-closer" class="text-right"><i class="fa fa-fw fa-times"></i></div>
      <input class="form-control" id="bsPageSearch" placeholder="{translate('Search')}..." autocomplete="off" type="search" /><br />
{foreach $areas page}
    {if $page.scope_id==2 && $page.name!="administration" && $page.name!="content"}
        {if $page.level==1}
      <a class="nav-link{if $page.name==$area} active{/if}" href="{$page.href}"><i class="fa fa-fw fa-{$page.name}"></i> {translate($page.title)}</a>
        {/if}
    {/if}
{/foreach}
    </div>
    <div id="sidebar-opener" class="pt-1 pl-2"><i class="fa fa-fw fa-outdent"></i></div>
<?php endif; ?>