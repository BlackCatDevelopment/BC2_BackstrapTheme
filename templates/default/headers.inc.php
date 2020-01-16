<?php

/**
 *
 *   @author          Black Cat Development
 *   @copyright       Black Cat Development
 *   @link            https://blackcat-cms.org
 *   @license         http://www.gnu.org/licenses/gpl.html
 *   @category        CAT_Core
 *   @package         backstrap
 *
 */

$debug = true;

$pg = \CAT\Helper\Page::getInstance();

/*
$bootstrapcss = 'CAT/vendor/twbs/bootstrap/dist/css/bootstrap.min.css';

$variant      = \CAT\Registry::get('DEFAULT_THEME_VARIANT');
if ($variant!='' && $variant!='default') {
    $bootstrapcss = 'CAT/vendor/thomaspark/bootswatch/dist/'.$variant.'/bootstrap.min.css';
}
*/

$bootstrapcss = 'templates/backstrap/css/darkmode/css/theme.css';
$variant = \CAT\Registry::get('DEFAULT_THEME_VARIANT');
if ($variant!='') {
    $bootstrapcss = 'templates/backstrap/css/'.$variant.'/css/theme.css';
}

if (\CAT\Backend::getArea()!=='login') {
    $mod_headers = array(
        'backend' => array(
            'meta' => array(
                array( 'charset' => (defined('DEFAULT_CHARSET') ? DEFAULT_CHARSET : "utf-8") ),
                array( 'http-equiv' => 'X-UA-Compatible', 'content' => 'IE=edge' ),
                array( 'name' => 'viewport', 'content' => 'width=device-width, initial-scale=1' ),
                array( 'name' => 'description', 'content' => 'BlackCat CMS - '.$pg->lang()->translate('Administration') ),
            ),
            'css' => array(
                array('file'=>'CAT/vendor/fortawesome/font-awesome/css/all.min.css',),
                array('file'=>$bootstrapcss,),
                array('file'=>'modules/lib_javascript/plugins/tippy/1.4.1/tippy.css'),
                array('file'=>'templates/backstrap/css/jquery-ui.theme.css',),
                array('file'=>'templates/backstrap/js/datetimepicker/jquery.datetimepicker.min.css',),
                array('file'=>'modules/lib_javascript/plugins/jquery.datatables/css/dataTables.bootstrap4.min.css',),
                array('file'=>'templates/backstrap/js/bootstrap4-editable/css/bootstrap-editable.css',),
                array('file'=>'templates/backstrap/css/default/sidebar.css',),
            ),
            'jquery' => array(
                'core'    => true,
                'ui'      => true,
                'plugins' => array('jquery.cattranslate','jquery.cookies','jquery.mark'),
            ),
            'js' => array(
                array(
                    'condition' => 'lt IE 9',
                    'files' => array(
                        'https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js',
                        'https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js',
                    ),
                ),
            )
        )
    );

    if ($debug) {
        $mod_headers['backend']['js'][] = 'templates/backstrap/js/debug.js';
    }

    if (file_exists(CAT_JS_PATH.'/jquery-ui/ui/i18n/jquery-ui-i18n.min.js')) {
        $mod_headers['backend']['js'][] = 'modules/lib_javascript/jquery-ui/ui/i18n/jquery-ui-i18n.min.js';
    }

    $file_to_find = \CAT\Helper\Directory::sanitizePath(
        CAT_ENGINE_PATH.'/modules/lib_javascript/plugins/jquery.datatables/i18n/'.strtolower(\CAT\Base::lang()->getLang()).'.json'
    );
    if (file_exists($file_to_find)) {
        $mod_headers['backend']['javascript'][] = 'CAT_ASSET_URL = "'.\CAT\Helper\Validate::path2uri($file_to_find).'";';
    }

    if (\CAT\Backend::getArea() == 'media') {
        $mod_headers['backend']['js'][]  = 'templates/backstrap/js/bootstrap.lightbox/ekko-lightbox.min.js';
        $mod_headers['backend']['css'][] = array('file'=>'modules/lib_javascript/plugins/jquery.fileupload/css/jquery.fileupload-ui.css');
        $mod_headers['backend']['js'][]  = 'modules/lib_javascript/plugins/jquery.datatables/js/jquery.dataTables.min.js';
    }

    if (\CAT\Backend::getArea() == 'admintools') {
        $mod_headers['backend']['js'][] = 'templates/backstrap/js/dashboard.js';
    }

    if (\CAT\Backend::getArea() == 'roles') {
        $mod_headers['backend']['css'][] = array('file'=>'modules/lib_javascript/plugins/jquery.fancytree/skin-lion/ui.fancytree.min.css');
    }

    if (\CAT\Backend::getArea() == 'pages') {
        $mod_headers['backend']['js'][] = 'templates/backstrap/js/SlickGrid/lib/jquery.event.drag-2.3.0.js';
        $mod_headers['backend']['js'][] = 'templates/backstrap/js/SlickGrid/slick.core.js';
        $mod_headers['backend']['js'][] = 'templates/backstrap/js/SlickGrid/slick.formatters.js';
        $mod_headers['backend']['js'][] = 'templates/backstrap/js/SlickGrid/slick.grid.js';
        $mod_headers['backend']['js'][] = 'templates/backstrap/js/SlickGrid/slick.dataview.js';
        $mod_headers['backend']['js'][] = 'templates/backstrap/js/SlickGrid/plugins/slick.rowselectionmodel.js';
        $mod_headers['backend']['js'][] = 'templates/backstrap/js/SlickGrid/plugins/slick.subtreemovemanager.js';
        $mod_headers['backend']['css'][] = array('file'=>'templates/backstrap/js/SlickGrid/slick.grid.css');
    }
} else {
    $mod_headers = array(
        'backend' => array(
            'meta' => array(
                array( 'charset' => (defined('DEFAULT_CHARSET') ? DEFAULT_CHARSET : "utf-8") ),
                array( 'http-equiv' => 'X-UA-Compatible', 'content' => 'IE=edge' ),
                array( 'name' => 'viewport', 'content' => 'width=device-width, initial-scale=1' ),
                array( 'name' => 'description', 'content' => 'BlackCat CMS - '.$pg->lang()->translate('Administration') ),
            ),
            'css' => array(
                array('file'=>'CAT/vendor/fortawesome/font-awesome/css/all.min.css',),
                array('file'=>$bootstrapcss,),
            ),
            'jquery' => array(
                'core'    => true,
            ),
            'js' => array(
                array(
                    'condition' => 'lt IE 9',
                    'files' => array(
                        'https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js',
                        'https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js',
                    ),
                ),
            )
        )
    );
}
