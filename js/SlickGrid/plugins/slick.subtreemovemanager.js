(function ($) {
  // register namespace
  $.extend(true, window, {
    "Slick": {
      "SubtreeMoveManager": SubtreeMoveManager
    }
  });

  function SubtreeMoveManager(options) {
    var _grid;
    var _dataView;
    var _canvas;
    var _dragging;
    var _self = this;
    var _handler = new Slick.EventHandler();
    var _defaults = {
      cancelEditOnDrag: false,
      levelProperty: "level"
    };

    function init(grid) {
      options = $.extend(true, {}, _defaults, options);
      _grid = grid;
      _dataView = _grid.getData();
      _canvas = _grid.getCanvasNode();
      _handler
        .subscribe(_grid.onDragInit, handleDragInit)
        .subscribe(_grid.onDragStart, handleDragStart)
        .subscribe(_grid.onDrag, handleDrag)
        .subscribe(_grid.onDragEnd, handleDragEnd);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleDragInit(e, dd) {
      // prevent the grid from cancelling drag'n'drop by default
      e.stopImmediatePropagation();
    }

    function handleDragStart(e, dd) {
      var cell = _grid.getCellFromEvent(e);

      if (options.cancelEditOnDrag && _grid.getEditorLock().isActive()) {
        _grid.getEditorLock().cancelCurrentEdit();
      }

      if (_grid.getEditorLock().isActive() || !/MoveRow/.test(_grid.getColumns()[cell.cell].behavior)) {
        return false;
      }

      _dragging = true;
      e.stopImmediatePropagation();

      var selectedRows = _grid.getSelectedRows();

      if (selectedRows.length == 0 || $.inArray(cell.row, selectedRows) == -1) {
        selectedRows = [cell.row];
        _grid.setSelectedRows(selectedRows);
      }

      // select child items
      var n = 1;
      for (var i = 0; i < selectedRows.length; i++) {
        var item = _grid.getDataItem(selectedRows[i]);
        var level = item[options.levelProperty];
        var nextitem = _grid.getDataItem(selectedRows[i]+n);
        var subrows = [];
        while(nextitem && nextitem[options.levelProperty] > level) {
            subrows.push(selectedRows[i]+n);
            n++;
            nextitem = _grid.getDataItem(selectedRows[i]+n);
        }
        selectedRows = selectedRows.concat(subrows);
        _grid.setSelectedRows(selectedRows);
      }

      var rowHeight = _grid.getOptions().rowHeight;

      dd.selectedRows = selectedRows;

      dd.selectionProxy = $("<div class='slick-reorder-proxy'/>")
          .css("position", "absolute")
          .css("zIndex", "99999")
          .css("width", $(_canvas).innerWidth())
          .css("height", rowHeight * selectedRows.length)
          .appendTo(_canvas);

      dd.guide = $("<div class='slick-reorder-guide'/>")
          .css("position", "absolute")
          .css("zIndex", "99998")
          .css("width", $(_canvas).innerWidth())
          .css("top", -1000)
          .appendTo(_canvas);

      dd.insertBefore = -1;
    }

    function handleDrag(e, dd) {
      if (!_dragging) {
        return;
      }

      e.stopImmediatePropagation();

      var top = e.pageY - $(_canvas).offset().top;
      dd.selectionProxy.css("top", top - 5);

      var insertBefore = Math.max(0, Math.min(Math.round(top / _grid.getOptions().rowHeight), _grid.getDataLength()));
      if (insertBefore !== dd.insertBefore) {
        var eventData = {
          "rows": dd.selectedRows,
          "insertBefore": insertBefore
        };

        if (_self.onBeforeMoveRows.notify(eventData) === false) {
          dd.guide.css("top", -1000);
          dd.canMove = false;
        } else {
          dd.guide.css("top", insertBefore * _grid.getOptions().rowHeight);
          dd.canMove = true;
        }

        dd.insertBefore = insertBefore;
      }
    }

    function handleDragEnd(e, dd) {
      if (!_dragging) {
        return;
      }
      _dragging = false;
      e.stopImmediatePropagation();

      dd.guide.remove();
      dd.selectionProxy.remove();

      // update level
      var idProperty   = _dataView.getIdPropertyName();
      var insertAfter  = (dd.insertBefore-1);
      var parent       = _grid.getDataItem(insertAfter);
      var parent_level = parent[options.levelProperty];
      var start_level  = Number(parent_level)+1;
      var first_item   = _grid.getDataItem(dd.selectedRows[0]);
      var offset       = Number(start_level) - Number(first_item[options.levelProperty]);

      if (dd.canMove) {
        var eventData = {
          "rows": dd.selectedRows,
          "insertBefore": dd.insertBefore
        };
        dd.selectedRows.forEach(function(element) {
          var item = _grid.getDataItem(element);
          item[options.levelProperty] = (Number(item[options.levelProperty]) + offset);
          _dataView.updateItem(item[idProperty],item);
          _grid.updateRow(element);
        });

        // TODO:  _grid.remapCellCssClasses ?
        _self.onMoveRows.notify(eventData);

        $("div.slick-pane div.selected").addClass("moved").removeClass("selected");

        _self.onDragEnd.notify(eventData);
      }
    }

    $.extend(this, {
      "onBeforeMoveRows": new Slick.Event(),
      "onMoveRows": new Slick.Event(),
      "onDragEnd": new Slick.Event(),
      "init": init,
      "destroy": destroy
    });
  }
})(jQuery);