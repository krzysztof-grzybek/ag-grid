<?php
$pageTitle = "Master Detail: Other";
$pageDescription = "Other items related to the Master / Detail feature";
$pageKeywords = "ag-grid javasript grid table master detail";
$pageGroup = "feature";
include '../documentation-main/documentation_header.php';
?>

<h1 class="heading-enterprise">Master / Detail - Other</h1>

<p class="lead">
    This section describes...
</p>



<h2>Syncing Detail Scrolling with Master</h2>

<p>
    By default, detail grids scroll independently to the master grid. This happens because the Master Detail is
    rendered inside the <a href="/javascript-grid-full-width-rows"> Full Width Row</a> (an element that spans across
    the Grid Viewport).
</p>

<p>
    To force this full width row to fill the Grid scrollable area, it is necessary to enable the
    <code>embedFullWidthRows</code> property.
</p>

<p>
    In the example below, notice that horizontal scrolling from within the detail grid also scrolls the master:
</p>

<?= grid_example('Detail scrolls with Master', 'detail-scrolls-with-master', 'generated', ['enterprise' => true, 'exampleHeight' => 525, 'modules'=>['clientside', 'masterdetail', 'menu', 'columnpanel']]) ?>



<h2>Filtering and Sorting</h2>

<p>
    There are no specific configurations for filtering and sorting with Master / Detail but as there are multiple grids
    each grid will filter and sort independently.
</p>

<p>
    Below shows a simple Master / Detail setup which has filtering and sorting enabled in both master and detail grids.
</p>

<?= grid_example('Filtering with Sort', 'filtering-with-sort', 'generated', ['enterprise' => true, 'exampleHeight' => 550, 'modules'=>['clientside', 'masterdetail', 'menu', 'setfilter', 'columnpanel', 'filterpanel']]) ?>



<h2>Exporting Master / Detail Data</h2>

<p>
    By default, exporting the master grid will just export the master rows. If you want to export detail rows, you can
    configure the <code>getCustomContentBelowRow</code> callback to generate a representation of the detail row that will
    be inserted below the master rows in the in the export. See the
    <a href="../javascript-grid-export/">export documentation</a> for more details.
</p>

<p>
    There is an important difference between rendering and exporting Master / Detail content. When you expand a master
    row in the UI, a new instance of the Grid is created to render the detail, meaning that you have the full power of
    the Grid to sort, filter and format the detail data.
</p>
<p>
    When exporting, the original data object representing
    the row is passed to <code>getCustomContentBelowRow</code> which returns styled content to be inserted into the
    export. No instance of the Grid is created. This means that export performance is good even with large Master /
    Detail data sets. However, if your <code>detailGridOptions</code> contains value getters, value formatters,
    sorting, filtering etc, and you want these to appear in the export, they must be applied by
    <code>getCustomContentBelowRow</code>.
</p>

<note>
    Since detail grids are full Grid instances, triggering an export through the right-click context menu on
    a detail grid will do a normal export for the detail grid only. If this is not appropriate for your application
    you can disable the export item in the context menu, or replace it with a custom item that triggers an export on
    the master grid.
</note>

<p>
    The example below demonstrate how both master and detail data can be exported.
</p>

<?= grid_example('Exporting Master / Detail Data', 'exporting', 'generated', ['enterprise' => true, 'exampleHeight' => 550, 'modules'=>['clientside', 'masterdetail', 'menu', 'columnpanel', 'clipboard', 'excel']]) ?>


<?php include '../documentation-main/documentation_footer.php';?>
