const parseString = str => {
    if (typeof str !== "string") return;
    if (str?.length > 0) return str.trim();
}

export default parseString;