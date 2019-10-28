<br />
{if $errors}
      <div class="alert alert-danger">
          Todo: Ordentliche Fehlerausgabe<br />
          <?php var_export($errors) ?>
      </div>

{/if}
{if !$modules}
      <div class="alert alert-info">
          {translate('Nothing to show')}
      </div>
{else}
{if $current=="catalog"}
<div class="float-right">
    {translate('Your catalog version')}: {$version}
    <button id="bsAddonsCatalog" class="btn btn-sm btn-primary">{translate('Update the catalog')}</button>
</div>
{/if}
      <table class="table compact">
        <thead>
          <tr>
            <th>{translate('Type')}</th>
            <th>{translate('Name')}</th>
            <th>{translate('Description')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
{if $type=='notinstalled'}{$modules=$notinstalled}{/if}
{foreach $modules module}
          <tr class="type_{$module.type}">
            <td class="bs-module-type" data-search="{$module.type}s">
                <span class="fa fa-fw fa-{$module.type}" title="{translate(ucfirst($module.type))}"></span>
                {if $module.warn}<i class="fa fa-exclamation-triangle"></i>{/if}
            </td>
            <td class="bs-module-name">
              <p><strong>{$module.name}</strong></p>
              <span class="small">
          {if $module.is_installed || $module.installed}
              {if $current!='catalog'}
              <a href="#" class="btn btn-sm btn-danger{if $module.removable != 'Y'} disabled{/if}"><span class="fa fa-remove"></span> {translate('Uninstall')}</a>
              {else}
              {if $module.upgradable}
              <a href="#" class="btn btn-sm btn-warning"><span class="fa fa-check"></span> {translate('Upgrade')}</a>
              {else}
              <i class="fa fa-check text-success"></i> {translate('Up to date')}
              {/if}
              {/if}
          {else}
              {if user_has_perm('addon_install') && not $module.warn}
              <a href="{$CAT_ADMIN_URL}/addons/install/{$module.type}/{$module.directory}" class="btn btn-sm btn-success"><span class="fa fa-plus"></span> {translate('Install')}</a>
              {/if}
          {/if}
              </span>
            </td>
            <td class="bs-module-desc">
              {if $module.description}<p>{$module.description}</p>{/if}
              {if $module.warn}<span class="alert alert-warning">{$module.warn}</span>{/if}
              <span class="small">
                <strong>{translate('Version')}:</strong> {if $module.version}{$module.version}{else}<i>n/a</i>{/if}
                {if $module.author} | <strong>{translate('By')}:</strong> {$module.author}{/if}
                {if $module.license} | <strong>{translate('License')}:</strong> {$module.license}{/if}
                {if $module.install_date} | <strong>{translate('Installed')}:</strong> {$module.install_date}{/if}
                {if $type!='notinstalled' && $module.removable == 'N'} | <span class="text-warning">{translate('You cannot uninstall this module as it is protected')}</span>{/if}
              </span>
            </td>
            <td>{if $module.icon}<img src="{$module.icon}" alt="Icon" />{/if}</td>
          </tr>
{/foreach}
        </tbody>
      </table>
{/if}
