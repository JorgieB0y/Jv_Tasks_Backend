
const generateID = () => {
    const randomNumber = Math.random().toString(32).substring(2);
    const randomDate = Date.now().toString(32);
    return randomNumber + randomDate
}

export default generateID;