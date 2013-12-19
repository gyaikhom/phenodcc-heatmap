/*
 * Copyright 2013 Medical Research Council Harwell.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Gagarine Yaikhom <g.yaikhom@har.mrc.ac.uk>
 */

(function() {
    /* this is the global variable where we expose the public interfaces */
    if (typeof dcc === 'undefined')
        dcc = {};

    var dcc_semanticVersion = 'DCC_HEATMAP_VERSION',
        dcc_floatingPointRegEx = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/,
        dcc_rgbHexColourRegEx = /^#?([0-9a-zA-Z]{2})([0-9a-zA-Z]{2})([0-9a-zA-Z]{2})$/,
        dcc_rgbHex6ColourRegEx = /^#?([0-9a-zA-Z])([0-9a-zA-Z])([0-9a-zA-Z])$/,
        dcc_rgbaColourRegEx = /^rgba?\((\d+),[\s\xa0]*(\d+),[\s\xa0]*(\d+)(?:,[\s\xa0]*(0\.\d+))?\)$/,

        /* The following keeps track of the mouse events that are attached with
         * the body of the documents */
        dcc_mouseDown = false,

        /* for saving existing mouse event handlers before over-ridding them */
        dcc_body = window.document.body,
        dcc_oldBodySelectStartHandler = dcc_body.onselectstart,
        dcc_oldBodyMouseUpHandler = dcc_body.onmouseup,

        /* colours that are made available on the heatmap colour picker */
        availableColours =
        [
            '#0099ff', '#ebf7ff', '#ff6600', '#ffffff',
            /* following colours from d3js: d3.scale.category20() */
            '#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78',
            '#2ca02c', '#98df8a', '#d62728', '#ff9896',
            '#9467bd', '#c5b0d5', '#8c564b', '#c49c94',
            '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7',
            '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'
        ]
        ;

    /**
     * Retrieves all of the properties that are specific to an object, excluding
     * those in the prototype.
     * 
     * @param {type} o Object to retrieve keys from.
     * @returns {Array} List of property names.
     */
    Object.keys = Object.keys || function(o) {
        var result = [];
        for (var name in o)
            if (o.hasOwnProperty(name))
                result.push(name);
        return result;
    };

    /**
     * Extracts the key for a given datum.
     *
     * @param {Object} datum Object that contains the key.
     * @returns {String} The key as a string.
     */
    function dcc_keyExtractor(datum) {
        return datum === undefined ? undefined : datum.k;
    }

    /**
     * Formats the row header entry datum object for display.
     *
     * @param {Object} datum Object that contains the data.
     * @returns {String} Formatted string header entry.
     */
    function dcc_rowFormatter(datum) {
        return datum.v;
    }

    /**
     * Formats the column header entry datum object for display.
     *
     * @param {Object} datum Object that contains the data.
     * @returns {String} Formatted string header entry.
     */
    function dcc_columnFormatter(datum) {
        return datum.u;
    }

    /**
     * Extracts the p-value from a cell datum.
     *
     * @param {Object} datum Object that contains the data.
     * @returns {Real} Floating point value.
     */
    function dcc_pvalueExtractor(datum) {
        return datum;
    }

    /**
     * Reports error by throwing exceptions.
     *
     * @param {type} msg Message to display.
     */
    function dcc_reportError(msg) {
        throw new Error(msg);
    }

    /**
     * Attach an event handler to the specified node for the supplied event.
     *
     * @param node DOM node to attach event to.
     * @param event Name of the event to handle.
     * @param handler Function that will handle the event.
     */
    function dcc_handleEvent(node, event, handler) {
        if (node.attachEvent)
            node.attachEvent('on' + event, handler);
        else if (node.addEventListener)
            node.addEventListener(event, handler, false);
    }

    /**
     * Prevent event from bubbling to parent DOM nodes.
     * 
     * @param {Object} event Event handle.
     */
    function dcc_preventEventBubbling(event) {
        if (event.preventDefault)
            event.preventDefault();
        if (event.stopPropagation)
            event.stopPropagation();
        event.cancelBubble = true;
        return false;
    }

    /**
     * Retrieves the data using asynchronous HTTP request.
     *
     * @param {String} url Resource URL to retrieve data from.
     * @param {Function} handler Handles successful retrieval.
     */
    function dcc_get(url, handler) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onreadystatechange = function(event) {
            if (request.readyState === 4) {
                if (request.status === 200)
                    handler(JSON.parse(request.responseText));
                else
                    dcc_reportError('Unable to retrieve data from ' + url);
            }
        };
        request.send(null);
    }

    /**
     * Returns a substring of the string object after discarding characters
     * from either the start, or the end.
     *
     * <p>If the supplied number of characters to be discarded is
     * less than 0, they are discarded at the end; otherwise, they are
     * discarded from the start of the string. <i>The original string is
     * left unmodified.</i></p>
     *
     * @param {Integer} nchars Number of characters to discard.
     * @return {String} A substring with the remaining characters.
     */
    String.prototype.discard = function(nchars) {
        var length = this.length - nchars;
        return nchars < 0 ? this.substr(0, length)
            : this.substr(nchars, length);
    };

    /**
     * Returns the property value for the supplied DOM node.
     * 
     * @param {Object} node DOM node.
     * @param {String} property Name of the property.
     * @returns {Object} Property value.
     */
    function dcc_getPropertyValue(node, property) {
        var value = "", view = document.defaultView;
        if (view && view.getComputedStyle)
            value = view.getComputedStyle(node, "").getPropertyValue(property);
        else if (node.currentStyle) {
            property = property.replace(/\-(\w)/g,
                function(str, p1) {
                    return p1.toUpperCase();
                });
            value = node.currentStyle[property];
        }
        return value;
    }

    /**
     * Get or set DOM node attribute.
     *
     * @param {Object} node DOM node to process.
     * @param {String} attribute Name of the sttribute.
     * @param {String} value Optional new value for attribute.
     */
    function dcc_attr(node, attribute, value) {
        if (node && attribute) {
            if (value === undefined)
                return node.getAttribute(attribute);
            else
                return node.setAttribute(attribute, value);
        }
        return null;
    }

    /**
     * Get or set style.
     *
     * @param {Object} node DOM node to process.
     * @param {String} property Style property name.
     * @param {Integer} value Optional new value for property.
     */
    function dcc_style(node, property, value) {
        if (value === undefined)
            return dcc_getPropertyValue(node, property);
        else {
            node.style[property] = value;
            return value;
        }
    }

    /**
     * Get or set background colour.
     *
     * @param {Object} node DOM node to process.
     * @param {String} value Optional new background colour.
     */
    function dcc_bgColour(node, value) {
        return dcc_style(node, 'background-color', value);
    }

    /**
     * Get or set background.
     *
     * @param {Object} node DOM node to process.
     * @param {String} value Optional new background.
     */
    function dcc_bg(node, value) {
        return dcc_style(node, 'background', value);
    }

    /**
     * Get or set background image.
     *
     * @param {Object} node DOM node to process.
     * @param {String} value Optional new background.
     */
    function dcc_bgImage(node, value) {
        return dcc_style(node, 'backgroundImage', value);
    }

    /**
     * Get or set inner HTML
     *
     * @param {Object} node DOM node to process.
     * @param {String} value Optional new text.
     */
    function dcc_text(node, value) {
        if (value)
            node.innerHTML = value;
        return node.innerHTML;
    }

    /**
     * Get or set style where properties are dimensions in pixels.
     *
     * @param {Object} node DOM node to process.
     * @param {String} property Style property name.
     * @param {Integer} value Optional new height.
     */
    function dcc_styleDimension(node, property, value) {
        if (value === undefined)
            return parseInt(dcc_getPropertyValue(node, property).discard(-2));
        else {
            node.style[property] = value + 'px';
            return value;
        }
    }

    /**
     * Get or set height.
     *
     * @param {Object} node DOM node to process.
     * @param {Integer} height Optional new value.
     */
    function dcc_height(node, height) {
        return dcc_styleDimension(node, 'height', height);
    }

    /**
     * Get or set width.
     *
     * @param {Object} node DOM node to process.
     * @param {Integer} width Optional new value.
     */
    function dcc_width(node, width) {
        return dcc_styleDimension(node, 'width', width);
    }

    /**
     * Get or set top placement.
     *
     * @param {Object} node DOM node to process.
     * @param {Integer} top Optional new value.
     */
    function dcc_top(node, top) {
        return dcc_styleDimension(node, 'top', top);
    }

    /**
     * Get or set left placement.
     *
     * @param {Object} node DOM node to process.
     * @param {Integer} left Optional new value.
     */
    function dcc_left(node, left) {
        return dcc_styleDimension(node, 'left', left);
    }

    /**
     * Get or set padding.
     *
     * @param {Object} node DOM node to process.
     * @param {String} type Padding type.
     * @param {Integer} value Padding in pixels.
     */
    function dcc_padding(node, type, value) {
        return dcc_styleDimension(node, 'padding-' + type, value);
    }

    /**
     * Get or set margin.
     *
     * @param {Object} node DOM node to process.
     * @param {String} type Margin type.
     * @param {Integer} value Margin in pixels.
     */
    function dcc_margin(node, type, value) {
        return dcc_styleDimension(node, 'margin-' + type, value);
    }

    /**
     * Get or set horizontal scrolling.
     *
     * @param {Object} node DOM node to process.
     * @param {Integer} left Optional new left.
     */
    function dcc_scrollLeft(node, left) {
        if (left !== undefined)
            node.scrollLeft = left;
        return node.scrollLeft;
    }

    /**
     * Get or set vertical scrolling.
     *
     * @param {Object} node DOM node to process.
     * @param {Integer} top Optional new top.
     */
    function dcc_scrollTop(node, top) {
        if (top !== undefined)
            node.scrollTop = top;
        return node.scrollTop;
    }

    /**
     * Get or set vertical scrolling.
     *
     * @param {Object} node DOM node to process.
     * @param {Integer} height Optional new height.
     */
    function dcc_scrollHeight(node, height) {
        if (height !== undefined)
            node.scrollHeight = height;
        return node.scrollHeight;
    }

    /**
     * Returns total top offset of supplied node relative to heatmap root.
     * 
     * @param {Object} node DOM node.
     * @returns {Integer} Total top-offset in pixels.
     */
    function dcc_getOffsetTopRoot(node) {
        var value = 0;
        while (node && dcc_class(node) !== 'dcc-heatmap-root') {
            value += node.offsetTop;
            node = node.offsetParent;
        }
        return value;
    }

    /**
     * Returns total left offset of supplied node relative to heatmap root.
     * 
     * @param {Object} node DOM node.
     * @returns {Integer} Total left-offset in pixels.
     */
    function dcc_getOffsetLeftRoot(node) {
        var value = 0;
        while (node && dcc_class(node) !== 'dcc-heatmap-root') {
            value += node.offsetLeft;
            node = node.offsetParent;
        }
        return value;
    }

    /**
     * Get or set style class of supplied node.
     * 
     * @param {Object} node DOM node.
     * @param {String} cls Style class to use.
     * @returns {String} Node class.
     */
    function dcc_class(node, cls) {
        if (cls === undefined)
            return node.getAttribute('class');
        else {
            node.setAttribute('class', cls);
            return cls;
        }
    }

    /**
     * Get the x-coordinate of mouse pointer relative to page.
     *
     * @param {type} event Mouse event.
     * @returns {Integer} x-coordinate of mouse relative to page in pixels.
     */
    function dcc_pageX(event) {
        return event.pageX === undefined ? event.clientX : event.pageX;
    }

    /**
     * Get the y-coordinate of mouse pointer relative to page.
     *
     * @param {type} event Mouse event.
     * @returns {Integer} y-coordinate of mouse relative to page in pixels.
     */
    function dcc_pageY(event) {
        return event.pageY === undefined ? event.clientY : event.pageY;
    }

    /**
     * Get the x-coordinate of mouse pointer relative to window.
     *
     * @param {type} event Mouse event.
     * @returns {Integer} x-coordinate of mouse relative to window in pixels.
     */
    function dcc_windowX(event) {
        return event.clientX;
    }

    /**
     * Get the y-coordinate of mouse pointer relative to window.
     *
     * @param {type} event Mouse event.
     * @returns {Integer} y-coordinate of mouse relative to window in pixels.
     */
    function dcc_windowY(event) {
        return event.clientY;
    }

    /**
     * Get inner width of the window.
     *
     * @returns {Integer} Inner width in pixels.
     */
    function dcc_innerWidth() {
        return window.innerWidth || document.documentElement.clientWidth;
    }

    /**
     * Get inner height of the window.
     *
     * @returns {Integer} Inner height in pixels.
     */
    function dcc_innerHeight() {
        return window.innerHeight || document.documentElement.clientHeight;
    }

    /**
     * Throttles event handler so that it is not activated until
     * the supplied delay has passed.
     * 
     * @param {Function} method Function to call after delay.
     * @param {Integer} delay Number of millisconds to wait before method call.
     * @param {Object} thisArg What to pass as this to method.
     */
    function dcc_throttle(method, delay, thisArg) {
        clearTimeout(method.throttleTimeout);
        method.throttleTimeout = setTimeout(
            function() {
                method.apply(thisArg);
            }, delay);
    }

    /**
     * Recursively empties the subtree of children DOM nodes.
     *
     * @param {Object} parent The root node of the subtrees to remove.
     */
    function dcc_removeChildrenSubtrees(parent) {
        if (parent === undefined)
            return;
        while (parent.firstChild) {
            dcc_removeChildrenSubtrees(parent.firstChild);
            parent.removeChild(parent.firstChild);
        }
    }

    /**
     * Creates a new DOM node.
     *
     * @param {Object} parent Parent DOM node to attach to.
     * @param {String} tag DOM node tag to use.
     * @param {String} id Identifier to use for the node.
     * @param {String} cls Style class for this node.
     * @param {String} text Text for inner HTML.
     */
    function dcc_createNode(parent, tag, id, cls, text) {
        var node = document.createElement(tag);

        if (parent)
            parent.appendChild(node);
        else
            dcc_reportError('Parent node required');

        if (id)
            node.setAttribute('id', id);
        if (cls)
            node.setAttribute('class', cls);
        if (text !== undefined)
            node.innerHTML = text;
        return node;
    }

    /**
     * Linear interpolation.
     *
     * @param {Real} low Low value.
     * @param {Real} high High value.
     * @param {Real} value Value to interpolate.
     *
     * @returns {Real} The interpolated value.
     */
    function dcc_lerp(low, high, value) {
        return low + value * (high - low);
    }

    /**
     * Clamp to colour channel.
     *
     * @param {Real} value Value to convert into channel.
     *
     * @returns {Integer} The channel value in the closed interval [0, 255].
     */
    function dcc_clampToColour(value) {
        return Math.min(255, Math.max(0, Math.round(value)));
    }

    /**
     * Create gradient colour from value.
     *
     * @param {Object} low RGB channels for the lower interpolant.
     * @param {Object} high RGB channels for the upper interpolant.
     * @param {Real} value Value to interpolate.
     */
    function dcc_getGradientColor(low, high, value) {
        return {
            'r': dcc_clampToColour(dcc_lerp(low.r, high.r, value)),
            'g': dcc_clampToColour(dcc_lerp(low.g, high.g, value)),
            'b': dcc_clampToColour(dcc_lerp(low.b, high.b, value))
        };
    }

    /**
     * Converts integral colour channels to hexadecimal RGB specification.
     *
     * @param {Object} channels RGB channels.
     *
     * @returns {String} RGB colour specification.
     */
    function dcc_convertChannelsToHexColour(channels) {
        var r = channels.r.toString(16),
            g = channels.g.toString(16),
            b = channels.b.toString(16);

        return '#' + (r.length === 1 ? '0' : '') + r
            + (g.length === 1 ? '0' : '') + g
            + (b.length === 1 ? '0' : '') + b;
    }

    /**
     * Splits colour string to integral channels, where the channel values are
     * inside the closed interval [0, 255].
     * 
     * @param {String} colour Colour in # format.
     */
    function dcc_splitColourToIntegralChannels(colour) {
        var channels = colour.match(dcc_rgbaColourRegEx), rgba;
        if (channels === null) {
            channels = colour.match(dcc_rgbHexColourRegEx);
            if (channels === null) {
                channels = colour.match(dcc_rgbHex6ColourRegEx);
                if (channels === null)
                    dcc_reportError('Invalid colour: \'' + colour + '\'');
                else
                    rgba = {
                        'r': parseInt(channels[1] + channels[1], 16),
                        'g': parseInt(channels[2] + channels[1], 16),
                        'b': parseInt(channels[3] + channels[1], 16),
                        'a': undefined
                    };
            } else
                rgba = {
                    'r': parseInt(channels[1], 16),
                    'g': parseInt(channels[2], 16),
                    'b': parseInt(channels[3], 16),
                    'a': undefined
                };
        } else
            rgba = {
                'r': parseInt(channels[1]),
                'g': parseInt(channels[2]),
                'b': parseInt(channels[3]),
                'a': channels[4] === undefined ?
                    undefined : parseFloat(channels[4])
            };
        return rgba;
    }

    /**
     * Returns the number of milliseconds it takes to execute a function.
     *
     * @param {Function} f Function to execute.
     */
    function dcc_timedExec(f) {
        var start = new Date().getTime();
        f();
        return new Date().getTime() - start;
    }

    /**
     * Returns the log_10 of supplied value. This is used in logarithmic
     * scaling of p-value threshold relative to the p-value slider value.
     * 
     * @param {Real} v Operand.
     * @returns {Real} Log_10 value.
     */
    function dcc_log10(v) {
        return Math.LOG10E * Math.log(v);
    }

    /**
     * Fix for IE non-compliance.
     * 
     * @param {object} event Event object.
     */
    function dcc_getEvent(event) {
        if (!event)
            event = window.event;
        return event;
    }

    /**
     * When a user hovers overs a p-value cell, we display a popup dialog with
     * further details. This function prepares the header that is used to
     * display the details.
     * 
     * @param {Object} content DOM node that will be the parent of popup.
     * @param {Boolean} isOntological Are we displaying ontological heatmap, or
     *     procedural heatmap? The columns differ because details differ.
     */
    function dcc_preparePopupHeader(content, isOntological) {
        var classPrefix = 'dcc-heatmap-popup-',
            tr = dcc_createNode(dcc_createNode(
            dcc_createNode(content, 'table'), 'thead'), 'tr');
        if (isOntological) {
            classPrefix += 'ont-';
            dcc_createNode(tr, 'th', null, classPrefix + 'hp', 'Procedure');
        }
        dcc_createNode(tr, 'th', null, classPrefix + 'hq', 'Parameter');
        dcc_createNode(tr, 'th', null, classPrefix + 'ht', 'MP annotation');
        dcc_createNode(tr, 'th', null, classPrefix + 'hi', '');
        dcc_createNode(tr, 'th', null, classPrefix + 'hv', 'p-value');
    }

    /**
     * The heatmap displays annotation results based on the p-value associated
     * with the phenotype call. This function converts the annotation call
     * returned by the server to the corresponding name, which is then used to
     * select the appropriate icon class.
     * 
     * @param {Integer} o Annotation call index.
     * @returns {String} Name of the annotation call.
     */
    function dcc_getSelectionOutcomeIconClass(o) {
        var r = null;
        switch (o) {
            case 1:
                r = 'increased';
                break;
            case 2:
                r = 'decreased';
                break;
            case 3:
                r = 'abnormal';
                break;
            case 4:
                r = 'inferred';
                break;
        }
        return 'dcc-heatmap-popup-icon dcc-heatmap-popup-icon-' + r;
    }

    /**
     * Transforms value to required precision. When precision is unspecified,
     * this uses 5 places of precision by default.
     *
     * @param {Real} value Value to transform.
     * @param {Integer} precision Places of precision.
     */
    function dcc_precision(value, precision) {
        return (value === undefined || value < 0 || value > 1) ? undefined :
            value === 1 ? 1 :
            value.toPrecision(precision === undefined ? 5 : precision);
    }

    /**
     * Handles mouse event when user release a mouse button.
     * 
     * @param {Object} event Event object for mouse up.
     */
    dcc_body.onmouseup = function(event) {
        dcc_mouseDown = false;
        dcc_body.onselectstart = dcc_oldBodySelectStartHandler;
        if (dcc_oldBodyMouseUpHandler)
            dcc_oldBodyMouseUpHandler(dcc_getEvent(event));
    };

    /**
     * Implements a value slider user interface.
     *
     * @param {Object} parent Container node.
     * @param {String} id Unique identifier for the slider.
     * @param {String} label The value label.
     * @param {Real} min Minimum value allowed.
     * @param {Real} max Maximum value allowed.
     * @param {Integer} height Maximum height for the slider in pixels.
     * @param {Integer} width Maximum width for the slider in pixels.
     * @param {Function} onValueChange Processing to do when value changes.
     * @param {Real} value Optional default value.
     */
    var Slider = function(parent, id, label, min, max, height,
        width, onValueChange, value) {
        this.id = id;
        this.minValue = min;
        this.maxValue = max;
        this.valueRange = max - min;

        /* if default value is unspecified, use the middle */
        this.defaultValue = value === undefined
            ? .5 * (this.maxValue - this.minValue) : value;

        this.onValueChange = onValueChange;
        this.sliderHeight = height;
        this.sliderWidth = width;
        this.labelText = label;

        this.renderSlider(parent);
    };

    Slider.prototype = {
        /**
         * Returns the current slider value.
         */
        getSliderValue: function() {
            var me = this, currentValue = me.value.value;
            if (dcc_floatingPointRegEx.test(currentValue))
                currentValue = parseFloat(currentValue);
            else
                dcc_reportError('Invalid threshold value');
            return currentValue;
        },

        /**
         * Converts current slider value to slider button position.
         * This is used for updating the position of the slider button when
         * user updates the value text box.
         */
        positionFromValue: function() {
            var me = this, valueBox = me.value, value = valueBox.value;
            if (dcc_floatingPointRegEx.test(value)) {
                dcc_style(valueBox, 'color', '#000000'); /* valid value */

                /* convert using logarithmic scale */
                if (value > 0 && value < 1)
                    value = .1 * dcc_log10(parseFloat(value)) + 1;

                /* keep value within range */
                if (value < me.minValue) {
                    value = me.minValue;

                    /* value is less than min, show warning with colour */
                    dcc_style(valueBox, 'color', 'green');
                } else if (value > me.maxValue) {
                    value = me.maxValue;

                    /* value is more than max, show warning with colour */
                    dcc_style(valueBox, 'color', 'blue');
                }
            } else {
                dcc_style(valueBox, 'color', '#ff0000'); /* highlight error */
                value = me.defaultValue;
            }

            return me.minButtonLeft + me.barWidth
                * (value - me.minValue) / me.valueRange; /* lerp */
        },

        /**
         * Converts current slider button position to slider value.
         * This is used for updating the slider value when the user drags the
         * slider button.
         */
        valueFromPosition: function() {
            var me = this, value;
            dcc_style(me.value, 'color', '#000000');

            value = me.minValue + me.valueRange * (dcc_left(me.button)
                + .5 * me.buttonWidth - me.barLeft) / me.barWidth; /* lerp */

            if (value > 0.0 && value < 1.0)
                value = Math.pow(10, (value - 1) * 10);

            return dcc_precision(value);
        },

        /**
         * This event handler is invoked when the user begins dragging the
         * slider button.
         * 
         * @param {Object} button Event is attached to the button DOM node.
         */
        getDragStartHandler: function(button) {
            return function(event) {
                dcc_mouseDown = true;
                event = dcc_getEvent(event);
                button.displacement = dcc_left(button) - dcc_pageX(event);

                /* prevent selection event when dragging */
                dcc_body.onselectstart = function() {
                    return false;
                };
            };
        },

        /**
         * This event handler is invoked when the user continues dragging
         * the slider button.
         * 
         * @param {Object} button Event is attached to the button DOM node.
         */
        getDragHandler: function(button) {
            var me = this;
            return function(event) {
                event = dcc_getEvent(event);
                if (dcc_mouseDown) {
                    var newPosition = dcc_pageX(event) + button.displacement;

                    /* keep slider button within range */
                    if (newPosition >= me.minButtonLeft
                        && newPosition <= me.maxButtonRight) {
                        dcc_left(button, newPosition);
                        me.value.value = me.valueFromPosition();
                        if (me.onValueChange)
                            me.onValueChange(me.value.value);
                    }
                }
            };
        },

        /**
         * Attaches events for implementing dragging event on slider button.
         */
        attachSliderDragHandler: function() {
            var me = this, sliderRegion = me.range, button = me.button,
                dragStart = me.getDragStartHandler(button),
                drag = me.getDragHandler(button);

            /* dragging event begins when user clicks on the slider button. */
            dcc_handleEvent(button, 'touchstart', dragStart);
            button.onmousedown = dragStart;

            /* dragging continues when user moves the mouse over the slider
             * region when the mouse button is depressed. */
            dcc_handleEvent(sliderRegion, 'touchmove', drag);
            sliderRegion.onmousemove = drag;
        },

        /**
         * The slider dimensions must be set based on the size of the labels,
         * supplied slider styling etc. Hence, these are calculated dynamically
         * after the components have been rendered.
         */
        refitSlider: function() {
            var me = this,
                /* vertical middle of the slider component */
                midHeight = me.sliderHeight * .5,

                /* label dimensions */
                labelWidth = dcc_width(me.label),
                labelHeight = dcc_height(me.label),
                labelTop = midHeight - labelHeight * .5,

                /* value box dimensions */
                valueWidth = dcc_width(me.value)
                + dcc_padding(me.value, 'left')
                + dcc_padding(me.value, 'right')
                + dcc_margin(me.value, 'left')
                + dcc_margin(me.value, 'right'),
                
                valueHeight = dcc_height(me.value)
                + dcc_padding(me.value, 'top')
                + dcc_padding(me.value, 'bottom'),
                valueTop = midHeight - valueHeight * .5,

                /* range contains the bar, button, and min and max labels */
                rangeWidth = me.sliderWidth - labelWidth - valueWidth
                - dcc_padding(me.range, 'left')
                - dcc_padding(me.range, 'right') - 2,
                rangeTop = 0,
                rangeHeight = me.sliderHeight,

                /* horizontal bar dimensions */
                barWidth = rangeWidth,
                barHeight = dcc_height(me.bar),
                barTop = midHeight - barHeight * .5,
                barLeft = dcc_padding(me.range, 'left'),

                /* slider button dimensions */
                buttonHeight = dcc_height(me.button),
                buttonTop = midHeight - buttonHeight * .5,

                /* min label dimensions */
                minWidth = dcc_width(me.min),
                minHeight = dcc_height(me.min),
                minTop = midHeight + buttonHeight * .5 + minHeight * .25,
                minLeft = barLeft - minWidth * .5,

                /* max label dimensions */
                maxWidth = dcc_width(me.max),
                maxTop = minTop,
                maxLeft = barLeft + rangeWidth - maxWidth * .5;

            /* the following values are used when converting slider value to
             * button position, and vice versa */
            me.buttonWidth = dcc_width(me.button);
            me.halfButtonWidth = .5 * me.buttonWidth;
            me.barLeft = barLeft;
            me.barRight = barLeft + barWidth;
            me.barWidth = barWidth;
            me.minButtonLeft = barLeft - me.halfButtonWidth;
            me.maxButtonRight = me.barRight - me.halfButtonWidth;

            /* using the dimensions just calculated, resize components */
            dcc_width(me.slider, me.sliderWidth);
            dcc_height(me.slider, me.sliderHeight);

            dcc_top(me.label, labelTop);
            dcc_top(me.value, valueTop);
            dcc_top(me.range, rangeTop);
            dcc_width(me.range, rangeWidth);
            dcc_height(me.range, rangeHeight);

            dcc_top(me.bar, barTop);
            dcc_width(me.bar, barWidth);
            dcc_left(me.bar, barLeft);

            dcc_top(me.button, buttonTop);
            dcc_width(me.button, me.buttonWidth);

            dcc_top(me.min, minTop);
            dcc_left(me.min, minLeft);
            dcc_top(me.max, maxTop);
            dcc_left(me.max, maxLeft);

            me.setValue();
            return me;
        },

        /**
         * Render the components of the slider by adding DOM nodes for each of
         * the components. Note that the identifier for each of the components
         * are derived from the slider identifier.
         *
         * @param {Object} parent Parent DOM nodes that contains the slider.
         */
        renderSlider: function(parent) {
            var me = this, id = me.id, prefix = 'dcc-slider';

            /* contains the entire slider */
            me.slider = dcc_createNode(parent, 'div', id, prefix);

            /* slider label */
            me.label = dcc_createNode(me.slider, 'div',
                id + '-label', prefix + '-label', me.labelText);

            /* editable slider value box */
            me.value = dcc_createNode(me.slider, 'input',
                id + '-value', prefix + '-value');

            /**
             * Attach event handler that updates slider button position when the
             * value in this box changes.
             * 
             * @param {Object} event Event object for key up.
             */
            me.value.onkeyup = function(event) {
                me.setValue(me.value.value);
            };

            /* important to call this after attaching the event above */
            me.value.value = me.defaultValue;

            /* range contains the bar, button, and min and max labels */
            me.range = dcc_createNode(me.slider, 'div',
                id + '-range', prefix + '-range');
            me.bar = dcc_createNode(me.range, 'div',
                id + '-bar', prefix + '-bar');
            me.button = dcc_createNode(me.range, 'div',
                id + '-button', prefix + '-button');

            /* resets the p-value threshold to default value */
            me.reset = dcc_createNode(me.range, 'div',
                id + '-reset', prefix + '-reset');
            dcc_attr(me.reset, 'title', 'Reset slider value');
            dcc_handleEvent(me.reset, 'click', function() {
                me.setValue();
            });

            me.min = dcc_createNode(me.range, 'div',
                id + '-min', prefix + '-min', me.minValue);
            me.max = dcc_createNode(me.range, 'div',
                id + '-max', prefix + '-max', me.maxValue);

            me.refitSlider();
            me.attachSliderDragHandler(me);
            me.onValueChange(me.value.value);
            return me;
        },

        /**
         * Sets slider value and position of the slider button.
         * 
         * @param {Real} value New value for the slider.
         */
        setValue: function(value) {
            var me = this;
            me.value.value = value === undefined ? me.defaultValue : value;
            me.buttonLeft = me.positionFromValue();
            dcc_left(me.button, me.buttonLeft);
            me.onValueChange(me.defaultValue);
        },

        hideSlider: function() {
            dcc_style(this.slider, 'visibility', 'hidden');
        },

        showSlider: function() {
            dcc_style(this.slider, 'visibility', 'visible');
        }
    };

    /**
     * Ensures that the string ends with a slash. This is used for converting
     * URL paths.
     * 
     * @param {String} str Original string.
     * @returns {String} String with '/' at the end.
     */
    function dcc_endWithSlash(str) {
        return str.substring(str.length - 1) !== '/' ?
            str + '/' : str;
    }

    /**
     * Implements PhenoDCC Heatmap.
     * 
     * @param {Object} prop Configuration object that specialises the heatmap.
     */
    dcc.PhenoHeatMap = function(prop) {
        if (prop === undefined)
            dcc_reportError('Invalid heatmap properties');
        this.version = dcc_semanticVersion;
        if (!this.checkHostDivElement(prop.container))
            return;
        this.id = prop.container; /* container identifier */

        if (prop.mgiid === undefined || prop.mgiid.length < 1)
            dcc_reportError('Invalid MGI identifier');
        this.mgiId = prop.mgiid;

        /* ontological or procedural (default is procedural) */
        this.isOntological = prop.mode === 'ontological';
        this.numColumns = (prop.ncol === undefined ? 5 : prop.ncol);

        if (prop.url === undefined)
            dcc_reportError('Invalid URL properties');

        this.jssrc = prop.url.jssrc === undefined ? 'js/' : prop.url.jssrc;
        this.jssrc = dcc_endWithSlash(this.jssrc);
        this.json = prop.url.json === undefined ? 'rest/' : prop.url.json;
        this.json = dcc_endWithSlash(this.json);
        if (prop.url.viz === undefined || typeof prop.url.viz !== 'function')
            dcc_reportError('Invalid vizualisation target URL generator');
        this.viz = prop.url.viz;

        this.rowFormatter = dcc_rowFormatter;
        this.columnFormatter = dcc_columnFormatter;
        if (prop.format !== undefined) {
            if (prop.format.row !== undefined) {
                if (typeof prop.format.row !== 'function')
                    dcc_reportError('Invalid row formatter');
                else
                    this.rowFormatter = prop.format.row;
            }

            if (prop.format.column !== undefined) {
                if (typeof prop.format.column !== 'function')
                    dcc_reportError('Invalid column formatter');
                else
                    this.columnFormatter = prop.format.column;
            }
        }

        this.pvalueExtractor = dcc_pvalueExtractor;
        this.keyExtractor = dcc_keyExtractor;
        if (prop.extract !== undefined) {
            if (prop.extract.pvalue !== undefined) {
                if (typeof prop.extract.pvalue !== 'function')
                    dcc_reportError('Invalid p-value extractor');
                else
                    this.pvalueExtractor = prop.extract.pvalue;
            }

            if (prop.extract.key !== undefined) {
                if (typeof prop.extract.key !== 'function')
                    dcc_reportError('Invalid key extractor');
                else
                    this.keyExtractor = prop.extract.key;
            }
        }

        /* we accelerate rendering of the p-values cells by defining a window
         * which completely encapculates only the visible p-value cells */
        this.windowRowStart = 0;
        this.windowRowEnd = 0;
        this.windowColumnStart = 0;
        this.windowColumnEnd = 0;

        /* references to the important data */
        this.data = null;
        this.dataRowHeaders = null;
        this.dataColumnHeaders = null;
        this.dataPvalues = null;
        this.dataNumRows = 0;
        this.dataNumColumns = 0;
        this.dataMinValue = null;
        this.dataMaxValue = null;
        this.dataValueRange = null;

        /* colour gradient extremes */
        this.significantColour = null;
        this.insignificantColour = null;
        this.highlightedSignificantColour = null;
        this.highlightedInsignificantColour = null;

        /* RGB channels for the above colours */
        this.significantColourChannels = null;
        this.insignificantColourChannels = null;
        this.highlightedSignificantColourChannels = null;
        this.highlightedInsignificantColourChannels = null;

        /* these values should match the value specified in the CSS file
         * NOTE:
         * To include the cell borders, 2 pixels are added to the CSS values. */
        this.rowHeaderCellHeight = 47;
        this.columnHeaderCellWidth = 102;

        /* handles to the legend colour boxes, for setting or changing colour */
        this.significant = null;
        this.insignificant = null;
        this.significantHighlighted = null;
        this.insignificantHighlighted = null;

        /* row and column pegging allows a row/column to be highlighted */
        this.pegged = {};
        this.activePeg = {};

        /* breadcrum stack which stores the navigational history */
        this.breadcrums = [{
                'l': 'Overview'
            }];

        /* The navigation bar DOM node that contains the breadcrums */
        this.breadcrumsNode = null;
        this.currentPage = 0;

        this.cells = null;
        this.pvalueThreshold = 0;

        this.colourPicker = null;
        this.colourBoxIndex = 0;

        /* popup parameters */
        this.popuGid = null;
        this.popupType = null;

        this.initialiseHeatmap();
    };

    /**
     * The following are object methods that are common to all heatmaps.
     */
    dcc.PhenoHeatMap.prototype = {
        getVersion: function() {
            return this.version;
        },

        /**
         * Updates web service resources URL that supply phenotype annotations.
         * This is used when switching modes between procedural and ontological.
         */
        updateUrls: function() {
            var me = this;
            if (me.isOntological)
                me.detailsUrl = me.heatmapUrl = me.json + 'ontological/';
            else
                me.detailsUrl = me.heatmapUrl = me.json + 'procedural/';
            me.heatmapUrl += 'heatmap';
            me.detailsUrl += 'details';
        },

        /**
         * Switching mode between procedural and ontological.
         */
        changeMode: function() {
            var me = this;
            me.type = undefined;
            me.isOntological = !me.isOntological;
            me.updateUrls();
            me.breadcrums = [{
                    'l': 'Overview'
                }];
            me.updateNavigationBar();
            me.retrieveSingleGeneData();
        },

        /**
         * Users are allowed to customise the colour for displaying significant
         * or insignificant phenotype calls. Since these colours are chosen
         * using the heatmap legends, the following functions prepares them
         * for use in rendering the p-value cells.
         */
        prepareColours: function() {
            var me = this;
            me.significantColour = dcc_bgColour(me.significant);
            me.insignificantColour = dcc_bgColour(me.insignificant);
            me.significantColourChannels
                = dcc_splitColourToIntegralChannels(me.significantColour);
            me.insignificantColourChannels
                = dcc_splitColourToIntegralChannels(me.insignificantColour);
        },

        /**
         * All of the p-value cells in the heatmap are active. By hovering or
         * clicking on these cells, users can retrieve further details about
         * that cell. The following attaches the required event handlers that
         * does the displaying of details.
         * 
         * @param {Object} td DOM node that corresponds to the p-value cell.
         * @param {Real} pvalue The associated p-value of the annotation.
         * @param {Integer} gid Genotype identifier.
         * @param {String} type Corresponding ontology or procedure.
         */
        addCellEventHandlers: function(td, pvalue, gid, type) {
            var me = this, click, hover;
            if (pvalue !== undefined && type) {
                dcc_class(td, 'clickable');

                click = me.getCellOnClickHandler(gid, type);
                hover = me.getCellOnMouseoverHandler(gid, type);

                td.onmouseup = click;
                td.onmouseover = hover;

                dcc_handleEvent(td, 'touchstart', function(event) {
                    dcc_preventEventBubbling(event);
                    td.touchEvent = event;
                    td.touchStartTime = new Date();
                });

                /* On touch devices, since we do not have hover event, we use
                 * the 'touch start' to identify both clicking and hovering.
                 * However, to activate click events, the user must press
                 * the cell for 1000 milliseconds before releasing. If released
                 * prior to this, the event will be interpreted as hovering */
                dcc_handleEvent(td, 'touchend', function(event) {
                    var now = new Date();
                    dcc_preventEventBubbling(event);
                    if (now.getTime() - td.touchStartTime.getTime() > 1000)
                        click(td.touchEvent);
                    else
                        hover(td.touchEvent);
                });
            }
        },

        /**
         * We initially had the option of exploring multiple gene annotations
         * simultaneously. However, due to user feedback this exploration mode
         * feature was removed. The heatmap now only shows annotations for one
         * gene. The following function implements this one gene scenario.
         * 
         * @param {Object} parent Parent DOM node.
         * @returns {Object} The contents DOM node.
         */
        prepareSingleGeneContent: function(parent) {
            return this.content =
                dcc_createNode(parent, 'div', null, 'dcc-heatmap-content');
        },

        /**
         * We use a breadcum UI to display the depth of the annotation. For
         * instance, viewing annotations for a specific procedure is deeper than
         * viewing annotations for a group of related procedures.
         * 
         * This function pushes the supplied breadcrum at the top of the stack.
         * To avoid infinite navigation self-loop, we first check if the
         * breadcrum already exists. If it does exists, we pop out all of the
         * breadcrums that are on top of it. Otherwise, we push a new one.
         *
         * @param {String} key Unique node identifier in the hierarchical tree.
         * @param {String} label Node label to showSlider in navigation bar.
         */
        pushBreadcrum: function(key, label) {
            var me = this, count = me.breadcrums.length;

            /* find the breadcrum starting at the top of the breadcrum stack */
            for (var i = count - 1; i > - 1; --i)
                if (me.breadcrums[i].k === key)
                    break;

            /* clear out children breadcrums, or push a new one */
            if (i > -1)
                while (++i < count)
                    me.breadcrums.pop();
            else
                me.breadcrums.push({
                    'k': key,
                    'l': label
                });

            me.updateNavigationBar();
        },

        /**
         * Retrieves the HeatMap data retriever for the current key.
         *
         * @param {String} key Unique node identifier in the hierarchical tree.
         * @param {String} label Node label to show in breadcrum navigator.
         */
        getHeatmapRetriever: function(key, label) {
            var me = this;
            return function() {
                me.type = key;
                me.retrieveSingleGeneData(key, label);
            };
        },

        /**
         * Creates a checkbox.
         *
         * @param {Object} parent Container for the checkbox.
         * @param {String} label Label to showSlider against the checkbox.
         * @param {Boolean} selected Is the checkbox initially selected.
         * @param {Function} onclick Processing to do after mouse click.
         *
         * @return {Object} The newly created checkbox node.
         */
        createCheckbox: function(parent, label, selected, onclick) {
            var cls = 'dcc-heatmap-checkbox-',
                selectedCls = cls + 'selected',
                unselectedCls = cls + 'unselected',
                checkbox = dcc_createNode(parent, 'div', null, null, label);

            if (selected) {
                checkbox.isSelected = true;
                cls = selectedCls;
            } else {
                checkbox.isSelected = false;
                cls = unselectedCls;
            }
            checkbox.className = cls;

            checkbox.onclick = function(event) {
                if (checkbox.isSelected) {
                    checkbox.isSelected = false;
                    checkbox.className = unselectedCls;
                } else {
                    checkbox.isSelected = true;
                    checkbox.className = selectedCls;
                }
                if (onclick)
                    onclick();
            };

            return checkbox;
        },

        /**
         * This function is invoked when the user customises the heatmap by
         * seleting colours for significant and insignificant annotations
         * using the heatmap legends.
         * 
         * @param {Object} event Event when user click on the colour selector.
         * @param {type} colour The colour that was selected by clicking.
         */
        selectColour: function(event, colour) {
            var me = this;
            switch (me.colourBoxIndex) {
                case 0:
                    dcc_bg(me.significant, colour);
                    break;
                case 1:
                    dcc_bg(me.insignificant, colour);
                    break;
                case 2:
                    dcc_bg(me.significantHighlighted, colour);
                    break;
                case 3:
                    dcc_bg(me.insignificantHighlighted, colour);
                    break;
                default:
                    return;
            }
            me.hideColourPicker();
            me.prepareColours();
        },

        /**
         * When the user hovers over the heatmap legends, a colour picker is
         * displayed. This contains an array of preset colours. This function
         * returns an event handler that will be invoked when the user clicks
         * on one of the colour cells.
         *
         * @param {String} colour What colour to select when clicked on.
         * @returns {Function} Event handler to invoke when user clicks on cell.
         */
        getColourSelector: function(colour) {
            var me = this;
            return function(event) {
                me.selectColour(dcc_getEvent(event), colour);
                me.updatePvalueSections();
            };
        },

        /**
         * When a user hovers over the heatmap legends, a colour picker is
         * displayed. The following functions prepares this colours picker.
         * 
         * @param {Object} parent DOM node that contains the colour picker.
         * @returns {Object} DOM node that represents the colour picker.
         */
        createColourPicker: function(parent) {
            var me = this, i, j, td, c = 0, colour,
                colourGridNumColumns = 4, colourGridNumRows = 5, 
                fragment = document.createDocumentFragment(),
                colourPicker = dcc_createNode(fragment, 'div', null,
                'dcc-heatmap-colour-picker'),
                tbody = dcc_createNode(dcc_createNode(colourPicker, 'table'), 'tbody');

            colourPicker.onmouseover = function(event) {
                event = dcc_getEvent(event);
                dcc_preventEventBubbling(event);
            };

            for (i = 0; i < colourGridNumRows; ++i) {
                dcc_createNode(tbody, 'tr');
                for (j = 0; j < colourGridNumColumns; ++j) {
                    td = dcc_createNode(tbody, 'td');
                    colour = availableColours[c++];
                    if (colour === undefined)
                        dcc_style(td, 'cursor', 'default');
                    else {
                        dcc_bg(td, colour);
                        td.onmouseup = me.getColourSelector(colour);
                    }
                }
            }
            parent.appendChild(fragment);

            /* hide colour picker handler */
            parent.onmouseover = function() {
                me.hideColourPicker();
                me.colourBoxIndex = undefined;
            };

            return me.colourPicker = colourPicker;
        },

        /**
         * Displays the colour picker by placing it relative to the legend box.
         * 
         * @param {Object} event The hovering event that initiated the display.
         */
        showColourPicker: function(event) {
            var me = this, node = event.target, x, y,
                displacement = 10; /* so that mouse pointer is on top */
            if (dcc.ie8) {
                x = dcc_windowX(event) - displacement;
                y = dcc_windowY(event) - displacement;
            } else {
                x = node.offsetLeft;
                y = node.offsetTop;
            }
            dcc_left(me.colourPicker, x);
            dcc_top(me.colourPicker, y);
            dcc_style(me.colourPicker, 'visibility', 'visible');
        },

        hideColourPicker: function() {
            var me = this;
            dcc_style(me.colourPicker, 'visibility', 'hidden');
        },

        /**
         * The heatmap displays a list of legends that specify the colour
         * that is used to identify significant or insignificant annotations.
         * The following creates a legend colour box.
         * 
         * @param {Object} parent Parent node that will contain the legends.
         * @param {String} label What does the legend mean.
         * @param {String} type What is the type of the annotation.
         * @param {Integer} index The current colour used to identify type.
         * @returns {Object} DOM node that represents the legend colour box.
         */
        createLegend: function(parent, label, type, index) {
            var me = this, cls = 'dcc-heatmap-toolbar-legend-',
                legends = dcc_createNode(parent, 'div',
                    null, 'dcc-heatmap-toolbar-legend'),
                colourBox = dcc_createNode(legends, 'div',
                    null, cls + type + '-colour');

            dcc_createNode(legends, 'div', null, cls + 'label', label);
            if (index !== undefined) {
                colourBox.onmouseover = function(event) {
                    event = dcc_getEvent(event);
                    dcc_preventEventBubbling(event);
                    me.showColourPicker(event);
                    me.colourBoxIndex = index;
                };
            }
            return colourBox;
        },

        /**
         * Appends a legend to the list of legends currently displayed.
         * 
         * @param {Object} parent Parent DOM node that contains the legends.
         */
        appendLegends: function(parent) {
            var me = this;
            me.significant =
                me.createLegend(parent, 'Significant', 'significant', 0);
            me.insignificant =
                me.createLegend(parent, 'Insignificant', 'insignificant', 1);
            dcc_style(me.createLegend(parent, 'No data', 'nodata'),
                'cursor', 'default');
        },

        /**
         * The navigation bar is displayed at the top of the heatmap. It
         * contains the breadcrum UI and ontological/procedural mode switcher.
         * This function updates the navigation bar when the depth of the
         * annotation level changes, or when the mode is switched.
         */
        updateNavigationBar: function() {
            var me = this, i = 0, n = me.breadcrums.length, datum, temp,
                fragment = document.createDocumentFragment(),
                crumPrefix = 'dcc-heatmap-breadcrum-',
                modePrefix = crumPrefix + 'mode-',
                active = modePrefix + 'active',
                inactive = modePrefix + 'inactive';

            if (me.title) {
                dcc_createNode(fragment, 'div', null,
                    crumPrefix + 'gene', me.title);
                dcc_createNode(fragment, 'div', null,
                    crumPrefix + 'gene-separator');
            }

            while (i < n) {
                datum = me.breadcrums[i++];
                if (datum === undefined)
                    continue;

                temp = dcc_createNode(fragment, 'div', null,
                    crumPrefix + 'item', datum.l);
                temp.onmouseup = me.getHeatmapRetriever(datum.k, datum.l);
                temp = dcc_createNode(fragment, 'div', null,
                    crumPrefix + 'separator');
            }

            me.ontological = dcc_createNode(fragment, 'div', null,
                me.isOntological ? active : inactive, 'Ontological');
            me.procedural = dcc_createNode(fragment, 'div', null,
                me.isOntological ? inactive : active, 'Procedural');

            dcc_handleEvent(me.ontological, 'click', function() {
                if (me.isOntological)
                    return;
                dcc_class(me.procedural, inactive);
                dcc_class(me.ontological, active);
                me.changeMode();
            });
            dcc_handleEvent(me.procedural, 'click', function() {
                if (!me.isOntological)
                    return;
                dcc_class(me.ontological, inactive);
                dcc_class(me.procedural, active);
                me.changeMode();
            });

            dcc_handleEvent(dcc_createNode(fragment, 'div', null,
                crumPrefix + 'help', 'Help'), 'click', function(event) {
                event = dcc_getEvent(event);
                dcc_preventEventBubbling(event);
                window.open(me.jssrc + '../manual.html', '_self');
            });

            dcc_removeChildrenSubtrees(me.breadcrumsNode);
            me.breadcrumsNode.appendChild(fragment);
        },

        /**
         * This prepares the heatmap toolbar which contains the breadcrum
         * navigator, annotation legends and the p-value selection tools. 
         * 
         * @param {Object} parent Parent DOM node.
         * @returns {Object} Toolbar DOM node.
         */
        prepareToolbar: function(parent) {
            var me = this, p = 'dcc-heatmap-toolbar-',
                genes = dcc_createNode(parent, 'div', null, 'dcc-heatmap-genes'),
                toolbar = dcc_createNode(parent, 'div', null, p + 'toolbar'),
                breadcrums = dcc_createNode(toolbar, 'div', null, p + 'breadcrums'),
                legends = dcc_createNode(toolbar, 'div', null, p + 'legends'),
                pvalueTools = dcc_createNode(toolbar, 'div', null, p + 'pvaluetools'),
                sliderOnValueChangeHandler =
                function() {
                    me.pvalueThreshold = me.pValueSlider.getSliderValue();
                    me.updatePvalueSections();
                };

            me.showpValueGradient = me.createCheckbox(pvalueTools,
                'Show gradient', false,
                function() {
                    if (me.showpValueGradient.isSelected)
                        me.pValueSlider.hideSlider();
                    else
                        me.pValueSlider.showSlider();
                    me.updatePvalueSections();
                });

            me.pValueSlider = new Slider(pvalueTools,
                'p-value-slider',
                'p-value threshold:',
                0.0, 1.0, 50, 500,
                function() {
                    dcc_throttle(sliderOnValueChangeHandler, 50, me);
                }, 0.0001);
            me.pvalueThreshold = me.pValueSlider.valueFromPosition();

            me.geneDetails = genes;
            me.legends = me.appendLegends(legends);
            me.breadcrumsNode = breadcrums;
            me.updateNavigationBar();

            return me.toolbar = toolbar;
        },

        /**
         * Creates heatmap user interface inside the supplied parent DOM node.
         *
         * @param {Object} parent Container DOM node.
         */
        createInterface: function(parent) {
            var me = this;
            me.prepareToolbar(parent);
            me.prepareSingleGeneContent(parent);
            return parent;
        },

        destroyInterface: function(parent) {
            dcc_removeChildrenSubtrees(parent);
        },

        /**
         * Round p-value to required precision.
         *
         * @param {Integer} row Row index for the data.
         * @param {Integer} column Column index for the data.
         *
         * @returns {Real} Floating point value.
         */
        pvaluePrecision: function(row, column) {
            var me = this;
            return me.dataPvalues[row][column].v =
                dcc_precision(me.pvalueExtractor(me.dataPvalues[row][column]));
        },

        /**
         * Converts the supplied p-value into the corresponding gradient colour
         * for one of the possible cell states (normal, or, highlighted.
         *
         * To convert a p-value to the corresponding colour channels,
         *
         * o we must first scale the p-value, which is in the range
         *   [me.minValue, me.dataMaxValu], to the range [0, 1].
         *
         * o then we use linear interpolation to calculate the colour channels
         *   using the channels of the colour gradient extremes.
         *
         * This ensures that the colour gradient is normalised depending on the
         * p-value extremes, thus increasing the variation of the HeatMap.
         *
         * @param {Real} value The p-value to convert.
         * @param {Boolean} isHighlighted Is the cell to be painted highlighted?
         */
        getPvalueGradientColour: function(value, isHighlighted) {
            var me = this, channels,
                /* scale p-value to range [0, 1] */
                scaled = (value - me.dataMinValue) / me.dataValueRange;

            /* the cell colour channels for normal and highlighted states
             * Note that we assign higher colours to lower p-values as lower
             * p-values mean higher significance) */
            channels = isHighlighted
                ? dcc_getGradientColor(me.highlightedSignificantColourChannels,
                me.highlightedInsignificantColourChannels, scaled)
                : dcc_getGradientColor(me.significantColourChannels,
                me.insignificantColourChannels, scaled);

            /* convert channels to hexadecimal value */
            return dcc_convertChannelsToHexColour(channels);
        },

        /**
         * The heatmap might display multiple alleles for the same gene. Hence,
         * we must find a way to distinguish between multiple versions of the
         * same gene (e.g., by allele, by centre etc.). This functions decides
         * which fields are different, so that we can prepare the unique
         * identifier for display in the heatmap.
         * 
         * @param {Object} lines Get the list of lines to display in heatmap.
         * @returns {Object} Boolean flags to mark fields that are different.
         */
        checkWhatFieldsAredifferent: function(lines) {
            var i, c = lines.length, line,
                differentAllele = 0, differentStrain = 0, differentCentre = 0,
                currentAllele, currentStrain, currentCentre;

            if (c > 0) {
                line = lines[0];
                currentAllele = line.a;
                currentStrain = line.s;
                currentCentre = line.i;

                for (i = 1; i < c; ++i)
                    if (currentAllele !== lines[i].a) {
                        differentAllele = 1;
                        break;
                    }
                for (i = 1; i < c; ++i)
                    if (currentStrain !== lines[i].s) {
                        differentStrain = 1;
                        break;
                    }
                for (i = 1; i < c; ++i)
                    if (currentCentre !== lines[i].i) {
                        differentCentre = 1;
                        break;
                    }
            }
            return {
                'allele': differentAllele,
                'strain': differentStrain,
                'centre': differentCentre
            };
        },

        /**
         * Proper row headers based on proper discussion. Details at:
         * 
         * http://confluence/pages/viewpage.action?pageId=14025316
         */
        generateRowIdentifiers: function() {
            var me = this, lines = me.dataColumnHeaders, i, c = lines.length,
                diff, line, allele, shortAllele, strain, centre, ilar, temp,
                maxNumChars = 32;

            /* set the gene symbol as title */
            me.title = lines[0].g;

            /* if there is only one row, just use gene symbol */
            if (c === 1) {
                me.dataColumnHeaders[0].u = me.title;
                return;
            } else {
                diff = me.checkWhatFieldsAredifferent(lines);
                for (i = 0; i < c; ++i) {
                    line = lines[i];
                    allele = line.a;
                    strain = line.s;
                    centre = line.c;
                    ilar = line.i;

                    /* extract superscripted string */
                    temp = allele ? allele.match(/.*<sup>(.*)<\/sup>/) : null;
                    me.dataColumnHeaders[i].a = allele = temp ? temp[1] : '';

                    /* bit of a hack, but is specified, so... */
                    shortAllele = allele ? allele.split('(')[0] : '';

                    if (diff.allele && !diff.strain && !diff.centre) {
                        if (allele.search("tm1a\\(") !== -1) {
                            me.dataColumnHeaders[i].u = "Conditional ready";
                        } else if (allele.search("tm1b\\(") !== -1) {
                            me.dataColumnHeaders[i].u = "Cre-excised deletion";
                        } else if (allele.search("tm1c\\(") !== -1) {
                            me.dataColumnHeaders[i].u = "Conditional";
                        } else if (allele.search("tm1d\\(") !== -1) {
                            me.dataColumnHeaders[i].u = "Deletion";
                        } else if (allele.search("tm1e\\(") !== -1) {
                            me.dataColumnHeaders[i].u = "Targeted non-conditional";
                        } else if (allele.search("tm1.1\\(") !== -1) {
                            me.dataColumnHeaders[i].u = "Cre-excised deletion";
                        } else if (allele.search("tm1\\(") !== -1) {
                            me.dataColumnHeaders[i].u = "Deletion";
                        } else {
                            me.dataColumnHeaders[i].u = allele;
                        }
                    } else if (!diff.allele && !diff.strain && diff.centre) {
                        me.dataColumnHeaders[i].u = centre.length < maxNumChars
                            ? centre : ilar;
                    } else if (!diff.allele && diff.strain && !diff.centre) {
                        me.dataColumnHeaders[i].u = strain;
                    } else if (diff.allele && diff.centre) {
                        me.dataColumnHeaders[i].u = shortAllele + ' (' + ilar + ')';
                    } else if (diff.allele && diff.strain) {
                        me.dataColumnHeaders[i].u = shortAllele + ' (' + strain + ')';
                    } else if (diff.strain && diff.centre) {
                        me.dataColumnHeaders[i].u = strain + ' (' + ilar + ')';
                    } else {
                        me.dataColumnHeaders[i].u = i + 1;
                    }

                    if (me.dataColumnHeaders[i].u.length > maxNumChars)
                        me.dataColumnHeaders[i].u = i + 1;
                }
            }
        },

        /**
         * Pre-processes the two-dimensional p-values array before rendering the
         * heat map. This allows us to set the extremes of the colour gradient
         * to match the bounding p-values.
         */
        processData: function() {
            var me = this, i, j, nr, nc, pvalue, min, max;

            /* @TODO: should try to remember appropriate pegs */
            me.pegged = {};

            /* used by lots of functions for generating the headers and grid */
            nr = me.dataNumRows = me.dataRowHeaders.length,
                nc = me.dataNumColumns = me.dataColumnHeaders.length;

            /* p-values will always be in the interval [0,1] */
            min = 2.0;
            max = -2.0;

            for (i = 0; i < nr; ++i)
                for (j = 0; j < nc; ++j) {
                    pvalue = me.dataPvalues[i][j];
                    if (pvalue < 0)
                        continue;
                    if (pvalue < min)
                        min = pvalue;
                    else if (pvalue > max)
                        max = pvalue;
                }

            /* these values are used in colour gradient calculations */
            me.dataMinValue = min;
            me.dataMaxValue = max;
            me.dataValueRange = me.dataMaxValue - me.dataMinValue;
            me.generateRowIdentifiers();
        },

        /**
         * Retrieves the data object from the server response.
         * 
         * @param {Object} data Response object from the server.
         * @param {String} name Name of the data field to extract.
         * @returns {Object} Field value.
         */
        getDataObject: function(data, name) {
            var obj = null;
            if (typeof data[name] === 'undefined')
                dcc_reportError("Missing 'row_headers' object/attribute in data");
            else
                obj = data[name];
            return obj;
        },

        /**
         * Retrieves heatmap data from the server response.
         * 
         * @param {Object} data Response object from the server.
         * @returns {Object} Heatmap data.
         */        
        extractHeatmapData: function(data) {
            var me = this, rowHeaders, columnHeaders, pvalues;
            if (typeof data.heatmap === 'undefined')
                dcc_reportError("Missing 'heatmap' object in data");
            else {
                data = data.heatmap;
                rowHeaders = me.getDataObject(data, 'row_headers');
                if (rowHeaders) {
                    columnHeaders = me.getDataObject(data, 'column_headers');
                    if (columnHeaders) {
                        pvalues = me.getDataObject(data, 'significance');
                        if (pvalues) {
                            me.data = data;
                            me.dataRowHeaders = rowHeaders;
                            me.dataColumnHeaders = columnHeaders;
                            me.dataPvalues = pvalues;
                            return true;
                        }
                    }
                }
            }
            return false;
        },

        /**
         * Checks if the heatmap data returned by the server is valid. If valid,
         * return the heatmap data object.
         * 
         * @param {Object} data Response object from the server.
         * @returns {Object|Boolean} Data object if valid; otherwise, false.
         */
        retrieveDataIfValid: function(data) {
            var me = this, success;
            if (data === undefined)
                dcc_reportError('Server returned invalid data');
            else {
                success = me.getDataObject(data, 'success');
                if (success !== null) {
                    if (success === true)
                        return me.extractHeatmapData(data);
                    else
                        dcc_reportError('Failed to retrieve data at server');
                }
            }
            return false;
        },

        /**
         * This function displays a list of all the genes and its variants at
         * the top of the heatmap.
         */
        fillGeneDetails: function() {
            var me = this, genesDetails = me.geneDetails, table, temp, tr, g,
                genes = me.dataColumnHeaders, i, c = genes.length;
            dcc_removeChildrenSubtrees(genesDetails);
            table = dcc_createNode(genesDetails, 'table');
            temp = dcc_createNode(table, 'thead');
            tr = dcc_createNode(temp, 'tr');
            dcc_createNode(tr, 'th', null, null, '#');
            dcc_createNode(tr, 'th', null, null, 'Descriptor');
            dcc_createNode(tr, 'th', null, null, 'Gene symbol');
            dcc_createNode(tr, 'th', null, null, 'Background strain');
            dcc_createNode(tr, 'th', null, null, 'Allele');
            dcc_createNode(tr, 'th', null, null, 'Phenotyping center');
            temp = dcc_createNode(table, 'tbody');

            for (i = 0; i < c; ++i) {
                g = genes[i];
                tr = dcc_createNode(temp, 'tr', null,
                    'dcc-row-' + (i % 2 ? 'even' : 'odd'));
                dcc_createNode(tr, 'td', null, null, i + 1);
                dcc_createNode(tr, 'td', null, null, g.u);
                dcc_createNode(tr, 'td', null, null, g.g);
                dcc_createNode(tr, 'td', null, null, g.s);
                dcc_createNode(tr, 'td', null, null, g.a);
                dcc_createNode(tr, 'td', null, null, g.c);
            }
        },

        /**
         * Displays notification when data is being loaded.
         * 
         * @param {Object} node DOM node that will contain the notification.
         * @param {String} msg The message to display in the notification.
         */
        showLoadingNotification: function(node, msg) {
            dcc_removeChildrenSubtrees(node);
            dcc_createNode(node, 'div', null,
                'dcc-heatmap-loading',
                "<div></div><span>" + msg + "</span>"
                );
        },

        /**
         * Hides notification when data has finished loading.
         * 
         * @param {Object} node DOM node that will contain the notification.
         */
        hideLoadingNotification: function(node) {
            dcc_removeChildrenSubtrees(node);
        },

        /**
         * Retrieves data for a single gene. Note that the gene may have
         * multiple variants with, say different alleles, centres etc. This
         * retrieves the data for all of these variants.
         * 
         * @param {String} key The key which identifies the phenotype group.
         * @param {String} label What label should go into the breadcrum.
         */
        retrieveSingleGeneData: function(key, label) {
            var me = this;
            if (me.mgiId === undefined)
                dcc_reportError('MGI identifier must be defined');
            else {
                me.showLoadingNotification(me.content, 'Loading heatmap...');
                dcc_get(me.heatmapUrl + '?'
                    + (me.mgiId === undefined ? '' : 'mgiid=' + me.mgiId)
                    + (me.type === undefined ? '' : '&type=' + me.type),
                    function(data) {
                        if (me.retrieveDataIfValid(data)) {
                            me.hideLoadingNotification(me.content);
                            me.processData();
                            me.fillGeneDetails();
                            me.renderPvalueGrid();
                            me.pushBreadcrum(key, label);
                        }
                    });
            }
        },

        /**
         * Updates the p-value cells that are currently displayed in the
         * heatmap. The colour of the cells are dependent on the colouring mode.
         * If gradients are enabled, we intrapolate the colour from the colours
         * of the significant and insignificant legends. If the gradients is
         * disabled, we use the p-value threshold to choose either the
         * significant or the insignificant colour.
         */
        updatePvalueSections: function() {
            var me = this, tds = me.pvalueSections,
                i, c, pvalue, td, noData = 'dcc-heatmap-nodata';

            if (tds === undefined)
                return;

            if (me.showpValueGradient.isSelected)
                for (i = 0, c = tds.length; i < c; ++i) {
                    td = tds[i];
                    pvalue = td.pvalue;
                    td = td.node;

                    if (pvalue === undefined)
                        dcc_class(td, noData);
                    else
                        dcc_bg(td, me.getPvalueGradientColour(pvalue));
                }
            else
                for (i = 0, c = tds.length; i < c; ++i) {
                    td = tds[i];
                    pvalue = td.pvalue;
                    td = td.node;

                    if (pvalue === undefined)
                        dcc_class(td, noData);
                    else
                        dcc_bg(td, pvalue < me.pvalueThreshold ?
                            me.significantColour : me.insignificantColour);
                }
        },

        /**
         * This event handler is invoked when a user clicks on one of the
         * rows that are currently displayed inside the details popup.
         * 
         * @param {Object} datum The data associated with the row.
         * @param {Boolean} isOntological Is the heatmap in ontological or
         *     procedural mode.
         */
        getPopupRowOnClickHandler: function(datum, isOntological) {
            var me = this;
            return function(event) {
                event = dcc_getEvent(event);
                dcc_preventEventBubbling(event);
                window.open(me.viz(me.popupGid,
                    isOntological ? datum.m : datum.k), '_self');
            };
        },

        /**
         * This prepares the details to be display inside a details popup dialog.
         * 
         * @param {Object} content Parent object that will contain the details.
         * @param {Object} data Data object to display inside the popup.
         * @param {Boolean} isOntological Is the heatmap in ontological or
         *     procedural mode.
         * @returns {Object} DOM node that contains the popup details.
         */
        preparePhenotypeTable: function(content, data, isOntological) {
            var me = this, c = data.length, i, tr, td, datum, icon, outcome,
                classPrefix = 'dcc-heatmap-popup-',
                popupContent = dcc_createNode(content, 'div',
                null, classPrefix + 'details'),
                tbody =
                dcc_createNode(dcc_createNode(popupContent, 'table'), 'tbody');
            
            if (isOntological)
                classPrefix += 'ont-';
            
            for (i = 0; i < c; ++i) {
                data[i].p = dcc_precision(data[i].p);
                datum = data[i];
                tr = dcc_createNode(tbody, 'tr', null,
                    classPrefix + (i % 2 ? 'even' : 'odd') + ' clickable');
                tr.onclick = me.getPopupRowOnClickHandler(datum, isOntological);
                if (isOntological)
                    dcc_createNode(tr, 'td', null, classPrefix + 'p', datum.a);
                dcc_createNode(tr, 'td', null, classPrefix + 'q', datum.n);
                td = dcc_createNode(tr, 'td', null, classPrefix + 'i');
                icon = dcc_createNode(td, 'div');
                dcc_createNode(tr, 'td', null, classPrefix + 't', datum.t);
                dcc_createNode(tr, 'td', null, classPrefix + 'v', datum.p);

                outcome = dcc_getSelectionOutcomeIconClass(datum.o);
                if (outcome !== null)
                    dcc_class(icon, outcome);
            }
            return popupContent;
        },

        /**
         * Prepares the popup. This brings in the correct popup details header
         * and the rows of phenotype annotations to be displayed.
         * 
         * @param {Object} data Contains data to display inside the popup.
         * @returns {Object} DOM node that contains the popup.
         */
        preparePopupContent: function(data) {
            var me = this, content = document.createDocumentFragment(),
                isOntological;
            if (typeof data.details === undefined)
                dcc_createNode(content, 'div', null,
                    'dcc-heatmap-popup-warning',
                    'Server returned invalid details');
            else {
                data = data.details;
                if (data.length > 0) {
                    isOntological = data[0].a !== undefined;
                    dcc_preparePopupHeader(content, isOntological);
                    content.popupContent =
                        me.preparePhenotypeTable(content, data, isOntological);
                } else
                    dcc_createNode(content, 'div', null,
                    'dcc-heatmap-popup-info',
                    'No significant parameters under current p-value threshold');
            }
            return content;
        },

        /**
         * Returns an event handler for events when user hovers mouse over
         * a p-value cell.
         * 
         * @param {Integer} gid Genotype identifier.
         * @param {String} type Type of display (could be a procedure type,
         *     parameter or an ontology parameter)
         * @returns {Function} Event handler.
         */
        getCellOnMouseoverHandler: function(gid, type) {
            var me = this;
            return function(event) {
                event = dcc_getEvent(event);
                dcc_preventEventBubbling(event);

                if (me.popupGid === gid && me.popupType === type)
                    return;
                else {
                    me.popupGid = gid;
                    me.popupType = type;
                }

                if (event.touches) {
                    event = event.touches;
                    if (event.length !== 1)
                        return;
                    event = event[0];
                }
                var x = dcc_windowX(event), y = dcc_windowY(event);
                me.showPopup(x, y);
                me.updatePopupContent();
                dcc_get(me.detailsUrl
                    + (!me.isOntological && isNaN(parseInt(type))
                    ? '/parameter' : '')
                    + (gid === undefined ? '' : '?gid=' + gid)
                    + '&type=' + type
                    + '&threshold=' + me.pvalueThreshold,
                    function(data) {
                        /* is mouse pointer still on the cell that triggered
                         * this Ajax call? Note that entering a cell resets
                         * these two values. */
                        if (me.popupGid === gid && me.popupType === type) {
                            me.updatePopupContent(me.preparePopupContent(data));

                            /* this will relocate popup so that it is visible */
                            me.movePopup(x, y);
                        }
                    });
            };
        },

        /**
         * Returns an event handler for events when user moves the mouse over
         * a p-value cell.
         * 
         * @returns {Function} Event handler.
         */
        getCellOnMousemoveHandler: function() {
            var me = this;
            return function(event) {
                event = dcc_getEvent(event);
                dcc_preventEventBubbling(event);
                me.movePopup(event);
            };
        },

        /**
         * Returns an event handler for events when user clicks on
         * a p-value cell.
         * 
         * @param {Integer} row Cell row.
         * @param {Integer} col Cell column.
         * @returns {Function} Event handler.
         */
        getCellOnClickHandler: function(row, col) {
            var me = this;
            return function(event) {
                event = dcc_getEvent(event);
                dcc_preventEventBubbling(event);
                window.open(me.viz(row, col), '_self');
            };
        },

        /**
         * The heatmap cell display is divided into sections. Each section
         * consists of phenotype headers followed by p-value cell rows for
         * each genotype variant.
         * 
         * @param {Object} rows Array of row headers.
         * @param {Object} columns Array of column headers.
         * @param {Integer} start Where to start in the array of column headers.
         * @param {Integer} count How many columns to display in one section.
         * @param {Integer} padding Number of cells that are unoccupied.
         * @param {Integer} numColonies Number of colonies corresponds to the
         *     gene variants.
         */
        fillSection: function(rows, columns, start, count, padding, numColonies) {
            var me = this, fragment = document.createDocumentFragment(),
                section = dcc_createNode(fragment, 'table',
                null, 'dcc-heatmap-section'),
                header = dcc_createNode(dcc_createNode(section, 'thead'), 'tr',
                null, 'dcc-heatmap-section-column-headers'),
                body = dcc_createNode(section, 'tbody'), rowHeader,
                type, col, i, j, k, pvalue, tr, td, tds = me.pvalueSections;

            /* create the header with procedure/parameter or ontology */
            dcc_createNode(header, 'th');
            for (i = 0, j = start; i < count; ++i, ++j) {
                col = columns[j];
                td = dcc_createNode(header, 'th',
                    null, null, me.rowFormatter(col));

                type = parseInt(me.keyExtractor(col));
                if (isNaN(type)) {
                    if (me.isOntological)
                        td.onmouseup = me.getHeatmapRetriever(
                            me.keyExtractor(col), td.innerHTML);
                    col.type = me.keyExtractor(col);
                } else {
                    td.onmouseup = me.getHeatmapRetriever(type, td.innerHTML);
                    col.type = type;
                }
                dcc_class(td, 'clickable');
            }
            
            /* fill in empty cells for unoccupied p-value cells */
            for (i = 0; i < padding; ++i)
                dcc_createNode(header, 'th');

            /* create rows for each gene/colony */
            if (tds === undefined)
                tds = [];
            for (i = 0; i < numColonies; ++i) {
                tr = dcc_createNode(body, 'tr');
                rowHeader = me.columnFormatter(rows[i]);
                dcc_createNode(tr, 'td', null,
                'dcc-heatmap-section-row-headers', rowHeader);
                for (j = 0, k = start; j < count; ++j, ++k) {
                    col = columns[k];
                    pvalue = me.pvaluePrecision(k, i);
                    td = dcc_createNode(tr, 'td', null, null, pvalue);
                    tds.push({
                        'node': td,
                        'pvalue': pvalue
                    });
                    me.addCellEventHandlers(td, pvalue,
                    me.keyExtractor(rows[i]), col.type);
                }
            }
            me.pvalueSections = tds;
            me.updatePvalueSections();
            me.content.appendChild(fragment);
            me.content.onmouseover = function(event) {
                event = dcc_getEvent(event);
                dcc_preventEventBubbling(event);
                me.hidePopup(event);
            };
        },

        /**
         * Renders the two-dimensional grid of p-value cells by rendring all of
         * the sections to satisfy the procedure/parameter or ontologies.
         */
        renderPvalueGrid: function() {
            var me = this, start = 0, count,
                /* we will display gene/colonies column headers as rows, so that
                 * each row of the section belongs to a gene/colony; and
                 * show the procedure/parameters/ontology as column header,
                 * although the server provides them as row headers. */
                columns = me.data.row_headers,
                rows = me.data.column_headers,
                columnsRemaining = columns.length,
                numColonies = rows.length,
                numColumnsPerSection = me.numColumns;

            if (columnsRemaining < 1)
                dcc_createNode(me.content, 'div', null,
                    'dcc-heatmap-no-sub', 'No subcategory found');
            else
                while (columnsRemaining > 0) {
                    count = numColumnsPerSection < columnsRemaining ?
                        numColumnsPerSection : columnsRemaining;
                    columnsRemaining -= numColumnsPerSection;
                    me.fillSection(rows, columns, start, count,
                        numColumnsPerSection - count, numColonies);
                    start += count;
                }
        },

        /**
         * View single gene heatmap.
         */
        viewSingleGene: function() {
            var me = this;
            me.createInterface(me.root);
            me.prepareColours();
            me.retrieveSingleGeneData();
            me.createColourPicker(me.root);
            me.createPopup(me.root);
        },

        /**
         * Creates the popup dialog.
         * 
         * @param {Object} parent DOM node that will contain the popup.
         * @returns {Object} DOM object that represents the popup.
         */
        createPopup: function(parent) {
            var me = this, p = 'dcc-heatmap-popup',
                popup = dcc_createNode(parent, 'div', null, p),
                content = dcc_createNode(popup, 'div', null, p + '-content'),
                close = dcc_createNode(popup, 'div', null, p + '-close');

            dcc_handleEvent(popup, 'mouseover', function(event) {
                event = dcc_getEvent(event);
                dcc_preventEventBubbling(event);
            });
            dcc_handleEvent(close, 'click', function(event) {
                event = dcc_getEvent(event);
                me.hidePopup(event);
            });
            popup.popupContent = content;
            popup.popupClose = close;
            return me.popup = popup;
        },

        /**
         * Update contents of the popup dialog.
         *
         * @param {Object} content New contents of the popup dialog.
         */
        updatePopupContent: function(content) {
            var me = this, node = me.popup.popupContent;
            if (content === undefined)
                me.showLoadingNotification(node, 'Loading details...');
            else {
                dcc_removeChildrenSubtrees(node);
                node.appendChild(content);
            }
        },

        /**
         * Display the popup dialog with the supplied content
         * relative to the supplied mouse position.
         * 
         * @param {type} x x-coordinate of the mouse.
         * @param {type} y y-coordinate of the mouse.
         * @param {type} content New content of the popup.
         */
        showPopup: function(x, y, content) {
            var me = this, popup = me.popup;
            me.updatePopupContent(content);
            dcc_style(popup, 'visibility', 'visible');
            me.movePopup(x, y);
        },

        /**
         * Check if the popup dialog has vertical scrollbar displayed.
         *
         * @returns {Boolean} True if scrollbar is visible; otherwise, false.
         */
        popupHasScroll: function() {
            var me = this, popupContent = me.popup.popupContent;
            return popupContent === undefined ? false :
                dcc_scrollHeight(popupContent) > dcc_height(popupContent);
        },

        /**
         * Returns the popup dialog box position relative to the supplied
         * mouse position.
         * 
         * @param {type} x x-coordinate of the mouse.
         * @param {type} y y-coordinate of the mouse.
         * @returns {dcc.PhenoHeatMap.prototype.getPopupPosition.Anonym$6}
         */
        getPopupPosition: function(x, y) {
            var me = this, padding = 50, popup = me.popup, diff,
                popupWidth = dcc_width(popup),
                popupHeight = dcc.ie8 ? 0 : dcc_height(popup),
                right = x + popupWidth + padding,
                bottom = y + popupHeight + padding,
                innerWidth = dcc_innerWidth(),
                innerHeight = dcc_innerHeight();

            diff = right - innerWidth;
            if (diff > 0)
                x -= diff;

            diff = bottom - innerHeight;
            if (diff > 0)
                y -= diff;

            return {
                'x': x,
                'y': y
            };
        },

        /**
         * Moves popup relative to supplied mouse position.
         *
         * @param {type} x x-coordinate of the mouse.
         * @param {type} y y-coordinate of the mouse.
         */
        movePopup: function(x, y) {
            var me = this, popup = me.popup, pos = me.getPopupPosition(x, y);
            dcc_left(popup, pos.x);
            dcc_top(popup, pos.y);
        },

        /**
         * Hides the popup box.
         */
        hidePopup: function() {
            var me = this;
            dcc_style(me.popup, 'visibility', 'hidden');
            me.popupGid = me.popupType = null;
        },

        /**
         * Checks if the supplied host div element is valid.
         *
         * @param {String} id Identifier of the parent DOM node.
         */
        checkHostDivElement: function(id) {
            var me = this, parent = document.getElementById(id);
            if (parent === null) {
                alert('Invalid heatmap host:\nNo DOM node with identifier\'' +
                    id + '\'');
                return false;
            }
            me.parent = parent;
            return true;
        },

        /**
         * Initialises the PhenoDCC Heatmap web application.
         */
        initialiseHeatmap: function() {
            var me = this, parent = me.parent;
            me.updateUrls();
            dcc_class(parent, 'phenodcc-heatmap');
            me.root = dcc_createNode(parent, 'div', null, 'dcc-heatmap-root');
            dcc_handleEvent(me.root, 'touchstart', function(event) {
                if (event.touches) {
                    event = event.touches;
                    if (event.length === 2) {
                        me.hidePopup();
                        me.hideColourPicker();
                    }
                }
            });
            dcc_handleEvent(dcc_body, 'mouseover', function(event) {
                me.hidePopup();
                me.hideColourPicker();
            });

            me.viewSingleGene();
            return true;
        }
    };
})();
