{if $edit_site_form}
    <div class="alert alert-info">
        {translate('Please note: You cannot change the folder and site name settings here. This is by design.')}
    </div>
    {$edit_site_form}
{else}
        <table class="table">
            <thead>
                <tr>
                    <th>{* icons column *}</th>
                    <th>{translate('Site ID')}</th>
                    <th>{translate('Name')}</th>
                    <th>{translate('Basedir')}</th>
                    <th>{translate('Subfolder')}</th>
                    <th>{translate('Size')}</th>
                    {if user_has_perm('users_list')}<th>{translate('Owner')}</th>{/if}
                </tr>
            </thead>
            <tbody>
            {foreach $sites site}
                <tr>
                    <td>
{if user_has_perm('sites_edit')}<a href="{$CAT_ADMIN_URL}/sites/edit/{$site.site_id}"><i class="fa fa-edit"></i></a>{/if}
                    </td>
                    <td>{$site.site_id}</td>
                    <td>{$site.site_name}</td>
                    <td>{if $site.site_basedir}{$site.site_basedir}{else}<i>default</i>{/if}</td>
                    <td>{$site.site_folder}</td>
                    <td>{$site.asset_size}</td>
                    {if user_has_perm('users_list')}<td>{$site.username}</td>{/if}
                </tr>
            {/foreach}
            </tbody>
        </table>

{if user_has_perm('sites_add')}
        <button class="btn btn-primary" id="bsSiteFormShow">
          {translate('Create site')}
        </button>
{/if}
        <div class="modal fade" id="bsSiteForm" tabindex="-1" role="dialog" aria-labelledby="bsSiteFormLabel">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title" id="bsSiteFormLabel">{translate('Create site')}</h2>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                {$new_site_form}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">{translate('Cancel & close')}</button>
                <button type="button" class="btn btn-primary">{translate('Confirm')}</button>
              </div>
            </div>
          </div>
        </div>
{/if}