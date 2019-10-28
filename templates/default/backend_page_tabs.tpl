<div class="detach" id="bsPageHeader" data-page="{$page.page_id}" data-lang="{$page.language}">{translate('Page')}: {$page.menu_title} (ID: {$page.page_id})</div>
<ul class="nav nav-tabs nav-fill" role="tablist">{* Tabs *}
    <li class="nav-item">
        <a class="nav-link{if $current == 'content'} active{/if}" href="{$CAT_ADMIN_URL}/pages/edit/{$page.page_id}"><span class="fa fa-fw fa-edit"></span> {translate('Content')}</a>
    </li>
    <li class="nav-item">
        <a class="nav-link{if $current == 'relations'} active{/if}" href="{$CAT_ADMIN_URL}/pages/relations/{$page.page_id}"><span class="fa fa-fw fa-exchange-alt"></span> {translate('Relations')}</a>
    </li>
    <li class="nav-item">
        <a class="nav-link{if $current == 'settings'} active{/if}" href="{$CAT_ADMIN_URL}/pages/settings/{$page.page_id}"><span class="fa fa-fw fa-cogs"></span> {translate('Settings')}</a>
    </li>
    <li class="nav-item">
        <a class="nav-link{if $current == 'headerfiles'} active{/if}" href="{$CAT_ADMIN_URL}/pages/headerfiles/{$page.page_id}"><span class="fa fa-fw fa-file-code"></span> {translate('Header files')}</a>
    </li>
    <li class="nav-item ml-auto">
        <span id="bsGlobalChangeIndicator" class="fa fa-fw fa-2x" title="{translate('This page has unsaved changes')}" ></span>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="#help" aria-controls="help" role="tab" data-toggle="tab" title="{translate('Help')}"><span class="fa fa-fw fa-info-circle"></span> {translate('Help')}</a>
    </li>
    <li class="nav-item">
        <a class="nav-link" href="{$page.href}" target="catPreview" title="{translate('See this page in the frontend; opens a new tab or browser window')}"><span class="fa fa-fw fa-eye"></span> {translate('View')}</a>
    </li>
</ul>