<!DOCTYPE html>
<html lang="{$LANGUAGE}">
<head>
    {get_page_headers()}
</head>
<body class="">
    <h1 class="sr-only">BlackCat CMS {$CAT_VERSION} Administration</h1>
    {include file='backend_nav_top.tpl'}
    <div class="container-fluid h-100">
        <div class="row h-100">
            {include file='backend_nav_sidebar.tpl'}
            <main role="main" class="col p-0 m-0">
                <nav aria-label="breadcrumb" role="navigation" class="breadcrumb">
                  {menu(2)}
                </nav>