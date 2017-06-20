(function (WorkbookApp, $) {

    setWorksheetSize = function (noOfRows, noOfCols) {
        for (var i = 0; i <= noOfRows; i++) {
            var row = document.querySelector("#workbookTable").insertRow(-1);
            for (var j = 0; j <= noOfCols; j++) {
                var letter = String.fromCharCode("A".charCodeAt(0) + j - 1);
                row.insertCell(-1).innerHTML = i && j ? "<input class='workBookCell' id='" + letter + i + "'/>" : i || letter;
            }
        }
    }

    setControls = function () {


        var DATA = {}, INPUTS = [].slice.call(document.querySelectorAll("input.workBookCell"));
        INPUTS.forEach(function (elm) {
            elm.onfocus = function (e) {
                e.target.value = localStorage[e.target.id] || "";
            };
            elm.onblur = function (e) {
                localStorage[e.target.id] = e.target.value;
                computeAll();
            };
            var getter = function () {
                var value = localStorage[elm.id] || "";
                if (value.charAt(0) == "=") {
                    with (DATA) return eval(value.substring(1));
                } else { return isNaN(parseFloat(value)) ? value : parseFloat(value); }
            };
            Object.defineProperty(DATA, elm.id, { get: getter });
            Object.defineProperty(DATA, elm.id.toLowerCase(), { get: getter });
        });
        (window.computeAll = function () {
            INPUTS.forEach(function (elm) { try { elm.value = DATA[elm.id]; } catch (e) { } });
        })();

    }


    WorkbookApp.TryCreateSheet = function ($form) {

        localStorage.clear();

        if (WorkbookApp.IsValidSheet($form))
        {
            $("#workbookConfigForm").addClass("hidden");
            $("#workbookPanel").removeClass("hidden");

            var noOfRows = $("#noOfRows").val();
            var noOfCols = $("#noOfCols").val();
            setWorksheetSize(noOfRows, noOfCols);
            setControls();
        }

        
    }

    WorkbookApp.IsValidSheet = function ($form) {
        var valid = true;
        var $firstError;

        $("[required]:visible", $form).each(function (index, element) {
            var $this = $(this);

            if (!$this.val()) {
                $firstError = $this;
                console.log("Validating", $this);
                $this.addClass("validation-error");
                $this.prop("title", "This field is required and must have a non zero value.");
                $this.prop("placeholder", "This field is required.");
                valid = false;
            }
            if (($this.val() == "0")) {
                $firstError = $this;
                console.log("Validating", $this);
                $this.addClass("validation-error");
                $this.prop("title", "This field should not be zero or empty.");
                $this.prop("placeholder", "This field should not be zero or empty.");
                valid = false;
            }
            if (($this.val() > 25)) {
                $firstError = $this;
                console.log("Validating", $this);
                $this.addClass("validation-error");
                $this.prop("title", "Please enter a number between 0 and 25.");
                $this.prop("placeholder", "Please enter a number between 0 and 25.");
                valid = false;
            }
        });

        if (!valid) {
            $('html, body').animate({
                scrollTop: $firstError.offset().top - 45,
                complete: function () {
                    alert("All required fields must have a value.");
                }
            }, 500);
        }

        console.log("Validation", "Validation check returned: " + valid);
        return valid;
    }

})(window.WorkbookApp = window.WorkbookApp || {}, jQuery);