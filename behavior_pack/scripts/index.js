const system = server.registerSystem(0, 0);

system.initialize = function() {
    this.listenForEvent("minecraft:client_screen_opened", (evt) => this.onScreenOpened(evt));
    this.listenForEvent("offhand:swap_request",       (evt) => this.onSwapRequest(evt));
};

system.onScreenOpened = function(evt) {
    if (evt.data.screen === "in_game_play_screen") {
        this.broadcastEvent("minecraft:display_ui_form", {
            form: { type: "offhand:inventory_form" }
        });
    }
};

system.onSwapRequest = function(evt) {
    const player   = evt.data.player;
    const invComp  = this.getComponent(player, "minecraft:inventory").data;
    const mainIdx  = evt.data.data.mainHandSlot;
    const offIdx   = evt.data.data.offHandSlot;
    const mainItem = invComp.container[mainIdx];
    const offItem  = invComp.container[offIdx];

    invComp.container[mainIdx] = offItem;
    invComp.container[offIdx]  = mainItem;
    this.applyComponentChanges(player, { "minecraft:inventory": invComp });
};
