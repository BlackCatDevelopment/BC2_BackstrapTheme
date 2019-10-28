  <header>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark" id="bsTop">
      <a class="navbar-brand" href="{$CAT_ADMIN_URL}/dashboard">BlackCat CMS {$CAT_VERSION}</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarMainContent" aria-controls="navbarMainContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="navbar-collapse collapse" id="navbarMainContent">
        {* menu(1) *}
<?php $this->scope["contentmenu"] = \CAT\Backend::getMenuForScope(1); if(\CAT\Backend::getScope() == 1): $this->scope["contentactive"] = true; endif; ?>
        <div class="btn-group mr-2">
          <button type="button" class="btn btn-{if $contentactive!=true}outline-{/if}secondary">{translate('Content')}</button>
          <button type="button" class="btn btn-{if $contentactive!=true}outline-{/if}secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="sr-only">Toggle Dropdown</span>
          </button>
          <div class="dropdown-menu">
            {foreach $contentmenu page}{if $page.name!='administration'}
            <a class="dropdown-item nav-link" href="{$page.href}"><i class="fa fa-fw fa-{$page.name}"></i> {translate($page.title)}</a>
            {/if}{/foreach}
          </div>
        </div>
<?php $this->scope["adminmenu"] = \CAT\Backend::getMenuForScope(2) ?>
        <div class="btn-group">
          <button type="button" class="btn btn-{if $contentactive==true}outline-{/if}secondary">
            <a href="{$CAT_ADMIN_URL}/administration">{translate('Administration')}</a>
          </button>
          
        </div>


        <ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex">
          <li class="nav-item dropdown">
            <a class="nav-item nav-link dropdown-toggle mr-md-2" id="bsUserDropdown" data-toggle="dropdown" title="{cat_username()}" href="#" aria-haspopup="true" aria-expanded="false">
              <i class="fa fa-user fa-fw"></i> {cat_username()}
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="bsUserDropdown">
              <a href="#" class="dropdown-item active"><i class="fa fa-user fa-fw"></i> {translate('User Profile')}</a>
              <a href="{$CAT_ADMIN_URL}/logout/" class="dropdown-item"><i class="fa fa-sign-out fa-fw"></i> {translate('Logout')}</a>
            </div>
          </li>
        </ul>{* /.navbar-top-links *}
      </div>{* /.navbar-collapse *}
    </nav>
  </header>
