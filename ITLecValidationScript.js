/* 
data-itlec-enablevalidation="1" // Enable the validation
itlec_ValidateAllControls() //Call it inside button or any event to start the validation
itlec_IsRequired(controlName)
itlec_GetControlValue(controlName)
itlec_getAttributeValue(controlName, attributeName)
itlec_GetControlValue(controlID)
 itlec_getAttributeValue(controlName, attributeName) 
 itlec_countWords(controlName) 
 itlec_onchange_validate(controlName) //Call this to fire control validation Both (Underline validation & summary validation)
*/

var ItlecFieldType = {
    "Number": "number",
    "Date": "date"
}

function itlec_ValidateAllControls() {
    var elements = document.querySelectorAll("[data-itlec-enablevalidation='1']");
    var isValid = true;
    for (var i in elements) {
        if (elements.hasOwnProperty(i)) {
            var controlId = elements[i].getAttribute('id');
            var validationMSG = itlec_validate_control(controlId);

            if (validationMSG)
            {
                isValid = false && isValid;
            }

            itlec_warningMessage(controlId, validationMSG);
        }
    }

    if (!isValid) {
        $('html,body').scrollTop(0);
    }
    return isValid;
}
function itlec_IsRequired(controlName) {
    var required = false;
    var isRequired = itlec_getAttributeValue(controlName, "data-itlec-isrequired");
    required = (isRequired == "true") || (isRequired == true);
    return required;
}

function itlec_GetControlValue(controlID) {
    /* var _control = document.getElementById(controlName);
     var controlVal = _control.value;
     return controlVal;*/

    var controlObj = document.getElementById(controlID);
    var controlType = controlObj.nodeName.toLowerCase();
    var retValue = "";

    if (controlType == "select") {

        retValue = controlObj.options[controlObj.selectedIndex].value;

        if (!retValue) {
            retValue = controlObj.options[controlObj.selectedIndex].text;
        }
    }
    else if (controlType == "a") {
        //Do Nothing
    }
    else if (controlType == "input") {

        if (controlObj.hasAttribute("checked")) {
            retValue = controlObj.checked;
        }
        else {
            retValue = controlObj.value;
        }
    }
    else {
        retValue = controlObj.value;
    }

    return retValue.toString();
}

function itlec_getAttributeValue(controlName, attributeName) {
    var retVal = "";
    var _control = document.getElementById(controlName);

    retVal = _control.getAttribute(attributeName);
    return retVal;
}
function itlec_countWords(controlName) {
    var controlValue = itlec_GetControlValue(controlName);
    var count = 0;
    var space = " ";
    for (var i = 0; i < controlValue.length; i++) {
        if (controlValue[i] == space) {
            count++;
        }
    }

    return count;
}

function itlec_onchange_validate(controlName) {
    itlec_validate_control(controlName);
    itlec_warningMessage(controlName);
}
function creatingWarningDiv() {
    var parent = document.getElementById('divallmsgs');
    var warning = document.createElement('div');
    warning.className = "alert alert-warning col-sm-6 col-sm-offset-1";
    warning.id = "warning";
    warning.style.visibility = "hidden";
    parent.insertBefore(warning, parent.firstChild);
    document.getElementById('warning').style.visibility = "visible";
}

function itlec_addWarningMessage(controlId, warningControlDiv, message) {
    var mess = document.createElement('a');
    mess.innerHTML = message + "<br />";
    mess.href = "javascript:document.getElementById('" + controlId + "').focus()";
    warningControlDiv.appendChild(mess);
    document.getElementById('warning').appendChild(warningControlDiv);
}

function itlec_CreateWarningMSG(controlId, validationMSG) {

    var controlWarningDivId = "itlec" + controlId + "warningmsg";

    if (document.getElementById('warning') == null) {
        creatingWarningDiv();
    }

    if (document.getElementById(controlWarningDivId) == null) {
        document.getElementById('warning').style.visibility = "visible";

        var warningControlDiv = document.createElement('div');
        warningControlDiv.id = controlWarningDivId;
        document.getElementById('warning').appendChild(warningControlDiv);

        itlec_addWarningMessage(controlId, warningControlDiv, validationMSG);
    }
}
function itlec_removeWarningMSG(controlId) {

    var controlWarningDivId = "itlec" + controlId + "warningmsg";
    if (document.getElementById(controlWarningDivId) != null) {

        document.getElementById('warning').removeChild(document.getElementById(controlWarningDivId));
    }
}
function itlec_warningMessage(controlId) {
    var validationMSG = itlec_validate_control(controlId);

    if (validationMSG) {
        itlec_CreateWarningMSG(controlId, validationMSG)
    }
    else {
        itlec_removeWarningMSG(controlId);
    }
}
function itlec_warningMessage(controlId, validationMSG) {

    if (validationMSG) {
        itlec_CreateWarningMSG(controlId, validationMSG)
    }
    else {
        itlec_removeWarningMSG(controlId);
    }
}
function itlec_IsValidationEnabled(controlId) {
    var retValue = false;
    var isEnabled = itlec_getAttributeValue(controlId, "data-itlec-enablevalidation");
    retValue = (isEnabled == "true") || (isEnabled == true) || (isEnabled == 1) || (isEnabled == "1");
    return retValue;
}
function itlec_Validate_IsRequired(controlId) {
    var message = "";

    var isRequired = itlec_IsRequired(controlId);

    var controlValue = itlec_GetControlValue(controlId);
    if (isRequired) {

        if (controlValue == "") {

            message = itlec_getAttributeValue(controlId, "data-itlec-requiredmsg");
            itlec_CreateControlValidationDiv(controlId, message);
        }
        else {
            itlec_RemoveControlValidationDiv(controlId);
        }
    }
    return message;
}
function itlec_Validate_RegExp(controlId) {
    var message = "";
    if (itlec_getAttributeValue(controlId, "data-itlec-regexp") != "null") {

        var controlValue = itlec_GetControlValue(controlId);
        var pattern = new RegExp(itlec_getAttributeValue(controlId, "data-itlec-regexp"), "g");
        if (pattern) {
            var result = controlValue.search(pattern);


            if (result == -1) {

                message = itlec_getAttributeValue(controlId, "data-itlec-regexpmsg");
                itlec_CreateControlValidationDiv(controlId, message);
            }
            else {
                itlec_RemoveControlValidationDiv(controlId);
            }
        }
    }
    return message;



}

function itlec_RemoveControlValidationDiv(controlId) {
    var removeElement = document.getElementById("itlec" + controlId + "msg");

    if (removeElement != null) {
        var validationDevMSGName = itlec_getAttributeValue(controlId, "data-itlec-divmsgname");
        var validationDevMSGObj = document.getElementById(validationDevMSGName);

        validationDevMSGObj.removeChild(removeElement);
    }
}

function itlec_CreateControlValidationDiv(controlId, message) {
    if (controlId && message) {
        var validationDevMSGName = itlec_getAttributeValue(controlId, "data-itlec-divmsgname");
        var validationDevMSGObj = document.getElementById(validationDevMSGName);
        var msgElementId = "itlec" + controlId + "msg";

        var div = document.getElementById(msgElementId);

        if (div == null) {
            var div = document.createElement('div');
            div.id = msgElementId;
        }
        div.innerHTML = "<p>" + message + "</p>";
        validationDevMSGObj.appendChild(div);
    }
}

function creatingWarningDiv() {
    var parent = document.getElementById('divallmsgs');
    var warning = document.createElement('div');
    warning.className = "alert alert-warning col-sm-6 col-sm-offset-1";
    warning.id = "warning";
    warning.style.visibility = "hidden";
    parent.insertBefore(warning, parent.firstChild);
    document.getElementById('warning').style.visibility = "visible";
}

function itlec_addWarningMessage(controlId, warningControlDiv, message) {
    var mess = document.createElement('a');
    mess.innerHTML = message + "<br />";
    mess.href = "javascript:document.getElementById('" + controlId + "').focus()";
    warningControlDiv.appendChild(mess);
    document.getElementById('warning').appendChild(warningControlDiv);
}

function itlec_CreateWarningMSG(controlId, validationMSG) {

    var controlWarningDivId = "itlec" + controlId + "warningmsg";

    if (document.getElementById('warning') == null) {
        creatingWarningDiv();
    }

    if (document.getElementById(controlWarningDivId) == null) {
        document.getElementById('warning').style.visibility = "visible";
        var warningControlDiv = document.createElement('div');
        warningControlDiv.id = controlWarningDivId;
        document.getElementById('warning').appendChild(warningControlDiv);

        itlec_addWarningMessage(controlId, warningControlDiv, validationMSG);
    }
}
function itlec_removeWarningMSG(controlId) {

    var controlWarningDivId = "itlec" + controlId + "warningmsg";
    if (document.getElementById(controlWarningDivId) != null) {

        document.getElementById('warning').removeChild(document.getElementById(controlWarningDivId));
    }
}
function itlec_warningMessage(controlId) {
    itlec_removeWarningMSG(controlId);
    var validationMSG = itlec_validate_control(controlId);

    if (validationMSG) {
        itlec_CreateWarningMSG(controlId, validationMSG)
    }
    //else {
    //    itlec_removeWarningMSG(controlId);
    //}
}
function itlec_warningMessage(controlId, validationMSG) {

    itlec_removeWarningMSG(controlId);
    if (validationMSG) {
        itlec_CreateWarningMSG(controlId, validationMSG)
    }
    //else {
    //    itlec_removeWarningMSG(controlId);
    //}
}
function itlec_IsValidationEnabled(controlId) {
    var retValue = false;
    var isEnabled = itlec_getAttributeValue(controlId, "data-itlec-enablevalidation");
    retValue = (isEnabled == "true") || (isEnabled == true) || (isEnabled == 1) || (isEnabled == "1");
    return retValue;
}
function itlec_Validate_IsRequired(controlId) {
    var message = "";

    var isRequired = itlec_IsRequired(controlId);

    var controlValue = itlec_GetControlValue(controlId);
    if (isRequired) {

        if (controlValue == "") {

            message = itlec_getAttributeValue(controlId, "data-itlec-requiredmsg");
            itlec_CreateControlValidationDiv(controlId, message);
        }
        else {
            itlec_RemoveControlValidationDiv(controlId);
        }
    }
    return message;
}


function itlec_Validate_RegExp(controlId) {
    var message = "";
    if (itlec_getAttributeValue(controlId, "data-itlec-regexp") != "null") {

        var controlValue = itlec_GetControlValue(controlId);
        var pattern = new RegExp(itlec_getAttributeValue(controlId, "data-itlec-regexp"), "g");
        if (pattern) {
            var result = controlValue.search(pattern);


            if (result == -1) {

                message = itlec_getAttributeValue(controlId, "data-itlec-regexpmsg");
                itlec_CreateControlValidationDiv(controlId, message);
            }
            else {
                itlec_RemoveControlValidationDiv(controlId);
            }
        }
    }
    return message;
}

function itlec_Validate_Type(controlId) {
    var message = "";
    var typeValue = itlec_getAttributeValue(controlId, "data-itlec-type");
    if (typeValue != "null") {

        var controlValue = itlec_GetControlValue(controlId);

        if (typeValue || controlValue) {

            var validationMSG = itlec_getAttributeValue(controlId, "data-itlec-typemsg");
            var errorMSG = itlec_CheckType(controlValue, typeValue, validationMSG);
            if (errorMSG) {
                itlec_CreateControlValidationDiv(controlId, message);
            }
            else {
                itlec_RemoveControlValidationDiv(controlId);
            }
        }
    }
    return message;
}
function itlec_Validate_Range(controlId) {
    var message = "";
    var typeValue = itlec_getAttributeValue(controlId, "data-itlec-type");
    var rangeValue = itlec_getAttributeValue(controlId, "data-itlec-range");

    if (typeValue && rangeValue) {

        var controlValue = itlec_GetControlValue(controlId);

        if (controlValue) {

            var validationMSG = itlec_getAttributeValue(controlId, "data-itlec-rangemsg");
            var errorMSG = itlec_CheckRange(controlValue, typeValue, rangeValue, validationMSG);
            if (errorMSG) {
                message = errorMSG;
                itlec_CreateControlValidationDiv(controlId, message);
            }
            else {
                itlec_RemoveControlValidationDiv(controlId);
            }
        }
    }
    return message;
}

function itlec_CheckRange(_value, _type, _range, _errorMSG) {

    if (_type && _range) {

        var rangeArr = _range.split(",");


        
        

        if (!_errorMSG) {
            _errorMSG = "Please enter data in the valid range, this field range should be between " + _range;
        }

        _type = _type.toLowerCase();

        if (_type == ItlecFieldType.Number) {


            if ((rangeArr.length != 2) || isNaN(rangeArr[0]) || isNaN(rangeArr[1])
                    || (parseFloat(rangeArr[0]) > parseFloat(rangeArr[1]))) {
                errorMSG = "Range format is worng.";
            } else {
                if (!isNaN(_value) && (parseFloat(rangeArr[0]) < parseFloat(_value)) && (parseFloat(rangeArr[1]) > parseFloat(_value))) {
                    _errorMSG = "";
                }
            }

        }
        else if (_type == ItlecFieldType.Date) {

            var minRangeDate = ITLecJSValidationDate.ConvertStringToDate(rangeArr[0], ITLecJSValidationDateFormt.ddmmyyForwardSlash);
            var maxRangeDate = ITLecJSValidationDate.ConvertStringToDate(rangeArr[1], ITLecJSValidationDateFormt.ddmmyyForwardSlash);
            var dateVal = ITLecJSValidationDate.ConvertStringToDate(_value, ITLecJSValidationDateFormt.ddmmyyForwardSlash);

            if ((rangeArr.length != 2) || isNaN(minRangeDate.getMonth()) || isNaN(maxRangeDate.getMonth())
                    || (minRangeDate > maxRangeDate)) {
                errorMSG = "Range format is worng.";
            } else {
                if (!isNaN(dateVal.getMonth()) && (minRangeDate < dateVal) && (maxRangeDate > dateVal)) {
                    _errorMSG = "";
                }
            }
        }
    } else {
        _errorMSG = "";
    }
    return _errorMSG;
}

function itlec_CheckType(_value, _type, _errorMSG) {
    debugger;
    if (_type) {
        if (!_errorMSG) {
            _errorMSG = "Please enter a valid data, this field type is a " + _type;
        }
        _type = _type.toLowerCase();

        if (_type == ItlecFieldType.Number) {
            if (!isNaN(_value)) {
                _errorMSG = "";
            }
        }
        else if (_type == ItlecFieldType.Date) {

            if (ITLecJSUtils.IsValidDate(_value)) {
                _errorMSG = "";
            }
        }
    } else
    {
        _errorMSG = "";
    }
    return _errorMSG;
}

function itlec_RemoveControlValidationDiv(controlId) {
    var removeElement = document.getElementById("itlec" + controlId + "msg");

    if (removeElement != null) {
        var validationDevMSGName = itlec_getAttributeValue(controlId, "data-itlec-divmsgname");
        var validationDevMSGObj = document.getElementById(validationDevMSGName);

        validationDevMSGObj.removeChild(removeElement);
    }
}


function itlec_CreateControlValidationDiv(controlId, message) {
    if (controlId && message) {
        var validationDevMSGName = itlec_getAttributeValue(controlId, "data-itlec-divmsgname");
        var validationDevMSGObj = document.getElementById(validationDevMSGName);
        var msgElementId = "itlec" + controlId + "msg";

        var div = document.getElementById(msgElementId);

        if (div == null) {
            var div = document.createElement('div');
            div.id = msgElementId;
        }
        div.innerHTML = "<p>" + message + "</p>";
        validationDevMSGObj.appendChild(div);
    }
}


function itlec_validate_control(controlName) {
    
    var message = "";
    var validationDevMSGName = itlec_getAttributeValue(controlName, "data-itlec-divmsgname");

    var validationDevMSGObj = document.getElementById(validationDevMSGName);
    var controlValue = itlec_GetControlValue(controlName);
    var isValidationEnabled = itlec_IsValidationEnabled(controlName);

    if (isValidationEnabled == true) {
        message = itlec_Validate_IsRequired(controlName);
        if (!message && controlValue) {



            //   if (validationDevMSGObj.lastElementChild.tagName != "INPUT") {
            // div that is under it
            //if (itlec_getAttributeValue(controlName, "data-itlec-regexp") != "null") {

            message = itlec_Validate_RegExp(controlName);

            if(!message)
            {
                message = itlec_Validate_Type(controlName);
                
                if (!message) {

                    message = itlec_Validate_Range(controlName);
                }
            }

        }
    }

    return message;
}




var ITLecJSValidationUtils =
    {
        IsPositiveInteger: function (str) {
            var n = Math.floor(Number(str));
            return n !== Infinity && String(n) === str && n >= 0;
        },
        IsValidDate: function (str) {
            var retVal = false;
            var convertedVal = Date.parse(str);
 
            if (!isNaN(convertedVal)) {
                retVal = true;
            }
            return retVal;
        }
    };


var ITLecJSValidationDateFormt = {
    "ddmmyyForwardSlash": "dd/mm/yy"
}

var ITLecJSValidationDate =
    {
        ConvertStringToDate: function (strDate, formate) {
            var retVal = null;
            if (formate == ITLecJSValidationDateFormt.ddmmyyForwardSlash) {


                var parts = strDate.split("/");
                retVal = new Date(parts[2], parts[1] - 1, parts[0]);
            }

            return retVal;
        },
        ConvertDateToString: function (_date, formate) {

            var retVal = "";
            
            if (formate == ITLecJSValidationDateFormt.ddmmyyForwardSlash) {

                let month = String(_date.getMonth() + 1);
                let day = String(_date.getDate());
                const year = String(_date.getFullYear());

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                retVal = day + "/" + month + "/" + year;
            }
            return retVal;
        }
    };
