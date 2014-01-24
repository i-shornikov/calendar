modules.define('i-bem__dom', ['jquery', 'dom', 'events'], function(provide, $, dom, events, BEMDOM) {

    BEMDOM.decl('b-time', {

        onSetMod: {

            'js': function() {

                this.hour = this.findBlockInside('hour', 'b-hour');
                this.min = this.findBlockInside('min', 'b-min');

                this.time = [0,1];
                this._renderTime();


                this.hour.findBlockInside('ctrlUp', 'link').on('click', function() {this.timeChange('h',1)}, this);
                this.hour.findBlockInside('data', 'link').on('click', function() {
                    this._addHandler('h');
                }, this);
                this.hour.findBlockInside('ctrlDown', 'link').on('click', function() {this.timeChange('h',-1)}, this);

                this.min.findBlockInside('ctrlUp', 'link').on('click', function() {this.timeChange('m',1)}, this);
                this.min.findBlockInside('data', 'link').on('click', function() {
                    this._addHandler('m');
                }, this);
                this.min.findBlockInside('ctrlDown', 'link').on('click', function() {this.timeChange('m',-1)}, this);

            }
        },

        _renderTime: function(){

            var h = this.time[0],
                m = this.time[1];

            h = h < 10 ? '0' + h : h;
            m = m < 10 ? '0' + m : m;

            BEMDOM.update(this.hour.elem('data'),
                BEMHTML.apply({
                    content: h + ' :'
                }));

            BEMDOM.update(this.min.elem('data'),
                BEMHTML.apply({
                    content: m
                }));

        },

        timeChange: function(field, value) {
            var h = this.time[0],
                m = this.time[1];

            switch (field) {
                case 'h':
                    h += value;

                    if ( h >= 24 || h < 0 ) {
                        h = h >= 24 ? h - 24 : h + 24;
                    }

                    this.time[0] = h;
                    this._renderTime(); break;

                case 'm':
                    m += value;

                    if (m >= 60 || m < 0) {

                        if (m >= 60) {
                            m -= 60;
                            this.time[0] -= h == 23 ? 23 : -1;
                        } else {
                            m += 60;
                            this.time[0] += h == 0 ? 23 : -1;
                        }
                    }

                    this.time[1] = m;
                    this._renderTime(); break;
            }

        },

        _addHandler: function(field) {
            var t = this;
               this.trig = this.trig ? false : true;

            window.addEventListener('mousewheel', function(){
                var delta; // Направление скролла
                // -1 - скролл вниз
                // 1  - скролл вверх
                event = event || window.event;
                // Opera и IE работают со свойством wheelDelta
                if (event.wheelDelta) {
                    delta = event.wheelDelta / 120;
                    // В Опере значение wheelDelta такое же, но с противоположным знаком
                    if (window.opera) delta = -delta;
                    // В реализации Gecko получим свойство detail
                } else if (event.detail) {
                    delta = -event.detail / 3;
                }
                // Запрещаем обработку события браузером по умолчанию
                if (event.preventDefault)  event.preventDefault();
                event.returnValue = false;
                t.trig ? t.timeChange(field, delta) : event.returnValue = true;
                return delta;
            }, false);

        }

        });
    provide(BEMDOM, $);
});
