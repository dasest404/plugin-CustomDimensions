$(function () {

    function isActionCustomDimensionReport(params) {
        return params.module == 'CustomDimensions'
            && params.action == 'getCustomDimension'
            && params.scopeOfDimension
            && params.scopeOfDimension === 'action';
    }

    DataTable_RowActions_Transitions.registerReport({
        isAvailableOnReport: function (dataTableParams) {
            return isActionCustomDimensionReport(dataTableParams);
        },
        isAvailableOnRow: function (dataTableParams, tr) {
            return isActionCustomDimensionReport(dataTableParams) && tr.parents('table').first().hasClass('subDataTable');
        },
        trigger: function (tr, e, subTableLabel) {
            var label = this.getLabelFromTr(tr);
            if (label && label.substr(0, 1) === '@') {
                label = label.substr(1);
            }

            var subtable = tr.closest('table');
            if (subtable.is('.subDataTable')) {
                var prev = subtable.closest('tr').prev();
                var segment = prev.attr('data-segment-filter');
                if (segment) {
                    label = unescape(label);
                    if (this.transitions === null) {
                        this.transitions = new Piwik_Transitions('url', label, this, segment);
                    } else {
                        this.transitions.reset('url', label, segment);
                    }
                    this.transitions.showPopover();
                }
            }
        }
    });


    DataTable_RowActions_Overlay.registerReport({
        isAvailableOnReport: function (dataTableParams) {
            return isActionCustomDimensionReport(dataTableParams);
        },
        onClick: function (actionA, tr, e) {
            var segment;
            var link = this.getLabelFromTr(tr);
            if (link && link.substr(0, 1) === '@') {
                link = link.substr(1);
            }

            link = 'http://' + unescape(link);

            var subtable = tr.closest('table');
            if (subtable.is('.subDataTable')) {
                var prev = subtable.closest('tr').prev();
                segment = prev.attr('data-segment-filter');
            }

            return {
                link: link,
                segment: segment
            }
        }
    });

});