/*
    AnyMask JS Plugin created by m00zs

    A jQuery plugin for every mask.
*/
(function($){

    $.fn.anymask = function(_options){

        String.prototype.replaceAt = function () {
            var rlen = arguments[2] == null ? 1 : arguments[2];
            return this.substring(0, arguments[0]) + arguments[1] + this.substring(arguments[0] + rlen);
        }

        function setCaretPosition(ctrl, pos) {
            // Modern browsers
            if (ctrl.setSelectionRange)
            {
                ctrl.focus();
                ctrl.setSelectionRange(pos, pos);
            
            // IE8 and below
            } else if (ctrl.createTextRange) {
                var range = ctrl.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
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

        var options = _options || {};
        var maskOption = (options.hasOwnProperty("mask") && typeof options["mask"] !== typeof undefined);
        var maskOptionValue = options["mask"];
        var typeOption = (options.hasOwnProperty("type") && typeof options["type"] !== typeof undefined);
        var typeOptionValue = options["type"];
        var formatOption = (options.hasOwnProperty("format") && typeof options["format"] !== typeof undefined);
        var formatOptionValue = options["format"];
        var callbackOption = (options.hasOwnProperty("callback") && typeof options["callback"] !== typeof undefined);
        var callbackOptionValue = options["callback"];
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

            if ((charCode > 31 && (charCode < 48 || charCode > 57)) || textValue.length === maskLength) {
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
                    setCaretPosition(thisElement.get(0), 0);
                    if (typeOption)
                    {
                        if (typeOptionValue === "date")
                        {
                            if (formatOption)
                            {
                                if (callbackOption)
                                {
    
                                } else {
                                    
                                }
                            } else {
                                console.error("Missing \"format\" option.");
                            }
    
                        } else if (typeOptionValue === "custom") {
                            if (callbackOption)
                            {
    
                            } else {
                                console.error("Missing \"callback\" option.");
                            }
                        }
                    }
                } else {
                    setCaretPosition(thisElement.get(0), auxCharIdxFinal+1);
                }
    
                return true;
            }    
            
            keyEvent.preventDefault();
            return false;
        });

    };

})(jQuery);