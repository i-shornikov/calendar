modules.define('i-bem__dom', ['jquery', 'dom', 'events'], function(provide, $, dom, events, BEMDOM) {

    BEMDOM.decl('b-event', {

        onSetMod: {

            'js': function() {

                this.findBlockOn('remove', 'link').on('click', this.remove, this);
            }

        },

        remove: function() {
            this.trigger('remove', { id: this.params.id });
            BEMDOM.destruct(this.domElem);
        }

    });

    provide(BEMDOM, $);
});
