modules.define('i-bem__dom', ['jquery', 'dom', 'events'], function(provide, $, dom, events, BEMDOM) {

    BEMDOM.decl('b-diary', {

        onSetMod: {

            'js': function() {
                this.newEventBtn = this.findBlockInside('new-event-btn', 'button');
                this.newEventTitle = this.findBlockInside('new-event-title', 'input');

                this.events = JSON.parse(localStorage.getItem('events'));

                if (!this.events) {
                    this.events = [];
                    this._updateStorage();
                }

                this._renderEventsList();

                this.newEventBtn.on('click', function() {
                    this.addEvent();
                }, this);
            }

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

        removeEvent: function(id) {
            for (var i = 0, l = this.events.length; i < l; i++) {
                if (this.events[i].id === id) {
                    this.events.splice(i, 1);

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
            localStorage.setItem('events', JSON.stringify(this.events));

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
