/**
 * Created by Butcheer on 23.06.14.
 */

$(window).load(function () {  // $(document).ready(... - w Chrome odpalana przed załadowaniem wszystkich obrazków (stąd różne wymiary )
        function Banner() {
            var param = {
                bannerid: "rotate-banner",
                slides: 5,
                center: 2,
                slides_width: [20, 30, 40, 30, 20],
                slides_position: [0.125, 0.25, 0.5, 0.75, 0.875],
                padding: { //px
                    top: 0,
                    right: 10,
                    bottom: 0,
                    left: 10
                },
                duration: 500,
                quick_duration: 100
            };
            var animation_ongoing = false;
            var banner = document.getElementById(param.bannerid);
            var that = this;
            this.init = function (parameters) {
                var initParameters = function (user_parameters) {
                    if (typeof user_parameters != 'undefined') {

                        for (var key in user_parameters) {
                            if (Object.prototype.hasOwnProperty.call(user_parameters, key)) {
                                param[key] = user_parameters[key];
                            }
                        }
                    }
                    param.slides = (param.slides % 2) ? param.slides : param.slides - 1;
                    param._center_position = Math.floor(param.slides / 2);
                    param.center = ((param.center < dd.length) && (param.center >= 0)) ? param.center - 1 : param._center_position;
                    initParamArrays();

                };
                var maxHeight = function () {
//                var styles = window.getComputedStyle(banner,null);
//                console.log('styles.computet.width: ', styles.width);
//                console.log('maxHeight->banner.offsetWidth: ' + banner.offsetWidth);
                    return (max_height.height * Math.max.apply(null, param.slides_width) * 0.01 * banner.offsetWidth) / max_height.width;
                };
                var initBanner = function (banner, max_height) {
                    banner.style.position = 'relative';
                    param.bottom_px = max_height * 0.01 * param.padding.bottom;
                    banner.style.height = max_height * (1 + (0.01 * (param.padding.top + param.padding.bottom))) + 'px';
                };
                var initParamArrays = function () {
                    if (param.slides_width.length != param.slides) {
                        param.slides_width = [];
                        param.slides_position = [];
                        param.slides_width[param._center_position] = 40;
                        param.slides_position[param._center_position] = 0.5;
                        for (var i = param._center_position - 1; i >= 0; i--) {
                            param.slides_width[i] = Math.round(param.slides_width[i + 1] / 2);
                            param.slides_position[i] = param.slides_position[i + 1] / 2;
                            param.slides_width[param.slides - (i + 1)] = param.slides_width[i];
                            param.slides_position[param.slides - (i + 1)] =
                                param.slides_position[param.slides - (i + 2)]
                                    + param.slides_position[i];
                        }
                    }
                };
                var initMaxHeight = function (dd) {
                    var obj = {
                        naturalHeight: 0
                    };
                    for (var i = 0; i < dd.length; i++) {
                        var img = dd[i].getElementsByTagName('IMG');
                        if (img[0].naturalHeight >= obj.naturalHeight) {
                            obj = img[0];
                            obj.index = i;
                        }
                    }
                    return {
                        width: obj.naturalWidth,
                        height: obj.naturalHeight
                    };
                };
                var setPosition = function (dd) {
                    $(dd[param.center]).data({position: param._center_position});
                    for (var i = param.center - 1; i >= 0; i--) {
                        $(dd[i]).data({position: $(dd[i + 1]).data('position') - 1});
                    }
                    for (i = param.center + 1; i < dd.length; i++) {
                        $(dd[i]).data({position: $(dd[i - 1]).data('position') + 1});
                    }
                };
                var dd = banner.getElementsByTagName('dd');
                var max_height = initMaxHeight(dd);


                if (dd.length >= param.slides) {
                    initParameters(parameters);
//                  console.log('Refresh -> initBanner_1:');
                    initBanner(banner, maxHeight());
                    setPosition(dd);
//                console.log('Refresh -> initBanner_2:');
                    initDDStyle(dd);
                    initBanner(banner, maxHeight()); // I know... uncomment console.log('Refresh...),console.log('Resize...)
                    // and console.log in maxHeight().
                    // Change browser window width and use 'maximize' button a few times.
                    // Test different width values. Do you see a difference?

                    $(window).resize(function () {
//                       console.log('Resize -> initBanner_1:');
                        initBanner(banner, maxHeight());
                        initDDStyle(dd);
//                    console.log('Resize -> initBanner_2:');
                        initBanner(banner, maxHeight());    //I know...
                    });

                    //blokowanie scrola strony gdy kursor w polu slidera
                    $(banner).on('mousewheel DOMMouseScroll', function(e) {
                        var e0 = e.originalEvent,
                            delta = e0.wheelDelta || -e0.detail;
                        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
                        e.preventDefault();
                    });
                    $('#move_left').bind('click', function (e) {
                        e.preventDefault();
                        moveLeft(dd);
                    });


                    $('#move_right').bind('click', function (e) {
                        e.preventDefault();
                        moveRight(dd);
                    });
                    $(banner).on("mousewheel", function (event) {
                        if (!animation_ongoing) {
                            if (event.deltaY > 0) //event.deltaY określa przesunięcie kółka dół-góra
                                moveRight(dd);
                            if (event.deltaY < 0)
                                moveLeft(dd);
                        }
                    });
                    that.addLegend();
                }

            };


            var initDDStyle = function (dd) {
                var banner = document.getElementById(param.bannerid),
                    banner_width = banner.offsetWidth,
                    position;
                var before_center = true;
                for (var i = 0; i < dd.length; i++) {
                    position = $(dd[i]).data("position");
                    if ((position >= 0) && (position < param.slides)) {
                        before_center = false;
                        dd[i].style.display = 'block';
                        dd[i].style.position = 'absolute';
                        dd[i].style.width = param.slides_width[position] + '%';
                        dd[i].style.zIndex = (position <= param._center_position) ? position : parseInt(dd[i - 1].style.zIndex) - 1;
                        dd[i].style.bottom = param.bottom_px + 'px';
                        dd[i].style.left = banner_width * param.slides_position[position]
                            - 0.5 * Math.round((banner_width * 0.01) * param.slides_width[position]) + 'px';
                    } else {
                        dd[i].style.zIndex = (position <= param._center_position) ? position : parseInt(dd[i - 1].style.zIndex) - 1;
                        dd[i].style.position = 'absolute';
                        dd[i].style.display = 'none';
                        dd[i].style.width = 0;
                        dd[i].style.bottom = param.bottom_px + 'px';

                        dd[i].style.left = (before_center) ?
                            banner_width * param.slides_position[0] + 'px'
                            : banner_width * param.slides_position[param.slides_position.length - 1] + 'px';
                    }
                }
            };

            var animate = function (dd, direction, duration, callback) {
                var banner = document.getElementById(param.bannerid),
                    banner_width = banner.offsetWidth,
                    animation_counter = 0;

                direction = (direction == 'right') ? 1 : -1;
                duration = (typeof duration == 'number') ? duration : param.duration;
                for (var i = 0; i < dd.length; i++) {
                    var position = $(dd[i]).data("position");
                    if ((direction < 0 && position == -1) || (direction > 0 && position == param.slides)) {
                        (function (_i) {
                            const j = _i;
                            $(dd[j]).animate({
                                    width: 0
                                },
                                {
                                    duration: duration,
                                    start: function () {
                                        this.current = j;
                                        dd[j].style.zIndex = -1;
                                        animation_counter = animation_counter + this.current;
                                    },
                                    complete: function () {
                                        animation_counter = animation_counter - this.current;
                                        if (animation_counter <= 0) {
                                            animation_ongoing = false;
                                            if (typeof callback != 'undefined') {
                                                callback(dd);
                                            }
                                        }
                                    }
                                })
                        })(i);
                    } else if ((position >= 0) && (position < param.slides )) {
                        dd[i].style.display = 'block';
                        dd[i].style.position = 'absolute';
                        dd[i].style.zIndex = (position <= param._center_position) ? position : parseInt(dd[i].style.zIndex) - direction;
                        (function (j) {
                            $(dd[j]).animate({
                                width: param.slides_width[position] + '%',
                                left: banner_width * param.slides_position[position]
                                    - 0.5 * Math.round((banner_width * 0.01) * param.slides_width[position]) + 'px'
                            }, {
                                duration: duration,
                                start: function () {
                                    this.current = j;
                                    animation_counter = animation_counter + this.current;
                                },
                                complete: function () {
                                    animation_counter = animation_counter - this.current;
                                    if (animation_counter <= 0) {
                                        animation_ongoing = false;
                                        if (typeof callback != 'undefined') {
                                            callback(dd);
                                        }
                                    }
                                }
                            })
                        })(i);
                    } else {
                        if (position < param._center_position) {
                            dd[i].style.zIndex = position;
                        } else {
                            dd[i].style.zIndex = parseInt(dd[i].style.zIndex) - direction;

                        }
                    }
                }
            };

            var moveLeft = function (dd) {
                if (!animation_ongoing) {
                    if ($(dd[dd.length - 1]).data('position') != param._center_position) {
                        animation_ongoing = true;
                        for (var i = 0, size = dd.length; i < size; i++) {
                            $(dd[i]).data({position: $(dd[i]).data('position') - 1});
                        }
                        animate(dd, 'left');
                        that.moveLegend();
                    } else {
                        goToBegin(dd, 0);
                    }
                }
            };

            var moveRight = function (dd) {
                if (!animation_ongoing) {
                    if ($(dd[0]).data('position') != param._center_position) {
                        animation_ongoing = true;
                        for (var i = 0, size = dd.length; i < size; i++) {
                            $(dd[i]).data({position: $(dd[i]).data('position') + 1});
                        }
                        animate(dd, 'right');
                        that.moveLegend();
                    }
                    else {
                        goToEnd(dd);
                    }
                }
            };


            var goToBegin = function (dd) {
                if ($(dd[0]).data('position') != param._center_position) {
                    animation_ongoing = true;
                    for (var i = 0, size = dd.length; i < size; i++) {
                        $(dd[i]).data({position: $(dd[i]).data('position') + 1});
                    }
                    animate(dd, 'right', param.quick_duration, goToBegin);
                    that.moveLegend();
                }
            };


            var goToEnd = function (dd) {
                if ($(dd[dd.length - 1]).data('position') != param._center_position) {
                    animation_ongoing = true;
                    for (var i = 0, size = dd.length; i < size; i++) {
                        $(dd[i]).data({position: $(dd[i]).data('position') - 1});
                    }

                    animate(dd, 'left', param.quick_duration, goToEnd);
                    that.moveLegend();
                }
            };

            this.moveLegend = function () {
                var legend = document.getElementsByClassName('legend')[0];
                if (typeof legend != 'undefined') {
                console.log('Działam');
                    var legend_dd = legend.getElementsByTagName('dd');
                    var dd = banner.getElementsByTagName('dd');
                    for (var i = 0, size = dd.length; i < size; i++) {
                        var position = $(dd[i]).data('position');
                        if (position < 0 || position >= param.slides) {
                            legend_dd[i].className = 'legend-invisible';
                        } else if (position == param._center_position) {
                            legend_dd[i].className = 'legend-center';
                        }
                        else {
                            legend_dd[i].className = 'legend-visible';
                        }
                    }
                }
            };

            this.addLegend = function () {
                var legend = document.createElement('dl');
                legend.className = 'legend';
                var dd = banner.getElementsByTagName('dd');
//                console.log('position start');
//                for (var j = 0, size = dd.length; j < size; j++) {
//                    console.log($(dd[j]).data('position'));
//                }
//                console.log('position end');
//                console.log('param.center: ' + param._center_position);

                var legend_position = [];
                for (var i = 0, size = dd.length; i < size; i++) {
                    legend_position[i] = document.createElement('dd');
                    var position = $(dd[i]).data('position');
                    if (position < 0 || position >= param.slides) {
                        legend_position[i].className = 'legend-invisible';
                    } else if (position == param._center_position) {
                        legend_position[i].className = 'legend-center';
                    }
                    else {
                        legend_position[i].className = 'legend-visible';

                    }
                    var temp = document.createTextNode(' ');

                    legend_position[i].appendChild(temp);
                    legend.appendChild(legend_position[i]);
                }

                var root_node = banner.parentNode;
                root_node.appendChild(legend);
            }

        }


        var banner = new Banner();
        banner.init(
            {
                duration: 200,
                quick_duration: 80,
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
                slides: 5,
                center: 5,
                slides_width: [30, 50, 30],
                slides_position: [0.3, 0.5, 0.7]}
        );

        $('#legend').on('click', function () {
            banner.addLegend();

        })


    }

)
;


