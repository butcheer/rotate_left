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
            bottom_position: 2, //px
            padding: { //px
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            },
            duration: 1000
        };
        var animation_is_going = false;
        var banner = document.getElementById(param.bannerid);
        var max_height = {};
        this.init = function () {
            param.slides = (param.slides % 2) ? param.slides : param.slides - 1;
            var that = this;
            var image_tag = 'IMG';
            if (banner.children[0].tagName == image_tag) {
                var background_img = banner.children[0];
            }
            var dd = banner.getElementsByTagName('dd'); //linki obrazkowe
            param.center = ((param.center < dd.length) && (param.center >= 0)) ? param.center : Math.floor(param.slides / 2);
            max_height = this.initMaxHeight(dd);
            this.setPosition(dd);
            if (dd.length >= param.slides) {
                this.initParamArrays();
                this.initDDStyle(dd);
                this.initBanner(banner, this.maxHeight(dd));
                window.addEventListener('resize', function () {
                    that.initDDStyle(dd);
                    that.initBanner(banner, that.maxHeight(dd));
                });//todo IE
            }
            document.getElementById('move').addEventListener('click', function () {
                that.moveLeft();
            });

        };


        this.initDDStyle = function (dd) {

            var banner = document.getElementById(param.bannerid),
                banner_width = banner.offsetWidth,
                position;
            var before_center = true;
            for (var i = 0; i < dd.length; i++) {
                position = $(dd[i]).data("position");
                var center = Math.floor(param.slides / 2);
                if ((position >= 0) && (position < param.slides)) {
                    before_center = false;
                    dd[i].style.display = 'block';
                    dd[i].style.position = 'absolute';
                    dd[i].style.width = param.slides_width[position] + '%';
                    dd[i].style.zIndex = (position <= center) ? position : parseInt(dd[i - 1].style.zIndex) - 1;
                    dd[i].style.bottom = param.bottom_position + '%';
                    dd[i].style.left = banner_width * param.slides_position[position]
                        - 0.5 * Math.round((banner_width * 0.01) * param.slides_width[position]) + 'px';
                } else {
                    dd[i].style.zIndex = (position <= center) ? position : parseInt(dd[i - 1].style.zIndex) - 1;
                    dd[i].style.position = 'absolute';
                    dd[i].style.display = 'none';
                    dd[i].style.width = 0;
                    dd[i].style.bottom = param.bottom_position + '%';

                    dd[i].style.left = (before_center) ?
                        banner_width * param.slides_position[0] + 'px'
                        : banner_width * param.slides_position[param.slides_position.length - 1] + 'px';
                }
            }
        };


        this.animate = function (dd) {
            var before_center = true;
            var banner = document.getElementById(param.bannerid),
                banner_width = banner.offsetWidth,
                position;
            var animation_count = 0;

            for (var i = 0; i < dd.length; i++) {
                var position = $(dd[i]).data("position");
                var center = Math.floor(param.slides / 2);
                if (position == -1) {
                    var j = i;
                    $(dd[i]).animate({
                            width: 0
                        },
                        {
                            duration: param.duration,
                            start: function () {
                                this.current = i;
                                animation_count = animation_count + this.current;
                            },
                            complete: function () {
                                dd[j].style.zIndex = dd[j].style.zIndex - 1;
                                animation_count = animation_count - this.current;
                                if (animation_count <= 0) {
                                    animation_is_going = false;
                                }
                            }
                        });
                }
                else if ((position >= 0) && (position < param.slides )) {
                    dd[i].style.display = 'block';
                    dd[i].style.position = 'absolute';
                    before_center = false;

                    dd[i].style.zIndex = dd[i].style.zIndex = (position <= center) ? position : parseInt(dd[i - 1].style.zIndex) - 1;

                    $(dd[i]).animate({
                        width: param.slides_width[position] + '%',
                        left: banner_width * param.slides_position[position]
                            - 0.5 * Math.round((banner_width * 0.01) * param.slides_width[position]) + 'px'
                    }, {
                        duration: param.duration,
                        start: function () {
                            this.current = i;
                            animation_count = animation_count + this.current;
                        },
                        complete: function () {
                            animation_count = animation_count - this.current;
                            if (animation_count <= 0) {
                                console.log('Zmień flagę: '+animation_count);
                                animation_is_going = false;
                            }
                        }
                    });
                }
            }
        }


        this.moveLeft = function () {
            if (!animation_is_going) {
                animation_is_going = true;
                var dd = document.getElementById(param.bannerid).getElementsByTagName('dd');
                for (var i = 0, size = dd.length; i < size; i++) {
                    $(dd[i]).data({position: $(dd[i]).data('position') - 1});
                }
                this.animate(dd);
            }
        }

        this.moveRight = function () {
            if (!animation_is_going) {
                animation_is_going = true;
                var dd = document.getElementById(param.bannerid).getElementsByTagName('dd');
                for (var i = 0, size = dd.length; i < size; i++) {
                    $(dd[i]).data({position: $(dd[i]).data('position') + 1});
                }
            }
        }

        this.initParamArrays = function () {
            var half = Math.floor(param.slides / 2);
            //  console.log("half: ", half);
            if (param.slides_width.length != param.slides) {
                param.slides_width = [];
                param.slides_position = [];
                param.slides_width[half] = 40;
                param.slides_position[half] = 0.5;
                for (var i = half - 1; i >= 0; i--) {
                    //  console.log(i);
                    param.slides_width[i] = Math.round(param.slides_width[i + 1] / 2);
                    param.slides_position[i] = param.slides_position[i + 1] / 2;
                    param.slides_width[param.slides - (i + 1)] = param.slides_width[i];
                    param.slides_position[param.slides - (i + 1)] =
                        param.slides_position[param.slides - (i + 2)]
                            + param.slides_position[i];
                }
            }
        }
        this.initMaxHeight = function (dd) {
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
        }
        this.maxHeight = function (dd) {
            return (max_height.height * Math.max.apply(null, param.slides_width) * 0.01 * banner.offsetWidth) / (max_height.width);
        }
        this.initBanner = function (banner, max_height) {
            banner.style.position = 'relative';
            banner.style.height = max_height + param.padding.top + param.padding.left + 'px';
        }
        this.setPosition = function (dd) {
            var half = Math.floor(param.slides / 2);
            $(dd[param.center]).data({position: half});
            for (var i = param.center - 1; i >= 0; i--) {
//                console.log('j ', $(dd[i + 1]).data('position'));
                $(dd[i]).data({position: $(dd[i + 1]).data('position') - 1});
            }
            for (var i = param.center + 1; i < dd.length; i++) {
                $(dd[i]).data({position: $(dd[i - 1]).data('position') + 1});
            }
        }
        this.showPositions = function (banner) {
            console.log("---GETPosition -----");
            var dd = banner.getElementsByTagName('dd');
            for (var i = 0; i < dd.length; i++) {
                console.log($(dd[i]).data().position);
            }
        }
        this.getPosition = function (dd, index) {
            return $(dd[index]).data('position');
        }
    }


    var banner = new Banner();
    banner.init();
})
;


