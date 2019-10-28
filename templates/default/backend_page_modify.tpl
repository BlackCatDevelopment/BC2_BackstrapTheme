<div class="row flex">
  <div class="col-md-12">
    {include file="backend_page_tabs.tpl"}

    <div class="tab-content">{* Tab panes *}

{* -------------------- START #contents tab-pane -------------------- *}
      <div role="tabpanel" class="tab-pane active" id="contents">
        <div class="row">
          <div class="col-md-6">
            <button id="bsCollapseAll" class="btn btn-default btn-sm" hidden><span class="fa fa-chevron-up"></span> {translate('Collapse all')}</button>
            <button id="bsExpandAll" class="btn btn-default btn-sm" hidden><span class="fa fa-chevron-down"></span> {translate('Expand all')}</button>
          </div>
          <div class="col-md-6">
{if $addable}
            <span id="bsAddonSelect" class="float-right">
              <label for="module">{translate('Add section')}</label>
              <select name="module" id="module">
                <option value="">{translate('[Please select]')}</option>
                {foreach $addable addon}
                <option value="{$addon.addon_id}">{$addon.name}</option>
                {/foreach}
              </select>
              <button class="btn btn-primary" id="bsAddonAdd" data-page="{$page.page_id}" data-block="1">{translate('Submit')}</button>
            </span>
{/if}
          </div>
        </div>{* class=row *}

{if $blocks}
      <div class="row">
        <div class="col-md-12">
          <ul class="draggable-card">
{include backend_page_modify_card.tpl}
          </ul>
        </div>
      </div>
{else}
      <div class="row">
        <div class="col-md-12">
          <div class="alert alert-info alert-dismissible" role="alert">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            {translate('No sections were found for this page')}
          </div>
        </div>
      </div>
{/if}
      </div>{* END #contents tab-pane *}
    </div>{* END tab content *}
  </div>{* END col *}
</div>{* END row *}

<div hidden="hidden" aria-hidden="true" id="publishing">
  <p>{translate('You can set a date and time period in which this content section will be visible.')}
     {translate('Expired sections will not be deleted, but they will no longer appear in the Frontend.')}</p>
  <ul class="nav nav-tabs" role="tablist">{* Tabs *}
    <li role="presentation" class="active">
      <a href="#bsModalPeriodTab" aria-controls="bsModalPeriodTab" role="tab" data-toggle="tab">{translate('Period of time')}</a>
    </li>
    <li role="presentation">
      <a href="#bsModalTimeTab" aria-controls="bsModalTimeTab" role="tab" data-toggle="tab">{translate('Time of day')}</a>
    </li>
  </ul>
  <div class="tab-content">{* Tab panes *}
    <div role="tabpanel" class="tab-pane active" id="bsModalPeriodTab">
      <p>{translate("If a section shall be visible between two dates, put the start and end date here.")}</p>
      <div class="input-group">
        <span class="input-group-addon col-3" style="width:33%">{translate('Date from')}</span>
        <input type="text" class="form-control datepicker col-3" name="publ_start" id="publ_start" />
        <span class="input-group-addon col-3 fa fa-trash"></span>
      </div><br />
      <div class="input-group">
        <span class="input-group-addon col-3" style="width:33%">{translate('Date until')}</span>
        <input type="text" class="form-control datepicker col-3" name="publ_end" id="publ_end" />
        <span class="input-group-addon col-3 fa fa-trash"></span>
      </div><br />
    </div>
    <div role="tabpanel" class="tab-pane" id="bsModalTimeTab">
      <p>{translate("If a section shall be visible between X and Y o'clock every day, put the start and end times here.")}</p>
      <div class="input-group">
        <span class="input-group-addon col-3">{translate('Time from')}</span>
        <input type="text" class="form-control timepicker col-3" name="publ_by_time_start" id="publ_by_time_start" />
        <span class="input-group-addon col-3">{translate('Time until')}</span>
        <input type="text" class="form-control timepicker col-3" name="publ_by_time_end" id="publ_by_time_end" />
      </div>
    </div>{* end #bsModalTimeTab tab *}
  </div>{* end class tab-content *}
</div>{* end hidden div *}

{include(file='backend_info_about_variants.tpl')}