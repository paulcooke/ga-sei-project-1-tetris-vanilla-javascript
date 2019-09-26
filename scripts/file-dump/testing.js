
// range generator for completed row arrays
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))

console.log(range(40, 49, 1))