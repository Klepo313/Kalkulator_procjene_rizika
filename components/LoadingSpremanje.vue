<template>
    <div>
        <div class="popup">
            <main>
                <div class="popup-header">
                    <h2>Spremanje promjena</h2>
                </div>
                <div class="popup-content">
                    <div class="loader" />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.popup {
    width: 100%;
    height: 100%;
    overflow: hidden;

    background-color: rgba(0, 0, 0, 0.5);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;

    border-radius: 5px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1);

    width: 300px;
    height: 300px;
}

h2 {
    font-size: 16px;
    color: var(--primary-color);
}

/* HTML: <div class="loader"></div> */
.loader {
    width: 60px;
    aspect-ratio: 1;
    display: flex;
    animation: l10-0 2s infinite steps(1);
}

.loader::before,
.loader::after {
    content: "";
    flex: 1;
    animation:
        l10-1 1s infinite linear alternate,
        l10-2 2s infinite steps(1) -.5s;
}

.loader::after {
    --s: -1, -1;
}

@keyframes l10-0 {
    0% {
        transform: scaleX(1) rotate(0deg)
    }

    50% {
        transform: scaleX(-1) rotate(-90deg)
    }
}

@keyframes l10-1 {

    0%,
    5% {
        transform: scale(var(--s, 1)) translate(0px) perspective(150px) rotateY(0deg)
    }

    33% {
        transform: scale(var(--s, 1)) translate(-10px) perspective(150px) rotateX(0deg)
    }

    66% {
        transform: scale(var(--s, 1)) translate(-10px) perspective(150px) rotateX(-180deg)
    }

    95%,
    100% {
        transform: scale(var(--s, 1)) translate(0px) perspective(150px) rotateX(-180deg)
    }
}

@keyframes l10-2 {
    0% {
        background: #514b82;
        border-radius: 0
    }

    50% {
        background: var(--primary-color);
        border-radius: 100px 0 0 100px
    }
}
</style>