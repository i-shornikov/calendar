modules.define('i-bem__dom', ['jquery', 'dom', 'events'], function(provide, $, dom, events, BEMDOM) {

    BEMDOM.decl('b-diary', {

        onSetMod: {

            'js': function() {
                this.nextDateBtn = this.findBlockInside('next', 'button');
                this.prevDateBtn = this.findBlockInside('preview', 'button');
                this.newEventBtn = this.findBlockInside('new-event-btn', 'button');
                this.newEventTitle = this.findBlockInside('new-event-title', 'input');

                this.setDate();
                this.getEvent();

                this.nextDateBtn.on('click', function() {this._nextDate()}, this);
                this.prevDateBtn.on('click', function() {this._prevDate()}, this);
                this.newEventBtn.on('click', function() {
                    this.addEvent();
                }, this);
            }

        },

        setDate: function(value) {
            var objDate;

            //value = value || 0;
            !value ? objDate = new Date() : objDate = new Date(value);

            var date =  objDate.getDate();
            var month = objDate.getMonth() + 1;
            var year = objDate.getFullYear();

            date < 10 ? date = '0' + date : date;
            month < 10 ? month = '0' + month : month;
            this.key = date + '.' + month + '.' + year;;

            BEMDOM.update(this.elem('date'), this.key);
        },

        _nextDate: function() {
            var date = this.key.split('.');
            var day = date[0] * 1;
            var month = date[1] * 1;
            var year = date[2] * 1;
            day++;
            if ((month == 2) && (day == 29)) {day=01; month++};
            if ( (day == 31) && ((month == 4) || (month == 6) || (month == 9) || (month == 11)) ) {day=1; month++};
            if ( (day == 32) && (month == 12) ) {day=01; month=01; year++;};
            if ( (day == 32) && (month < 12) ){day=01; month++};
            this.setDate(year+' '+month+' '+day);
            this.getEvent();
        },

        _prevDate: function() {
            var date = this.key.split('.');
            var day = date[0] * 1;
            var month = date[1] * 1;
            var year = date[2] * 1;
            if (day == 1) {
                day = 31;
                if ( (month == 5) || (month == 7) || (month == 10) || (month == 12) ) {day=30;month--};
                if (month == 3) {day=28; month--};
                if (month == 1) {day=31; month=12; year--};
            } else day--;
            this.setDate(year+' '+month+' '+day);
            this.getEvent();
        },

        addEvent: function() {
            var title = this.newEventTitle.getVal();

            if (!title) return;

            this.events.push({ title: title, id: Math.round(Math.random() * 10000) });
            this.newEventTitle.setVal('');

            this
                ._renderEventsList()
                ._updateStorage();

            return this;
        },

        getEvent: function() {
            this.events = JSON.parse(localStorage.getItem(this.key));

            if (!this.events) {
                this.events = [];
                this._updateStorage();
            }

            this._renderEventsList();
        },

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
                    title: event.title,
                    id: event.id
                }));
            }, this);

            return this;
        },

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
