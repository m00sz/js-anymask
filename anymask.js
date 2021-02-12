/*
    AnyMask JS Plugin created by m00zs

    A jQuery plugin for every mask.
*/
(function($){

    /* VARS */
    var momentJSScript;

    // <script id="libRequired-MomentJS" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.min.js" integrity="sha512-LGXaggshOkD/at6PFNcp2V2unf9LzFq6LE+sChH7ceMTDP0g2kn6Vxwgg7wkPP7AAtX+lmPqPdxB47A0Nz0cMQ==" crossorigin="anonymous"></script>

    /* CREATE AUX FUNCTION */
    if (typeof $.fn.setCaretPos === typeof undefined){
        $.fn.setCaretPos = function(pos) {
            var thisElement = this.get(0);

            // Modern browsers
            if (thisElement.setSelectionRange)
            {
                thisElement.focus();
                thisElement.setSelectionRange(pos, pos);
            
            // IE8 and below
            } else if (thisElement.createTextRange) {
                var range = thisElement.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        };
    }

    /* CREATE AUX FUNCTION */
    if (typeof String.prototype.replaceAt === typeof undefined) {
        String.prototype.replaceAt = function () {
            var rlen = arguments[2] == null ? 1 : arguments[2];
            return this.substring(0, arguments[0]) + arguments[1] + this.substring(arguments[0] + rlen);
        }
    }

    $.fn.anymask = function(_options){
        /* CREATE AND APPEND MOMENTJS TO THE HEAD */
        if (typeof momentJSScript === typeof undefined) {
            momentJSScript = document.createElement("script");
            momentJSScript = $(momentJSScript);
            momentJSScript.attr({
                id: "libRequired-MomentJS",
                src: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.min.js",
                integrity: "sha512-LGXaggshOkD/at6PFNcp2V2unf9LzFq6LE+sChH7ceMTDP0g2kn6Vxwgg7wkPP7AAtX+lmPqPdxB47A0Nz0cMQ==",
                crossorigin: "anonymous"
            });
            $(document).find("head").append(momentJSScript);
        }       

        var thisElement = $(this);
        if (typeof thisElement === typeof undefined)
        {
            console.error("Element is undefined.");                
            return null;
        }
        
        if (thisElement.get(0).nodeName !== "INPUT")
        {
            console.error(thisElement);                
            console.error("Element is not an \"input\" element.");                
            return null;
        }

        if (thisElement.attr("type") !== "text")
        {
            console.error("Element is not an \"input type text\" element.");                
            return null;
        }        

        /* OPTIONS */
        var options = _options || {};
        var maskOption = (options.hasOwnProperty("mask") && typeof options["mask"] !== typeof undefined);
        var maskOptionValue = options["mask"];
        var typeOption = (options.hasOwnProperty("type") && typeof options["type"] !== typeof undefined);
        var typeOptionValue = options["type"];
        var formatOption = (options.hasOwnProperty("format") && typeof options["format"] !== typeof undefined);
        var formatOptionValue = options["format"];
        var callbackOption = (options.hasOwnProperty("callback") && typeof options["callback"] !== typeof undefined);
        var callbackOptionValue = options["callback"];

        /* VALIDATE OPTIONS */
        if (!maskOption){
            console.error("Missing \"mask(string|array)\"  options.");                
            return null;
        }

        var placeholderMask = maskOptionValue.replace(/[0-9]/g, "_");
        thisElement.attr("placeholder", placeholderMask);

        var maskLength = maskOptionValue.replace(/[^0-9]/g, "");
        maskLength = maskLength.length;

        thisElement.keydown(function(keyEvent){
            keyEvent = (keyEvent) ? keyEvent : window.event;
            var charCode = (keyEvent.which) ? keyEvent.which : keyEvent.keyCode;
            var textValue = thisElement.val();
            textValue = textValue.replace(/[^0-9]/g, "");

            var validKey = ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode === 8 || charCode === 37 || charCode === 39);
            if (validKey === false){
                keyEvent.preventDefault();
                return false; 
            } else if (charCode !== 8 && charCode !== 37 && charCode !== 39 && textValue.length === maskLength) {
                keyEvent.preventDefault();
                return false; 
            }             
        });

        thisElement.keyup(function(keyEvent){
            keyEvent = (keyEvent) ? keyEvent : window.event;
            var charCode = (keyEvent.which) ? keyEvent.which : keyEvent.keyCode;

            if ((charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode === 8 || charCode === 37 || charCode === 39)
            {                
                var textValue = thisElement.val();
                textValue = textValue.replace(/[^0-9]/g, "");
    
                var finalValue = ""+placeholderMask;
    
                var auxCharIdxFinal = 0;
                for(var charIdxText = 0; charIdxText < textValue.length; charIdxText++){
                    var charValueText = textValue.charAt(charIdxText);                    
                    
                    for(var charIdxFinal = auxCharIdxFinal; charIdxFinal < finalValue.length; charIdxFinal++){
                        var charValueFinal = finalValue.charAt(charIdxFinal);
                        if (charValueFinal === '_')
                        {
                            auxCharIdxFinal = charIdxFinal;
                            finalValue = finalValue.replaceAt(charIdxFinal, charValueText);
                            break;
                        }                        
                    }
                }
    
                thisElement.val(finalValue);
                if (maskLength === textValue.length)
                {
                    if (typeOption)
                    {
                        if (typeOptionValue === "date")
                        {
                            if (formatOption)
                            {
                                if (callbackOption)
                                {
                                    callbackOptionValue(thisElement);
    
                                } else {                                    
                                    try {
                                        var date = moment(finalValue, formatOptionValue);
                                        if (date.isValid()){
                                            // thisElement.css("border", "1px solid green");
                                        } else {
                                            thisElement.val("");
                                            thisElement.setCaretPos(0);
                                            // thisElement.css("border", "1px solid red");
                                        }                                        
                                    } catch (error) {
                                        thisElement.val(placeholderMask);
                                        thisElement.setCaretPos(0);
                                        // thisElement.css("border", "1px solid red");                                                                                    
                                    }

                                    // setTimeout(function(){
                                    //     thisElement.css("border", "0px");
                                    // }, 1500);
                                }
                            } else {
                                console.error("Missing \"format\" option.");
                            }
    
                        } else if (typeOptionValue === "custom") {
                            if (callbackOption)
                            {
                                callbackOptionValue(thisElement);
                            } else {
                                console.error("Missing \"callback\" option.");
                            }
                        }
                    }
                } else {
                    if (textValue.length === 0)
                        thisElement.setCaretPos(0);
                    else
                        thisElement.setCaretPos(auxCharIdxFinal + 1);
                }
    
                return true;
            }    
            
            keyEvent.preventDefault();
            return false;
        });

    };

})(jQuery);