modules.define('i-bem__dom', ['jquery', 'dom', 'events'], function(provide, $, dom, events, BEMDOM) {

    BEMDOM.decl('b-diary', {

        onSetMod: {

            'js': function() {
                this.nextDayBtn = this.findBlockInside('nextDay', 'button');
                this.prevDayBtn = this.findBlockInside('previewDay', 'button');
                this.nextMonthBtn = this.findBlockInside('nextMonth', 'button');
                this.prevMonthBtn = this.findBlockInside('previewMonth', 'button');
                this.newEventBtn = this.findBlockInside('new-event-btn', 'button');
                this.newEventTitle = this.findBlockInside('new-event-title', 'input');

                this._setDate();
                this.Time = this.findBlockInside('b-time').time;

                this.nextDayBtn.on('click', function() {this._setDate(this.key,1,null)}, this);
                this.prevDayBtn.on('click', function() {this._setDate(this.key,-1,null)}, this);
                this.nextMonthBtn.on('click', function() {this._setDate(this.key,null,1)}, this);
                this.prevMonthBtn.on('click', function() {this._setDate(this.key,null,-1)}, this);
                this.newEventBtn.on('click', function() {this.addEvent()}, this);
            }

        },

            /**
             * _timeFormat - приводит массив содержащий время [h,m,s] к формату [hh, mm, ss]
             * @param array - массив для преоброзования
             * @returns {array} - преобразованный массив
             * @private
             */
        _timeFormat: function(array) {

            for(var i=0; i<array.length; i++) {
                array[i] = array[i] < 10 && (array[i]+'').length == 1 ? '0' + array[i]: array[i];
            }

            return array
        },

        /**
         * _setDate - Устанавливает дату. Создает поле this.key с установленной датой.
         *           В дальнейшем this.key используется как ключ для localStorage.
         *           После установки даты вызывается метод для отоброжения событий.
         * @param value - Принемает строку в формате "yyyy mm dd"
         *                При отсудствующем парпаметре вызывается текущая дата.
         * @param offsetDay - Смещение даты по дням. Принимает число - кол-во дней.
         * @param offsetMonth - Смещение даты по месяцам. Принимает число - кол-во дней.
         */
        _setDate: function(value, offsetDay, offsetMonth) {
            offsetDay = offsetDay || 0;
            offsetMonth = offsetMonth || 0;

            var objDate = !value ? new Date() : new Date(value);

            objDate.setDate(objDate.getDate() + offsetDay);
            objDate.setMonth(objDate.getMonth() + offsetMonth);

            var out,
                date = objDate.getDate(),
                month = objDate.getMonth() + 1,
                year = objDate.getFullYear();

            date = date < 10 ? '0' + date : date;
            month = month < 10 ? '0' + month : month;
            out = date + '.' + month + '.' + year;
            this.key = year + ' ' + month + ' ' + date;

            BEMDOM.update(this.elem('date'), out);

            this.getEvent();
        },

            /**
             * addEvent - Метод считывает строку из input,
             * вызывает прорисовку и обновляет localStorage
             *
             * @returns {this}
             */
        addEvent: function() {
            var title = this.newEventTitle.getVal();

            if (!title) return;

            this.events.push({
                time: this._timeFormat(this.Time).join(':'),
                title: title,
                id: Math.round(Math.random() * 10000) });

            this.newEventTitle.setVal('');

            this
                ._renderEventsList()
                ._updateStorage();

            return this;
        },

            /**
             * getEvent - Получает содержимое хранилища, преобразует его в массив.
             * Массив записывается в поле this.event;
             * Ключом является поле с установленной датой - this.key;
             * Вызывает метод прорисовки страницы;
             */
        getEvent: function() {
            this.events = JSON.parse(localStorage.getItem(this.key));

            if (!this.events) {
                this.events = [];
                this._updateStorage();
            }

            this._renderEventsList();
        },

            /**
             * removeEvent - Метод удаляет событие из текущего списка (this.events)
             * @param id - числовой параметр, является меткой для удаления конкретного события
             * @returns {*}
             */
        removeEvent: function(id) {
            for (var i = 0, l = this.events.length; i < l; i++) {
                if (this.events[i].id === id) {
                    this.events.splice(i, 1);

                    if (!this.events.length) {
                        BEMDOM.update(this.elem('events-list'),
                            BEMHTML.apply({
                                block: 'b-diary',
                                elem: 'empty',
                                content: 'Нет событий'
                        }))
                    }

                    break;
                }
            }

            this._updateStorage();

            return this;
        },

            /**
             * _renderEventsList - Переберает текущие события (this.events),
             * добовляет их на страницу.
             * @returns {this}
             */
        _renderEventsList: function() {
            var list = this.elem('events-list');

            BEMDOM.update(list, this.events.length ?
                '' :
                BEMHTML.apply({
                    block: 'b-diary',
                    elem: 'empty',
                    content: 'Нет событий'
                }));

            this.events.forEach(function(event) {
                BEMDOM.append(list, BEMHTML.apply({
                    block: 'b-event',
                    title: event.time + '&nbsp;&nbsp;&nbsp;&nbsp;' + event.title,
                    id: event.id
                }));
            }, this);

            return this;
        },

            /**
             * _updateStorage - Записывает в localStorage текущие события this.events
             * @returns {this}
             */
        _updateStorage: function() {
                localStorage.setItem(this.key, JSON.stringify(this.events));

                return this;
            }

    },
    {
        live: function() {
            this.liveInitOnBlockInsideEvent('remove', 'b-event', function(e, data) {
                this.removeEvent(data.id);
            });

            return false;
        }
    });

    provide(BEMDOM, $);

});
