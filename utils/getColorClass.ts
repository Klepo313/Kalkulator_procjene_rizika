
/**
 * Returns a color class based on a numeric value. 
 * The input value is parsed to an integer. If parsing fails, returns 'nullgray'.
 * @param value - The numeric or string representation of the value to be evaluated.
 * @returns The corresponding color class as a string.
 */

export function getColorClass(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return 'nullgray';

    const parsedValue = parseInt(value.toString(), 10);
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


/**
 * Returns a shaded color based on a given color and a percentage.
 * @param color - The color in hexadecimal format, without the '#' prefix.
 * @param percent - The percentage of shading (0-100).
 * @returns The shaded color in hexadecimal format, without the '#' prefix.
 *             If the input color is invalid, returns '000000'.
 */
export function shadeColor(color: string, percent: number): string {
    const num = parseInt(color.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
        .toString(16)
        .slice(1)}`;
}
