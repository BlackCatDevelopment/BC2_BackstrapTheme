        <table class="table dtable">
            <thead>
                <tr>
                    <th>{* icons column *}</th>
                    <th>{translate('Type')}</th>
                    <th>{translate('Description')}</th>
                    <th>{translate('Menus of this type')}</th>
                </tr>
            </thead>
            <tbody>
            {foreach $menus index item}
                <tr>
                    <td></td>
                    <td><a href="{$CAT_ADMIN_URL}/menus/edit/{$item.0.menu_id}">{$item.0.type_name}</a></td>
                    <td>{translate($item.0.description)}</td>
                    <td>
{foreach $item m}
                    {$m.info}<br />
{/foreach}
                    </td>
                </tr>

            {/foreach}
            </tbody>
        </table>


{* get the name of the language file; allows to check if it exists *}
{$file = cat('modules/lib_javascript/plugins/jquery.datatables/i18n/',lower($LANGUAGE),'.json')}
<script type="text/javascript">
//<![CDATA[
    $(function() {
        CAT_ASSET_URL = "{cat_asset_url($file,'js')}";
    });
//]]>
</script>
