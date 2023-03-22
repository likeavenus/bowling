export const getColor = (value: number) => {
    var hue = ((1 - value * 0.00045) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
};