export function getColorClass(value) {
    const parsedValue = parseInt(value);
    console.log("parsedValue: ", parsedValue);
    if (isNaN(parsedValue)) return 'nullgray';
    if (parsedValue < 0) return 'lightgray';
    if (parsedValue === 0) return 'white';
    if (parsedValue === 1) return 'gray';
    if (parsedValue >= 2 && parsedValue <= 3) return 'green';
    if (parsedValue >= 4 && parsedValue <= 6) return 'yellow';
    if (parsedValue >= 7 && parsedValue <= 10) return 'orange';
    if (parsedValue >= 11 && parsedValue <= 15) return 'red';
    return 'white';
}

