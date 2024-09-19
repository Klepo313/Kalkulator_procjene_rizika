<template>
    <div v-if="visible" class="popup">
        <main>
            <div class="popup-header">
                Imate <strong>nespremljene promjene</strong>.<br>
                Jeste li sigurni da želite napustiti ovu stranicu?
            </div>
            <div class="popup-buttons">
                <button id="acceptButton" @click="$emit('confirm')">Napusti</button>
                <button id="cancelBtn" @click="$emit('cancel')">Odustani</button>
            </div>
        </main>
    </div>
</template>

<script setup>
defineProps({
    visible: Boolean
});
</script>

<style scoped>
.popup {
    width: 100%;
    height: 100%;
    overflow: hidden;

    background-color: rgba(0, 0, 0, 0.5);

    display: flex;
    justify-content: center;
    align-items: center;
}

main {
    width: 400px;
    padding: 20px;

    background-color: white;
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

main>div {
    width: 100%;
}

.popup-header {
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    line-height: 1.6;
}

strong {
    font-size: 16px;
    text-decoration: underline;
}

.popup-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
}

#acceptButton {
    height: auto;
    width: auto;
    padding: 0px;
    background: none;
    color: var(--text-color);
}

#acceptButton:hover {
    text-decoration: underline;
}
</style>
