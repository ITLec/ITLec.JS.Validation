function itlec_ValidateAllControls() {
    var elements = document.querySelectorAll("[data-itlec-enablevalidation='1']");

    var isValid = true;

    for (var i in elements) {
        if (elements.hasOwnProperty(i)) {
            //  alert(elements[i].getAttribute('data-itlec-requiredmsg'));
            var controlId = elements[i].getAttribute('id');
            isValid = itlec_validate_control(controlId) && isValid;
            itlec_warningMessage(controlId);
        }
    }


    if (!isValid) {
        $('html,body').scrollTop(0);
    }
    return isValid;

}
/*---------------------------------------------------------------------------------------*/
function itlec_IsRequired(controlName) {
    var required = false;
    var isRequired = itlec_getAttributeValue(controlName, "data-itlec-isrequired");
    required = (isRequired == "true") || (isRequired == true);
    return required;
}

function itlec_GetControlValue(controlName) {
    var _control = document.getElementById(controlName);
    var controlVal = _control.value;
    return controlVal;
}

function itlec_getAttributeValue(controlName, attributeName) {
    var required_msg = "";
    var _control = document.getElementById(controlName);

    required_msg += _control.getAttribute(attributeName);
    return required_msg;
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
function itlec_validate_control(controlName) {
    var sucess = false;
    var message = "";
    var parent = document.getElementById(itlec_getAttributeValue(controlName, "data-itlec-divmsgname"));
    var required = itlec_IsRequired(controlName);
    if (required == true) {
        var controlValue = itlec_GetControlValue(controlName);
        message += itlec_getAttributeValue(controlName, "data-itlec-requiredmsg");
        if (controlValue != "") {
            var div = document.createElement('div');
            div.id = "itlec" + controlName + "msg";
            parent.appendChild(div);
            if (parent.lastElementChild.tagName != "INPUT") {
                // div that is under it
                if (itlec_getAttributeValue(controlName, "data-itlec-regexp") != "null") {
                    var pattern = new RegExp(itlec_getAttributeValue(controlName, "data-itlec-regexp"), "g");
                    var result = controlValue.search(pattern);

                    if (result == 0) {
                        //  get value and check on characters 
                        if (itlec_getAttributeValue(controlName, "data-itlec-minimumcharacters") != "null") {
                            if (itlec_GetControlValue(controlName).length > itlec_getAttributeValue(controlName, "data-itlec-minimumcharacters")) {
                                parent.removeChild(document.getElementById("itlec" + controlName + "msg"));
                                sucess = true;
                            }
                            else if (itlec_GetControlValue(controlName).length < itlec_getAttributeValue(controlName, "data-itlec-minimumcharacters")) {
                                message = "";
                                message += itlec_getAttributeValue(controlName, "data-itlec-minimumlettersmsg");
                                document.getElementById("itlec" + controlName + "msg").innerHTML = "<p>" + message + "</p>";
                                sucess = false;

                            }
                        }
                        else if (itlec_getAttributeValue(controlName, "data-itlec-minimumcharacters") == "null") {

                            if (itlec_getAttributeValue(controlName, "data-itlec-minimumwords") != "null") {
                                if (itlec_countWords(controlName) > itlec_getAttributeValue(controlName, "data-itlec-minimumwords")) {
                                    parent.removeChild(document.getElementById("itlec" + controlName + "msg"));
                                    sucess = true;
                                } else if (itlec_countWords(controlName) < itlec_getAttributeValue(controlName, "data-itlec-minimumwords")) {
                                    message = "";
                                    message += itlec_getAttributeValue(controlName, "data-itlec-minimumwordsmsg");
                                    document.getElementById("itlec" + controlName + "msg").innerHTML = "<p>" + message + "</p>";
                                    sucess = false;
                                }

                            }
                            else if (itlec_getAttributeValue(controlName, "data-itlec-minimumwords") == "null") {
                                parent.removeChild(document.getElementById("itlec" + controlName + "msg"));
                                sucess = true;
                            }


                        }

                    }
                    else if (result == -1) {
                        message = "";
                        message += itlec_getAttributeValue(controlName, "data-itlec-regexpmsg");
                        document.getElementById("itlec" + controlName + "msg").innerHTML = "<p>" + message + "</p>";
                        sucess = false;
                    }

                }
                else if (itlec_getAttributeValue(controlName, "data-itlec-regexp") == "null") {
                    parent.removeChild(document.getElementById("itlec" + controlName + "msg"));
                    sucess = true;
                }
            }
            else if (parent.lastElementChild.tagName == "INPUT") {

                sucess = true;

            }
        }
        else if (controlValue == "") {

            var msgElementId = "itlec" + controlName + "msg";

            var div = document.getElementById(msgElementId);

            if (div == null) {
                var div = document.createElement('div');
                div.id = msgElementId;
            }
            div.innerHTML = "<p>" + message + "</p>";
            parent.appendChild(div);

            sucess = false;

        }
    }
    return sucess;
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
function createWarningSubDiv(id) {
    var container = document.createElement('div');
    container.id = id;
    document.getElementById('warning').appendChild(container);
}
function removeWarningSubDiv(id) {
    document.getElementById('warning').removeChild(document.getElementById(id));
}
function itlec_addWarningMessage(message, controlName, container) {
    var mess = document.createElement('a');
    mess.innerHTML = message + "<br />";
    mess.href = "javascript:document.getElementById('" + controlName + "').focus()";
    container.appendChild(mess);
    document.getElementById('warning').appendChild(container);
}
function checkRegularExpression(controlName, controlValue) {
    var pattern = new RegExp(itlec_getAttributeValue(controlName, "data-itlec-regexp"), "g");
    var result = controlValue.search(pattern);
    if (result == 0) {

        if (itlec_getAttributeValue(controlName, "data-itlec-minimumcharacters") != "null") {
            if (itlec_GetControlValue(controlName).length > itlec_getAttributeValue(controlName, "data-itlec-minimumcharacters")) {
                removeWarningSubDiv("itlec" + controlName + "warningmsg");
            }
            else if (itlec_GetControlValue(controlName).length < itlec_getAttributeValue(controlName, "data-itlec-minimumcharacters")) {
                message = "";
                message += itlec_getAttributeValue(controlName, "data-itlec-minimumlettersmsg");
                var container = document.getElementById("itlec" + controlName + "warningmsg");
                itlec_addWarningMessage(message, controlName, container);


            }
        }
        else if (itlec_getAttributeValue(controlName, "data-itlec-minimumcharacters") == "null") {

            if (itlec_getAttributeValue(controlName, "data-itlec-minimumwords") != "null") {
                if (itlec_countWords(controlName) > itlec_getAttributeValue(controlName, "data-itlec-minimumwords")) {
                    removeWarningSubDiv("itlec" + controlName + "warningmsg");
                } else if (itlec_countWords(controlName) < itlec_getAttributeValue(controlName, "data-itlec-minimumwords")) {

                    message = "";
                    message += itlec_getAttributeValue(controlName, "data-itlec-minimumwordsmsg");
                    var container = document.getElementById("itlec" + controlName + "warningmsg");
                    itlec_addWarningMessage(message, controlName, container);
                }

            }
            else if (itlec_getAttributeValue(controlName, "data-itlec-minimumwords") == "null") {
                removeWarningSubDiv("itlec" + controlName + "warningmsg");
            }


        }

    }
    else if (result == -1) {
        message = "";
        message += itlec_getAttributeValue(controlName, "data-itlec-regexpmsg");
        var container = document.getElementById("itlec" + controlName + "warningmsg");
        itlec_addWarningMessage(message, controlName, container);
    }
}

function itlec_warningMessage(controlName) {
    var message = "";
    var _control = document.getElementById(controlName);
    var required = itlec_IsRequired(controlName);
    if (required == true) {
        var controlValue = itlec_GetControlValue(controlName);
        message += itlec_getAttributeValue(controlName, "data-itlec-requiredmsg");
        if (controlValue != "") {
            if (document.getElementById('warning') == null) {
                creatingWarningDiv();
            }
            if (itlec_getAttributeValue(controlName, "data-itlec-regexp") != "null") {
                if (document.getElementById("itlec" + controlName + "warningmsg") != null) {
                    removeWarningSubDiv("itlec" + controlName + "warningmsg");
                }
                if (document.getElementById("itlec" + controlName + "warningmsg") == null) {
                    document.getElementById('warning').style.visibility = "visible";
                    createWarningSubDiv("itlec" + controlName + "warningmsg");
                }
                checkRegularExpression(controlName, controlValue);


            }
            else if (itlec_getAttributeValue(controlName, "data-itlec-regexp") == "null") {
                if (document.getElementById("itlec" + controlName + "warningmsg") != null) {
                    removeWarningSubDiv("itlec" + controlName + "warningmsg");

                }
            }
            if (document.getElementById('warning').childElementCount == 0) {
                document.getElementById('warning').style.visibility = "hidden";
            }
        }
        else if (controlValue == "") {
            if (document.getElementById('warning') == null) {
                // create warning div
                creatingWarningDiv();
            }
            if (document.getElementById("itlec" + controlName + "warningmsg") == null) {
                document.getElementById('warning').style.visibility = "visible";
                createWarningSubDiv("itlec" + controlName + "warningmsg");
                var container = document.getElementById("itlec" + controlName + "warningmsg");
                itlec_addWarningMessage(message, controlName, container);
            }

        }
    }
}
